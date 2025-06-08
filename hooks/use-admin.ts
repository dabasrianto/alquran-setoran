"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  getAllUsersWithStats,
  updateUserSubscription,
  getSubscriptionAnalytics,
  autoDowngradeExpiredUsers,
  bulkUpdateSubscriptions,
  deleteUser as deleteUserFromFirestore,
  updateUserProfile as updateUserProfileInFirestore,
  toggleUserActiveStatus as toggleUserActiveStatusInFirestore,
  resetUserData as resetUserDataInFirestore,
  searchUsers as searchUsersInFirestore,
  isAdmin,
} from "@/lib/firebase-firestore"

export function useAdmin() {
  const { user } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isUserAdmin = user?.email ? isAdmin(user.email) : false

  const loadUsers = async () => {
    if (!isUserAdmin) {
      console.log("👤 User is not admin, skipping user load")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Loading users for admin...")
      const usersData = await getAllUsersWithStats()
      console.log(`✅ Loaded ${usersData.length} users with stats`)

      setUsers(usersData)
    } catch (err: any) {
      console.error("❌ Error loading users:", err)
      setError(err.message || "Failed to load users")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    if (!isUserAdmin) return

    try {
      console.log("📊 Loading subscription analytics...")
      const analyticsData = await getSubscriptionAnalytics()
      setAnalytics(analyticsData)
      console.log("✅ Analytics loaded successfully")
    } catch (err: any) {
      console.error("❌ Error loading analytics:", err)
      // Don't set error for analytics failure
    }
  }

  const updateSubscription = async (userId: string, subscriptionType: "free" | "premium", expiryDate?: Date) => {
    if (!isUserAdmin) {
      throw new Error("Unauthorized: Admin access required")
    }

    try {
      console.log(`🔄 Admin updating subscription for ${userId} to ${subscriptionType}`)
      await updateUserSubscription(userId, subscriptionType, expiryDate)

      // Reload users to reflect changes
      await loadUsers()
      await loadAnalytics()

      console.log("✅ Subscription updated successfully")
    } catch (error: any) {
      console.error("❌ Error updating subscription:", error)
      throw error
    }
  }

  const bulkUpdate = async (
    updates: Array<{
      userId: string
      subscriptionType: "free" | "premium"
      expiryDate?: Date
    }>,
  ) => {
    if (!isUserAdmin) {
      throw new Error("Unauthorized: Admin access required")
    }

    try {
      console.log(`🔄 Bulk updating ${updates.length} subscriptions`)
      await bulkUpdateSubscriptions(updates)

      // Reload data
      await loadUsers()
      await loadAnalytics()

      console.log("✅ Bulk update completed successfully")
    } catch (error: any) {
      console.error("❌ Error in bulk update:", error)
      throw error
    }
  }

  const checkExpiredUsers = async () => {
    if (!isUserAdmin) {
      throw new Error("Unauthorized: Admin access required")
    }

    try {
      console.log("⏰ Checking for expired premium users...")
      const downgraded = await autoDowngradeExpiredUsers()

      if (downgraded > 0) {
        // Reload data if any users were downgraded
        await loadUsers()
        await loadAnalytics()
      }

      return downgraded
    } catch (error: any) {
      console.error("❌ Error checking expired users:", error)
      throw error
    }
  }

  const deleteUser = async (userId: string) => {
    if (!isUserAdmin) {
      throw new Error("Unauthorized: Admin access required")
    }

    try {
      console.log(`🗑️ Admin deleting user ${userId}`)
      await deleteUserFromFirestore(userId)

      // Reload data
      await loadUsers()
      await loadAnalytics()

      console.log("✅ User deleted successfully")
    } catch (error: any) {
      console.error("❌ Error deleting user:", error)
      throw error
    }
  }

  const updateUserProfile = async (userId: string, updates: any) => {
    if (!isUserAdmin) {
      throw new Error("Unauthorized: Admin access required")
    }

    try {
      console.log(`🔄 Admin updating profile for ${userId}`)
      await updateUserProfileInFirestore(userId, updates)

      // Reload data
      await loadUsers()

      console.log("✅ User profile updated successfully")
    } catch (error: any) {
      console.error("❌ Error updating user profile:", error)
      throw error
    }
  }

  const toggleUserActiveStatus = async (userId: string, isActive: boolean) => {
    if (!isUserAdmin) {
      throw new Error("Unauthorized: Admin access required")
    }

    try {
      console.log(`🔄 Admin toggling active status for ${userId} to ${isActive}`)
      await toggleUserActiveStatusInFirestore(userId, isActive)

      // Reload data
      await loadUsers()

      console.log("✅ User active status updated successfully")
    } catch (error: any) {
      console.error("❌ Error updating user active status:", error)
      throw error
    }
  }

  const resetUserData = async (userId: string) => {
    if (!isUserAdmin) {
      throw new Error("Unauthorized: Admin access required")
    }

    try {
      console.log(`🔄 Admin resetting data for ${userId}`)
      await resetUserDataInFirestore(userId)

      // Reload data
      await loadUsers()

      console.log("✅ User data reset successfully")
    } catch (error: any) {
      console.error("❌ Error resetting user data:", error)
      throw error
    }
  }

  const searchUsers = async (searchTerm: string) => {
    if (!isUserAdmin) {
      throw new Error("Unauthorized: Admin access required")
    }

    try {
      console.log(`🔍 Admin searching users with term: ${searchTerm}`)
      const searchResults = await searchUsersInFirestore(searchTerm)

      console.log("✅ User search completed successfully")
      return searchResults
    } catch (error: any) {
      console.error("❌ Error searching users:", error)
      throw error
    }
  }

  const refreshData = async () => {
    await Promise.all([loadUsers(), loadAnalytics()])
  }

  useEffect(() => {
    if (user) {
      console.log("👤 User changed, loading admin data. Is admin:", isUserAdmin)
      if (isUserAdmin) {
        loadUsers()
        loadAnalytics()
      }
    } else {
      console.log("👤 No user, clearing admin data")
      setUsers([])
      setAnalytics(null)
      setLoading(false)
    }
  }, [user, isUserAdmin])

  return {
    users,
    analytics,
    loading,
    error,
    isAdmin: isUserAdmin,
    updateSubscription,
    bulkUpdate,
    checkExpiredUsers,
    deleteUser,
    updateUserProfile,
    toggleUserActiveStatus,
    resetUserData,
    searchUsers,
    refreshUsers: loadUsers,
    refreshAnalytics: loadAnalytics,
    refreshData,
  }
}

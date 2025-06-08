"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getAllUsers, updateUserSubscription, getUserStats, isAdmin } from "@/lib/firebase-firestore"

export function useAdmin() {
  const { user, userProfile } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isUserAdmin = user?.email ? isAdmin(user.email) : false

  const loadUsers = async () => {
    if (!isUserAdmin) {
      console.log("User is not admin, skipping user load")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log("Loading users for admin...")
      const usersData = await getAllUsers()
      console.log("Loaded users data:", usersData)

      if (!usersData || usersData.length === 0) {
        console.log("No users found or empty array returned")
        setUsers([])
        setLoading(false)
        return
      }

      // Load stats for each user
      console.log("Loading stats for each user...")
      const usersWithStats = await Promise.all(
        usersData.map(async (userData) => {
          try {
            const stats = await getUserStats(userData.id)
            return {
              ...userData,
              stats,
            }
          } catch (error) {
            console.error(`Error loading stats for user ${userData.id}:`, error)
            return {
              ...userData,
              stats: {
                studentsCount: 0,
                ustadzCount: 0,
                ustadzahCount: 0,
                totalPengujis: 0,
              },
            }
          }
        }),
      )

      console.log("Users with stats:", usersWithStats)
      setUsers(usersWithStats)
    } catch (err: any) {
      console.error("Error loading users:", err)
      setError(err.message || "Failed to load users")
      setUsers([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const updateSubscription = async (userId: string, subscriptionType: "free" | "premium", expiryDate?: Date) => {
    if (!isUserAdmin) {
      throw new Error("Unauthorized")
    }

    try {
      console.log(`Admin updating subscription for ${userId} to ${subscriptionType}`)
      await updateUserSubscription(userId, subscriptionType, expiryDate)
      await loadUsers() // Refresh data
      console.log("Subscription updated successfully")
    } catch (error: any) {
      console.error("Error updating subscription:", error)
      throw error
    }
  }

  useEffect(() => {
    if (user) {
      console.log("User changed, loading users. Is admin:", isUserAdmin)
      loadUsers()
    } else {
      console.log("No user, clearing data")
      setUsers([])
      setLoading(false)
    }
  }, [user, isUserAdmin])

  return {
    users,
    loading,
    error,
    isAdmin: isUserAdmin,
    updateSubscription,
    refreshUsers: loadUsers,
  }
}

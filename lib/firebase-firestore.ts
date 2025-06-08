import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Student, Setoran, Penguji } from "./types"

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString()
  }
  if (timestamp instanceof Date) {
    return timestamp.toISOString()
  }
  return timestamp || new Date().toISOString()
}

// Helper function to ensure db is available
const ensureDb = () => {
  if (!db) {
    throw new Error("Firestore not initialized. Please check your Firebase configuration.")
  }
  return db
}

// Students
export const getStudents = async (userId: string): Promise<Student[]> => {
  try {
    const database = ensureDb()
    const studentsRef = collection(database, "users", userId, "students")
    const q = query(studentsRef, orderBy("name"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || "",
        kelas: data.kelas || "",
        target: data.target || "",
        hafalan: (data.hafalan || []).map((h: any) => ({
          ...h,
          timestamp: convertTimestamp(h.timestamp),
        })),
      }
    })
  } catch (error) {
    console.error("Error getting students:", error)
    throw new Error("Failed to load students data")
  }
}

export const addStudent = async (userId: string, student: Omit<Student, "id">): Promise<string> => {
  try {
    const database = ensureDb()
    const studentsRef = collection(database, "users", userId, "students")
    const docRef = await addDoc(studentsRef, {
      ...student,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding student:", error)
    throw new Error("Failed to add student")
  }
}

export const updateStudent = async (userId: string, studentId: string, updates: Partial<Student>): Promise<void> => {
  try {
    const database = ensureDb()
    const studentRef = doc(database, "users", userId, "students", studentId)
    await updateDoc(studentRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating student:", error)
    throw new Error("Failed to update student")
  }
}

export const deleteStudent = async (userId: string, studentId: string): Promise<void> => {
  try {
    const database = ensureDb()
    const studentRef = doc(database, "users", userId, "students", studentId)
    await deleteDoc(studentRef)
  } catch (error) {
    console.error("Error deleting student:", error)
    throw new Error("Failed to delete student")
  }
}

export const addSetoran = async (userId: string, studentId: string, setoran: Omit<Setoran, "id">): Promise<void> => {
  try {
    const database = ensureDb()
    const studentRef = doc(database, "users", userId, "students", studentId)
    const studentDoc = await getDoc(studentRef)

    if (studentDoc.exists()) {
      const currentData = studentDoc.data()
      const currentHafalan = currentData.hafalan || []

      const newSetoran = {
        ...setoran,
        id: `setoran_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: setoran.timestamp || new Date().toISOString(),
      }

      await updateDoc(studentRef, {
        hafalan: [...currentHafalan, newSetoran],
        updatedAt: serverTimestamp(),
      })
    } else {
      throw new Error("Student not found")
    }
  } catch (error) {
    console.error("Error adding setoran:", error)
    throw new Error("Failed to add setoran")
  }
}

export const updateSetoran = async (
  userId: string,
  studentId: string,
  setoranId: string,
  updates: Partial<Setoran>,
): Promise<void> => {
  try {
    const database = ensureDb()
    const studentRef = doc(database, "users", userId, "students", studentId)
    const studentDoc = await getDoc(studentRef)

    if (studentDoc.exists()) {
      const currentData = studentDoc.data()
      const currentHafalan = currentData.hafalan || []

      const updatedHafalan = currentHafalan.map((h: any) => (h.id === setoranId ? { ...h, ...updates } : h))

      await updateDoc(studentRef, {
        hafalan: updatedHafalan,
        updatedAt: serverTimestamp(),
      })
    } else {
      throw new Error("Student not found")
    }
  } catch (error) {
    console.error("Error updating setoran:", error)
    throw new Error("Failed to update setoran")
  }
}

export const deleteSetoran = async (userId: string, studentId: string, setoranId: string): Promise<void> => {
  try {
    const database = ensureDb()
    const studentRef = doc(database, "users", userId, "students", studentId)
    const studentDoc = await getDoc(studentRef)

    if (studentDoc.exists()) {
      const currentData = studentDoc.data()
      const currentHafalan = currentData.hafalan || []

      const updatedHafalan = currentHafalan.filter((h: any) => h.id !== setoranId)

      await updateDoc(studentRef, {
        hafalan: updatedHafalan,
        updatedAt: serverTimestamp(),
      })
    } else {
      throw new Error("Student not found")
    }
  } catch (error) {
    console.error("Error deleting setoran:", error)
    throw new Error("Failed to delete setoran")
  }
}

// Penguji/Ustadz
export const getPengujis = async (userId: string): Promise<Penguji[]> => {
  try {
    const database = ensureDb()
    const pengujisRef = collection(database, "users", userId, "pengujis")
    const q = query(pengujisRef, orderBy("name"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Penguji[]
  } catch (error) {
    console.error("Error getting pengujis:", error)
    throw new Error("Failed to load pengujis data")
  }
}

export const addPenguji = async (userId: string, penguji: Omit<Penguji, "id">): Promise<string> => {
  try {
    const database = ensureDb()
    const pengujisRef = collection(database, "users", userId, "pengujis")
    const docRef = await addDoc(pengujisRef, {
      ...penguji,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding penguji:", error)
    throw new Error("Failed to add penguji")
  }
}

export const updatePenguji = async (userId: string, pengujiId: string, updates: Partial<Penguji>): Promise<void> => {
  try {
    const database = ensureDb()
    const pengujiRef = doc(database, "users", userId, "pengujis", pengujiId)
    await updateDoc(pengujiRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating penguji:", error)
    throw new Error("Failed to update penguji")
  }
}

export const deletePenguji = async (userId: string, pengujiId: string): Promise<void> => {
  try {
    const database = ensureDb()
    const pengujiRef = doc(database, "users", userId, "pengujis", pengujiId)
    await deleteDoc(pengujiRef)
  } catch (error) {
    console.error("Error deleting penguji:", error)
    throw new Error("Failed to delete penguji")
  }
}

// User subscription management
export const getUserProfile = async (userId: string): Promise<any> => {
  try {
    const database = ensureDb()
    const userRef = doc(database, "users", userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const data = userDoc.data()
      return {
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        subscriptionExpiry: data.subscriptionExpiry ? convertTimestamp(data.subscriptionExpiry) : null,
      }
    }
    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw new Error("Failed to load user profile")
  }
}

export const updateSubscription = async (
  userId: string,
  subscriptionType: "free" | "premium",
  expiryDate?: Date,
): Promise<void> => {
  try {
    const database = ensureDb()
    const userRef = doc(database, "users", userId)
    await updateDoc(userRef, {
      subscriptionType,
      subscriptionExpiry: expiryDate ? expiryDate : null,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating subscription:", error)
    throw new Error("Failed to update subscription")
  }
}

export const isAdmin = (email: string): boolean => {
  const adminEmails = ["dabasrianto@gmail.com"]
  return adminEmails.includes(email.toLowerCase())
}

// Admin Functions - Get all users with their stats
export const getAllUsersWithStats = async (): Promise<any[]> => {
  try {
    console.log("🔍 Fetching all users from Firestore...")

    const database = ensureDb()
    const usersRef = collection(database, "users")
    const snapshot = await getDocs(usersRef)

    console.log(`📊 Found ${snapshot.size} users in Firestore`)

    const users = await Promise.all(
      snapshot.docs.map(async (userDoc) => {
        const userData = userDoc.data()
        console.log(`👤 Processing user: ${userData.email}`)

        // Get user stats
        const stats = await getUserDetailedStats(userDoc.id)

        return {
          id: userDoc.id,
          uid: userData.uid || userDoc.id,
          email: userData.email || "",
          displayName: userData.displayName || userData.email || "Unknown User",
          photoURL: userData.photoURL || null,
          subscriptionType: userData.subscriptionType || "free",
          subscriptionExpiry: userData.subscriptionExpiry ? convertTimestamp(userData.subscriptionExpiry) : null,
          createdAt: convertTimestamp(userData.createdAt),
          updatedAt: convertTimestamp(userData.updatedAt),
          lastLoginAt: userData.lastLoginAt ? convertTimestamp(userData.lastLoginAt) : null,
          isActive: userData.isActive !== false, // default to true
          stats,
        }
      }),
    )

    // Sort by creation date (newest first)
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    console.log("✅ Successfully processed all users with stats")
    return users
  } catch (error) {
    console.error("❌ Error getting all users:", error)
    throw new Error(`Failed to load users data: ${(error as any).message}`)
  }
}

// Get detailed stats for a user
export const getUserDetailedStats = async (userId: string): Promise<any> => {
  try {
    const database = ensureDb()
    const studentsRef = collection(database, "users", userId, "students")
    const pengujisRef = collection(database, "users", userId, "pengujis")

    const [studentsSnapshot, pengujisSnapshot] = await Promise.all([
      getDocs(studentsRef).catch(() => ({ docs: [] })),
      getDocs(pengujisRef).catch(() => ({ docs: [] })),
    ])

    const students = studentsSnapshot.docs.map((doc) => doc.data())
    const pengujis = pengujisSnapshot.docs.map((doc) => doc.data())

    // Calculate detailed stats
    const ustadzCount = pengujis.filter((p) => p.gender === "L").length
    const ustadzahCount = pengujis.filter((p) => p.gender === "P").length

    // Calculate total hafalan stats
    let totalAyatHafal = 0
    let totalSetoran = 0

    students.forEach((student) => {
      if (student.hafalan && Array.isArray(student.hafalan)) {
        totalSetoran += student.hafalan.length

        // Calculate unique verses memorized
        const uniqueVerses = new Set()
        student.hafalan.forEach((hafalan: any) => {
          for (let i = hafalan.start; i <= hafalan.end; i++) {
            uniqueVerses.add(`${hafalan.surah}-${i}`)
          }
        })
        totalAyatHafal += uniqueVerses.size
      }
    })

    return {
      studentsCount: students.length,
      ustadzCount,
      ustadzahCount,
      totalPengujis: pengujis.length,
      totalAyatHafal,
      totalSetoran,
      totalSuratSelesai: 0,
      lastActivity: new Date().toISOString(),
    }
  } catch (error) {
    console.error(`❌ Error getting stats for user ${userId}:`, error)
    return {
      studentsCount: 0,
      ustadzCount: 0,
      ustadzahCount: 0,
      totalPengujis: 0,
      totalAyatHafal: 0,
      totalSetoran: 0,
      totalSuratSelesai: 0,
      lastActivity: null,
    }
  }
}

// Update user subscription with detailed logging
export const updateUserSubscription = async (
  userId: string,
  subscriptionType: "free" | "premium",
  expiryDate?: Date,
): Promise<void> => {
  try {
    console.log(`🔄 Updating subscription for user ${userId} to ${subscriptionType}`)

    const database = ensureDb()
    const userRef = doc(database, "users", userId)

    // First, check if user exists
    const userDoc = await getDoc(userRef)
    if (!userDoc.exists()) {
      throw new Error(`User with ID ${userId} not found`)
    }

    const updateData: any = {
      subscriptionType,
      updatedAt: serverTimestamp(),
    }

    if (subscriptionType === "premium") {
      // Set expiry date (default 30 days if not provided)
      const expiry = expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      updateData.subscriptionExpiry = expiry
      console.log(`📅 Setting premium expiry to: ${expiry.toISOString()}`)
    } else {
      // Remove expiry for free accounts
      updateData.subscriptionExpiry = null
      console.log("🆓 Setting to free account, removing expiry")
    }

    await updateDoc(userRef, updateData)

    console.log(`✅ Successfully updated subscription for user ${userId}`)

    // Log the change for admin tracking
    console.log("📝 Admin Action Log:", {
      targetUserId: userId,
      action: `Subscription changed to ${subscriptionType}`,
      details: {
        previousType: userDoc.data()?.subscriptionType || "unknown",
        newType: subscriptionType,
        expiryDate: updateData.subscriptionExpiry,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`❌ Error updating subscription for user ${userId}:`, error)
    throw new Error(`Failed to update subscription: ${(error as any).message}`)
  }
}

// Get subscription analytics
export const getSubscriptionAnalytics = async (): Promise<any> => {
  try {
    console.log("📊 Calculating subscription analytics...")

    const users = await getAllUsersWithStats()

    const analytics = {
      totalUsers: users.length,
      freeUsers: users.filter((u) => u.subscriptionType === "free").length,
      premiumUsers: users.filter((u) => u.subscriptionType === "premium").length,
      expiredPremium: users.filter(
        (u) => u.subscriptionType === "premium" && u.subscriptionExpiry && new Date(u.subscriptionExpiry) < new Date(),
      ).length,
      totalRevenue: users.filter((u) => u.subscriptionType === "premium").length * 50000, // Rp 50k per user
      conversionRate:
        users.length > 0
          ? ((users.filter((u) => u.subscriptionType === "premium").length / users.length) * 100).toFixed(1)
          : "0",
      averageStudentsPerUser:
        users.length > 0
          ? (users.reduce((sum, u) => sum + (u.stats?.studentsCount || 0), 0) / users.length).toFixed(1)
          : "0",
      totalStudents: users.reduce((sum, u) => sum + (u.stats?.studentsCount || 0), 0),
      totalPengujis: users.reduce((sum, u) => sum + (u.stats?.totalPengujis || 0), 0),
      totalAyatHafal: users.reduce((sum, u) => sum + (u.stats?.totalAyatHafal || 0), 0),
      activeUsers: users.filter((u) => u.isActive !== false).length,
      inactiveUsers: users.filter((u) => u.isActive === false).length,
    }

    console.log("✅ Analytics calculated:", analytics)
    return analytics
  } catch (error) {
    console.error("❌ Error calculating analytics:", error)
    throw new Error(`Failed to calculate analytics: ${(error as any).message}`)
  }
}

// Auto-downgrade expired premium users
export const autoDowngradeExpiredUsers = async (): Promise<number> => {
  try {
    console.log("🔄 Checking for expired premium users...")

    const users = await getAllUsersWithStats()
    const expiredUsers = users.filter(
      (user) =>
        user.subscriptionType === "premium" &&
        user.subscriptionExpiry &&
        new Date(user.subscriptionExpiry) < new Date(),
    )

    if (expiredUsers.length === 0) {
      console.log("✅ No expired premium users found")
      return 0
    }

    console.log(`⏰ Found ${expiredUsers.length} expired premium users`)

    const database = ensureDb()

    for (const user of expiredUsers) {
      const userRef = doc(database, "users", user.id)
      await updateDoc(userRef, {
        subscriptionType: "free",
        subscriptionExpiry: null,
        updatedAt: serverTimestamp(),
      })

      console.log(`⬇️ Downgrading expired user: ${user.email}`)
    }

    console.log(`✅ Successfully downgraded ${expiredUsers.length} expired users`)

    return expiredUsers.length
  } catch (error) {
    console.error("❌ Error auto-downgrading expired users:", error)
    throw new Error(`Failed to auto-downgrade expired users: ${(error as any).message}`)
  }
}

// Bulk update multiple users (for admin operations)
export const bulkUpdateSubscriptions = async (
  updates: Array<{
    userId: string
    subscriptionType: "free" | "premium"
    expiryDate?: Date
  }>,
): Promise<void> => {
  try {
    console.log(`🔄 Bulk updating ${updates.length} user subscriptions`)

    const database = ensureDb()
    const batch = writeBatch(database)

    for (const update of updates) {
      const userRef = doc(database, "users", update.userId)
      const updateData: any = {
        subscriptionType: update.subscriptionType,
        updatedAt: serverTimestamp(),
      }

      if (update.subscriptionType === "premium") {
        updateData.subscriptionExpiry = update.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      } else {
        updateData.subscriptionExpiry = null
      }

      batch.update(userRef, updateData)
    }

    await batch.commit()

    console.log(`✅ Successfully bulk updated ${updates.length} subscriptions`)
  } catch (error) {
    console.error("❌ Error in bulk update:", error)
    throw new Error(`Failed to bulk update subscriptions: ${(error as any).message}`)
  }
}

// Delete user and all their data
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    console.log(`🗑️ Deleting user ${userId} and all their data...`)

    const database = ensureDb()
    const batch = writeBatch(database)

    // Delete all students
    const studentsRef = collection(database, "users", userId, "students")
    const studentsSnapshot = await getDocs(studentsRef)
    studentsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Delete all pengujis
    const pengujisRef = collection(database, "users", userId, "pengujis")
    const pengujisSnapshot = await getDocs(pengujisRef)
    pengujisSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Delete user document
    const userRef = doc(database, "users", userId)
    batch.delete(userRef)

    await batch.commit()

    console.log(`✅ Successfully deleted user ${userId} and all their data`)
  } catch (error) {
    console.error(`❌ Error deleting user ${userId}:`, error)
    throw new Error(`Failed to delete user: ${(error as any).message}`)
  }
}

// Update user profile
export const updateUserProfile = async (userId: string, updates: any): Promise<void> => {
  try {
    console.log(`🔄 Updating profile for user ${userId}`)

    const database = ensureDb()
    const userRef = doc(database, "users", userId)

    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Successfully updated profile for user ${userId}`)
  } catch (error) {
    console.error(`❌ Error updating profile for user ${userId}:`, error)
    throw new Error(`Failed to update user profile: ${(error as any).message}`)
  }
}

// Toggle user active status
export const toggleUserActiveStatus = async (userId: string, isActive: boolean): Promise<void> => {
  try {
    console.log(`🔄 Setting user ${userId} active status to ${isActive}`)

    const database = ensureDb()
    const userRef = doc(database, "users", userId)

    await updateDoc(userRef, {
      isActive,
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Successfully updated active status for user ${userId}`)
  } catch (error) {
    console.error(`❌ Error updating active status for user ${userId}:`, error)
    throw new Error(`Failed to update user active status: ${(error as any).message}`)
  }
}

// Reset user data (delete all students and pengujis but keep user)
export const resetUserData = async (userId: string): Promise<void> => {
  try {
    console.log(`🔄 Resetting data for user ${userId}...`)

    const database = ensureDb()
    const batch = writeBatch(database)

    // Delete all students
    const studentsRef = collection(database, "users", userId, "students")
    const studentsSnapshot = await getDocs(studentsRef)
    studentsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Delete all pengujis
    const pengujisRef = collection(database, "users", userId, "pengujis")
    const pengujisSnapshot = await getDocs(pengujisRef)
    pengujisSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()

    console.log(`✅ Successfully reset data for user ${userId}`)
  } catch (error) {
    console.error(`❌ Error resetting data for user ${userId}:`, error)
    throw new Error(`Failed to reset user data: ${(error as any).message}`)
  }
}

// Search users
export const searchUsers = async (searchTerm: string): Promise<any[]> => {
  try {
    console.log(`🔍 Searching users with term: ${searchTerm}`)

    const users = await getAllUsersWithStats()

    const filteredUsers = users.filter((user) => {
      const term = searchTerm.toLowerCase()
      return (
        user.email?.toLowerCase().includes(term) ||
        user.displayName?.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term)
      )
    })

    console.log(`✅ Found ${filteredUsers.length} users matching search term`)
    return filteredUsers
  } catch (error) {
    console.error("❌ Error searching users:", error)
    throw new Error(`Failed to search users: ${(error as any).message}`)
  }
}

// Alias for backward compatibility
export const getAllUsers = getAllUsersWithStats
export const getUserStats = getUserDetailedStats

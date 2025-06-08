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

// Admin functions - Improved with better error handling
export const getAllUsers = async (): Promise<any[]> => {
  try {
    const database = ensureDb()
    const usersRef = collection(database, "users")

    console.log("Fetching all users from Firestore...")

    // Try to get all users without ordering first to see if there are permission issues
    const snapshot = await getDocs(usersRef)

    console.log(`Found ${snapshot.size} users in Firestore`)

    const users = snapshot.docs.map((doc) => {
      const data = doc.data()
      console.log(`Processing user: ${data.email}`, data)

      return {
        id: doc.id,
        uid: data.uid || doc.id,
        email: data.email || "",
        displayName: data.displayName || data.email || "Unknown User",
        photoURL: data.photoURL || null,
        subscriptionType: data.subscriptionType || "free",
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        subscriptionExpiry: data.subscriptionExpiry ? convertTimestamp(data.subscriptionExpiry) : null,
      }
    })

    // Sort by creation date (newest first)
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    console.log("Processed users:", users)
    return users
  } catch (error) {
    console.error("Error getting all users:", error)
    console.error("Error details:", {
      code: (error as any).code,
      message: (error as any).message,
      stack: (error as any).stack,
    })
    throw new Error(`Failed to load users data: ${(error as any).message}`)
  }
}

export const updateUserSubscription = async (
  userId: string,
  subscriptionType: "free" | "premium",
  expiryDate?: Date,
): Promise<void> => {
  try {
    const database = ensureDb()
    const userRef = doc(database, "users", userId)

    console.log(`Updating subscription for user ${userId} to ${subscriptionType}`)

    const updateData: any = {
      subscriptionType,
      updatedAt: serverTimestamp(),
    }

    if (subscriptionType === "premium" && expiryDate) {
      updateData.subscriptionExpiry = expiryDate
    } else if (subscriptionType === "free") {
      updateData.subscriptionExpiry = null
    }

    await updateDoc(userRef, updateData)
    console.log(`Successfully updated subscription for user ${userId}`)
  } catch (error) {
    console.error("Error updating user subscription:", error)
    throw new Error("Failed to update user subscription")
  }
}

export const getUserStats = async (userId: string): Promise<any> => {
  try {
    const database = ensureDb()
    const studentsRef = collection(database, "users", userId, "students")
    const pengujisRef = collection(database, "users", userId, "pengujis")

    const [studentsSnapshot, pengujisSnapshot] = await Promise.all([
      getDocs(studentsRef).catch(() => ({ size: 0 })), // Handle permission errors gracefully
      getDocs(pengujisRef).catch(() => ({ docs: [] })),
    ])

    const pengujis = Array.isArray(pengujisSnapshot.docs) ? pengujisSnapshot.docs.map((doc) => doc.data()) : []

    const ustadzCount = pengujis.filter((p) => p.gender === "L").length
    const ustadzahCount = pengujis.filter((p) => p.gender === "P").length

    return {
      studentsCount: studentsSnapshot.size || 0,
      ustadzCount,
      ustadzahCount,
      totalPengujis: pengujis.length,
    }
  } catch (error) {
    console.error("Error getting user stats for user:", userId, error)
    return {
      studentsCount: 0,
      ustadzCount: 0,
      ustadzahCount: 0,
      totalPengujis: 0,
    }
  }
}

export const isAdmin = (email: string): boolean => {
  const adminEmails = ["dabasrianto@gmail.com"]
  return adminEmails.includes(email.toLowerCase())
}

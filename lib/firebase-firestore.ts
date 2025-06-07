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

// Students
export const getStudents = async (userId: string): Promise<Student[]> => {
  try {
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const studentsRef = collection(db, "users", userId, "students")
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
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const studentsRef = collection(db, "users", userId, "students")
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
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const studentRef = doc(db, "users", userId, "students", studentId)
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
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const studentRef = doc(db, "users", userId, "students", studentId)
    await deleteDoc(studentRef)
  } catch (error) {
    console.error("Error deleting student:", error)
    throw new Error("Failed to delete student")
  }
}

export const addSetoran = async (userId: string, studentId: string, setoran: Omit<Setoran, "id">): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const studentRef = doc(db, "users", userId, "students", studentId)
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
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const studentRef = doc(db, "users", userId, "students", studentId)
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
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const studentRef = doc(db, "users", userId, "students", studentId)
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
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const pengujisRef = collection(db, "users", userId, "pengujis")
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
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const pengujisRef = collection(db, "users", userId, "pengujis")
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
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const pengujiRef = doc(db, "users", userId, "pengujis", pengujiId)
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
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const pengujiRef = doc(db, "users", userId, "pengujis", pengujiId)
    await deleteDoc(pengujiRef)
  } catch (error) {
    console.error("Error deleting penguji:", error)
    throw new Error("Failed to delete penguji")
  }
}

// User subscription management
export const getUserProfile = async (userId: string): Promise<any> => {
  try {
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const userRef = doc(db, "users", userId)
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
    if (!db) {
      throw new Error("Firestore not initialized")
    }

    const userRef = doc(db, "users", userId)
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

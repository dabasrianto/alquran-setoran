"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/hooks/use-subscription"
import {
  getStudents,
  getPengujis,
  addStudent,
  updateStudent,
  deleteStudent,
  addSetoran,
  updateSetoran,
  deleteSetoran,
  addPenguji,
  updatePenguji,
  deletePenguji,
} from "@/lib/firebase-firestore"
import type { Student, Penguji, Setoran } from "@/lib/types"

export function useFirebaseData() {
  const { user } = useAuth()
  const { subscription, checkLimits } = useSubscription()
  const [students, setStudents] = useState<Student[]>([])
  const [pengujis, setPengujis] = useState<Penguji[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data when user is available
  useEffect(() => {
    if (user?.uid) {
      loadData()
    } else {
      setStudents([])
      setPengujis([])
      setLoading(false)
    }
  }, [user?.uid])

  const loadData = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      const [studentsData, pengujisData] = await Promise.all([getStudents(user.uid), getPengujis(user.uid)])

      setStudents(studentsData)
      setPengujis(pengujisData)
      setError(null)
    } catch (err) {
      console.error("Error loading data:", err)
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  // Get subscription status
  const getSubscriptionStatus = () => {
    if (!subscription) return null

    const ustadzCount = pengujis.filter((p) => p.gender === "L").length
    const ustadzahCount = pengujis.filter((p) => p.gender === "P").length

    return checkLimits({
      students: students.length,
      ustadz: ustadzCount,
      ustadzah: ustadzahCount,
    })
  }

  // Student operations
  const handleAddStudent = async (studentData: Omit<Student, "id">) => {
    if (!user?.uid) throw new Error("User not authenticated")

    const subscriptionStatus = getSubscriptionStatus()
    if (subscriptionStatus && !subscriptionStatus.canAddStudent) {
      throw new Error(
        `Limit maksimal ${subscriptionStatus.limits.maxStudents} murid untuk paket saat ini. Upgrade untuk menambah lebih banyak murid.`,
      )
    }

    try {
      const studentId = await addStudent(user.uid, studentData)
      await loadData() // Refresh data
      return studentId
    } catch (err) {
      console.error("Error adding student:", err)
      throw err
    }
  }

  const handleUpdateStudent = async (studentId: string, updates: Partial<Student>) => {
    if (!user?.uid) throw new Error("User not authenticated")

    try {
      await updateStudent(user.uid, studentId, updates)
      await loadData() // Refresh data
    } catch (err) {
      console.error("Error updating student:", err)
      throw err
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!user?.uid) throw new Error("User not authenticated")

    try {
      await deleteStudent(user.uid, studentId)
      await loadData() // Refresh data
    } catch (err) {
      console.error("Error deleting student:", err)
      throw err
    }
  }

  // Setoran operations
  const handleAddSetoran = async (studentId: string, setoran: Omit<Setoran, "id">) => {
    if (!user?.uid) throw new Error("User not authenticated")

    try {
      await addSetoran(user.uid, studentId, setoran)
      await loadData() // Refresh data
    } catch (err) {
      console.error("Error adding setoran:", err)
      throw err
    }
  }

  const handleUpdateSetoran = async (studentId: string, setoranId: string, updates: Partial<Setoran>) => {
    if (!user?.uid) throw new Error("User not authenticated")

    try {
      await updateSetoran(user.uid, studentId, setoranId, updates)
      await loadData() // Refresh data
    } catch (err) {
      console.error("Error updating setoran:", err)
      throw err
    }
  }

  const handleDeleteSetoran = async (studentId: string, setoranId: string) => {
    if (!user?.uid) throw new Error("User not authenticated")

    try {
      await deleteSetoran(user.uid, studentId, setoranId)
      await loadData() // Refresh data
    } catch (err) {
      console.error("Error deleting setoran:", err)
      throw err
    }
  }

  // Penguji operations
  const handleAddPenguji = async (pengujiData: Omit<Penguji, "id">) => {
    if (!user?.uid) throw new Error("User not authenticated")

    const subscriptionStatus = getSubscriptionStatus()
    if (subscriptionStatus) {
      if (pengujiData.gender === "L" && !subscriptionStatus.canAddUstadz) {
        throw new Error(
          `Limit maksimal ${subscriptionStatus.limits.maxUstadz} ustadz untuk paket saat ini. Upgrade untuk menambah lebih banyak ustadz.`,
        )
      }
      if (pengujiData.gender === "P" && !subscriptionStatus.canAddUstadzah) {
        throw new Error(
          `Limit maksimal ${subscriptionStatus.limits.maxUstadzah} ustadzah untuk paket saat ini. Upgrade untuk menambah lebih banyak ustadzah.`,
        )
      }
    }

    try {
      const pengujiId = await addPenguji(user.uid, pengujiData)
      await loadData() // Refresh data
      return pengujiId
    } catch (err) {
      console.error("Error adding penguji:", err)
      throw err
    }
  }

  const handleUpdatePenguji = async (pengujiId: string, updates: Partial<Penguji>) => {
    if (!user?.uid) throw new Error("User not authenticated")

    try {
      await updatePenguji(user.uid, pengujiId, updates)
      await loadData() // Refresh data
    } catch (err) {
      console.error("Error updating penguji:", err)
      throw err
    }
  }

  const handleDeletePenguji = async (pengujiId: string) => {
    if (!user?.uid) throw new Error("User not authenticated")

    try {
      await deletePenguji(user.uid, pengujiId)
      await loadData() // Refresh data
    } catch (err) {
      console.error("Error deleting penguji:", err)
      throw err
    }
  }

  return {
    students,
    pengujis,
    loading,
    error,
    subscription,
    subscriptionStatus: getSubscriptionStatus(),
    // Student methods
    addStudent: handleAddStudent,
    updateStudent: handleUpdateStudent,
    deleteStudent: handleDeleteStudent,
    // Setoran methods
    addSetoran: handleAddSetoran,
    updateSetoran: handleUpdateSetoran,
    deleteSetoran: handleDeleteSetoran,
    // Penguji methods
    addPenguji: handleAddPenguji,
    updatePenguji: handleUpdatePenguji,
    deletePenguji: handleDeletePenguji,
    // Utility
    refreshData: loadData,
  }
}
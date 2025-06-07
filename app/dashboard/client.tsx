"use client"

import { useEffect, useState } from "react"
import Dashboard from "@/components/dashboard"
import { useAuth } from "@/contexts/auth-context"
import { getStudents } from "@/lib/firebase-firestore"
import { Button } from "@/components/ui/button"
import type { Student } from "@/lib/types"

export default function DashboardClient() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStudents = async () => {
    if (!user?.uid) {
      setStudents([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const studentsData = await getStudents(user.uid)
      setStudents(studentsData)
    } catch (err: any) {
      console.error("Error loading students for dashboard:", err)
      setError(err.message || "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [user?.uid])

  // Auto refresh every 30 seconds to sync with main app
  useEffect(() => {
    if (!user?.uid) return

    const interval = setInterval(() => {
      loadStudents()
    }, 30000)

    return () => clearInterval(interval)
  }, [user?.uid])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={loadStudents}>Coba Lagi</Button>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">Tidak ada data murid</h3>
        <p className="text-muted-foreground">
          Tambahkan murid dan setoran hafalan terlebih dahulu untuk melihat visualisasi data.
        </p>
      </div>
    )
  }

  return <Dashboard students={students} />
}

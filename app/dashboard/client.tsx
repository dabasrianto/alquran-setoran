"use client"

import { useEffect, useState } from "react"
import Dashboard from "@/components/dashboard"
import type { Student } from "@/lib/types"

export default function DashboardClient() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("hafalanQuranData")
      if (storedData) {
        setStudents(JSON.parse(storedData))
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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

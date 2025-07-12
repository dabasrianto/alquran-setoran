"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, CheckCircle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

export function OverallStats() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPenguji: 0,
    totalSetoran: 0,
    completedSetoran: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return

      setLoading(true)
      try {
        const studentsSnapshot = await getDocs(collection(db, "users", currentUser.uid, "students"))
        const totalStudents = studentsSnapshot.size

        const pengujiSnapshot = await getDocs(collection(db, "users", currentUser.uid, "pengujis"))
        const totalPenguji = pengujiSnapshot.size

        const setoranSnapshot = await getDocs(collection(db, "users", currentUser.uid, "setoran"))
        const totalSetoran = setoranSnapshot.size

        const completedSetoranSnapshot = await getDocs(
          query(collection(db, "users", currentUser.uid, "setoran"), where("status", "==", "completed")),
        )
        const completedSetoran = completedSetoranSnapshot.size

        setStats({
          totalStudents,
          totalPenguji,
          totalSetoran,
          completedSetoran,
        })
      } catch (error) {
        console.error("Error fetching overall stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [currentUser])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Santri</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
          <p className="text-xs text-muted-foreground">Santri terdaftar</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Penguji</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPenguji}</div>
          <p className="text-xs text-muted-foreground">Penguji terdaftar</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Setoran</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSetoran}</div>
          <p className="text-xs text-muted-foreground">Setoran tercatat</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Setoran Selesai</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedSetoran}</div>
          <p className="text-xs text-muted-foreground">Setoran telah diselesaikan</p>
        </CardContent>
      </Card>
    </div>
  )
}

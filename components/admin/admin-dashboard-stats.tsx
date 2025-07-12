"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, BarChart, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export function AdminDashboardStats() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalStudents: 0,
    totalPenguji: 0,
    upgradeRequests: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser) return

      setLoading(true)
      try {
        // Total Users
        const usersSnapshot = await getDocs(collection(db, "users"))
        const totalUsers = usersSnapshot.size

        // Active Subscriptions
        const subscriptionsSnapshot = await getDocs(
          query(collection(db, "subscriptions"), where("status", "==", "active")),
        )
        const activeSubscriptions = subscriptionsSnapshot.size

        // Total Students
        let totalStudents = 0
        for (const userDoc of usersSnapshot.docs) {
          const studentsSnapshot = await getDocs(collection(db, "users", userDoc.id, "students"))
          totalStudents += studentsSnapshot.size
        }

        // Total Penguji
        let totalPenguji = 0
        for (const userDoc of usersSnapshot.docs) {
          const pengujiSnapshot = await getDocs(collection(db, "users", userDoc.id, "pengujis"))
          totalPenguji += pengujiSnapshot.size
        }

        // Upgrade Requests
        const upgradeRequestsSnapshot = await getDocs(
          query(collection(db, "upgradeRequests"), where("status", "==", "pending")),
        )
        const upgradeRequests = upgradeRequestsSnapshot.size

        setStats({
          totalUsers,
          activeSubscriptions,
          totalStudents,
          totalPenguji,
          upgradeRequests,
        })
      } catch (error) {
        console.error("Error fetching admin dashboard stats:", error)
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
          <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Pengguna terdaftar</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Langganan Aktif</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
          <p className="text-xs text-muted-foreground">Langganan premium aktif</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Santri</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
          <p className="text-xs text-muted-foreground">Santri terdaftar di semua akun</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Permintaan Upgrade</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upgradeRequests}</div>
          <p className="text-xs text-muted-foreground">Permintaan upgrade tertunda</p>
        </CardContent>
      </Card>
    </div>
  )
}

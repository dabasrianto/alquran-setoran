"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/hooks/use-subscription"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"
import { type PricingPlan, getPricingPlans } from "@/lib/firebase-pricing"
import { GradientStatCard } from "@/components/ui/gradient-stat-card"
import { Button } from "@/components/ui/button"
import { Link } from "next/link"
import { CheckCircle2 } from "lucide-react"

// Generate sample data for the charts
const generateChartData = (points: number, trend: "up" | "down" | "volatile") => {
  const data = []
  let value = trend === "up" ? 10 : 100

  for (let i = 0; i < points; i++) {
    if (trend === "up") {
      value += Math.random() * 10
    } else if (trend === "down") {
      value -= Math.random() * 5
      value = Math.max(value, 5) // Ensure we don't go below 5
    } else {
      // Volatile - random ups and downs
      value += (Math.random() - 0.5) * 20
      value = Math.max(value, 5) // Ensure we don't go below 5
    }

    data.push({
      name: `Day ${i + 1}`,
      value: Math.round(value),
    })
  }

  return data
}

// Sample data for the charts
const studentsData = generateChartData(30, "up")
const setoranData = generateChartData(30, "volatile")
const completedSurahData = generateChartData(30, "up")
const completedJuzData = generateChartData(30, "up")

export function UserStats() {
  const { currentUser, loading: authLoading } = useAuth()
  const { userSubscription, loading: subscriptionLoading } = useSubscription()
  const [studentCount, setStudentCount] = useState(0)
  const [pengujiCount, setPengujiCount] = useState(0)
  const [loadingCounts, setLoadingCounts] = useState(true)
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([])
  const [loadingPricing, setLoadingPricing] = useState(true)

  useEffect(() => {
    const fetchCounts = async () => {
      if (!currentUser) return

      setLoadingCounts(true)
      try {
        const studentsSnapshot = await getDocs(collection(db, "users", currentUser.uid, "students"))
        setStudentCount(studentsSnapshot.size)

        const pengujiSnapshot = await getDocs(collection(db, "users", currentUser.uid, "pengujis"))
        setPengujiCount(pengujiSnapshot.size)
      } catch (error) {
        console.error("Error fetching user specific counts:", error)
      } finally {
        setLoadingCounts(false)
      }
    }

    const fetchPlans = async () => {
      setLoadingPricing(true)
      const plans = await getPricingPlans()
      setPricingPlans(plans)
      setLoadingPricing(false)
    }

    fetchCounts()
    fetchPlans()
  }, [currentUser])

  if (authLoading || subscriptionLoading || loadingCounts || loadingPricing) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const currentPlan = pricingPlans.find((plan) => plan.id === userSubscription?.tier)

  const maxStudents = currentPlan?.maxStudents === null ? Number.POSITIVE_INFINITY : currentPlan?.maxStudents || 0
  const maxTeachers = currentPlan?.maxTeachers === null ? Number.POSITIVE_INFINITY : currentPlan?.maxTeachers || 0

  const studentProgress = maxStudents === Number.POSITIVE_INFINITY ? 100 : (studentCount / maxStudents) * 100
  const pengujiProgress = maxTeachers === Number.POSITIVE_INFINITY ? 100 : (pengujiCount / maxTeachers) * 100

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-2">Ringkasan Paket Anda</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paket Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentPlan?.name || "Gratis"}</div>
              <p className="text-xs text-muted-foreground">
                {userSubscription?.status === "active"
                  ? `Berakhir: ${userSubscription.endDate?.toLocaleDateString()}`
                  : "Tidak Aktif"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Batas Santri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentCount} / {maxStudents === Number.POSITIVE_INFINITY ? "∞" : maxStudents}
              </div>
              <Progress value={studentProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground">Penggunaan santri</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Batas Penguji</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pengujiCount} / {maxTeachers === Number.POSITIVE_INFINITY ? "∞" : maxTeachers}
              </div>
              <Progress value={pengujiProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground">Penggunaan penguji</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-lg mb-2">Fitur Paket Anda</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {(currentPlan?.features || []).map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> {feature}
            </li>
          ))}
          {/* Add more feature checks based on your PricingPlan interface */}
        </ul>
      </div>

      <Separator />

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/upgrade">Kelola Langganan</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <GradientStatCard
          title="Total Murid"
          value={studentCount.toString()}
          change={12}
          data={studentsData}
          color="purple"
        />
        <GradientStatCard title="Total Ayat Dihafal" value="1,240" change={8} data={setoranData} color="blue" />
        <GradientStatCard title="Surat Selesai" value="7" change={5} data={completedSurahData} color="green" />
        <GradientStatCard title="Juz Selesai" value="2" change={0} data={completedJuzData} color="amber" />
      </div>
    </div>
  )
}

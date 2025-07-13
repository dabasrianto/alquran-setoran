"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import type { Student } from "@/lib/types"
import { calculateStudentSummary } from "@/lib/utils"
import { quranData } from "@/lib/quran-data"
import { useMediaQuery } from "@/hooks/use-media-query"
import { UserDashboardStats } from "@/components/dashboard/user-stats"
import dynamic from "next/dynamic"
import { OverallStats } from '@/components/overall-stats'
import { StudentList } from '@/components/student-list'
import { PengujiList } from '@/components/penguji-list'
import { SetoranHistory } from '@/components/setoran-history'
import { StudentProgress } from '@/components/student-progress'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import UserStats from '@/components/dashboard/user-stats' // Import UserStats component

interface DashboardProps {
  students: Student[]
}

// Dynamically import Recharts components with SSR disabled
const DynamicUserDashboardStats = dynamic(
  () => import("@/components/dashboard/user-stats").then(mod => mod.UserDashboardStats),
  { ssr: false }
)

export default function Dashboard({ students }: DashboardProps) {
  const { currentUser, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [filterKelas, setFilterKelas] = useState("all")
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login')
    }
  }, [currentUser, loading, router])

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Prepare data for charts
  const studentsWithSummary = students
    .map((student) => ({
      ...student,
      summary: calculateStudentSummary(student),
    }))
    .filter((student) => filterKelas === "all" || student.kelas === filterKelas)

  const uniqueKelas = [...new Set(students.map((s) => s.kelas).filter(Boolean))].sort()

  // Data for Top Students Chart
  const topStudentsData = [...studentsWithSummary]
    .sort((a, b) => (b.summary?.totalMemorizedVerses || 0) - (a.summary?.totalMemorizedVerses || 0))
    .slice(0, isMobile ? 5 : 10)
    .map((student) => ({
      name: student.name,
      ayat: student.summary?.totalMemorizedVerses || 0,
    }))

  // Data for Surah Completion Chart
  const surahCompletionData = quranData
    .map((surah) => {
      const completedCount = studentsWithSummary.filter((student) => {
        const hafalanForSurah = student.hafalan?.filter((h) => h.surah === surah.name) || []
        const memorizedVerses = new Set()

        hafalanForSurah.forEach((h) => {
          for (let i = h.start; i <= h.end; i++) {
            memorizedVerses.add(i)
          }
        })

        return memorizedVerses.size === surah.verses
      }).length

      return {
        name: `${surah.number}. ${surah.name}`,
        completed: completedCount,
        inProgress:
          studentsWithSummary.filter((student) => student.hafalan?.some((h) => h.surah === surah.name)).length -
          completedCount,
      }
    })
    .filter((d) => d.completed > 0 || d.inProgress > 0)
    .slice(0, isMobile ? 8 : 15)

  // Data for Juz Progress Chart
  const juzProgressData = Array.from({ length: 30 }, (_, i) => {
    const juzNumber = i + 1
    const studentsStarted = studentsWithSummary.filter(
      (student) => student.summary?.juzProgress?.details && student.summary.juzProgress.details[juzNumber],
    ).length

    const studentsCompleted = studentsWithSummary.filter(
      (student) => student.summary?.juzProgress?.details && student.summary.juzProgress.details[juzNumber]?.isComplete,
    ).length

    return {
      name: `Juz ${juzNumber}`,
      started: studentsStarted,
      completed: studentsCompleted,
    }
  }).filter((d) => d.started > 0)

  // Data for Assessment Distribution
  const assessmentData = (() => {
    const counts = { "Ulang Lagi": 0, "Kurang Lancar": 0, Lancar: 0, Mutqin: 0 }

    studentsWithSummary.forEach((student) => {
      student.hafalan?.forEach((h) => {
        if (h.penilaian && counts[h.penilaian as keyof typeof counts] !== undefined) {
          counts[h.penilaian as keyof typeof counts]++
        }
      })
    })

    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  })()

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                  <TabsTrigger value="students">Santri</TabsTrigger>
                  <TabsTrigger value="penguji">Penguji</TabsTrigger>
                  <TabsTrigger value="setoran">Setoran</TabsTrigger>
                  <TabsTrigger value="progress">Progres Santri</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="overview">
                <OverallStats />
              </TabsContent>
              <TabsContent value="students">
                <StudentList />
              </TabsContent>
              <TabsContent value="penguji">
                <PengujiList />
              </TabsContent>
              <TabsContent value="setoran">
                <SetoranHistory />
              </TabsContent>
              <TabsContent value="progress">
                <StudentProgress />
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Dashboard Pengguna
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Selamat datang, {currentUser.email}!</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Gunakan tab di atas untuk mengelola data Anda.
                      </span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <UserStats /> {/* Use the imported UserStats component */}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

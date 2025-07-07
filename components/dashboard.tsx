"use client"

import { useState } from "react"
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
import dynamic from 'next/dynamic'

interface DashboardProps {
  students: Student[]
}

// Dynamically import Recharts components with SSR disabled
const DynamicUserDashboardStats = dynamic(
  () => import('@/components/dashboard/user-stats').then(mod => mod.UserDashboardStats),
  { ssr: false }
)

export default function Dashboard({ students }: DashboardProps) {
  const [filterKelas, setFilterKelas] = useState("all")
  const isMobile = useMediaQuery("(max-width: 768px)")

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Dashboard Analisis Hafalan</h2>
        <div className="w-full sm:w-auto">
          <Select value={filterKelas} onValueChange={setFilterKelas}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {uniqueKelas.map((kelas) => (
                <SelectItem key={kelas} value={kelas}>
                  {kelas}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <DynamicUserDashboardStats />
      </div>

      <Tabs defaultValue="students">
        <TabsList className="mb-4 w-full overflow-x-auto flex-nowrap justify-start md:justify-center">
          <TabsTrigger value="students">Progres Murid</TabsTrigger>
          <TabsTrigger value="surah">Progres Surat</TabsTrigger>
          <TabsTrigger value="juz">Progres Juz</TabsTrigger>
          <TabsTrigger value="assessment">Penilaian</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-base md:text-lg">
                {isMobile ? "5" : "10"} Murid dengan Hafalan Terbanyak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topStudentsData}
                    layout={isMobile ? "horizontal" : "vertical"}
                    margin={
                      isMobile ? { top: 5, right: 10, left: 0, bottom: 60 } : { top: 5, right: 30, left: 50, bottom: 5 }
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {isMobile ? (
                      <>
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                          tick={{ fontSize: 10 }}
                          interval={0}
                        />
                        <YAxis />
                      </>
                    ) : (
                      <>
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                      </>
                    )}
                    <Tooltip formatter={(value) => [`${value} ayat`, "Total Ayat"]} />
                    <Legend />
                    <Bar dataKey="ayat" fill="#3b82f6" name="Total Ayat Dihafal">
                      <defs>
                        <linearGradient id="colorAyat" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="surah">
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-base md:text-lg">Progres Surat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px]"> 
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={surahCompletionData}
                    margin={
                      isMobile
                        ? { top: 5, right: 10, left: 0, bottom: 60 }
                        : { top: 5, right: 30, left: 20, bottom: 80 }
                    }
                    layout={isMobile ? "vertical" : "horizontal"}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    {isMobile ? (
                      <>
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} interval={0} />
                      </>
                    ) : (
                      <>
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                      </>
                    )}
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#4ade80" name="Selesai">
                      <defs>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                    </Bar>
                    <Bar dataKey="inProgress" stackId="a" fill="#facc15" name="Dalam Proses">
                      <defs>
                        <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#facc15" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#facc15" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="juz">
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-base md:text-lg">Progres Juz</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  {isMobile ? (
                    <BarChart data={juzProgressData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="started" fill="#facc15" name="Dimulai">
                        <defs>
                          <linearGradient id="colorStarted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#facc15" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#facc15" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                      </Bar>
                      <Bar dataKey="completed" fill="#4ade80" name="Selesai">
                        <defs>
                          <linearGradient id="colorCompleted2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4ade80" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                      </Bar>
                    </BarChart>
                  ) : (
                    <LineChart data={juzProgressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="started" 
                        stroke="#facc15" 
                        name="Dimulai"
                        strokeWidth={2}
                        dot={{ stroke: '#facc15', strokeWidth: 2, r: 4 }}
                        activeDot={{ stroke: '#facc15', strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#4ade80" 
                        name="Selesai"
                        strokeWidth={2}
                        dot={{ stroke: '#4ade80', strokeWidth: 2, r: 4 }}
                        activeDot={{ stroke: '#4ade80', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <CardTitle className="text-base md:text-lg">Distribusi Penilaian</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] md:h-[400px] w-full max-w-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assessmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={!isMobile}
                      outerRadius={isMobile ? 100 : 150}
                      fill="#8884d8"
                      dataKey="value"
                      label={isMobile ? undefined : ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {assessmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} setoran`, "Jumlah"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
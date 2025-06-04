"use client"

import type { StudentWithSummary } from "@/lib/types"

interface OverallStatsProps {
  students: StudentWithSummary[]
  filterName: string
  filterKelas: string
}

export default function OverallStats({ students, filterName, filterKelas }: OverallStatsProps) {
  const totalStudents = students.length
  let totalAyatSum = 0
  let maxAyat = 0
  let topStudents: string[] = []

  students.forEach((student) => {
    const ayatCount = student.summary?.totalMemorizedVerses || 0
    totalAyatSum += ayatCount
    if (ayatCount > maxAyat) {
      maxAyat = ayatCount
      topStudents = [student.name]
    } else if (ayatCount === maxAyat && maxAyat > 0) {
      topStudents.push(student.name)
    }
  })

  const averageAyat = totalStudents > 0 ? (totalAyatSum / totalStudents).toFixed(1) : "0"

  let title = "Statistik "
  if (filterKelas !== "all") {
    title += `Kelas ${filterKelas}`
    if (filterName) title += ` (Nama: "${filterName}")`
  } else if (filterName) {
    title += `(Filter Nama: "${filterName}")`
  } else {
    title += "Keseluruhan"
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
      <div className="overall-stats-grid grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-item bg-muted p-4 rounded-lg text-center border">
          <div className="stat-value text-2xl font-bold">{totalStudents}</div>
          <div className="stat-label text-sm text-muted-foreground mt-1">Total Murid</div>
        </div>
        <div className="stat-item bg-muted p-4 rounded-lg text-center border">
          <div className="stat-value text-2xl font-bold">{averageAyat}</div>
          <div className="stat-label text-sm text-muted-foreground mt-1">Rata-rata Ayat Hafal</div>
        </div>
        <div className="stat-item bg-muted p-4 rounded-lg text-center border">
          <div className="stat-value text-2xl font-bold">{topStudents.length > 0 ? topStudents.join(", ") : "-"}</div>
          <div className="stat-label text-sm text-muted-foreground mt-1">Hafalan Terbanyak</div>
          {topStudents.length > 0 && (
            <div className="top-student-list text-sm text-muted-foreground">({maxAyat} ayat)</div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  BookOpen,
  Filter,
  Search,
  Clock,
  MessageSquare
} from "lucide-react"
import type { Student, Setoran, Penguji } from "@/lib/types"
import { quranData } from "@/lib/quran-data"

interface ProgressTimelineProps {
  student: Student
  pengujis: Penguji[]
  onEdit: (setoran: Setoran, studentId: string) => void
  onDelete: (setoran: Setoran, studentId: string) => void
}

export default function ProgressTimeline({
  student,
  pengujis,
  onEdit,
  onDelete,
}: ProgressTimelineProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPenilaian, setFilterPenilaian] = useState("all")
  const [filterSurah, setFilterSurah] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Process and filter hafalan
  const filteredHafalan = useMemo(() => {
    if (!student.hafalan || student.hafalan.length === 0) return []

    let filtered = [...student.hafalan]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (h) =>
          h.surah.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.catatan?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Penilaian filter
    if (filterPenilaian !== "all") {
      filtered = filtered.filter((h) => h.penilaian === filterPenilaian)
    }

    // Surah filter
    if (filterSurah !== "all") {
      filtered = filtered.filter((h) => h.surah === filterSurah)
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter((h) => new Date(h.timestamp) >= filterDate)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter((h) => new Date(h.timestamp) >= filterDate)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter((h) => new Date(h.timestamp) >= filterDate)
          break
      }
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [student.hafalan, searchTerm, filterPenilaian, filterSurah, dateFilter])

  // Get unique surahs from student's hafalan
  const uniqueSurahs = useMemo(() => {
    if (!student.hafalan) return []
    const surahs = [...new Set(student.hafalan.map((h) => h.surah))]
    return surahs.sort((a, b) => {
      const aInfo = quranData.find((s) => s.name === a)
      const bInfo = quranData.find((s) => s.name === b)
      return (aInfo?.number || 0) - (bInfo?.number || 0)
    })
  }, [student.hafalan])

  const getPenilaianColor = (penilaian: string) => {
    switch (penilaian) {
      case "Ulang Lagi":
        return "bg-red-100 text-red-800 border-red-200"
      case "Kurang Lancar":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Lancar":
        return "bg-green-100 text-green-800 border-green-200"
      case "Mutqin":
        return "bg-teal-100 text-teal-800 border-teal-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPengujiName = (pengujiId?: string) => {
    if (!pengujiId) return null
    const penguji = pengujis.find((p) => p.id === pengujiId)
    if (!penguji) return null
    return `${penguji.gender === "L" ? "Ustadz" : "Ustadzah"} ${penguji.name}`
  }

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      time: date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    }
  }

  const getSurahDisplay = (surahName: string) => {
    const surahInfo = quranData.find((s) => s.name === surahName)
    return surahInfo ? `${surahInfo.number}. ${surahName}` : surahName
  }

  return (
    <div className="space-y-6">
      {/* Student Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{student.name}</h3>
              {student.kelas && <Badge variant="outline">{student.kelas}</Badge>}
              {student.target && (
                <p className="text-sm text-muted-foreground mt-1">Target: {student.target}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{student.hafalan?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Setoran</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari surat atau catatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterSurah} onValueChange={setFilterSurah}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Surat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Surat</SelectItem>
                {uniqueSurahs.map((surah) => (
                  <SelectItem key={surah} value={surah}>
                    {getSurahDisplay(surah)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPenilaian} onValueChange={setFilterPenilaian}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Penilaian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Penilaian</SelectItem>
                <SelectItem value="Ulang Lagi">Ulang Lagi</SelectItem>
                <SelectItem value="Kurang Lancar">Kurang Lancar</SelectItem>
                <SelectItem value="Lancar">Lancar</SelectItem>
                <SelectItem value="Mutqin">Mutqin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Tanggal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tanggal</SelectItem>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">7 Hari Terakhir</SelectItem>
                <SelectItem value="month">30 Hari Terakhir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline Progres ({filteredHafalan.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHafalan.length === 0 ? (
            <div className="text-center py-8">
              {searchTerm || filterPenilaian !== "all" || filterSurah !== "all" || dateFilter !== "all" ? (
                <Alert>
                  <Filter className="h-4 w-4" />
                  <AlertDescription>
                    Tidak ada progres yang sesuai dengan filter. Coba ubah filter pencarian.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <BookOpen className="h-4 w-4" />
                  <AlertDescription>
                    Belum ada riwayat progres untuk murid ini. Tambahkan progres pertama!
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHafalan.map((hafalan, index) => {
                const { date, time } = formatDateTime(hafalan.timestamp)
                const pengujiName = getPengujiName(hafalan.pengujiId)
                const surahDisplay = getSurahDisplay(hafalan.surah)

                return (
                  <div key={hafalan.id} className="relative">
                    {/* Timeline line */}
                    {index < filteredHafalan.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-full bg-border"></div>
                    )}

                    <div className="flex gap-4">
                      {/* Timeline dot */}
                      <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{surahDisplay}</h4>
                                  <Badge className={getPenilaianColor(hafalan.penilaian || "")}>
                                    {hafalan.penilaian}
                                  </Badge>
                                </div>

                                <div className="text-sm text-muted-foreground mb-2">
                                  Ayat {hafalan.start} - {hafalan.end} ({hafalan.end - hafalan.start + 1} ayat)
                                </div>

                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {date} • {time}
                                  </div>
                                  {pengujiName && (
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {pengujiName}
                                    </div>
                                  )}
                                </div>

                                {hafalan.catatan && (
                                  <div className="bg-muted p-3 rounded-md mb-3">
                                    <div className="flex items-start gap-2">
                                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                      <p className="text-sm whitespace-pre-wrap">{hafalan.catatan}</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onEdit(hafalan, student.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onDelete(hafalan, student.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
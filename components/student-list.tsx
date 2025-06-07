"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import type { Student, StudentWithSummary } from "@/lib/types"
import StudentProgress from "@/components/student-progress"
import SetoranHistory from "@/components/setoran-history"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useFirebaseData } from "@/hooks/use-firebase-data"

interface StudentListProps {
  students: StudentWithSummary[]
  onDeleteStudent: (id: string) => void
  onEditStudent: (student: Student) => void
  onDeleteSetoran: (studentId: string, setoranId: string) => void
  onEditSetoran: (data: { setoran: any; studentId: string }) => void
  filterName: string
  setFilterName: (value: string) => void
  filterKelas: string
  setFilterKelas: (value: string) => void
  sortOption: string
  setSortOption: (value: string) => void
  uniqueKelas: string[]
}

export default function StudentList({
  students,
  onDeleteStudent,
  onEditStudent,
  onDeleteSetoran,
  onEditSetoran,
  filterName,
  setFilterName,
  filterKelas,
  setFilterKelas,
  sortOption,
  setSortOption,
  uniqueKelas,
}: StudentListProps) {
  const [expandedStudents, setExpandedStudents] = useState<Record<string, boolean>>({})
  const { pengujis } = useFirebaseData()

  const toggleStudentExpand = (studentId: string) => {
    setExpandedStudents((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }))
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-gray-700 whitespace-nowrap">Daftar Murid dan Progres</h2>
        <div className="filter-sort-controls w-full md:w-auto flex-grow md:flex-grow-0">
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[150px]">
              <Input
                id="filterName"
                placeholder="Filter Nama..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Select value={filterKelas} onValueChange={setFilterKelas}>
                <SelectTrigger id="filterKelas">
                  <SelectValue placeholder="Semua Kelas" />
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
            <div className="flex-1 min-w-[180px]">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger id="sortOption">
                  <SelectValue placeholder="Urutkan Berdasarkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">Nama (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Nama (Z-A)</SelectItem>
                  <SelectItem value="ayat_desc">Total Ayat Hafal (Terbanyak)</SelectItem>
                  <SelectItem value="ayat_asc">Total Ayat Hafal (Tersedikit)</SelectItem>
                  <SelectItem value="surah_selesai_desc">Surat Selesai (Terbanyak)</SelectItem>
                  <SelectItem value="juz_selesai_desc">Juz Selesai (Terbanyak)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div id="studentList">
        {students.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            {filterName || filterKelas !== "all"
              ? "Tidak ada murid yang cocok dengan filter."
              : "Belum ada murid ditambahkan."}
          </p>
        ) : (
          students.map((student) => (
            <Collapsible
              key={student.id}
              open={expandedStudents[student.id]}
              onOpenChange={() => toggleStudentExpand(student.id)}
              className="student-item border-b py-4 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 inline">{student.name}</h3>
                  {student.kelas && <span className="kelas-label">({student.kelas})</span>}
                  {student.target && (
                    <span className="target-label block md:inline">
                      Target: <strong>{student.target}</strong>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="student-actions flex-shrink-0">
                    <Button variant="warning" size="sm" onClick={() => onEditStudent(student)} className="mr-2">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDeleteStudent(student.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-1">
                      {expandedStudents[student.id] ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>

              <div className="summary-grid grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 mt-3 mb-2 p-2 md:p-3 bg-muted rounded-lg border">
                <div className="summary-item text-center">
                  <div className="summary-value text-base md:text-lg font-semibold">
                    {student.summary?.totalMemorizedVerses || 0}
                  </div>
                  <div className="summary-label text-xs text-muted-foreground">Total Ayat</div>
                </div>
                <div className="summary-item text-center">
                  <div className="summary-value text-base md:text-lg font-semibold">
                    {student.summary?.startedSurahsCount || 0}
                  </div>
                  <div className="summary-label text-xs text-muted-foreground">Surat Dimulai</div>
                </div>
                <div className="summary-item text-center">
                  <div className="summary-value text-base md:text-lg font-semibold">
                    {student.summary?.completedSurahsCount || 0}
                  </div>
                  <div className="summary-label text-xs text-muted-foreground">Surat Selesai</div>
                </div>
                <div className="summary-item text-center">
                  <div className="summary-value text-base md:text-lg font-semibold">
                    {student.summary?.juzProgress?.started || 0}
                  </div>
                  <div className="summary-label text-xs text-muted-foreground">Juz Dimulai</div>
                </div>
                <div className="summary-item text-center">
                  <div className="summary-value text-base md:text-lg font-semibold">
                    {student.summary?.juzProgress?.completed || 0}
                  </div>
                  <div className="summary-label text-xs text-muted-foreground">Juz Selesai</div>
                </div>
              </div>

              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <StudentProgress student={student} />
                  <SetoranHistory
                    student={student}
                    pengujis={pengujis}
                    onDeleteSetoran={onDeleteSetoran}
                    onEditSetoran={onEditSetoran}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  )
}

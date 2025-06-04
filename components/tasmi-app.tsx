"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StudentForm from "@/components/student-form"
import SetoranForm from "@/components/setoran-form"
import StudentList from "@/components/student-list"
import OverallStats from "@/components/overall-stats"
import DataManagement from "@/components/data-management"
import type { Student, Setoran } from "@/lib/types"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { calculateStudentSummary } from "@/lib/utils"

const STORAGE_KEY = "hafalanQuranData"

export default function TasmiApp() {
  const [students, setStudents] = useLocalStorage<Student[]>(STORAGE_KEY, [])
  const [filterName, setFilterName] = useState("")
  const [filterKelas, setFilterKelas] = useState("all")
  const [sortOption, setSortOption] = useState("name_asc")
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [editingSetoran, setEditingSetoran] = useState<{
    setoran: Setoran
    studentId: string
  } | null>(null)
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [sortedStudents, setSortedStudents] = useState<any[]>([])
  const [uniqueKelas, setUniqueKelas] = useState<string[]>([])

  // Process students data when dependencies change
  useEffect(() => {
    // Extract unique kelas values
    const kelasValues = [...new Set(students.map((s) => s.kelas).filter(Boolean))].sort()
    setUniqueKelas(kelasValues)

    // Filter students
    const filtered = students.filter((student) => {
      const nameMatch = student.name.toLowerCase().includes(filterName.toLowerCase())
      const kelasMatch = filterKelas === "all" || student.kelas === filterKelas
      return nameMatch && kelasMatch
    })

    // Add summary to filtered students
    const withSummary = filtered.map((student) => ({
      ...student,
      summary: calculateStudentSummary(student),
    }))

    // Sort students
    const sorted = [...withSummary].sort((a, b) => {
      switch (sortOption) {
        case "name_asc":
          return a.name.localeCompare(b.name)
        case "name_desc":
          return b.name.localeCompare(a.name)
        case "ayat_desc":
          return (b.summary?.totalMemorizedVerses || 0) - (a.summary?.totalMemorizedVerses || 0)
        case "ayat_asc":
          return (a.summary?.totalMemorizedVerses || 0) - (b.summary?.totalMemorizedVerses || 0)
        case "surah_selesai_desc":
          return (b.summary?.completedSurahsCount || 0) - (a.summary?.completedSurahsCount || 0)
        case "juz_selesai_desc":
          return (b.summary?.juzProgress?.completed || 0) - (a.summary?.juzProgress?.completed || 0)
        default:
          return 0
      }
    })

    setFilteredStudents(withSummary)
    setSortedStudents(sorted)
  }, [students, filterName, filterKelas, sortOption])

  const handleAddStudent = (student: Student) => {
    setStudents([...students, student])
  }

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)))
    setEditingStudent(null)
  }

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus murid ini beserta seluruh data setorannya?")) {
      setStudents(students.filter((s) => s.id !== studentId))
      if (editingStudent?.id === studentId) {
        setEditingStudent(null)
      }
      if (editingSetoran?.studentId === studentId) {
        setEditingSetoran(null)
      }
    }
  }

  const handleAddSetoran = (studentId: string, setoran: Setoran) => {
    setStudents(
      students.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            hafalan: [...(s.hafalan || []), setoran],
          }
        }
        return s
      }),
    )
  }

  const handleUpdateSetoran = (studentId: string, setoranId: string, updatedSetoran: Partial<Setoran>) => {
    setStudents(
      students.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            hafalan: (s.hafalan || []).map((h) => (h.id === setoranId ? { ...h, ...updatedSetoran } : h)),
          }
        }
        return s
      }),
    )
    setEditingSetoran(null)
  }

  const handleDeleteSetoran = (studentId: string, setoranId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus setoran ini?")) {
      setStudents(
        students.map((s) => {
          if (s.id === studentId) {
            return {
              ...s,
              hafalan: (s.hafalan || []).filter((h) => h.id !== setoranId),
            }
          }
          return s
        }),
      )
      if (editingSetoran?.setoran.id === setoranId) {
        setEditingSetoran(null)
      }
    }
  }

  // Mobile-friendly tabs for different sections
  return (
    <>
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-4">
          <TabsTrigger value="students">Murid</TabsTrigger>
          <TabsTrigger value="setoran">Setoran</TabsTrigger>
          <TabsTrigger value="stats">Statistik</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card className="mb-6">
            <CardContent className="p-4 md:p-6">
              <StudentForm
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                editingStudent={editingStudent}
                setEditingStudent={setEditingStudent}
                students={students}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <StudentList
                students={sortedStudents}
                onDeleteStudent={handleDeleteStudent}
                onEditStudent={setEditingStudent}
                onDeleteSetoran={handleDeleteSetoran}
                onEditSetoran={setEditingSetoran}
                filterName={filterName}
                setFilterName={setFilterName}
                filterKelas={filterKelas}
                setFilterKelas={setFilterKelas}
                sortOption={sortOption}
                setSortOption={setSortOption}
                uniqueKelas={uniqueKelas}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setoran">
          <Card className="mb-6">
            <CardContent className="p-4 md:p-6">
              <SetoranForm
                students={students}
                onAddSetoran={handleAddSetoran}
                onUpdateSetoran={handleUpdateSetoran}
                editingSetoran={editingSetoran}
                setEditingSetoran={setEditingSetoran}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="mb-6">
            <CardContent className="p-4 md:p-6">
              <OverallStats students={filteredStudents} filterName={filterName} filterKelas={filterKelas} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardContent className="p-4 md:p-6">
              <DataManagement students={students} setStudents={setStudents} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

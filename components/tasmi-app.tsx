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
import { calculateStudentSummary } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useFirebaseData } from "@/hooks/use-firebase-data"

export default function TasmiApp() {
  const {
    students,
    pengujis,
    loading,
    error,
    subscriptionStatus,
    addStudent,
    updateStudent,
    deleteStudent,
    addSetoran,
    updateSetoran,
    deleteSetoran,
  } = useFirebaseData()

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

  const handleAddStudent = async (studentData: Omit<Student, "id">) => {
    try {
      await addStudent(studentData)
    } catch (error: any) {
      console.error("Error adding student:", error)
      alert(error.message || "Gagal menambah murid")
    }
  }

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      await updateStudent(updatedStudent.id, updatedStudent)
      setEditingStudent(null)
    } catch (error: any) {
      console.error("Error updating student:", error)
      alert(error.message || "Gagal mengupdate murid")
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus murid ini beserta seluruh data setorannya?")) {
      try {
        await deleteStudent(studentId)
        if (editingStudent?.id === studentId) {
          setEditingStudent(null)
        }
        if (editingSetoran?.studentId === studentId) {
          setEditingSetoran(null)
        }
      } catch (error: any) {
        console.error("Error deleting student:", error)
        alert(error.message || "Gagal menghapus murid")
      }
    }
  }

  const handleAddSetoran = async (studentId: string, setoran: Omit<Setoran, "id">) => {
    try {
      await addSetoran(studentId, setoran)
    } catch (error: any) {
      console.error("Error adding setoran:", error)
      alert(error.message || "Gagal menambah setoran")
    }
  }

  const handleUpdateSetoran = async (studentId: string, setoranId: string, updatedSetoran: Partial<Setoran>) => {
    try {
      await updateSetoran(studentId, setoranId, updatedSetoran)
      setEditingSetoran(null)
    } catch (error: any) {
      console.error("Error updating setoran:", error)
      alert(error.message || "Gagal mengupdate setoran")
    }
  }

  const handleDeleteSetoran = async (studentId: string, setoranId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus setoran ini?")) {
      try {
        await deleteSetoran(studentId, setoranId)
        if (editingSetoran?.setoran.id === setoranId) {
          setEditingSetoran(null)
        }
      } catch (error: any) {
        console.error("Error deleting setoran:", error)
        alert(error.message || "Gagal menghapus setoran")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    )
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
                subscriptionStatus={subscriptionStatus}
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
                pengujis={pengujis}
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
              <DataManagement students={students} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

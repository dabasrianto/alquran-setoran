"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  Eye
} from "lucide-react"
import type { Student, StudentWithSummary, Setoran, Penguji } from "@/lib/types"
import { calculateStudentSummary } from "@/lib/utils"
import ProgressForm from "./progress-form"
import ProgressTimeline from "./progress-timeline"

interface SetoranProgressTableProps {
  students: Student[]
  pengujis: Penguji[]
  onAddSetoran: (studentId: string, setoran: Omit<Setoran, "id">) => Promise<void>
  onUpdateSetoran: (studentId: string, setoranId: string, updatedSetoran: Partial<Setoran>) => Promise<void>
  onDeleteSetoran: (studentId: string, setoranId: string) => Promise<void>
}

export default function SetoranProgressTable({
  students,
  pengujis,
  onAddSetoran,
  onUpdateSetoran,
  onDeleteSetoran,
}: SetoranProgressTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterKelas, setFilterKelas] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editingSetoran, setEditingSetoran] = useState<{
    setoran: Setoran
    studentId: string
  } | null>(null)
  const [showProgressForm, setShowProgressForm] = useState(false)
  const [showTimeline, setShowTimeline] = useState<string | null>(null)

  // Process students with summary
  const studentsWithSummary: StudentWithSummary[] = useMemo(() => {
    return students.map((student) => ({
      ...student,
      summary: calculateStudentSummary(student),
    }))
  }, [students])

  // Get unique classes
  const uniqueKelas = useMemo(() => {
    return [...new Set(students.map((s) => s.kelas).filter(Boolean))].sort()
  }, [students])

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = studentsWithSummary.filter((student) => {
      const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
      const kelasMatch = filterKelas === "all" || student.kelas === filterKelas
      
      let statusMatch = true
      if (filterStatus === "completed") {
        statusMatch = student.summary.completedSurahsCount > 0
      } else if (filterStatus === "in_progress") {
        statusMatch = student.summary.startedSurahsCount > 0 && student.summary.completedSurahsCount === 0
      } else if (filterStatus === "not_started") {
        statusMatch = student.summary.startedSurahsCount === 0
      }

      return nameMatch && kelasMatch && statusMatch
    })

    // Sort students
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "kelas":
          return (a.kelas || "").localeCompare(b.kelas || "")
        case "progress":
          return (b.summary.totalMemorizedVerses || 0) - (a.summary.totalMemorizedVerses || 0)
        case "last_update":
          const aLastUpdate = a.hafalan?.[0]?.timestamp || "0"
          const bLastUpdate = b.hafalan?.[0]?.timestamp || "0"
          return new Date(bLastUpdate).getTime() - new Date(aLastUpdate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [studentsWithSummary, searchTerm, filterKelas, filterStatus, sortBy])

  const getProgressStatus = (student: StudentWithSummary) => {
    const { startedSurahsCount, completedSurahsCount, totalMemorizedVerses } = student.summary
    
    if (completedSurahsCount > 0) {
      return { status: "completed", label: "Selesai", color: "bg-green-100 text-green-800" }
    } else if (startedSurahsCount > 0) {
      return { status: "in_progress", label: "Berlangsung", color: "bg-blue-100 text-blue-800" }
    } else {
      return { status: "not_started", label: "Belum Mulai", color: "bg-gray-100 text-gray-800" }
    }
  }

  const getLastUpdateDate = (student: Student) => {
    if (!student.hafalan || student.hafalan.length === 0) {
      return "Belum ada"
    }
    
    const sortedHafalan = [...student.hafalan].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    
    return new Date(sortedHafalan[0].timestamp).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  }

  const handleAddProgress = (student: Student) => {
    setSelectedStudent(student)
    setEditingSetoran(null)
    setShowProgressForm(true)
  }

  const handleEditProgress = (setoran: Setoran, studentId: string) => {
    const student = students.find(s => s.id === studentId)
    if (student) {
      setSelectedStudent(student)
      setEditingSetoran({ setoran, studentId })
      setShowProgressForm(true)
    }
  }

  const handleDeleteProgress = async (setoran: Setoran, studentId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus progres ini?")) {
      try {
        await onDeleteSetoran(studentId, setoran.id)
      } catch (error: any) {
        alert(`Error: ${error.message}`)
      }
    }
  }

  const handleViewTimeline = (studentId: string) => {
    setShowTimeline(studentId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Progres Pembelajaran Murid</h2>
          <p className="text-muted-foreground">Kelola dan pantau progres hafalan setiap murid</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama murid..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterKelas} onValueChange={setFilterKelas}>
              <SelectTrigger>
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

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="in_progress">Berlangsung</SelectItem>
                <SelectItem value="not_started">Belum Mulai</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nama</SelectItem>
                <SelectItem value="kelas">Kelas</SelectItem>
                <SelectItem value="progress">Progres</SelectItem>
                <SelectItem value="last_update">Update Terakhir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Daftar Murid ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterKelas !== "all" || filterStatus !== "all" 
                  ? "Tidak ada murid yang sesuai filter" 
                  : "Belum ada murid"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterKelas !== "all" || filterStatus !== "all"
                  ? "Coba ubah filter pencarian"
                  : "Tambahkan murid terlebih dahulu di tab Murid"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Murid</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Progres Terkini</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update Terakhir</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const progressStatus = getProgressStatus(student)
                    const lastUpdate = getLastUpdateDate(student)
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            {student.target && (
                              <div className="text-sm text-muted-foreground">
                                Target: {student.target}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {student.kelas ? (
                            <Badge variant="outline">{student.kelas}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">{student.summary.totalMemorizedVerses}</span> ayat
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {student.summary.completedSurahsCount} surat selesai • {student.summary.juzProgress.completed} juz selesai
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={progressStatus.color}>
                            {progressStatus.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {progressStatus.status === "in_progress" && <Clock className="h-3 w-3 mr-1" />}
                            {progressStatus.label}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {lastUpdate}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewTimeline(student.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddProgress(student)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Form Dialog */}
      <Dialog open={showProgressForm} onOpenChange={setShowProgressForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSetoran ? "Edit Progres" : "Tambah Progres"} - {selectedStudent?.name}
            </DialogTitle>
            <DialogDescription>
              {editingSetoran 
                ? "Edit progres pembelajaran yang sudah ada"
                : "Tambahkan progres pembelajaran baru untuk murid ini"
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedStudent && (
            <ProgressForm
              student={selectedStudent}
              pengujis={pengujis}
              editingSetoran={editingSetoran}
              onSubmit={async (setoran) => {
                if (editingSetoran) {
                  await onUpdateSetoran(selectedStudent.id, editingSetoran.setoran.id, setoran)
                } else {
                  await onAddSetoran(selectedStudent.id, setoran)
                }
                setShowProgressForm(false)
                setEditingSetoran(null)
                setSelectedStudent(null)
              }}
              onCancel={() => {
                setShowProgressForm(false)
                setEditingSetoran(null)
                setSelectedStudent(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Timeline Dialog */}
      <Dialog open={!!showTimeline} onOpenChange={() => setShowTimeline(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Timeline Progres - {students.find(s => s.id === showTimeline)?.name}
            </DialogTitle>
            <DialogDescription>
              Riwayat lengkap progres pembelajaran murid
            </DialogDescription>
          </DialogHeader>
          
          {showTimeline && (
            <ProgressTimeline
              student={students.find(s => s.id === showTimeline)!}
              pengujis={pengujis}
              onEdit={handleEditProgress}
              onDelete={handleDeleteProgress}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

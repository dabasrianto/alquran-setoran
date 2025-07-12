"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Loader2, Edit, Trash2 } from "lucide-react"
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface Student {
  id: string
  name: string
  dob: Date
  gender: string
  kelas: string
  createdAt: Date
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage] = useState(10)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const { toast } = useToast()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    setLoading(true)
    const studentsRef = collection(db, "users", currentUser.uid, "students")
    const q = query(studentsRef)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedStudents: Student[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          dob: doc.data().dob?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Student[]
        setStudents(fetchedStudents)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching students:", error)
        setLoading(false)
        toast({
          title: "Error",
          description: "Gagal memuat daftar santri.",
          variant: "destructive",
        })
      },
    )

    return () => unsubscribe()
  }, [currentUser, toast])

  const handleEdit = (student: Student) => {
    setCurrentStudent({
      ...student,
      dob: new Date(student.dob), // Ensure dob is a Date object
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !currentStudent) return

    setLoading(true)
    try {
      await updateDoc(doc(db, "users", currentUser.uid, "students", currentStudent.id), {
        name: currentStudent.name,
        dob: currentStudent.dob,
        gender: currentStudent.gender,
        kelas: currentStudent.kelas,
      })
      toast({
        title: "Sukses",
        description: "Data santri berhasil diperbarui.",
      })
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating student:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui data santri.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (studentId: string) => {
    if (!currentUser) return
    if (!window.confirm("Apakah Anda yakin ingin menghapus santri ini?")) {
      return
    }
    setLoading(true)
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "students", studentId))
      toast({
        title: "Sukses",
        description: "Santri berhasil dihapus.",
      })
    } catch (error) {
      console.error("Error deleting student:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus santri.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.gender.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Santri</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Santri</CardTitle>
        <div className="flex justify-end">
          <Input
            placeholder="Cari santri..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Tanggal Lahir</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Dibuat Pada</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Tidak ada santri ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              currentStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{format(student.dob, "dd MMM yyyy")}</TableCell>
                  <TableCell>
                    <Badge variant={student.gender === "Laki-laki" ? "default" : "secondary"}>{student.gender}</Badge>
                  </TableCell>
                  <TableCell>{student.kelas}</TableCell>
                  <TableCell>{format(student.createdAt, "dd MMM yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(student)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(student.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <Button variant={currentPage === i + 1 ? "default" : "outline"} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Santri</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateStudent} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nama Santri</Label>
              <Input
                id="edit-name"
                value={currentStudent?.name || ""}
                onChange={(e) => setCurrentStudent((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dob">Tanggal Lahir</Label>
              <Input
                id="edit-dob"
                type="date"
                value={currentStudent?.dob ? format(currentStudent.dob, "yyyy-MM-dd") : ""}
                onChange={(e) =>
                  setCurrentStudent((prev) => (prev ? { ...prev, dob: new Date(e.target.value) } : null))
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-gender">Jenis Kelamin</Label>
              <Select
                value={currentStudent?.gender || ""}
                onValueChange={(value) => setCurrentStudent((prev) => (prev ? { ...prev, gender: value } : null))}
                required
              >
                <SelectTrigger id="edit-gender">
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-kelas">Kelas</Label>
              <Input
                id="edit-kelas"
                value={currentStudent?.kelas || ""}
                onChange={(e) => setCurrentStudent((prev) => (prev ? { ...prev, kelas: e.target.value } : null))}
                placeholder="Contoh: Kelas A, Tahfidz 1"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

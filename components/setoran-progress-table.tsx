'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'
import { collection, query, onSnapshot, getDocs, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { QURAN_DATA } from '@/lib/quran-data'
import { calculateStudentSummary } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

interface Student {
  id: string
  name: string
  kelas: string
  hafalan?: {
    surah: string
    start: number
    end: number
    penilaian: string
  }[]
}

interface StudentSummary {
  totalMemorizedVerses: number
  totalMurajaahVerses: number
  juzProgress: {
    totalJuz: number
    completedJuz: number
    details: {
      [key: number]: {
        memorizedVerses: number
        totalVerses: number
        progress: number
        isComplete: boolean
      }
    }
  }
  surahProgress: {
    [key: string]: {
      memorizedVerses: number
      totalVerses: number
      progress: number
      isComplete: boolean
    }
  }
}

export function SetoranProgressTable() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterKelas, setFilterKelas] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [studentsPerPage] = useState(10)
  const { toast } = useToast()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    setLoading(true)
    const studentsRef = collection(db, 'users', currentUser.uid, 'students')
    const setoranRef = collection(db, 'users', currentUser.uid, 'setoran')

    const unsubscribeStudents = onSnapshot(query(studentsRef), async (studentSnapshot) => {
      const fetchedStudents: Student[] = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        kelas: doc.data().kelas || 'Tidak Ada Kelas',
      }))

      const studentsWithHafalan: Student[] = []
      for (const student of fetchedStudents) {
        const setoranQuery = query(setoranRef, where('studentId', '==', student.id))
        const setoranSnapshot = await getDocs(setoranQuery)
        const hafalanData = setoranSnapshot.docs.map(doc => ({
          surah: doc.data().surah,
          start: doc.data().startAyat,
          end: doc.data().endAyat,
          penilaian: doc.data().score >= 90 ? 'Mutqin' : doc.data().score >= 75 ? 'Lancar' : doc.data().score >= 50 ? 'Kurang Lancar' : 'Ulang Lagi',
        }))
        studentsWithHafalan.push({ ...student, hafalan: hafalanData })
      }
      setStudents(studentsWithHafalan)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching students or setoran:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Gagal memuat progres santri.",
        variant: "destructive",
      })
    })

    return () => unsubscribeStudents()
  }, [currentUser, toast])

  const studentsWithSummary = students.map(student => ({
    ...student,
    summary: calculateStudentSummary(student),
  }))

  const filteredStudents = studentsWithSummary.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterKelas === 'all' || student.kelas === filterKelas)
  )

  const uniqueKelas = [...new Set(students.map(s => s.kelas))].filter(Boolean)

  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent)
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Progres Hafalan Santri</CardTitle>
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
        <CardTitle>Progres Hafalan Santri</CardTitle>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <Input
            placeholder="Cari santri..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterKelas} onValueChange={setFilterKelas}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {uniqueKelas.map(kelas => (
                <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Santri</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Total Ayat Dihafal</TableHead>
              <TableHead>Progres Juz</TableHead>
              <TableHead>Progres Surah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Tidak ada santri ditemukan.</TableCell>
              </TableRow>
            ) : (
              currentStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.kelas}</TableCell>
                  <TableCell>{student.summary?.totalMemorizedVerses || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.summary?.juzProgress?.progress || 0} className="w-[100px]" />
                      <span>{student.summary?.juzProgress?.completedJuz || 0}/{student.summary?.juzProgress?.totalJuz || 30} Juz</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {Object.entries(student.summary?.surahProgress || {}).map(([surahName, progress]) => (
                        <div key={surahName} className="flex items-center gap-2 text-xs">
                          <span>{surahName}:</span>
                          <Progress value={progress.progress} className="w-[80px]" />
                          <span>{progress.memorizedVerses}/{progress.totalVerses}</span>
                        </div>
                      ))}
                      {Object.keys(student.summary?.surahProgress || {}).length === 0 && "Belum ada hafalan"}
                    </div>
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
                <Button
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  onClick={() => paginate(i + 1)}
                >
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
    </Card>
  )
}

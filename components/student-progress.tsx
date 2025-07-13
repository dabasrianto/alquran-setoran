'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'
import { collection, query, onSnapshot, getDocs, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { QURAN_DATA } from '@/lib/quran-data'
import { calculateStudentSummary } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

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

export function StudentProgress() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedStudentSummary, setSelectedStudentSummary] = useState<StudentSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    const studentsRef = collection(db, 'users', currentUser.uid, 'students')
    const setoranRef = collection(db, 'users', currentUser.uid, 'setoran')

    const unsubscribeStudents = onSnapshot(query(studentsRef), async (studentSnapshot) => {
      const fetchedStudents: Student[] = studentSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        kelas: doc.data().kelas || 'Tidak Ada Kelas',
      }))
      setStudents(fetchedStudents)

      if (fetchedStudents.length > 0 && !selectedStudentId) {
        setSelectedStudentId(fetchedStudents[0].id)
      }
      setLoading(false)
    }, (error) => {
      console.error("Error fetching students:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Gagal memuat daftar santri.",
        variant: "destructive",
      })
    })

    return () => unsubscribeStudents()
  }, [currentUser, selectedStudentId, toast])

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!currentUser || !selectedStudentId) {
        setSelectedStudentSummary(null)
        return
      }

      setLoading(true)
      try {
        const studentDoc = students.find(s => s.id === selectedStudentId)
        if (!studentDoc) {
          setSelectedStudentSummary(null)
          setLoading(false)
          return
        }

        const setoranQuery = query(collection(db, 'users', currentUser.uid, 'setoran'), where('studentId', '==', selectedStudentId))
        const setoranSnapshot = await getDocs(setoranQuery)
        const hafalanData = setoranSnapshot.docs.map(doc => ({
          surah: doc.data().surah,
          start: doc.data().startAyat,
          end: doc.data().endAyat,
          penilaian: doc.data().score >= 90 ? 'Mutqin' : doc.data().score >= 75 ? 'Lancar' : doc.data().score >= 50 ? 'Kurang Lancar' : 'Ulang Lagi',
        }))
        const studentWithHafalan = { ...studentDoc, hafalan: hafalanData }
        setSelectedStudentSummary(calculateStudentSummary(studentWithHafalan))
      } catch (error) {
        console.error("Error fetching student progress:", error)
        toast({
          title: "Error",
          description: "Gagal memuat progres santri.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [currentUser, selectedStudentId, students, toast])

  const handlePrint = () => {
    window.print()
  }

  const getPenilaianClass = (penilaian: string) => {
    switch (penilaian) {
      case 'Ulang Lagi':
        return 'penilaian-ulang'
      case 'Kurang Lancar':
        return 'penilaian-kurang'
      case 'Lancar':
        return 'penilaian-lancar'
      case 'Mutqin':
        return 'penilaian-mutqin'
      default:
        return ''
    }
  }

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

  const selectedStudent = students.find(s => s.id === selectedStudentId)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Progres Hafalan Santri</CardTitle>
        <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-2">
          <Printer className="h-4 w-4" /> Cetak Laporan
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="select-student">Pilih Santri</Label>
          <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
            <SelectTrigger id="select-student">
              <SelectValue placeholder="Pilih Santri untuk melihat progres" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedStudentId && selectedStudentSummary ? (
          <div id="printArea" className="space-y-6">
            <h3 className="text-xl font-bold">Laporan Progres Hafalan: {selectedStudent?.name}</h3>
            <p className="text-muted-foreground">Kelas: {selectedStudent?.kelas || 'N/A'}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ringkasan Hafalan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Total Ayat Dihafal:</strong> {selectedStudentSummary.totalMemorizedVerses}</p>
                  <p><strong>Total Ayat Murajaah:</strong> {selectedStudentSummary.totalMurajaahVerses}</p>
                  <p><strong>Progres Keseluruhan Juz:</strong> {selectedStudentSummary.juzProgress.completedJuz} / {selectedStudentSummary.juzProgress.totalJuz} Juz</p>
                  <Progress value={selectedStudentSummary.juzProgress.progress} className="w-full mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progres Per Juz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                  {Object.entries(selectedStudentSummary.juzProgress.details).map(([juz, data]) => (
                    <div key={juz} className="flex items-center gap-2">
                      <span className="font-medium">Juz {juz}:</span>
                      <Progress value={data.progress} className="flex-1" />
                      <span>{data.memorizedVerses}/{data.totalVerses} ayat ({data.progress.toFixed(0)}%)</span>
                      {data.isComplete && <Badge className="bg-green-500">Selesai</Badge>}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progres Per Surah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(selectedStudentSummary.surahProgress).map(([surahName, data]) => (
                  <div key={surahName} className="flex items-center gap-2">
                    <span className="font-medium">{surahName}:</span>
                    <Progress value={data.progress} className="flex-1" />
                    <span>{data.memorizedVerses}/{data.totalVerses} ayat ({data.progress.toFixed(0)}%)</span>
                    {data.isComplete && <Badge className="bg-green-500">Selesai</Badge>}
                  </div>
                ))}
                {Object.keys(selectedStudentSummary.surahProgress).length === 0 && (
                  <p className="text-muted-foreground text-center">Belum ada hafalan yang tercatat untuk surah.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Penilaian Hafalan</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Surah</TableHead>
                      <TableHead>Ayat</TableHead>
                      <TableHead>Penilaian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedStudent?.hafalan && selectedStudent.hafalan.length > 0 ? (
                      selectedStudent.hafalan.map((h, index) => (
                        <TableRow key={index}>
                          <TableCell>{QURAN_DATA.find(s => s.name.transliteration.id === h.surah)?.name.transliteration.id || h.surah}</TableCell>
                          <TableCell>{h.start}-{h.end}</TableCell>
                          <TableCell>
                            <Badge className={getPenilaianClass(h.penilaian)}>
                              {h.penilaian}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">Belum ada detail hafalan.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Silakan pilih santri untuk melihat progres hafalan.</p>
        )}
      </CardContent>
    </Card>
  )
}

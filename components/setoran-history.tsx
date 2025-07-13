'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Loader2, Edit, Trash2 } from 'lucide-react'
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QURAN_DATA } from '@/lib/quran-data'
import { format } from 'date-fns'

interface Setoran {
  id: string
  studentId: string
  pengujiId: string
  date: Date
  type: string
  surah: string
  startAyat: number
  endAyat: number
  score: number
  notes: string
}

interface Student {
  id: string
  name: string
}

interface Penguji {
  id: string
  name: string
}

export function SetoranHistory() {
  const [setorans, setSetorans] = useState<Setoran[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [setoransPerPage] = useState(10)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentSetoran, setCurrentSetoran] = useState<Setoran | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [pengujis, setPengujis] = useState<Penguji[]>([])
  const { toast } = useToast()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    const fetchDependencies = async () => {
      // Fetch students
      const studentsRef = collection(db, 'users', currentUser.uid, 'students')
      const studentsSnapshot = await getDocs(query(studentsRef))
      const fetchedStudents: Student[] = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }))
      setStudents(fetchedStudents)

      // Fetch pengujis
      const pengujisRef = collection(db, 'users', currentUser.uid, 'pengujis')
      const pengujisSnapshot = await getDocs(query(pengujisRef))
      const fetchedPengujis: Penguji[] = pengujisSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }))
      setPengujis(fetchedPengujis)
    }
    fetchDependencies()

    setLoading(true)
    const setoransRef = collection(db, 'users', currentUser.uid, 'setoran')
    const q = query(setoransRef)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSetorans: Setoran[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as Setoran[]
      setSetorans(fetchedSetorans)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching setorans:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Gagal memuat riwayat setoran.",
        variant: "destructive",
      })
    })

    return () => unsubscribe()
  }, [currentUser, toast])

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'N/A'
  }

  const getPengujiName = (pengujiId: string) => {
    return pengujis.find(p => p.id === pengujiId)?.name || 'N/A'
  }

  const handleEdit = (setoran: Setoran) => {
    setCurrentSetoran({
      ...setoran,
      date: new Date(setoran.date), // Ensure date is a Date object
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateSetoran = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !currentSetoran) return

    setLoading(true)
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'setoran', currentSetoran.id), {
        studentId: currentSetoran.studentId,
        pengujiId: currentSetoran.pengujiId,
        date: currentSetoran.date,
        type: currentSetoran.type,
        surah: currentSetoran.surah,
        startAyat: Number(currentSetoran.startAyat),
        endAyat: Number(currentSetoran.endAyat),
        score: Number(currentSetoran.score),
        notes: currentSetoran.notes,
      })
      toast({
        title: "Sukses",
        description: "Data setoran berhasil diperbarui.",
      })
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating setoran:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui data setoran.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (setoranId: string) => {
    if (!currentUser) return
    if (!window.confirm("Apakah Anda yakin ingin menghapus setoran ini?")) {
      return
    }
    setLoading(true)
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'setoran', setoranId))
      toast({
        title: "Sukses",
        description: "Setoran berhasil dihapus.",
      })
    } catch (error) {
      console.error("Error deleting setoran:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus setoran.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredSetorans = setorans.filter(setoran =>
    getStudentName(setoran.studentId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getPengujiName(setoran.pengujiId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    setoran.surah.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setoran.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastSetoran = currentPage * setoransPerPage
  const indexOfFirstSetoran = indexOfLastSetoran - setoransPerPage
  const currentSetorans = filteredSetorans.slice(indexOfFirstSetoran, indexOfLastSetoran)
  const totalPages = Math.ceil(filteredSetorans.length / setoransPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Setoran</CardTitle>
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
        <CardTitle>Riwayat Setoran</CardTitle>
        <div className="flex justify-end">
          <Input
            placeholder="Cari setoran..."
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
              <TableHead>Santri</TableHead>
              <TableHead>Penguji</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Surah</TableHead>
              <TableHead>Ayat</TableHead>
              <TableHead>Nilai</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSetorans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">Tidak ada riwayat setoran ditemukan.</TableCell>
              </TableRow>
            ) : (
              currentSetorans.map((setoran) => (
                <TableRow key={setoran.id}>
                  <TableCell className="font-medium">{getStudentName(setoran.studentId)}</TableCell>
                  <TableCell>{getPengujiName(setoran.pengujiId)}</TableCell>
                  <TableCell>{format(setoran.date, 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={setoran.type === 'baru' ? 'default' : 'secondary'}>
                      {setoran.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{setoran.surah}</TableCell>
                  <TableCell>{setoran.startAyat}-{setoran.endAyat}</TableCell>
                  <TableCell>{setoran.score}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(setoran)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(setoran.id)} className="text-red-600">
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Setoran</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSetoran} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-student">Santri</Label>
              <Select
                value={currentSetoran?.studentId || ''}
                onValueChange={(value) => setCurrentSetoran(prev => prev ? { ...prev, studentId: value } : null)}
                required
              >
                <SelectTrigger id="edit-student">
                  <SelectValue placeholder="Pilih Santri" />
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
            <div className="grid gap-2">
              <Label htmlFor="edit-penguji">Penguji</Label>
              <Select
                value={currentSetoran?.pengujiId || ''}
                onValueChange={(value) => setCurrentSetoran(prev => prev ? { ...prev, pengujiId: value } : null)}
                required
              >
                <SelectTrigger id="edit-penguji">
                  <SelectValue placeholder="Pilih Penguji" />
                </SelectTrigger>
                <SelectContent>
                  {pengujis.map((penguji) => (
                    <SelectItem key={penguji.id} value={penguji.id}>
                      {penguji.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-date">Tanggal</Label>
              <Input
                id="edit-date"
                type="date"
                value={currentSetoran?.date ? format(currentSetoran.date, 'yyyy-MM-dd') : ''}
                onChange={(e) => setCurrentSetoran(prev => prev ? { ...prev, date: new Date(e.target.value) } : null)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Jenis Setoran</Label>
              <Select
                value={currentSetoran?.type || ''}
                onValueChange={(value) => setCurrentSetoran(prev => prev ? { ...prev, type: value } : null)}
                required
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Pilih Jenis Setoran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baru">Baru</SelectItem>
                  <SelectItem value="murajaah">Murajaah</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-surah">Surah</Label>
              <Select
                value={currentSetoran?.surah || ''}
                onValueChange={(value) => setCurrentSetoran(prev => prev ? { ...prev, surah: value } : null)}
                required
              >
                <SelectTrigger id="edit-surah">
                  <SelectValue placeholder="Pilih Surah" />
                </SelectTrigger>
                <SelectContent>
                  {QURAN_DATA.map((s) => (
                    <SelectItem key={s.number} value={s.name.transliteration.id}>
                      {s.number}. {s.name.transliteration.id} ({s.numberOfVerses} ayat)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-start-ayat">Ayat Awal</Label>
                <Input
                  id="edit-start-ayat"
                  type="number"
                  value={currentSetoran?.startAyat || ''}
                  onChange={(e) => setCurrentSetoran(prev => prev ? { ...prev, startAyat: parseInt(e.target.value) } : null)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-end-ayat">Ayat Akhir</Label>
                <Input
                  id="edit-end-ayat"
                  type="number"
                  value={currentSetoran?.endAyat || ''}
                  onChange={(e) => setCurrentSetoran(prev => prev ? { ...prev, endAyat: parseInt(e.target.value) } : null)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-score">Nilai (1-100)</Label>
              <Input
                id="edit-score"
                type="number"
                value={currentSetoran?.score || ''}
                onChange={(e) => setCurrentSetoran(prev => prev ? { ...prev, score: parseInt(e.target.value) } : null)}
                min="1"
                max="100"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Catatan (Opsional)</Label>
              <Input
                id="edit-notes"
                value={currentSetoran?.notes || ''}
                onChange={(e) => setCurrentSetoran(prev => prev ? { ...prev, notes: e.target.value } : null)}
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

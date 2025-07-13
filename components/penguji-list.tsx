'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Loader2, Edit, Trash2 } from 'lucide-react'
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Penguji {
  id: string
  name: string
  phone: string
  createdAt: Date
}

export function PengujiList() {
  const [pengujis, setPengujis] = useState<Penguji[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pengujisPerPage] = useState(10)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentPenguji, setCurrentPenguji] = useState<Penguji | null>(null)
  const { toast } = useToast()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    setLoading(true)
    const pengujisRef = collection(db, 'users', currentUser.uid, 'pengujis')
    const q = query(pengujisRef)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPengujis: Penguji[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Penguji[]
      setPengujis(fetchedPengujis)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching pengujis:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Gagal memuat daftar penguji.",
        variant: "destructive",
      })
    })

    return () => unsubscribe()
  }, [currentUser, toast])

  const handleEdit = (penguji: Penguji) => {
    setCurrentPenguji(penguji)
    setIsEditModalOpen(true)
  }

  const handleUpdatePenguji = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !currentPenguji) return

    setLoading(true)
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'pengujis', currentPenguji.id), {
        name: currentPenguji.name,
        phone: currentPenguji.phone,
      })
      toast({
        title: "Sukses",
        description: "Data penguji berhasil diperbarui.",
      })
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating penguji:", error)
      toast({
        title: "Error",
        description: "Gagal memperbarui data penguji.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pengujiId: string) => {
    if (!currentUser) return
    if (!window.confirm("Apakah Anda yakin ingin menghapus penguji ini?")) {
      return
    }
    setLoading(true)
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'pengujis', pengujiId))
      toast({
        title: "Sukses",
        description: "Penguji berhasil dihapus.",
      })
    } catch (error) {
      console.error("Error deleting penguji:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus penguji.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPengujis = pengujis.filter(penguji =>
    penguji.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    penguji.phone.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastPenguji = currentPage * pengujisPerPage
  const indexOfFirstPenguji = indexOfLastPenguji - pengujisPerPage
  const currentPengujis = filteredPengujis.slice(indexOfFirstPenguji, indexOfLastPenguji)
  const totalPages = Math.ceil(filteredPengujis.length / pengujisPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Penguji</CardTitle>
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
        <CardTitle>Daftar Penguji</CardTitle>
        <div className="flex justify-end">
          <Input
            placeholder="Cari penguji..."
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
              <TableHead>Telepon</TableHead>
              <TableHead>Dibuat Pada</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPengujis.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Tidak ada penguji ditemukan.</TableCell>
              </TableRow>
            ) : (
              currentPengujis.map((penguji) => (
                <TableRow key={penguji.id}>
                  <TableCell className="font-medium">{penguji.name}</TableCell>
                  <TableCell>{penguji.phone}</TableCell>
                  <TableCell>{penguji.createdAt.toLocaleDateString()}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(penguji)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(penguji.id)} className="text-red-600">
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
            <DialogTitle>Edit Penguji</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdatePenguji} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nama Penguji</Label>
              <Input
                id="edit-name"
                value={currentPenguji?.name || ''}
                onChange={(e) => setCurrentPenguji(prev => prev ? { ...prev, name: e.target.value } : null)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Nomor Telepon</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={currentPenguji?.phone || ''}
                onChange={(e) => setCurrentPenguji(prev => prev ? { ...prev, phone: e.target.value } : null)}
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

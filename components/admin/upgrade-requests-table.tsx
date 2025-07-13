'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Loader2 } from 'lucide-react'
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { format } from 'date-fns'

interface UpgradeRequest {
  id: string
  userId: string
  requestedTier: string
  status: 'pending' | 'approved' | 'rejected'
  timestamp: Date
  notes?: string
}

export function UpgradeRequestsTable() {
  const [requests, setRequests] = useState<UpgradeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [requestsPerPage] = useState(10)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    const requestsRef = collection(db, 'upgradeRequests')
    const q = query(requestsRef)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRequests: UpgradeRequest[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as UpgradeRequest[]
      setRequests(fetchedRequests)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching upgrade requests:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Gagal memuat permintaan upgrade.",
        variant: "destructive",
      })
    })

    return () => unsubscribe()
  }, [toast])

  const handleUpdateStatus = async (requestId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'upgradeRequests', requestId), { status: newStatus })
      toast({
        title: "Sukses",
        description: `Status permintaan berhasil diubah menjadi ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating request status:", error)
      toast({
        title: "Error",
        description: "Gagal mengubah status permintaan.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRequest = async (requestId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus permintaan ini?")) {
      return
    }
    try {
      await deleteDoc(doc(db, 'upgradeRequests', requestId))
      toast({
        title: "Sukses",
        description: "Permintaan berhasil dihapus.",
      })
    } catch (error) {
      console.error("Error deleting request:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus permintaan.",
        variant: "destructive",
      })
    }
  }

  const filteredRequests = requests.filter(req =>
    req.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.requestedTier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastRequest = currentPage * requestsPerPage
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest)
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permintaan Upgrade</CardTitle>
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
        <CardTitle>Permintaan Upgrade</CardTitle>
        <div className="flex justify-end">
          <Input
            placeholder="Cari permintaan..."
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
              <TableHead>ID Pengguna</TableHead>
              <TableHead>Paket Diminta</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Tidak ada permintaan upgrade ditemukan.</TableCell>
              </TableRow>
            ) : (
              currentRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-mono text-xs">{req.userId}</TableCell>
                  <TableCell>{req.requestedTier}</TableCell>
                  <TableCell>
                    <Badge variant={
                      req.status === 'approved' ? 'default' :
                      req.status === 'pending' ? 'secondary' :
                      'destructive'
                    }>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(req.timestamp, 'dd MMM yyyy HH:mm')}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate">{req.notes || 'N/A'}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'approved')}>
                          Setujui
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(req.id, 'rejected')}>
                          Tolak
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteRequest(req.id)} className="text-red-600">
                          Hapus Permintaan
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
    </Card>
  )
}

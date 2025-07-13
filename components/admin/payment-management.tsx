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

interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  timestamp: Date
  planId: string
  transactionId?: string
}

export function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [paymentsPerPage] = useState(10)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    const paymentsRef = collection(db, 'payments')
    const q = query(paymentsRef)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPayments: Payment[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as Payment[]
      setPayments(fetchedPayments)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching payments:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Gagal memuat daftar pembayaran.",
        variant: "destructive",
      })
    })

    return () => unsubscribe()
  }, [toast])

  const handleUpdatePaymentStatus = async (paymentId: string, newStatus: 'pending' | 'completed' | 'failed') => {
    try {
      await updateDoc(doc(db, 'payments', paymentId), { status: newStatus })
      toast({
        title: "Sukses",
        description: `Status pembayaran berhasil diubah menjadi ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating payment status:", error)
      toast({
        title: "Error",
        description: "Gagal mengubah status pembayaran.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePayment = async (paymentId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pembayaran ini?")) {
      return
    }
    try {
      await deleteDoc(doc(db, 'payments', paymentId))
      toast({
        title: "Sukses",
        description: "Pembayaran berhasil dihapus.",
      })
    } catch (error) {
      console.error("Error deleting payment:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus pembayaran.",
        variant: "destructive",
      })
    }
  }

  const filteredPayments = payments.filter(payment =>
    payment.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.planId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.transactionId && payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const indexOfLastPayment = currentPage * paymentsPerPage
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment)
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Pembayaran</CardTitle>
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
        <CardTitle>Manajemen Pembayaran</CardTitle>
        <div className="flex justify-end">
          <Input
            placeholder="Cari pembayaran..."
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
              <TableHead>Paket</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>ID Transaksi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Tidak ada pembayaran ditemukan.</TableCell>
              </TableRow>
            ) : (
              currentPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs">{payment.userId}</TableCell>
                  <TableCell>{payment.planId}</TableCell>
                  <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: payment.currency }).format(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      payment.status === 'completed' ? 'default' :
                      payment.status === 'pending' ? 'secondary' :
                      'destructive'
                    }>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(payment.timestamp, 'dd MMM yyyy HH:mm')}</TableCell>
                  <TableCell className="font-mono text-xs">{payment.transactionId || 'N/A'}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(payment.id, 'completed')}>
                          Tandai Selesai
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(payment.id, 'pending')}>
                          Tandai Tertunda
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdatePaymentStatus(payment.id, 'failed')}>
                          Tandai Gagal
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeletePayment(payment.id)} className="text-red-600">
                          Hapus Pembayaran
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

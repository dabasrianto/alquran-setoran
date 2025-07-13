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

interface Subscription {
  id: string
  userId: string
  tier: string
  status: 'active' | 'inactive' | 'pending' | 'cancelled'
  startDate: Date
  endDate: Date
  paymentStatus: 'paid' | 'unpaid' | 'pending'
}

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [subscriptionsPerPage] = useState(10)
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    const subscriptionsRef = collection(db, 'subscriptions')
    const q = query(subscriptionsRef)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSubscriptions: Subscription[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || new Date(),
      })) as Subscription[]
      setSubscriptions(fetchedSubscriptions)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching subscriptions:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Gagal memuat daftar langganan.",
        variant: "destructive",
      })
    })

    return () => unsubscribe()
  }, [toast])

  const handleUpdateSubscriptionStatus = async (subscriptionId: string, newStatus: 'active' | 'inactive' | 'pending' | 'cancelled') => {
    try {
      await updateDoc(doc(db, 'subscriptions', subscriptionId), { status: newStatus })
      toast({
        title: "Sukses",
        description: `Status langganan berhasil diubah menjadi ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating subscription status:", error)
      toast({
        title: "Error",
        description: "Gagal mengubah status langganan.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus langganan ini?")) {
      return
    }
    try {
      await deleteDoc(doc(db, 'subscriptions', subscriptionId))
      toast({
        title: "Sukses",
        description: "Langganan berhasil dihapus.",
      })
    } catch (error) {
      console.error("Error deleting subscription:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus langganan.",
        variant: "destructive",
      })
    }
  }

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.tier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastSubscription = currentPage * subscriptionsPerPage
  const indexOfFirstSubscription = indexOfLastSubscription - subscriptionsPerPage
  const currentSubscriptions = filteredSubscriptions.slice(indexOfFirstSubscription, indexOfLastSubscription)
  const totalPages = Math.ceil(filteredSubscriptions.length / subscriptionsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Langganan</CardTitle>
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
        <CardTitle>Manajemen Langganan</CardTitle>
        <div className="flex justify-end">
          <Input
            placeholder="Cari langganan..."
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
              <TableHead>Status</TableHead>
              <TableHead>Mulai</TableHead>
              <TableHead>Berakhir</TableHead>
              <TableHead>Status Pembayaran</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Tidak ada langganan ditemukan.</TableCell>
              </TableRow>
            ) : (
              currentSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-mono text-xs">{sub.userId}</TableCell>
                  <TableCell>{sub.tier}</TableCell>
                  <TableCell>
                    <Badge variant={
                      sub.status === 'active' ? 'default' :
                      sub.status === 'pending' ? 'secondary' :
                      'destructive'
                    }>
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(sub.startDate, 'dd MMM yyyy')}</TableCell>
                  <TableCell>{format(sub.endDate, 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={sub.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                      {sub.paymentStatus}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleUpdateSubscriptionStatus(sub.id, 'active')}>
                          Aktifkan
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateSubscriptionStatus(sub.id, 'inactive')}>
                          Nonaktifkan
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateSubscriptionStatus(sub.id, 'cancelled')}>
                          Batalkan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteSubscription(sub.id)} className="text-red-600">
                          Hapus Langganan
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

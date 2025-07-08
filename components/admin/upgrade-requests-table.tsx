"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Crown,
  DollarSign
} from "lucide-react"
import type { UpgradeRequest } from "@/lib/types"
import { SUBSCRIPTION_TIERS, formatPrice } from "@/lib/subscription-tiers"
import { generatePaymentUrl } from "@/lib/firebase-premium"

interface UpgradeRequestsTableProps {
  requests: UpgradeRequest[]
  onApprove: (requestId: string, paymentUrl?: string) => Promise<void>
  onReject: (requestId: string, reason: string) => Promise<void>
  onRefresh: () => Promise<void>
}

export default function UpgradeRequestsTable({
  requests,
  onApprove,
  onReject,
  onRefresh,
}: UpgradeRequestsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterTier, setFilterTier] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<UpgradeRequest | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [processing, setProcessing] = useState<string | null>(null)

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    const matchesTier = filterTier === "all" || request.requestedTier === filterTier
    
    return matchesSearch && matchesStatus && matchesTier
  })

  const getStatusBadge = (status: UpgradeRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case "payment_pending":
        return <Badge className="bg-blue-100 text-blue-800"><CreditCard className="h-3 w-3 mr-1" />Payment Pending</Badge>
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800"><Crown className="h-3 w-3 mr-1" />Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: UpgradeRequest["paymentStatus"]) => {
    switch (status) {
      case "none":
        return <span className="text-gray-400">-</span>
      case "pending":
        return <Badge variant="outline" className="text-orange-600">Pending</Badge>
      case "processing":
        return <Badge variant="outline" className="text-blue-600">Processing</Badge>
      case "completed":
        return <Badge variant="outline" className="text-green-600">Completed</Badge>
      case "failed":
        return <Badge variant="outline" className="text-red-600">Failed</Badge>
      case "refunded":
        return <Badge variant="outline" className="text-purple-600">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTierBadge = (tier: string) => {
    const tierInfo = SUBSCRIPTION_TIERS[tier]
    if (!tierInfo) return <Badge variant="outline">{tier}</Badge>
    
    return (
      <Badge className={
        tier === "institution" ? "bg-amber-100 text-amber-800" :
        tier === "pro" ? "bg-purple-100 text-purple-800" :
        tier === "premium" ? "bg-blue-100 text-blue-800" :
        "bg-gray-100 text-gray-800"
      }>
        {tierInfo.name}
      </Badge>
    )
  }

  const handleApprove = async (request: UpgradeRequest) => {
    try {
      setProcessing(request.id)
      
      let paymentUrl: string | undefined
      
      if (paymentMethod && request.amount > 0) {
        // Generate payment URL
        paymentUrl = await generatePaymentUrl(request, paymentMethod as any)
      }
      
      await onApprove(request.id, paymentUrl)
      setSelectedRequest(null)
      setPaymentMethod("")
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (request: UpgradeRequest) => {
    if (!rejectReason.trim()) {
      alert("Alasan penolakan harus diisi")
      return
    }
    
    try {
      setProcessing(request.id)
      await onReject(request.id, rejectReason)
      setSelectedRequest(null)
      setRejectReason("")
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setProcessing(null)
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upgrade Requests ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari email atau nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="payment_pending">Payment Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tier</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="institution">Institution</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={onRefresh} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== "all" || filterTier !== "all" 
                  ? "Tidak ada request yang sesuai filter" 
                  : "Belum ada upgrade request"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all" || filterTier !== "all"
                  ? "Coba ubah filter pencarian"
                  : "Request upgrade akan muncul di sini"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Current → Requested</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.userName}</div>
                          <div className="text-sm text-muted-foreground">{request.userEmail}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTierBadge(request.currentTier)}
                          <span>→</span>
                          {getTierBadge(request.requestedTier)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">
                            {formatPrice(request.amount, request.currency)}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      
                      <TableCell>
                        {getPaymentStatusBadge(request.paymentStatus)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDateTime(request.requestDate)}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Request Details</DialogTitle>
                                <DialogDescription>
                                  Detail upgrade request dari {request.userName}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">User</label>
                                      <div className="flex items-center gap-2 mt-1">
                                        <User className="h-4 w-4" />
                                        <div>
                                          <div className="font-medium">{selectedRequest.userName}</div>
                                          <div className="text-sm text-muted-foreground">{selectedRequest.userEmail}</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Tier Upgrade</label>
                                      <div className="flex items-center gap-2 mt-1">
                                        {getTierBadge(selectedRequest.currentTier)}
                                        <span>→</span>
                                        {getTierBadge(selectedRequest.requestedTier)}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Amount</label>
                                      <div className="font-medium mt-1">
                                        {formatPrice(selectedRequest.amount, selectedRequest.currency)}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                                      <div className="mt-1">
                                        {getStatusBadge(selectedRequest.status)}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Request Date</label>
                                      <div className="text-sm mt-1">
                                        {formatDateTime(selectedRequest.requestDate)}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                                      <div className="mt-1">
                                        {getPaymentStatusBadge(selectedRequest.paymentStatus)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {selectedRequest.notes && (
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Notes</label>
                                      <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                                        {selectedRequest.notes}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {selectedRequest.paymentUrl && (
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Payment URL</label>
                                      <div className="mt-1">
                                        <a 
                                          href={selectedRequest.paymentUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline text-sm"
                                        >
                                          {selectedRequest.paymentUrl}
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {selectedRequest.status === "pending" && (
                                    <div className="space-y-4 border-t pt-4">
                                      <h4 className="font-medium">Admin Actions</h4>
                                      
                                      {selectedRequest.amount > 0 && (
                                        <div>
                                          <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <SelectTrigger className="mt-1">
                                              <SelectValue placeholder="Pilih metode pembayaran" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                              <SelectItem value="ewallet">E-Wallet</SelectItem>
                                              <SelectItem value="qris">QRIS</SelectItem>
                                              <SelectItem value="credit_card">Credit Card</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      )}
                                      
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Reject Reason</label>
                                        <Textarea
                                          placeholder="Alasan penolakan (jika reject)"
                                          value={rejectReason}
                                          onChange={(e) => setRejectReason(e.target.value)}
                                          className="mt-1"
                                          rows={3}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <DialogFooter>
                                {selectedRequest?.status === "pending" && (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="destructive"
                                      onClick={() => selectedRequest && handleReject(selectedRequest)}
                                      disabled={processing === selectedRequest?.id}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => selectedRequest && handleApprove(selectedRequest)}
                                      disabled={processing === selectedRequest?.id || (selectedRequest.amount > 0 && !paymentMethod)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      {processing === selectedRequest?.id ? "Processing..." : "Approve"}
                                    </Button>
                                  </div>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

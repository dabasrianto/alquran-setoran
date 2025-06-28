"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/dialog"
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  DollarSign,
  Calendar,
  ExternalLink,
  AlertTriangle
} from "lucide-react"
import type { UpgradeRequest, PaymentInfo } from "@/lib/types"
import { formatPrice } from "@/lib/subscription-tiers"
import { getPaymentsByUpgradeRequest } from "@/lib/firebase-premium"

interface PaymentManagementProps {
  requests: UpgradeRequest[]
  onProcessPayment: (paymentId: string, upgradeRequestId: string) => Promise<void>
  onRefresh: () => Promise<void>
}

export default function PaymentManagement({
  requests,
  onProcessPayment,
  onRefresh,
}: PaymentManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterMethod, setFilterMethod] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<UpgradeRequest | null>(null)
  const [payments, setPayments] = useState<PaymentInfo[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)

  // Filter requests that have payments
  const paymentRequests = requests.filter(r => 
    r.paymentStatus !== "none" && 
    (r.status === "approved" || r.status === "payment_pending" || r.status === "completed")
  )

  const filteredRequests = paymentRequests.filter((request) => {
    const matchesSearch = 
      request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || request.paymentStatus === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getPaymentStatusBadge = (status: UpgradeRequest["paymentStatus"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800"><CreditCard className="h-3 w-3 mr-1" />Processing</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
      case "refunded":
        return <Badge className="bg-purple-100 text-purple-800">Refunded</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return <Badge variant="outline">Bank Transfer</Badge>
      case "ewallet":
        return <Badge variant="outline">E-Wallet</Badge>
      case "credit_card":
        return <Badge variant="outline">Credit Card</Badge>
      case "qris":
        return <Badge variant="outline">QRIS</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  const loadPayments = async (upgradeRequestId: string) => {
    try {
      setLoadingPayments(true)
      const paymentsData = await getPaymentsByUpgradeRequest(upgradeRequestId)
      setPayments(paymentsData)
    } catch (error: any) {
      console.error("Error loading payments:", error)
      alert(`Error loading payments: ${error.message}`)
    } finally {
      setLoadingPayments(false)
    }
  }

  const handleViewPayments = async (request: UpgradeRequest) => {
    setSelectedRequest(request)
    await loadPayments(request.id)
  }

  const handleProcessPayment = async (payment: PaymentInfo) => {
    if (window.confirm("Konfirmasi pembayaran ini sebagai berhasil?")) {
      try {
        await onProcessPayment(payment.id, payment.upgradeRequestId)
        await loadPayments(payment.upgradeRequestId) // Refresh payments
        await onRefresh() // Refresh main data
      } catch (error: any) {
        alert(`Error: ${error.message}`)
      }
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

  // Calculate payment statistics
  const stats = {
    totalPayments: paymentRequests.length,
    pendingPayments: paymentRequests.filter(r => r.paymentStatus === "pending").length,
    completedPayments: paymentRequests.filter(r => r.paymentStatus === "completed").length,
    failedPayments: paymentRequests.filter(r => r.paymentStatus === "failed").length,
    totalAmount: paymentRequests
      .filter(r => r.paymentStatus === "completed")
      .reduce((sum, r) => sum + r.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold">{stats.totalPayments}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingPayments}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedPayments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failedPayments}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {stats.totalAmount.toLocaleString("id-ID")}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Management ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={onRefresh} variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== "all" 
                  ? "Tidak ada payment yang sesuai filter" 
                  : "Belum ada payment"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Coba ubah filter pencarian"
                  : "Payment akan muncul di sini setelah ada upgrade request yang diapprove"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Payment URL</TableHead>
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
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">
                            {formatPrice(request.amount, request.currency)}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getPaymentStatusBadge(request.paymentStatus)}
                      </TableCell>
                      
                      <TableCell>
                        {request.paymentUrl ? (
                          <a 
                            href={request.paymentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Payment
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDateTime(request.requestDate)}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPayments(request)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Detail pembayaran untuk {selectedRequest?.userName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              {/* Request Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User</label>
                      <div className="font-medium">{selectedRequest.userName}</div>
                      <div className="text-sm text-muted-foreground">{selectedRequest.userEmail}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Amount</label>
                      <div className="font-medium text-lg">
                        {formatPrice(selectedRequest.amount, selectedRequest.currency)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Payment Status</label>
                      <div className="mt-1">
                        {getPaymentStatusBadge(selectedRequest.paymentStatus)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Request Date</label>
                      <div className="text-sm">{formatDateTime(selectedRequest.requestDate)}</div>
                    </div>
                  </div>
                  
                  {selectedRequest.paymentUrl && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-muted-foreground">Payment URL</label>
                      <div className="mt-1">
                        <a 
                          href={selectedRequest.paymentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {selectedRequest.paymentUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingPayments ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : payments.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No payment records found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              <span className="font-medium">Payment #{payment.id.slice(-8)}</span>
                              {getMethodBadge(payment.method)}
                            </div>
                            <div className="flex items-center gap-2">
                              {getPaymentStatusBadge(payment.status as any)}
                              {payment.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleProcessPayment(payment)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirm Payment
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Amount:</span>
                              <span className="ml-2 font-medium">
                                {formatPrice(payment.amount, payment.currency)}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Created:</span>
                              <span className="ml-2">{formatDateTime(payment.createdAt)}</span>
                            </div>
                            {payment.completedAt && (
                              <div>
                                <span className="text-muted-foreground">Completed:</span>
                                <span className="ml-2">{formatDateTime(payment.completedAt)}</span>
                              </div>
                            )}
                            {payment.gatewayTransactionId && (
                              <div>
                                <span className="text-muted-foreground">Gateway ID:</span>
                                <span className="ml-2 font-mono text-xs">{payment.gatewayTransactionId}</span>
                              </div>
                            )}
                          </div>
                          
                          {payment.failureReason && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                              <div className="flex items-center gap-1 text-red-600">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-medium">Failure Reason:</span>
                              </div>
                              <div className="text-red-700 mt-1">{payment.failureReason}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
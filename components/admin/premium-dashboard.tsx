"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminDashboardStats } from "@/components/admin/admin-dashboard-stats"
import { Alert, AlertDescription } from "@/components/ui/alert"
import dynamic from "next/dynamic"
import {
  Crown,
  TrendingUp,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import TierManagement from "./tier-management"
import UpgradeRequestsTable from "./upgrade-requests-table"
import PaymentManagement from "./payment-management"
import AdminActionLogs from "./admin-action-logs"
import { useAuth } from "@/contexts/auth-context"
import {
  getAllUpgradeRequests,
  getAdminLogs,
  approveUpgradeRequest,
  rejectUpgradeRequest,
  processSuccessfulPayment,
} from "@/lib/firebase-premium"
import type { UpgradeRequest, AdminActionLog } from "@/lib/types"

// Dynamically import Recharts components with SSR disabled
const DynamicAdminDashboardStats = dynamic(
  () => import("@/components/admin/admin-dashboard-stats").then(mod => mod.AdminDashboardStats),
  { ssr: false }
)

export default function PremiumDashboard() {
  const { user } = useAuth()
  const [upgradeRequests, setUpgradeRequests] = useState<UpgradeRequest[]>([])
  const [adminLogs, setAdminLogs] = useState<AdminActionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [requestsData, logsData] = await Promise.all([
        getAllUpgradeRequests(),
        getAdminLogs(50),
      ])

      setUpgradeRequests(requestsData)
      setAdminLogs(logsData)
    } catch (err: any) {
      console.error("Error loading premium dashboard data:", err)
      setError(err.message || "Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleApproveRequest = async (requestId: string, paymentUrl?: string) => {
    try {
      if (!user?.uid) throw new Error("Admin not authenticated")
      
      await approveUpgradeRequest(requestId, user.uid, paymentUrl)
      await loadData() // Refresh data
    } catch (error: any) {
      alert(`Error approving request: ${error.message}`)
    }
  }

  const handleRejectRequest = async (requestId: string, reason: string) => {
    try {
      if (!user?.uid) throw new Error("Admin not authenticated")
      
      await rejectUpgradeRequest(requestId, user.uid, reason)
      await loadData() // Refresh data
    } catch (error: any) {
      alert(`Error rejecting request: ${error.message}`)
    }
  }

  const handleProcessPayment = async (paymentId: string, upgradeRequestId: string) => {
    try {
      if (!user?.uid) throw new Error("Admin not authenticated")
      
      await processSuccessfulPayment(paymentId, upgradeRequestId, user.uid)
      await loadData() // Refresh data
    } catch (error: any) {
      alert(`Error processing payment: ${error.message}`)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate dashboard statistics
  const stats = {
    totalRequests: upgradeRequests.length,
    pendingRequests: upgradeRequests.filter(r => r.status === "pending").length,
    approvedRequests: upgradeRequests.filter(r => r.status === "approved").length,
    completedRequests: upgradeRequests.filter(r => r.status === "completed").length,
    totalRevenue: upgradeRequests
      .filter(r => r.status === "completed")
      .reduce((sum, r) => sum + r.amount, 0),
    pendingPayments: upgradeRequests.filter(r => r.paymentStatus === "pending").length,
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-600" />
            Premium Management Dashboard
          </h2>
          <p className="text-muted-foreground">Kelola tier langganan, upgrade requests, dan pembayaran</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <DynamicAdminDashboardStats />
      </div>

      {/* Legacy Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 hidden">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{stats.totalRequests}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approvedRequests}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completedRequests}</p>
              </div>
              <Crown className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {stats.totalRevenue.toLocaleString("id-ID")}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
                <p className="text-2xl font-bold text-red-600">{stats.pendingPayments}</p>
              </div>
              <CreditCard className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Upgrade Requests
            {stats.pendingRequests > 0 && (
              <Badge variant="destructive" className="ml-1">
                {stats.pendingRequests}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tiers" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Tier Management
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Management
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Admin Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <UpgradeRequestsTable
            requests={upgradeRequests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="tiers">
          <TierManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagement
            requests={upgradeRequests}
            onProcessPayment={handleProcessPayment}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="logs">
          <AdminActionLogs logs={adminLogs} onRefresh={handleRefresh} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
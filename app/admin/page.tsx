"use client"

import { useAuth } from "@/contexts/auth-context"
import { useAdmin } from "@/hooks/use-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, RefreshCw, Crown } from "lucide-react"
import Link from "next/link"
import AdminUsersList from "@/components/admin/admin-users-list"
import AdminStats from "@/components/admin/admin-stats"
import AdminDebug from "@/components/admin/admin-debug"
import SubscriptionManager from "@/components/admin/subscription-manager"
import UserManagement from "@/components/admin/user-management"
import PremiumDashboard from "@/components/admin/premium-dashboard"
import LoginPage from "@/components/auth/login-page"
import FirebaseRulesSetup from "@/components/admin/firebase-rules-setup"

export default function AdminPage() {
  const { user, loading: authLoading, isAdmin: userIsAdmin } = useAuth()
  const { users, analytics, loading, error, isAdmin, refreshData } = useAdmin()

  // Only log when there's meaningful state change
  if (process.env.NODE_ENV === 'development') {
    console.log("AdminPage render:", {
      user: user?.email || 'undefined',
      userIsAdmin,
      hookIsAdmin: isAdmin,
      usersCount: users?.length || 0,
      authLoading,
      dataLoading: loading,
      error,
      analytics: analytics ? 'loaded' : 'null',
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  if (!userIsAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-red-600">Akses Ditolak</CardTitle>
            <CardDescription>Anda tidak memiliki akses ke halaman admin</CardDescription>
            <p className="text-sm text-muted-foreground mt-2">Email Anda: {user.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Admin email yang diizinkan: dabasrianto@gmail.com
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Kelola pengguna, langganan, dan premium upgrades</p>
            <p className="text-sm text-green-600 mt-1">✅ Logged in as admin: {user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Kembali ke App</Link>
            </Button>
          </div>
        </div>

        {/* Debug Component */}
        <AdminDebug />

        {/* Firebase Rules Setup - Show if there's permission error */}
        {error && error.includes("permissions") && <FirebaseRulesSetup />}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Error:</strong> {error}
              <br />
              <Button variant="outline" size="sm" onClick={refreshData} className="mt-2">
                Coba Lagi
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="premium" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="premium" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Premium Management
            </TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Kelola User</TabsTrigger>
            <TabsTrigger value="subscriptions">Kelola Langganan</TabsTrigger>
            <TabsTrigger value="data">Data Pengguna</TabsTrigger>
          </TabsList>

          <TabsContent value="premium">
            <PremiumDashboard />
          </TabsContent>

          <TabsContent value="overview">
            <AdminStats users={users} loading={loading} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement users={users} loading={loading} onRefresh={refreshData} />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionManager users={users} analytics={analytics} loading={loading} onRefresh={refreshData} />
          </TabsContent>

          <TabsContent value="data">
            <AdminUsersList users={users} loading={loading} onRefresh={refreshData} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

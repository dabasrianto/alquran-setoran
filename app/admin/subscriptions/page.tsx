"use client"

import { useAuth } from "@/contexts/auth-context"
import { useAdmin } from "@/hooks/use-admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import AdminUsersList from "@/components/admin/admin-users-list"
import LoginPage from "@/components/auth/login-page"

export default function AdminSubscriptionsPage() {
  const { user, loading: authLoading } = useAuth()
  const { users, loading, error, isAdmin, refreshUsers } = useAdmin()

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-red-600">Akses Ditolak</CardTitle>
            <CardDescription>Anda tidak memiliki akses ke halaman admin</CardDescription>
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
              Kelola Langganan
            </h1>
            <p className="text-muted-foreground mt-1">Upgrade/downgrade paket langganan pengguna</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Admin
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Subscription Management */}
        <AdminUsersList users={users} loading={loading} onRefresh={refreshUsers} showSubscriptionActions={true} />
      </div>
    </main>
  )
}

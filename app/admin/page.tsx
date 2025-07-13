'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminDashboardStats } from '@/components/admin/admin-dashboard-stats'
import { UserManagement } from '@/components/admin/user-management'
import { SubscriptionManager } from '@/components/admin/subscription-manager'
import { AdminActionLogs } from '@/components/admin/admin-action-logs'
import { AdminDebug } from '@/components/admin/admin-debug'
import { FirebaseRulesSetup } from '@/components/admin/firebase-rules-setup'
import { PricingManagement } from '@/components/admin/pricing-management'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  const { currentUser, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push('/login')
      } else if (!isAdmin) {
        router.push('/dashboard') // Redirect non-admins
      }
    }
  }, [currentUser, loading, isAdmin, router])

  if (loading || !currentUser || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="users">Pengguna</TabsTrigger>
                  <TabsTrigger value="subscriptions">Langganan</TabsTrigger>
                  <TabsTrigger value="pricing">Kelola Harga</TabsTrigger>
                  <TabsTrigger value="logs">Log Aktivitas</TabsTrigger>
                  <TabsTrigger value="debug">Debug & Info</TabsTrigger>
                  <TabsTrigger value="rules">Aturan Keamanan</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="dashboard">
                <AdminDashboardStats />
              </TabsContent>
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
              <TabsContent value="subscriptions">
                <SubscriptionManager />
              </TabsContent>
              <TabsContent value="pricing">
                <PricingManagement />
              </TabsContent>
              <TabsContent value="logs">
                <AdminActionLogs />
              </TabsContent>
              <TabsContent value="debug">
                <AdminDebug />
              </TabsContent>
              <TabsContent value="rules">
                <FirebaseRulesSetup />
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Admin Panel
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Selamat datang di Panel Admin!</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Gunakan tab di atas untuk mengelola berbagai aspek aplikasi.
                      </span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Ringkasan Cepat</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Pengguna Terdaftar</span>
                      <span>{/* Dynamic data from stats component */}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Langganan Aktif</span>
                      <span>{/* Dynamic data from stats component */}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Permintaan Upgrade</span>
                      <span>{/* Dynamic data from stats component */}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SubscriptionManager } from '@/components/admin/subscription-manager'
import { UpgradeRequestsTable } from '@/components/admin/upgrade-requests-table'
import { PaymentManagement } from '@/components/admin/payment-management'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminSubscriptionsPage() {
  const { currentUser, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('subscriptions')

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
                  <TabsTrigger value="subscriptions">Kelola Langganan</TabsTrigger>
                  <TabsTrigger value="requests">Permintaan Upgrade</TabsTrigger>
                  <TabsTrigger value="payments">Manajemen Pembayaran</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="subscriptions">
                <SubscriptionManager />
              </TabsContent>
              <TabsContent value="requests">
                <UpgradeRequestsTable />
              </TabsContent>
              <TabsContent value="payments">
                <PaymentManagement />
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Manajemen Langganan
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Ringkasan</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Langganan Aktif</span>
                      <span>{/* Dynamic data from stats component */}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Permintaan Upgrade</span>
                      <span>{/* Dynamic data from stats component */}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Pembayaran</span>
                      <span>{/* Dynamic data from stats component */}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Panduan</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Gunakan tab "Kelola Langganan" untuk melihat dan mengubah status langganan pengguna.
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Tab "Permintaan Upgrade" menampilkan permintaan upgrade yang perlu ditinjau.
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        "Manajemen Pembayaran" untuk melacak semua transaksi.
                      </span>
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

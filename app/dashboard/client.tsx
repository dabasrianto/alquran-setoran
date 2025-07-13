'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OverallStats } from '@/components/overall-stats'
import { StudentList } from '@/components/student-list'
import { PengujiList } from '@/components/penguji-list'
import { SetoranHistory } from '@/components/setoran-history'
import { StudentProgress } from '@/components/student-progress'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { UserStats } from '@/components/dashboard/user-stats'
import { PricingDisplay } from '@/components/dashboard/pricing-display'

export default function DashboardClient() {
  const { currentUser, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login')
    }
  }, [currentUser, loading, router])

  if (loading || !currentUser) {
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
                  <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                  <TabsTrigger value="students">Santri</TabsTrigger>
                  <TabsTrigger value="penguji">Penguji</TabsTrigger>
                  <TabsTrigger value="setoran">Setoran</TabsTrigger>
                  <TabsTrigger value="progress">Progres Santri</TabsTrigger>
                  <TabsTrigger value="pricing">Paket & Harga</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="overview">
                <OverallStats />
              </TabsContent>
              <TabsContent value="students">
                <StudentList />
              </TabsContent>
              <TabsContent value="penguji">
                <PengujiList />
              </TabsContent>
              <TabsContent value="setoran">
                <SetoranHistory />
              </TabsContent>
              <TabsContent value="progress">
                <StudentProgress />
              </TabsContent>
              <TabsContent value="pricing">
                <PricingDisplay />
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Dashboard Pengguna
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Selamat datang, {currentUser.email}!</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Gunakan tab di atas untuk mengelola data Anda.
                      </span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <UserStats />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

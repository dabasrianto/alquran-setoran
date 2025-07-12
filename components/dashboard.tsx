"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, TrendingUp, Calendar, Plus, BarChart3, Settings, Crown } from "lucide-react"

// Import components
import StudentList from "@/components/student-list"
import PengujiList from "@/components/penguji-list"
import StudentProgress from "@/components/student-progress"
import OverallStats from "@/components/overall-stats"
import DataManagement from "@/components/data-management"
import PricingDisplay from "@/components/dashboard/pricing-display"
import { useAuth } from "@/contexts/auth-context"

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [currentPlan, setCurrentPlan] = useState("free") // This would come from user subscription data

  const handleUpgrade = (planId: string) => {
    console.log("Upgrading to plan:", planId)
    // Here you would implement the upgrade logic
    // For now, just show an alert
    alert(`Upgrade ke paket ${planId} akan segera tersedia!`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Selamat datang kembali, {user?.displayName || user?.email}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Crown className="h-3 w-3" />
              <span>Paket {currentPlan === "free" ? "Gratis" : currentPlan}</span>
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Murid</span>
          </TabsTrigger>
          <TabsTrigger value="pengujis" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Penguji</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center space-x-2">
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">Langganan</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Pengaturan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverallStats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Aktivitas Terbaru</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Setoran baru dari Ahmad</p>
                      <p className="text-sm text-muted-foreground">Al-Baqarah ayat 1-10</p>
                    </div>
                    <Badge variant="outline">2 jam lalu</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Murid baru ditambahkan</p>
                      <p className="text-sm text-muted-foreground">Fatimah Az-Zahra</p>
                    </div>
                    <Badge variant="outline">1 hari lalu</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Laporan bulanan siap</p>
                      <p className="text-sm text-muted-foreground">Progress bulan ini</p>
                    </div>
                    <Badge variant="outline">2 hari lalu</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <Plus className="h-6 w-6 mb-2" />
                    <span className="text-sm">Tambah Murid</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <BookOpen className="h-6 w-6 mb-2" />
                    <span className="text-sm">Input Setoran</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span className="text-sm">Lihat Laporan</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">Kelola Penguji</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <StudentList />
        </TabsContent>

        <TabsContent value="pengujis">
          <PengujiList />
        </TabsContent>

        <TabsContent value="progress">
          <StudentProgress />
        </TabsContent>

        <TabsContent value="subscription">
          <PricingDisplay currentPlan={currentPlan} onUpgrade={handleUpgrade} />
        </TabsContent>

        <TabsContent value="settings">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { Separator } from "@/components/ui/separator"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentList } from "@/components/student-list"
import { PengujiList } from "@/components/penguji-list"
import { SetoranHistory } from "@/components/setoran-history"
import { StudentProgress } from "@/components/student-progress"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function DataManagement() {
  const { currentUser, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("students")

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login")
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
                  <TabsTrigger value="students">Santri</TabsTrigger>
                  <TabsTrigger value="penguji">Penguji</TabsTrigger>
                  <TabsTrigger value="setoran">Setoran</TabsTrigger>
                  <TabsTrigger value="progress">Progres Santri</TabsTrigger>
                </TabsList>
              </div>
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
            </Tabs>
          </div>
          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">Manajemen Data</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Ringkasan</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Santri</span>
                      <span>{/* Dynamic data from list component */}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Penguji</span>
                      <span>{/* Dynamic data from list component */}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Setoran</span>
                      <span>{/* Dynamic data from list component */}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Panduan</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Gunakan tab "Santri" untuk mengelola daftar santri Anda.
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tab "Penguji" untuk mengelola daftar penguji.</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        "Setoran" untuk mencatat dan melihat riwayat setoran tasmi.
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">"Progres Santri" untuk memantau capaian hafalan.</span>
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

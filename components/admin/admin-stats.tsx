"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Crown, UserCheck, BarChart } from "lucide-react"

interface AdminStatsProps {
  users: any[]
  loading: boolean
}

export default function AdminStats({ users, loading }: AdminStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalUsers = users.length
  const premiumUsers = users.filter((user) => user.subscriptionType === "premium").length
  const freeUsers = users.filter((user) => user.subscriptionType === "free").length
  const totalStudents = users.reduce((sum, user) => sum + (user.stats?.studentsCount || 0), 0)
  const totalUstadz = users.reduce((sum, user) => sum + (user.stats?.ustadzCount || 0), 0)
  const totalUstadzah = users.reduce((sum, user) => sum + (user.stats?.ustadzahCount || 0), 0)

  const stats = [
    {
      title: "Total Pengguna",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pengguna Premium",
      value: premiumUsers,
      icon: Crown,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Pengguna Gratis",
      value: freeUsers,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Murid",
      value: totalStudents,
      icon: BarChart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistik Penguji</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Ustadz:</span>
              <span className="font-semibold">{totalUstadz}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Ustadzah:</span>
              <span className="font-semibold">{totalUstadzah}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Total Penguji:</span>
              <span className="font-bold">{totalUstadz + totalUstadzah}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Konversi Premium</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Rate Konversi:</span>
              <span className="font-semibold">
                {totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-600 h-2 rounded-full"
                style={{ width: `${totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rata-rata per User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Murid per User:</span>
              <span className="font-semibold">{totalUsers > 0 ? (totalStudents / totalUsers).toFixed(1) : 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Penguji per User:</span>
              <span className="font-semibold">
                {totalUsers > 0 ? ((totalUstadz + totalUstadzah) / totalUsers).toFixed(1) : 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

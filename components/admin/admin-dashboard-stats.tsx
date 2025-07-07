"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts"

// Generate sample data for the charts
const generateChartData = (points: number, trend: "up" | "down" | "volatile") => {
  const data = []
  let value = trend === "up" ? 10 : 100
  
  for (let i = 0; i < points; i++) {
    if (trend === "up") {
      value += Math.random() * 10
    } else if (trend === "down") {
      value -= Math.random() * 5
      value = Math.max(value, 5) // Ensure we don't go below 5
    } else {
      // Volatile - random ups and downs
      value += (Math.random() - 0.5) * 20
      value = Math.max(value, 5) // Ensure we don't go below 5
    }
    
    data.push({
      name: `Day ${i + 1}`,
      value: Math.round(value)
    })
  }
  
  return data
}

// Sample data for the charts
const usersData = generateChartData(30, "up")
const premiumUsersData = generateChartData(30, "up")
const freeUsersData = generateChartData(30, "volatile")
const studentsData = generateChartData(30, "up")
const pengujisData = generateChartData(30, "up")
const revenueData = generateChartData(30, "up")

export function AdminDashboardStats() {
  return (
    <>
      <Card>
        <CardHeader className="pb-1 pt-3 px-3 md:pb-2 md:pt-4 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Total Pengguna</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-4">
          <div className="text-xl md:text-2xl font-bold">22</div>
          <div className="h-[50px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usersData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 pt-3 px-3 md:pb-2 md:pt-4 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Pengguna Premium</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-4">
          <div className="text-xl md:text-2xl font-bold">8</div>
          <div className="h-[50px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={premiumUsersData}>
                <defs>
                  <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#d97706" 
                  fillOpacity={1} 
                  fill="url(#colorPremium)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 pt-3 px-3 md:pb-2 md:pt-4 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Pengguna Gratis</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-4">
          <div className="text-xl md:text-2xl font-bold">14</div>
          <div className="h-[50px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={freeUsersData}>
                <defs>
                  <linearGradient id="colorFree" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorFree)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 pt-3 px-3 md:pb-2 md:pt-4 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Total Murid</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-4">
          <div className="text-xl md:text-2xl font-bold">320</div>
          <div className="h-[50px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentsData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorStudents)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 pt-3 px-3 md:pb-2 md:pt-4 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Total Penguji</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-4">
          <div className="text-xl md:text-2xl font-bold">45</div>
          <div className="h-[50px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pengujisData}>
                <defs>
                  <linearGradient id="colorPengujis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f97316" 
                  fillOpacity={1} 
                  fill="url(#colorPengujis)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 pt-3 px-3 md:pb-2 md:pt-4 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Pendapatan</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-4">
          <div className="text-xl md:text-2xl font-bold">Rp 6.000.000</div>
          <div className="h-[50px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
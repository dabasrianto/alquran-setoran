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
const studentsData = generateChartData(30, "up")
const setoranData = generateChartData(30, "volatile")
const completedSurahData = generateChartData(30, "up")
const completedJuzData = generateChartData(30, "up")

export function UserDashboardStats() {
  return (
    <>
      <Card>
        <CardHeader className="pb-1 pt-3 px-3 md:pb-2 md:pt-4 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Total Murid</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-4">
          <div className="text-xl md:text-2xl font-bold">18</div>
          <div className="h-[50px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentsData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
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
          <CardTitle className="text-xs md:text-sm font-medium">Total Ayat Dihafal</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-4">
          <div className="text-xl md:text-2xl font-bold">1,240</div>
          <div className="h-[50px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={setoranData}>
                <defs>
                  <linearGradient id="colorSetoran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorSetoran)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 pt-3 px-3 md:pb-2 md:pt-4 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Surat Selesai</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-4">
          <div className="text-xl md:text-2xl font-bold">7</div>
          <div className="h-[50px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completedSurahData}>
                <defs>
                  <linearGradient id="colorSurah" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4ade80" 
                  fillOpacity={1} 
                  fill="url(#colorSurah)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1 pt-3 px-3 md:pb-2 md:pt-4 md:px-6">
          <CardTitle className="text-xs md:text-sm font-medium">Juz Selesai</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-4">
          <div className="text-xl md:text-2xl font-bold">2</div>
          <div className="h-[50px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={completedJuzData}>
                <defs>
                  <linearGradient id="colorJuz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#facc15" 
                  fillOpacity={1} 
                  fill="url(#colorJuz)" 
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
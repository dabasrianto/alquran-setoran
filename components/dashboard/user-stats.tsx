"use client"

import { GradientStatCard } from "@/components/ui/gradient-stat-card"

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
      <GradientStatCard
        title="Total Murid"
        value="18"
        change={12}
        data={studentsData}
        color="purple"
      />
      <GradientStatCard
        title="Total Ayat Dihafal"
        value="1,240"
        change={8}
        data={setoranData}
        color="blue"
      />
      <GradientStatCard
        title="Surat Selesai"
        value="7"
        change={5}
        data={completedSurahData}
        color="green"
      />
      <GradientStatCard
        title="Juz Selesai"
        value="2"
        change={0}
        data={completedJuzData}
        color="amber"
      />
    </>
  )
}
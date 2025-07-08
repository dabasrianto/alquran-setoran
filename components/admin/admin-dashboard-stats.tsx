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
const usersData = generateChartData(30, "up")
const premiumUsersData = generateChartData(30, "up")
const freeUsersData = generateChartData(30, "volatile")
const studentsData = generateChartData(30, "up")
const pengujisData = generateChartData(30, "up")
const revenueData = generateChartData(30, "up")

export function AdminDashboardStats() {
  return (
    <>
      <GradientStatCard
        title="Total Pengguna"
        value="22"
        change={15}
        data={usersData}
        color="blue"
      />
      <GradientStatCard
        title="Pengguna Premium"
        value="8"
        change={25}
        data={premiumUsersData}
        color="amber"
      />
      <GradientStatCard
        title="Pengguna Gratis"
        value="14"
        change={10}
        data={freeUsersData}
        color="purple"
      />
      <GradientStatCard
        title="Total Murid"
        value="320"
        change={18}
        data={studentsData}
        color="green"
      />
      <GradientStatCard
        title="Total Penguji"
        value="45"
        change={5}
        data={pengujisData}
        color="orange"
      />
      <GradientStatCard
        title="Pendapatan"
        value="Rp 6.000.000"
        change={12}
        data={revenueData}
        color="green"
      />
    </>
  )
}

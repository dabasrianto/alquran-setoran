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
const subscriptionsData = generateChartData(30, "up")
const ordersData = generateChartData(30, "volatile")
const revenueData = generateChartData(30, "up")

export function AdminDashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <GradientStatCard
        title="New subscriptions"
        value="22"
        change={15}
        data={subscriptionsData}
        color="purple"
      />
      <GradientStatCard
        title="New orders"
        value="320"
        change={-4}
        data={ordersData}
        color="orange"
      />
      <GradientStatCard
        title="Avg. order revenue"
        value="$1,080"
        change={8}
        data={revenueData}
        color="green"
      />
    </div>
  )
}
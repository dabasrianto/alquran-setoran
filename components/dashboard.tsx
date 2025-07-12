import type React from "react"
import { PricingDisplay } from "./dashboard/pricing-display"

interface DashboardProps {
  user?: {
    subscriptionType?: "basic" | "premium" | "enterprise"
  }
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard!</p>

      {/* Add this as a new section in the dashboard */}
      <div className="mt-8">
        <PricingDisplay
          currentTier={user?.subscriptionType || "basic"}
          onUpgrade={(tierId) => {
            // Handle upgrade logic here
            console.log("Upgrade to:", tierId)
          }}
        />
      </div>
    </div>
  )
}

export default Dashboard

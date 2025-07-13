import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { Search } from "@/components/dashboard/search"
import { PricingDisplay } from "@/components/dashboard/pricing-display"
import DashboardClient from './client'

export default function DashboardPage() {
  return <DashboardClient />
}

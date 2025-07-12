import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { Search } from "@/components/dashboard/search"
import { PricingDisplay } from "@/components/dashboard/pricing-display"

export default function DashboardPage() {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Search />
      </div>
      <Tabs defaultValue="overview" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="recent-sales">Penjualan Terakhir</TabsTrigger>
          <TabsTrigger value="pricing">Paket & Harga</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        <TabsContent value="recent-sales" className="space-y-4">
          <RecentSales />
        </TabsContent>
        <TabsContent value="pricing">
          <PricingDisplay />
        </TabsContent>
      </Tabs>
    </div>
  )
}

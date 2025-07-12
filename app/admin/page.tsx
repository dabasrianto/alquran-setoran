"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PricingManagement from "@/components/admin/pricing-management"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>

      <Tabs defaultValue="users" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
          <TabsTrigger value="pricing">Harga Langganan</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <p>Manage users here.</p>
        </TabsContent>
        <TabsContent value="pricing">
          <PricingManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

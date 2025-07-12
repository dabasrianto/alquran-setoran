"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "@/components/admin/user-management"
import { PricingManagement } from "@/components/admin/pricing-management"

export default function AdminPage() {
  return (
    <div className="container py-10">
      <Tabs defaultValue="users" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="users">Kelola Pengguna</TabsTrigger>
          <TabsTrigger value="pricing">Kelola Harga</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        <TabsContent value="pricing">
          <PricingManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

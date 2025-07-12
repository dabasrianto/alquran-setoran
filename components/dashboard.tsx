import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PricingDisplay from "@/components/dashboard/pricing-display"

export default function Dashboard() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="upgrade">
        <PricingDisplay />
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}

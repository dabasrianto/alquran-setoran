"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/hooks/use-subscription"
import { PremiumUpgradeModal } from "@/components/auth/premium-upgrade-modal"
import {
  type PricingPlan,
  getPricingPlans,
  formatPrice,
  calculateYearlyPrice,
  subscribeToPricingChanges,
} from "@/lib/firebase-pricing"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function PricingDisplay() {
  const { currentUser, loading } = useAuth()
  const router = useRouter()
  const { userSubscription, loading: subscriptionLoading } = useSubscription()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([])
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [loadingPricing, setLoadingPricing] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPricing(true)
      const plans = await getPricingPlans()
      setPricingPlans(plans.filter((p) => p.active)) // Only show active plans
      setLoadingPricing(false)
    }

    fetchPlans()

    const unsubscribeRealtime = subscribeToPricingChanges((plans) => {
      setPricingPlans(plans.filter((p) => p.active))
    })

    return () => {
      unsubscribeRealtime()
    }
  }, [])

  const handleUpgradeClick = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  if (loading || !currentUser || subscriptionLoading || loadingPricing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const currentPlanId = userSubscription?.tier || "free"
  const currentPlan = pricingPlans.find((p) => p.id === currentPlanId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Pilih Paket Langganan Anda</CardTitle>
        <p className="text-muted-foreground text-center">
          Upgrade untuk mendapatkan fitur lebih banyak dan batas penggunaan yang lebih tinggi.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={billingPeriod}
            onValueChange={(value: "monthly" | "yearly") => {
              if (value) setBillingPeriod(value)
            }}
            className="border rounded-md"
          >
            <ToggleGroupItem value="monthly" aria-label="Toggle monthly">
              Bulanan
            </ToggleGroupItem>
            <ToggleGroupItem value="yearly" aria-label="Toggle yearly">
              Tahunan (Hemat 20%)
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => {
            const isCurrent = currentPlanId === plan.id
            const displayPrice =
              billingPeriod === "monthly" ? plan.price : plan.yearlyPrice || calculateYearlyPrice(plan.price)
            const displayInterval = billingPeriod === "monthly" ? "/bulan" : "/tahun"

            return (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col justify-between p-6 border-2",
                  isCurrent ? "border-primary" : "border-gray-200 dark:border-gray-700",
                  plan.isPopular && "border-blue-500 dark:border-blue-400",
                  plan.isRecommended && "border-green-500 dark:border-green-400",
                )}
              >
                <div>
                  <CardHeader className="p-0 pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                      {plan.isPopular && <Badge className="bg-blue-500 text-white">Populer</Badge>}
                      {plan.isRecommended && <Badge className="bg-green-500 text-white">Rekomendasi</Badge>}
                    </div>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="text-4xl font-bold mb-4">
                      {formatPrice(displayPrice, plan.currency)}
                      <span className="text-base text-muted-foreground font-normal">{displayInterval}</span>
                    </div>
                    <Separator className="my-4" />
                    <ul className="space-y-2 text-sm">
                      {(plan.features || []).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                      {plan.maxStudents !== undefined && (
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          Maksimal {plan.maxStudents === null ? "Tidak Terbatas" : plan.maxStudents} Santri
                        </li>
                      )}
                      {plan.maxTeachers !== undefined && (
                        <li className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                          Maksimal {plan.maxTeachers === null ? "Tidak Terbatas" : plan.maxTeachers} Penguji
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </div>
                <Button className="mt-6 w-full" onClick={() => handleUpgradeClick(plan)} disabled={isCurrent}>
                  {isCurrent ? "Paket Anda Saat Ini" : "Pilih Paket"}
                </Button>
              </Card>
            )
          })}
        </div>
      </CardContent>
      {selectedPlan && (
        <PremiumUpgradeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
          billingPeriod={billingPeriod}
        />
      )}
    </Card>
  )
}

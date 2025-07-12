"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Loader2 } from "lucide-react"
import { type PricingPlan, formatPrice, calculateYearlyPrice, subscribeToPricingChanges } from "@/lib/firebase-pricing"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function PricingSection() {
  const { currentUser } = useAuth()
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToPricingChanges((fetchedPlans) => {
      setPricingPlans(fetchedPlans.filter((p) => p.active)) // Only show active plans
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Memuat paket harga...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Pilih Paket yang Tepat untuk Anda
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Fleksibel, terjangkau, dan dirancang untuk kebutuhan Anda.
            </p>
          </div>
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => {
            const displayPrice =
              billingPeriod === "monthly" ? plan.price : plan.yearlyPrice || calculateYearlyPrice(plan.price)
            const displayInterval = billingPeriod === "monthly" ? "/bulan" : "/tahun"

            return (
              <Card
                key={plan.id}
                className={cn(
                  "flex flex-col justify-between p-6 border-2",
                  plan.isPopular && "border-blue-500 dark:border-blue-400",
                  plan.isRecommended && "border-green-500 dark:border-green-400",
                )}
              >
                <div>
                  <CardHeader className="p-0 pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                      <div className="flex gap-1">
                        {plan.isPopular && <Badge className="bg-blue-500 text-white">Populer</Badge>}
                        {plan.isRecommended && <Badge className="bg-green-500 text-white">Rekomendasi</Badge>}
                      </div>
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
                <Button className="mt-6 w-full" asChild>
                  {currentUser ? (
                    <Link href="/upgrade">Pilih Paket</Link>
                  ) : (
                    <Link href="/register">Daftar Sekarang</Link>
                  )}
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

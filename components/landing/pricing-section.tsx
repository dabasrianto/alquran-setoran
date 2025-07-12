"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, Crown, Star, Users, GraduationCap } from "lucide-react"
import { type PricingPlan, formatPrice, calculateYearlyPrice, subscribeToPricingChanges } from "@/lib/firebase-pricing"

export function PricingSection() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [isYearly, setIsYearly] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToPricingChanges((updatedPlans) => {
      // Only show active plans on landing page
      setPlans(updatedPlans.filter((plan) => plan.active))
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleUpgrade = (planName: string) => {
    const phoneNumber = "+628977712345"
    const message = `Bismillah, afwan Admin saya ingin upgrade ke paket ${planName}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded animate-pulse mx-auto mb-4" style={{ width: "200px" }} />
            <div className="h-4 bg-gray-200 rounded animate-pulse mx-auto" style={{ width: "300px" }} />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pilih Paket yang Tepat</h2>
          <p className="text-xl text-gray-600 mb-8">Mulai gratis, upgrade kapan saja sesuai kebutuhan</p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className={!isYearly ? "font-medium" : ""}>
              Bulanan
            </Label>
            <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
            <Label htmlFor="billing-toggle" className={isYearly ? "font-medium" : ""}>
              Tahunan
            </Label>
            <Badge variant="secondary" className="ml-2">
              Hemat 20%
            </Badge>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const displayPrice = isYearly && plan.price > 0 ? calculateYearlyPrice(plan.price) / 12 : plan.price
            const totalPrice = isYearly && plan.price > 0 ? calculateYearlyPrice(plan.price) : plan.price

            return (
              <Card
                key={plan.id}
                className={`relative ${plan.isRecommended ? "ring-2 ring-primary shadow-lg scale-105" : ""}`}
              >
                {plan.isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Crown className="w-3 h-3 mr-1" />
                      Direkomendasikan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="flex items-center justify-center gap-2">
                    {plan.name}
                    {plan.isPopular && (
                      <Badge variant="secondary">
                        <Star className="w-3 h-3 mr-1" />
                        Populer
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="py-4">
                    <div className="text-4xl font-bold">{formatPrice(displayPrice)}</div>
                    <div className="text-sm text-muted-foreground">
                      per {isYearly ? "bulan (ditagih tahunan)" : "bulan"}
                    </div>
                    {isYearly && plan.price > 0 && (
                      <div className="text-sm text-green-600 mt-1">Total: {formatPrice(totalPrice)}/tahun</div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span>
                        {plan.maxStudents === null ? "Santri tidak terbatas" : `Maksimal ${plan.maxStudents} santri`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span>
                        {plan.maxTeachers === null ? "Penguji tidak terbatas" : `Maksimal ${plan.maxTeachers} penguji`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full mt-6"
                    variant={plan.isRecommended ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {plan.price === 0 ? "Mulai Gratis" : "Pilih Paket"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {plans.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada paket tersedia</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default PricingSection

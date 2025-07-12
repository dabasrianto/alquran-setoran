"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Award, Loader2 } from "lucide-react"
import { getPricingPlans, formatPrice, calculateDiscount, type PricingPlan } from "@/lib/firebase-pricing"

interface PricingSectionProps {
  onSelectPlan?: (planId: string) => void
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPricingPlans()
  }, [])

  const loadPricingPlans = async () => {
    try {
      setLoading(true)
      const pricingPlans = await getPricingPlans()
      setPlans(pricingPlans.filter((plan) => plan.isActive).sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error("Error loading pricing plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = (planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId)
    } else {
      // Default behavior - redirect to auth
      window.location.href = `/auth?plan=${planId}`
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pilih Paket yang Tepat</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mulai gratis dan upgrade sesuai kebutuhan madrasah Anda
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Memuat paket harga...</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pilih Paket yang Tepat</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mulai gratis dan upgrade sesuai kebutuhan madrasah Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.isRecommended
                  ? "border-blue-500 shadow-lg scale-105"
                  : plan.isPopular
                    ? "border-green-500 shadow-md"
                    : ""
              }`}
            >
              {plan.isRecommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Award className="h-3 w-3 mr-1" />
                    Direkomendasikan
                  </Badge>
                </div>
              )}
              {plan.isPopular && !plan.isRecommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Populer
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 mt-2">{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
                    {plan.price > 0 && <span className="text-gray-600 ml-2">/bulan</span>}
                  </div>
                  {plan.originalPrice && plan.originalPrice > plan.price && (
                    <div className="flex items-center justify-center mt-2">
                      <span className="text-lg text-gray-500 line-through">{formatPrice(plan.originalPrice)}</span>
                      <Badge variant="destructive" className="ml-2">
                        Hemat {calculateDiscount(plan.originalPrice, plan.price)}%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.isRecommended
                      ? "bg-blue-600 hover:bg-blue-700"
                      : plan.isPopular
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                  }`}
                  variant={plan.price === 0 ? "outline" : "default"}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.price === 0 ? "Mulai Gratis" : "Pilih Paket"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Butuh paket khusus untuk institusi besar?</p>
          <Button variant="outline">Hubungi Tim Sales</Button>
        </div>
      </div>
    </section>
  )
}

// Default export for backward compatibility
export default PricingSection

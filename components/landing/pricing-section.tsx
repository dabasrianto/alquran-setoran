"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getPricingPlans, formatPrice, calculateDiscount, type PricingPlan } from "@/lib/firebase-pricing"
import { Check, Star, Award, Users, BookOpen } from "lucide-react"

interface PricingSectionProps {
  onSelectPlan?: (planId: string) => void
}

export default function PricingSection({ onSelectPlan }: PricingSectionProps) {
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
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="relative">
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full mt-6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Pilih Paket yang Tepat untuk Anda</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Mulai gratis dan upgrade kapan saja sesuai kebutuhan madrasah atau TPQ Anda
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const discount = plan.originalPrice ? calculateDiscount(plan.originalPrice, plan.price) : 0

          return (
            <Card
              key={plan.id}
              className={`relative transition-all hover:shadow-lg ${
                plan.isRecommended ? "ring-2 ring-primary shadow-lg scale-105" : ""
              }`}
            >
              {/* Badges */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {plan.isPopular && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
                {plan.isRecommended && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Award className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </div>

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                    {plan.originalPrice && plan.originalPrice > plan.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(plan.originalPrice)}
                      </span>
                    )}
                  </div>
                  {discount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Hemat {discount}%
                    </Badge>
                  )}
                  {plan.price > 0 && <p className="text-sm text-muted-foreground">/bulan</p>}
                </div>
                <CardDescription className="text-center">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Limits */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 mr-1 text-primary" />
                      <span className="font-semibold">{plan.maxStudents === "unlimited" ? "∞" : plan.maxStudents}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Murid</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <BookOpen className="h-4 w-4 mr-1 text-primary" />
                      <span className="font-semibold">{plan.maxTeachers === "unlimited" ? "∞" : plan.maxTeachers}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Ustadz</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={plan.isRecommended ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.price === 0 ? "Mulai Gratis" : "Pilih Paket"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center mt-12 space-y-4">
        <p className="text-sm text-muted-foreground">Semua paket termasuk dukungan teknis dan update gratis</p>
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" />
            <span>Tanpa kontrak</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" />
            <span>Cancel kapan saja</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-600" />
            <span>Data aman & backup</span>
          </div>
        </div>
      </div>
    </div>
  )
}

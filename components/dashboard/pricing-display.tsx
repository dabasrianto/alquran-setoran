"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { getPricingPlans, formatPrice, calculateDiscount, type PricingPlan } from "@/lib/firebase-pricing"
import { Check, Star, Award, Users, BookOpen, ArrowUp } from "lucide-react"

interface PricingDisplayProps {
  onUpgrade?: (planId: string) => void
  showCurrentPlan?: boolean
}

export default function PricingDisplay({ onUpgrade, showCurrentPlan = true }: PricingDisplayProps) {
  const { userProfile } = useAuth()
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

  const handleUpgrade = (planId: string) => {
    if (onUpgrade) {
      onUpgrade(planId)
    } else {
      // Default behavior - redirect to upgrade page
      window.location.href = `/upgrade?plan=${planId}`
    }
  }

  const getCurrentPlan = () => {
    if (!userProfile) return null
    return plans.find((plan) => plan.id === userProfile.subscriptionType) || plans.find((plan) => plan.id === "free")
  }

  const getUpgradeOptions = () => {
    const currentPlan = getCurrentPlan()
    if (!currentPlan) return plans

    // Show plans that are higher tier than current plan
    return plans.filter((plan) => plan.order > currentPlan.order)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {showCurrentPlan && (
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        )}
        <div>
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const currentPlan = getCurrentPlan()
  const upgradeOptions = getUpgradeOptions()

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      {showCurrentPlan && currentPlan && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Paket Saat Ini</h3>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{currentPlan.name}</span>
                    <Badge variant="outline">Aktif</Badge>
                  </CardTitle>
                  <CardDescription>{currentPlan.description}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatPrice(currentPlan.price)}</div>
                  {currentPlan.price > 0 && <div className="text-sm text-muted-foreground">/bulan</div>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-semibold">
                      {currentPlan.maxStudents === "unlimited" ? "Unlimited" : `${currentPlan.maxStudents} murid`}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <BookOpen className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-semibold">
                      {currentPlan.maxTeachers === "unlimited" ? "Unlimited" : `${currentPlan.maxTeachers} ustadz`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentPlan.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-3 w-3 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upgrade Options */}
      {upgradeOptions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ArrowUp className="h-5 w-5 mr-2 text-primary" />
            Upgrade Paket
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {upgradeOptions.map((plan) => {
              const discount = plan.originalPrice ? calculateDiscount(plan.originalPrice, plan.price) : 0

              return (
                <Card
                  key={plan.id}
                  className={`relative transition-all hover:shadow-lg ${
                    plan.isRecommended ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {/* Badges */}
                  {(plan.isPopular || plan.isRecommended) && (
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
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{formatPrice(plan.price)}</span>
                        {plan.originalPrice && plan.originalPrice > plan.price && (
                          <span className="text-sm text-muted-foreground line-through">
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
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Limits */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center">
                          <Users className="h-4 w-4 mr-1 text-primary" />
                          <span className="font-semibold">
                            {plan.maxStudents === "unlimited" ? "∞" : plan.maxStudents}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Murid</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-center">
                          <BookOpen className="h-4 w-4 mr-1 text-primary" />
                          <span className="font-semibold">
                            {plan.maxTeachers === "unlimited" ? "∞" : plan.maxTeachers}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Ustadz</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {plan.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Check className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 5 && (
                        <p className="text-xs text-muted-foreground">+{plan.features.length - 5} fitur lainnya</p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full"
                      variant={plan.isRecommended ? "default" : "outline"}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Upgrade ke {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {upgradeOptions.length === 0 && showCurrentPlan && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Anda sudah menggunakan paket terbaik!</h3>
            <p>Terima kasih telah mempercayai layanan premium kami.</p>
          </div>
        </div>
      )}
    </div>
  )
}

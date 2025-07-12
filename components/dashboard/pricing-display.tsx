"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, ArrowUp, Star, Award, Loader2 } from "lucide-react"
import { getPricingPlans, formatPrice, type PricingPlan } from "@/lib/firebase-pricing"
import { useAuth } from "@/contexts/auth-context"

interface PricingDisplayProps {
  currentPlan?: string
  onUpgrade?: (planId: string) => void
}

export default function PricingDisplay({ currentPlan = "free", onUpgrade }: PricingDisplayProps) {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

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

  const getCurrentPlanData = () => {
    return plans.find((plan) => plan.id === currentPlan) || plans[0]
  }

  const getUpgradeOptions = () => {
    const currentPlanData = getCurrentPlanData()
    if (!currentPlanData) return []

    return plans.filter((plan) => plan.order > currentPlanData.order)
  }

  const calculateUsagePercentage = (used: number, limit: number | "unlimited") => {
    if (limit === "unlimited") return 0
    return Math.min((used / limit) * 100, 100)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Memuat informasi paket...</span>
        </CardContent>
      </Card>
    )
  }

  const currentPlanData = getCurrentPlanData()
  const upgradeOptions = getUpgradeOptions()

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Paket Saat Ini: {currentPlanData?.name}</span>
                {currentPlanData?.isPopular && (
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
                {currentPlanData?.isRecommended && (
                  <Badge>
                    <Award className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{currentPlanData?.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatPrice(currentPlanData?.price || 0)}</div>
              {(currentPlanData?.price || 0) > 0 && <div className="text-sm text-muted-foreground">/bulan</div>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Usage Stats */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Murid</span>
                  <span>0 / {currentPlanData?.maxStudents === "unlimited" ? "∞" : currentPlanData?.maxStudents}</span>
                </div>
                <Progress value={calculateUsagePercentage(0, currentPlanData?.maxStudents || 0)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Ustadz</span>
                  <span>1 / {currentPlanData?.maxTeachers === "unlimited" ? "∞" : currentPlanData?.maxTeachers}</span>
                </div>
                <Progress value={calculateUsagePercentage(1, currentPlanData?.maxTeachers || 1)} className="h-2" />
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold mb-2">Fitur Tersedia</h4>
              <ul className="space-y-1">
                {currentPlanData?.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
                {(currentPlanData?.features.length || 0) > 3 && (
                  <li className="text-sm text-muted-foreground">
                    +{(currentPlanData?.features.length || 0) - 3} fitur lainnya
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {upgradeOptions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Upgrade Paket</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upgradeOptions.map((plan) => (
              <Card key={plan.id} className="relative">
                {plan.isRecommended && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Direkomendasikan
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span>{plan.name}</span>
                    {plan.isPopular && (
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-2xl font-bold">
                    {formatPrice(plan.price)}
                    {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/bulan</span>}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-sm text-muted-foreground">+{plan.features.length - 4} fitur lainnya</li>
                    )}
                  </ul>

                  <Button
                    className="w-full"
                    onClick={() => onUpgrade?.(plan.id)}
                    variant={plan.isRecommended ? "default" : "outline"}
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Upgrade ke {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {upgradeOptions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Award className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Anda Sudah Menggunakan Paket Tertinggi!</h3>
            <p className="text-muted-foreground">Terima kasih telah mempercayai layanan kami dengan paket premium.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

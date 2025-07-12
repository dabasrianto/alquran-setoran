"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Users, GraduationCap, TrendingUp, Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { type PricingPlan, formatPrice, subscribeToPricingChanges } from "@/lib/firebase-pricing"

interface UserUsage {
  studentsCount: number
  teachersCount: number
}

export function PricingDisplay() {
  const { userProfile } = useAuth()
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [usage, setUsage] = useState<UserUsage>({ studentsCount: 0, teachersCount: 0 })

  useEffect(() => {
    const unsubscribe = subscribeToPricingChanges((updatedPlans) => {
      const activePlans = updatedPlans.filter((plan) => plan.active)
      setPlans(activePlans)

      // Find current user's plan
      const userPlanName = userProfile?.subscriptionType === "premium" ? "Premium" : "Free"
      const userPlan = activePlans.find((plan) => plan.name.toLowerCase() === userPlanName.toLowerCase())
      setCurrentPlan(userPlan || null)
      setLoading(false)
    })

    return unsubscribe
  }, [userProfile?.subscriptionType])

  // Mock usage data - in real app, this would come from Firebase
  useEffect(() => {
    // This would be replaced with actual Firebase query
    setUsage({
      studentsCount: 3,
      teachersCount: 1,
    })
  }, [])

  const handleUpgrade = (planName: string) => {
    const phoneNumber = "+628977712345"
    const message = `Bismillah, afwan Admin saya ingin upgrade ke paket ${planName}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
  }

  const getUsagePercentage = (used: number, limit: number | null) => {
    if (limit === null) return 0 // unlimited
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-48 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      {currentPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentPlan.name === "Premium" && <Crown className="w-5 h-5 text-yellow-500" />}
              Paket Saat Ini: {currentPlan.name}
              {currentPlan.isPopular && <Badge variant="secondary">Populer</Badge>}
            </CardTitle>
            <CardDescription>{currentPlan.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{formatPrice(currentPlan.price)}</span>
              <span className="text-sm text-muted-foreground">per bulan</span>
            </div>

            {/* Usage Statistics */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Santri</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {usage.studentsCount} / {currentPlan.maxStudents === null ? "∞" : currentPlan.maxStudents}
                  </span>
                </div>
                {currentPlan.maxStudents !== null && (
                  <Progress value={getUsagePercentage(usage.studentsCount, currentPlan.maxStudents)} className="h-2" />
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm font-medium">Penguji</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {usage.teachersCount} / {currentPlan.maxTeachers === null ? "∞" : currentPlan.maxTeachers}
                  </span>
                </div>
                {currentPlan.maxTeachers !== null && (
                  <Progress value={getUsagePercentage(usage.teachersCount, currentPlan.maxTeachers)} className="h-2" />
                )}
              </div>
            </div>

            {/* Features Status */}
            <div className="space-y-2">
              <h4 className="font-medium">Fitur Aktif</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade Options */}
      {currentPlan?.name !== "Premium" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Upgrade Paket
            </CardTitle>
            <CardDescription>Tingkatkan paket Anda untuk mendapatkan fitur lebih lengkap</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {plans
                .filter((plan) => plan.name !== currentPlan?.name && plan.price > (currentPlan?.price || 0))
                .map((plan) => (
                  <Card key={plan.id} className="relative">
                    {plan.isRecommended && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-primary">
                          <Crown className="w-3 h-3 mr-1" />
                          Direkomendasikan
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription className="text-sm">{plan.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="text-2xl font-bold">{formatPrice(plan.price)}</div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          <span>
                            {plan.maxStudents === null ? "Santri tidak terbatas" : `${plan.maxStudents} santri`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-3 h-3" />
                          <span>
                            {plan.maxTeachers === null ? "Penguji tidak terbatas" : `${plan.maxTeachers} penguji`}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <Check className="w-3 h-3 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {plan.features.length > 3 && (
                          <div className="text-xs text-muted-foreground">+{plan.features.length - 3} fitur lainnya</div>
                        )}
                      </div>

                      <Button className="w-full" size="sm" onClick={() => handleUpgrade(plan.name)}>
                        Upgrade ke {plan.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

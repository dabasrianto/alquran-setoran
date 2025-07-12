"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Crown, Users, TrendingUp, CheckCircle, AlertCircle, RefreshCw, Zap } from "lucide-react"
import { getPricingPlans, formatPrice } from "@/lib/firebase-pricing"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/hooks/use-subscription"
import type { SubscriptionTierInfo } from "@/lib/types"
import Link from "next/link"

export default function PricingDisplay() {
  const { user } = useAuth()
  const { subscription, usage, loading: subscriptionLoading } = useSubscription()
  const [plans, setPlans] = useState<SubscriptionTierInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTierInfo | null>(null)

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true)
        const pricingPlans = await getPricingPlans()
        setPlans(pricingPlans)

        // Find current plan
        if (subscription) {
          const current = pricingPlans.find((p) => p.id === subscription.tier)
          setCurrentPlan(current || null)
        }
      } catch (err) {
        console.error("Error loading pricing plans:", err)
      } finally {
        setLoading(false)
      }
    }

    loadPlans()
  }, [subscription])

  if (loading || subscriptionLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Memuat informasi langganan...
        </CardContent>
      </Card>
    )
  }

  if (!currentPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Paket Tidak Ditemukan
          </CardTitle>
          <CardDescription>Informasi paket langganan tidak tersedia</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/upgrade">Pilih Paket Langganan</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Calculate usage percentages
  const studentUsage =
    currentPlan.features.maxStudents === -1 ? 0 : (usage.studentsCount / currentPlan.features.maxStudents) * 100

  const ustadzUsage =
    currentPlan.features.maxUstadz === -1 ? 0 : (usage.ustadzCount / currentPlan.features.maxUstadz) * 100

  const ustadzahUsage =
    currentPlan.features.maxUstadzah === -1 ? 0 : (usage.ustadzahCount / currentPlan.features.maxUstadzah) * 100

  // Get upgrade options (higher tier plans)
  const upgradeOptions = plans
    .filter((plan) => plan.price > currentPlan.price && plan.id !== currentPlan.id)
    .slice(0, 2) // Show max 2 upgrade options

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Paket Saat Ini: {currentPlan.name}
                {currentPlan.popular && <Badge variant="secondary">Popular</Badge>}
                {currentPlan.recommended && <Badge>Recommended</Badge>}
              </CardTitle>
              <CardDescription>{currentPlan.description}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{formatPrice(currentPlan.price)}</div>
              <div className="text-sm text-muted-foreground">per bulan</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Usage Statistics */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Penggunaan Saat Ini
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Students Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Santri</span>
                  <span>
                    {usage.studentsCount} /{" "}
                    {currentPlan.features.maxStudents === -1 ? "∞" : currentPlan.features.maxStudents}
                  </span>
                </div>
                {currentPlan.features.maxStudents !== -1 && (
                  <Progress
                    value={studentUsage}
                    className={`h-2 ${studentUsage > 80 ? "bg-red-100" : studentUsage > 60 ? "bg-yellow-100" : "bg-green-100"}`}
                  />
                )}
              </div>

              {/* Ustadz Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ustadz</span>
                  <span>
                    {usage.ustadzCount} / {currentPlan.features.maxUstadz === -1 ? "∞" : currentPlan.features.maxUstadz}
                  </span>
                </div>
                {currentPlan.features.maxUstadz !== -1 && (
                  <Progress
                    value={ustadzUsage}
                    className={`h-2 ${ustadzUsage > 80 ? "bg-red-100" : ustadzUsage > 60 ? "bg-yellow-100" : "bg-green-100"}`}
                  />
                )}
              </div>

              {/* Ustadzah Usage */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ustadzah</span>
                  <span>
                    {usage.ustadzahCount} /{" "}
                    {currentPlan.features.maxUstadzah === -1 ? "∞" : currentPlan.features.maxUstadzah}
                  </span>
                </div>
                {currentPlan.features.maxUstadzah !== -1 && (
                  <Progress
                    value={ustadzahUsage}
                    className={`h-2 ${ustadzahUsage > 80 ? "bg-red-100" : ustadzahUsage > 60 ? "bg-yellow-100" : "bg-green-100"}`}
                  />
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold">Fitur Aktif</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {Object.entries(currentPlan.features).map(([key, value]) => {
                if (["maxStudents", "maxUstadz", "maxUstadzah"].includes(key)) return null

                const labels: Record<string, string> = {
                  exportPDF: "Export PDF",
                  prioritySupport: "Priority Support",
                  customReports: "Custom Reports",
                  multipleInstitutions: "Multiple Institutions",
                  apiAccess: "API Access",
                  advancedAnalytics: "Advanced Analytics",
                  bulkImport: "Bulk Import",
                }

                return (
                  <div key={key} className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${value ? "text-green-500" : "text-gray-300"}`} />
                    <span className={value ? "" : "text-muted-foreground"}>{labels[key]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      {upgradeOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Upgrade Paket
            </CardTitle>
            <CardDescription>Tingkatkan paket untuk mendapatkan fitur lebih lengkap</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upgradeOptions.map((plan) => (
                <Card key={plan.id} className="border-2 border-dashed">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <Badge variant="outline">
                        <Zap className="h-3 w-3 mr-1" />
                        Upgrade
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{formatPrice(plan.price)}</div>
                      <div className="text-sm text-muted-foreground">per bulan</div>
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Santri:</span>
                        <span className="font-medium">
                          {plan.features.maxStudents === -1 ? "Unlimited" : plan.features.maxStudents}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ustadz:</span>
                        <span className="font-medium">
                          {plan.features.maxUstadz === -1 ? "Unlimited" : plan.features.maxUstadz}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ustadzah:</span>
                        <span className="font-medium">
                          {plan.features.maxUstadzah === -1 ? "Unlimited" : plan.features.maxUstadzah}
                        </span>
                      </div>
                    </div>

                    <Button asChild className="w-full" size="sm">
                      <Link href={`/upgrade?plan=${plan.id}`}>Upgrade ke {plan.name}</Link>
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

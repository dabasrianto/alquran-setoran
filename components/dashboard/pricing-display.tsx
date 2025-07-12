"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, TrendingUp } from "lucide-react"
import { getPricingTiers, formatPrice, getTierFeaturesList } from "@/lib/firebase-pricing"
import type { SubscriptionTierInfo } from "@/lib/types"

interface PricingDisplayProps {
  currentTier?: string
  onUpgrade?: (tierId: string) => void
}

export function PricingDisplay({ currentTier = "basic", onUpgrade }: PricingDisplayProps) {
  const [tiers, setTiers] = useState<SubscriptionTierInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPricingTiers()
  }, [])

  const loadPricingTiers = async () => {
    try {
      setLoading(true)
      const pricingTiers = await getPricingTiers()
      setTiers(pricingTiers)
    } catch (error) {
      console.error("Error loading pricing tiers:", error)
    } finally {
      setLoading(false)
    }
  }

  const isCurrentTier = (tierId: string) => tierId === currentTier

  const canUpgrade = (tierId: string) => {
    const tierOrder = ["basic", "pro", "premium", "institution"]
    const currentIndex = tierOrder.indexOf(currentTier)
    const targetIndex = tierOrder.indexOf(tierId)
    return targetIndex > currentIndex
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow p-6 h-80">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Paket Langganan</h3>
        <p className="text-gray-600">Tingkatkan paket Anda untuk mendapatkan fitur yang lebih lengkap</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`relative transition-all duration-300 ${
              isCurrentTier(tier.id) ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-lg"
            }`}
          >
            {isCurrentTier(tier.id) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Paket Saat Ini</Badge>
              </div>
            )}

            {tier.popular && !isCurrentTier(tier.id) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white">Populer</Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-2">
                {tier.id === "premium" && <Crown className="h-6 w-6 text-yellow-500" />}
                {tier.id === "pro" && <Zap className="h-6 w-6 text-purple-500" />}
                {tier.id === "institution" && <TrendingUp className="h-6 w-6 text-orange-500" />}
              </div>

              <CardTitle className="text-lg font-bold">{tier.name}</CardTitle>

              <CardDescription className="text-sm text-gray-600">{tier.description}</CardDescription>

              <div className="mt-3">
                <div className="text-2xl font-bold text-gray-900">{formatPrice(tier.price)}</div>
                {tier.price > 0 && <div className="text-xs text-gray-500">per bulan</div>}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <ul className="space-y-2 mb-4 text-sm">
                {getTierFeaturesList(tier)
                  .slice(0, 4)
                  .map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 text-xs">{feature}</span>
                    </li>
                  ))}
                {getTierFeaturesList(tier).length > 4 && (
                  <li className="text-xs text-gray-500 italic">
                    +{getTierFeaturesList(tier).length - 4} fitur lainnya
                  </li>
                )}
              </ul>

              {isCurrentTier(tier.id) ? (
                <Button disabled className="w-full" size="sm">
                  Paket Aktif
                </Button>
              ) : canUpgrade(tier.id) ? (
                <Button onClick={() => onUpgrade?.(tier.id)} className="w-full" size="sm">
                  Upgrade
                </Button>
              ) : (
                <Button disabled className="w-full bg-transparent" size="sm" variant="outline">
                  Downgrade
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

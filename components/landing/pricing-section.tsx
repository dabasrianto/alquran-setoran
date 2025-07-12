"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Crown, Building2 } from "lucide-react"
import { getPricingTiers, formatPrice, getTierFeaturesList } from "@/lib/firebase-pricing"
import type { SubscriptionTierInfo } from "@/lib/types"

export function PricingSection() {
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

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case "basic":
        return <Star className="h-6 w-6 text-blue-600" />
      case "pro":
        return <Crown className="h-6 w-6 text-purple-600" />
      case "premium":
        return <Building2 className="h-6 w-6 text-green-600" />
      case "institution":
        return <Building2 className="h-6 w-6 text-orange-600" />
      default:
        return <Star className="h-6 w-6 text-gray-600" />
    }
  }

  const getTierColor = (tierId: string) => {
    switch (tierId) {
      case "basic":
        return "border-blue-200 hover:border-blue-300"
      case "pro":
        return "border-purple-200 hover:border-purple-300"
      case "premium":
        return "border-green-200 hover:border-green-300 ring-2 ring-green-100"
      case "institution":
        return "border-orange-200 hover:border-orange-300"
      default:
        return "border-gray-200 hover:border-gray-300"
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Pilih Paket yang Tepat</h2>
            <p className="mt-4 text-xl text-gray-600">Solusi terbaik untuk kebutuhan manajemen hafalan Al-Quran Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-lg p-6 h-96">
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
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Pilih Paket yang Tepat</h2>
          <p className="mt-4 text-xl text-gray-600">Solusi terbaik untuk kebutuhan manajemen hafalan Al-Quran Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={`relative transition-all duration-300 hover:shadow-xl ${getTierColor(tier.id)} ${
                tier.popular ? "transform scale-105" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-3 py-1">Paling Populer</Badge>
                </div>
              )}

              {tier.recommended && (
                <div className="absolute -top-4 right-4">
                  <Badge className="bg-orange-500 text-white px-3 py-1">Direkomendasikan</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">{getTierIcon(tier.id)}</div>
                <CardTitle className="text-xl font-bold text-gray-900">{tier.name}</CardTitle>
                <CardDescription className="text-gray-600 mt-2">{tier.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-gray-900">{formatPrice(tier.price)}</div>
                  {tier.price > 0 && <div className="text-sm text-gray-500 mt-1">per bulan</div>}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {getTierFeaturesList(tier)
                    .slice(0, 6)
                    .map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  {getTierFeaturesList(tier).length > 6 && (
                    <li className="text-sm text-gray-500 italic">
                      +{getTierFeaturesList(tier).length - 6} fitur lainnya
                    </li>
                  )}
                </ul>

                <Button
                  className={`w-full ${
                    tier.popular
                      ? "bg-green-600 hover:bg-green-700"
                      : tier.recommended
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  size="lg"
                >
                  {tier.price === 0 ? "Mulai Gratis" : "Pilih Paket"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Butuh paket khusus untuk institusi besar?</p>
          <Button variant="outline" size="lg">
            Hubungi Tim Sales
          </Button>
        </div>
      </div>
    </section>
  )
}

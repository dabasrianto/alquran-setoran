"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Check,
  Crown,
  Star,
  Users,
  FileText,
  Headphones,
  BarChart3,
  Upload,
  Zap,
  Building2,
  RefreshCw,
} from "lucide-react"
import { getPricingPlans, formatPrice, calculateYearlyPrice } from "@/lib/firebase-pricing"
import type { SubscriptionTierInfo } from "@/lib/types"
import Link from "next/link"

const FEATURE_ICONS = {
  maxStudents: Users,
  maxUstadz: Users,
  maxUstadzah: Users,
  exportPDF: FileText,
  prioritySupport: Headphones,
  customReports: BarChart3,
  multipleInstitutions: Building2,
  apiAccess: Zap,
  advancedAnalytics: BarChart3,
  bulkImport: Upload,
}

const FEATURE_DESCRIPTIONS = {
  maxStudents: "Jumlah santri yang dapat dikelola",
  maxUstadz: "Jumlah ustadz yang dapat ditambahkan",
  maxUstadzah: "Jumlah ustadzah yang dapat ditambahkan",
  exportPDF: "Export laporan dalam format PDF",
  prioritySupport: "Dukungan prioritas via WhatsApp",
  customReports: "Laporan kustom dan detail",
  multipleInstitutions: "Kelola multiple madrasah",
  apiAccess: "Akses API untuk integrasi",
  advancedAnalytics: "Analytics dan insights mendalam",
  bulkImport: "Import data santri secara massal",
}

export function PricingSection() {
  const [plans, setPlans] = useState<SubscriptionTierInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [isYearly, setIsYearly] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true)
        setError(null)
        const pricingPlans = await getPricingPlans()
        setPlans(pricingPlans)
      } catch (err) {
        console.error("Error loading pricing plans:", err)
        setError("Gagal memuat data harga")
      } finally {
        setLoading(false)
      }
    }

    loadPlans()
  }, [])

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pilih Paket Langganan</h2>
            <p className="text-xl text-muted-foreground">Pilih paket yang sesuai dengan kebutuhan madrasah Anda</p>
          </div>
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Memuat harga...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pilih Paket Langganan</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pilih Paket Langganan</h2>
          <p className="text-xl text-muted-foreground mb-8">Pilih paket yang sesuai dengan kebutuhan madrasah Anda</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className={!isYearly ? "font-semibold" : ""}>
              Bulanan
            </Label>
            <Switch id="billing-toggle" checked={isYearly} onCheckedChange={setIsYearly} />
            <Label htmlFor="billing-toggle" className={isYearly ? "font-semibold" : ""}>
              Tahunan
              <Badge variant="secondary" className="ml-2">
                Hemat 20%
              </Badge>
            </Label>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const displayPrice = isYearly ? calculateYearlyPrice(plan.price) : plan.price
            const billingPeriod = isYearly ? "tahun" : "bulan"

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular ? "border-primary shadow-lg scale-105" : ""
                } ${plan.recommended ? "border-2 border-primary" : ""}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Populer
                    </Badge>
                  </div>
                )}

                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="secondary" className="px-3 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      Rekomendasi
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>

                  <div className="py-4">
                    <div className="text-4xl font-bold text-primary">{formatPrice(displayPrice)}</div>
                    <div className="text-sm text-muted-foreground">per {billingPeriod}</div>
                    {isYearly && plan.price > 0 && (
                      <div className="text-xs text-green-600 mt-1">
                        Hemat {formatPrice(plan.price * 12 - displayPrice)} per tahun
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Limits */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Santri
                      </span>
                      <span className="font-semibold">
                        {plan.features.maxStudents === -1 ? "Unlimited" : plan.features.maxStudents}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Ustadz
                      </span>
                      <span className="font-semibold">
                        {plan.features.maxUstadz === -1 ? "Unlimited" : plan.features.maxUstadz}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Ustadzah
                      </span>
                      <span className="font-semibold">
                        {plan.features.maxUstadzah === -1 ? "Unlimited" : plan.features.maxUstadzah}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Features */}
                  <div className="space-y-2">
                    {Object.entries(plan.features).map(([key, value]) => {
                      if (["maxStudents", "maxUstadz", "maxUstadzah"].includes(key)) return null

                      const Icon = FEATURE_ICONS[key as keyof typeof FEATURE_ICONS]
                      const description = FEATURE_DESCRIPTIONS[key as keyof typeof FEATURE_DESCRIPTIONS]

                      return (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          {value ? (
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <div className="h-4 w-4 flex-shrink-0" />
                          )}
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className={value ? "" : "text-muted-foreground line-through"}>{description}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Button
                      asChild
                      className={`w-full ${plan.popular || plan.recommended ? "bg-primary hover:bg-primary/90" : ""}`}
                      variant={plan.popular || plan.recommended ? "default" : "outline"}
                    >
                      <Link href={plan.price === 0 ? "/register" : "/upgrade"}>
                        {plan.price === 0 ? "Mulai Gratis" : "Pilih Paket"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Semua paket termasuk dukungan teknis dan update gratis</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/panduan">Lihat Panduan</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Sudah Punya Akun?</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection

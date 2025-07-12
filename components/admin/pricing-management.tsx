"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Save,
  DollarSign,
  Users,
  FileText,
  Shield,
  Building,
  Zap,
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { getPricingTiers, updatePricingTier, formatPrice } from "@/lib/firebase-pricing"
import type { SubscriptionTierInfo } from "@/lib/types"

export function PricingManagement() {
  const [tiers, setTiers] = useState<SubscriptionTierInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

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
      setMessage({ type: "error", text: "Gagal memuat data harga langganan" })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTier = async (tierId: string, updates: Partial<SubscriptionTierInfo>) => {
    try {
      setSaving(tierId)
      await updatePricingTier(tierId, updates)

      // Update local state
      setTiers((prev) => prev.map((tier) => (tier.id === tierId ? { ...tier, ...updates } : tier)))

      setMessage({ type: "success", text: `Berhasil memperbarui paket ${tierId}` })
    } catch (error) {
      console.error("Error updating tier:", error)
      setMessage({ type: "error", text: "Gagal memperbarui paket langganan" })
    } finally {
      setSaving(null)
    }
  }

  const handlePriceChange = (tierId: string, newPrice: string) => {
    const price = Number.parseInt(newPrice.replace(/\D/g, "")) || 0
    setTiers((prev) => prev.map((tier) => (tier.id === tierId ? { ...tier, price } : tier)))
  }

  const handleFeatureToggle = (tierId: string, featureKey: string, value: boolean | number) => {
    setTiers((prev) =>
      prev.map((tier) =>
        tier.id === tierId
          ? {
              ...tier,
              features: {
                ...tier.features,
                [featureKey]: value,
              },
            }
          : tier,
      ),
    )
  }

  const handleBasicInfoChange = (tierId: string, field: string, value: string | boolean) => {
    setTiers((prev) => prev.map((tier) => (tier.id === tierId ? { ...tier, [field]: value } : tier)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data harga langganan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Harga Langganan</h2>
          <p className="text-gray-600 mt-1">Kelola harga dan fitur untuk setiap paket langganan</p>
        </div>
        <Button onClick={loadPricingTiers} variant="outline">
          <TrendingUp className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {message && (
        <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    {tier.name}
                    {tier.popular && <Badge variant="secondary">Popular</Badge>}
                    {tier.recommended && <Badge className="bg-green-100 text-green-800">Recommended</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-1">{tier.description}</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Info Dasar</TabsTrigger>
                  <TabsTrigger value="features">Fitur</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${tier.id}`}>Nama Paket</Label>
                      <Input
                        id={`name-${tier.id}`}
                        value={tier.name}
                        onChange={(e) => handleBasicInfoChange(tier.id, "name", e.target.value)}
                        placeholder="Nama paket"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`price-${tier.id}`}>Harga (IDR)</Label>
                      <Input
                        id={`price-${tier.id}`}
                        value={tier.price === 0 ? "0" : tier.price.toLocaleString("id-ID")}
                        onChange={(e) => handlePriceChange(tier.id, e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`description-${tier.id}`}>Deskripsi</Label>
                    <Textarea
                      id={`description-${tier.id}`}
                      value={tier.description}
                      onChange={(e) => handleBasicInfoChange(tier.id, "description", e.target.value)}
                      placeholder="Deskripsi paket"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`popular-${tier.id}`}
                        checked={tier.popular || false}
                        onCheckedChange={(checked) => handleBasicInfoChange(tier.id, "popular", checked)}
                      />
                      <Label htmlFor={`popular-${tier.id}`}>Paket Popular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`recommended-${tier.id}`}
                        checked={tier.recommended || false}
                        onCheckedChange={(checked) => handleBasicInfoChange(tier.id, "recommended", checked)}
                      />
                      <Label htmlFor={`recommended-${tier.id}`}>Direkomendasikan</Label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>Maksimal Murid</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Switch
                          checked={tier.features.maxStudents === Number.POSITIVE_INFINITY}
                          onCheckedChange={(checked) =>
                            handleFeatureToggle(tier.id, "maxStudents", checked ? Number.POSITIVE_INFINITY : 50)
                          }
                        />
                        <Label className="text-sm">Unlimited</Label>
                        {tier.features.maxStudents !== Number.POSITIVE_INFINITY && (
                          <Input
                            type="number"
                            value={tier.features.maxStudents}
                            onChange={(e) =>
                              handleFeatureToggle(tier.id, "maxStudents", Number.parseInt(e.target.value) || 0)
                            }
                            className="w-20"
                            min="0"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Maksimal Ustadz</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Switch
                            checked={tier.features.maxUstadz === Number.POSITIVE_INFINITY}
                            onCheckedChange={(checked) =>
                              handleFeatureToggle(tier.id, "maxUstadz", checked ? Number.POSITIVE_INFINITY : 5)
                            }
                          />
                          <Label className="text-sm">Unlimited</Label>
                          {tier.features.maxUstadz !== Number.POSITIVE_INFINITY && (
                            <Input
                              type="number"
                              value={tier.features.maxUstadz}
                              onChange={(e) =>
                                handleFeatureToggle(tier.id, "maxUstadz", Number.parseInt(e.target.value) || 0)
                              }
                              className="w-16"
                              min="0"
                            />
                          )}
                        </div>
                      </div>

                      <div>
                        <Label>Maksimal Ustadzah</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Switch
                            checked={tier.features.maxUstadzah === Number.POSITIVE_INFINITY}
                            onCheckedChange={(checked) =>
                              handleFeatureToggle(tier.id, "maxUstadzah", checked ? Number.POSITIVE_INFINITY : 5)
                            }
                          />
                          <Label className="text-sm">Unlimited</Label>
                          {tier.features.maxUstadzah !== Number.POSITIVE_INFINITY && (
                            <Input
                              type="number"
                              value={tier.features.maxUstadzah}
                              onChange={(e) =>
                                handleFeatureToggle(tier.id, "maxUstadzah", Number.parseInt(e.target.value) || 0)
                              }
                              className="w-16"
                              min="0"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4 text-gray-500" />
                          <Label>Export PDF</Label>
                        </div>
                        <Switch
                          checked={tier.features.exportPDF}
                          onCheckedChange={(checked) => handleFeatureToggle(tier.id, "exportPDF", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-gray-500" />
                          <Label>Priority Support</Label>
                        </div>
                        <Switch
                          checked={tier.features.prioritySupport}
                          onCheckedChange={(checked) => handleFeatureToggle(tier.id, "prioritySupport", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <Label>Custom Reports</Label>
                        </div>
                        <Switch
                          checked={tier.features.customReports}
                          onCheckedChange={(checked) => handleFeatureToggle(tier.id, "customReports", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <Label>Multiple Institutions</Label>
                        </div>
                        <Switch
                          checked={tier.features.multipleInstitutions}
                          onCheckedChange={(checked) => handleFeatureToggle(tier.id, "multipleInstitutions", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-gray-500" />
                          <Label>API Access</Label>
                        </div>
                        <Switch
                          checked={tier.features.apiAccess}
                          onCheckedChange={(checked) => handleFeatureToggle(tier.id, "apiAccess", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-gray-500" />
                          <Label>Advanced Analytics</Label>
                        </div>
                        <Switch
                          checked={tier.features.advancedAnalytics}
                          onCheckedChange={(checked) => handleFeatureToggle(tier.id, "advancedAnalytics", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <Label>Bulk Import</Label>
                        </div>
                        <Switch
                          checked={tier.features.bulkImport}
                          onCheckedChange={(checked) => handleFeatureToggle(tier.id, "bulkImport", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Harga saat ini: <span className="font-semibold">{formatPrice(tier.price)}</span>
                </div>
                <Button
                  onClick={() => handleUpdateTier(tier.id, tier)}
                  disabled={saving === tier.id}
                  className="min-w-[100px]"
                >
                  {saving === tier.id ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

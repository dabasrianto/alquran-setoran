"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Crown, 
  Check, 
  Users, 
  FileText, 
  Headphones, 
  Building, 
  Code, 
  BarChart,
  Upload,
  Star,
  Zap
} from "lucide-react"
import { SUBSCRIPTION_TIERS, formatPrice, getTierFeaturesList } from "@/lib/subscription-tiers"

export default function TierManagement() {
  const tiers = Object.values(SUBSCRIPTION_TIERS)

  const getFeatureIcon = (feature: string) => {
    if (feature.includes("Murid") || feature.includes("Ustadz")) return <Users className="h-4 w-4" />
    if (feature.includes("PDF")) return <FileText className="h-4 w-4" />
    if (feature.includes("Support")) return <Headphones className="h-4 w-4" />
    if (feature.includes("Institution")) return <Building className="h-4 w-4" />
    if (feature.includes("API")) return <Code className="h-4 w-4" />
    if (feature.includes("Analytics")) return <BarChart className="h-4 w-4" />
    if (feature.includes("Import")) return <Upload className="h-4 w-4" />
    return <Check className="h-4 w-4" />
  }

  const getTierBadge = (tier: any) => {
    if (tier.popular) {
      return <Badge className="bg-blue-100 text-blue-800">Popular</Badge>
    }
    if (tier.recommended) {
      return <Badge className="bg-amber-100 text-amber-800">Recommended</Badge>
    }
    return null
  }

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case "basic":
        return <Users className="h-6 w-6 text-gray-600" />
      case "premium":
        return <Star className="h-6 w-6 text-blue-600" />
      case "pro":
        return <Zap className="h-6 w-6 text-purple-600" />
      case "institution":
        return <Crown className="h-6 w-6 text-amber-600" />
      default:
        return <Users className="h-6 w-6" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Subscription Tier Management</h3>
        <p className="text-muted-foreground">
          Kelola dan pantau berbagai tier langganan yang tersedia untuk pengguna
        </p>
      </div>

      {/* Tier Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`relative ${
              tier.popular ? "border-blue-200 bg-blue-50" : 
              tier.recommended ? "border-amber-200 bg-amber-50" : ""
            }`}
          >
            {getTierBadge(tier) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                {getTierBadge(tier)}
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-3">
                {getTierIcon(tier.id)}
              </div>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
              <div className="mt-4">
                <div className="text-3xl font-bold">
                  {formatPrice(tier.price, tier.currency)}
                </div>
                {tier.price > 0 && (
                  <div className="text-sm text-muted-foreground">
                    per {tier.billingPeriod === "monthly" ? "bulan" : "tahun"}
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {getTierFeaturesList(tier).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {getFeatureIcon(feature)}
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Max Students:</span>
                    <br />
                    {tier.features.maxStudents === Number.POSITIVE_INFINITY 
                      ? "Unlimited" 
                      : tier.features.maxStudents
                    }
                  </div>
                  <div>
                    <span className="font-medium">Max Teachers:</span>
                    <br />
                    {tier.features.maxUstadz === Number.POSITIVE_INFINITY 
                      ? "Unlimited" 
                      : `${tier.features.maxUstadz + tier.features.maxUstadzah}`
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Comparison Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  {tiers.map((tier) => (
                    <th key={tier.id} className="text-center py-3 px-4">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Max Students</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.features.maxStudents === Number.POSITIVE_INFINITY 
                        ? "∞" 
                        : tier.features.maxStudents
                      }
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Max Ustadz</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.features.maxUstadz === Number.POSITIVE_INFINITY 
                        ? "∞" 
                        : tier.features.maxUstadz
                      }
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Max Ustadzah</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.features.maxUstadzah === Number.POSITIVE_INFINITY 
                        ? "∞" 
                        : tier.features.maxUstadzah
                      }
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Export PDF</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.features.exportPDF ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Priority Support</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.features.prioritySupport ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Custom Reports</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.features.customReports ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">API Access</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.features.apiAccess ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Advanced Analytics</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.features.advancedAnalytics ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Bulk Import</td>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="text-center py-3 px-4">
                      {tier.features.bulkImport ? (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier) => (
              <div key={tier.id} className="text-center p-4 border rounded-lg">
                <div className="font-semibold">{tier.name}</div>
                <div className="text-2xl font-bold text-primary mt-2">
                  {formatPrice(tier.price, tier.currency)}
                </div>
                {tier.price > 0 && (
                  <div className="text-sm text-muted-foreground">
                    per {tier.billingPeriod === "monthly" ? "bulan" : "tahun"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
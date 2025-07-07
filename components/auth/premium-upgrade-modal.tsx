"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Crown, 
  Check, 
  CreditCard, 
  Smartphone, 
  Building, 
  QrCode,
  Info,
  Loader2,
  CheckCircle
} from "lucide-react"
import { SUBSCRIPTION_TIERS, formatPrice, getTierFeaturesList } from "@/lib/subscription-tiers"
import { createUpgradeRequest } from "@/lib/firebase-premium"
import type { SubscriptionTier } from "@/lib/types"

interface PremiumUpgradeModalProps {
  children: React.ReactNode
  targetTier?: SubscriptionTier
}

export default function PremiumUpgradeModal({ children, targetTier = "premium" }: PremiumUpgradeModalProps) {
  const { user, userProfile } = useAuth()
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(targetTier)
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const currentTier = (userProfile?.subscriptionType as SubscriptionTier) || "basic"
  const availableTiers = Object.values(SUBSCRIPTION_TIERS).filter(tier => 
    tier.id !== currentTier && tier.price > SUBSCRIPTION_TIERS[currentTier].price
  )

  const selectedTierInfo = SUBSCRIPTION_TIERS[selectedTier]

  const paymentMethods = [
    {
      id: "bank_transfer",
      name: "Transfer Bank",
      icon: Building,
      description: "Transfer ke rekening BCA/Mandiri",
      available: true,
    },
    {
      id: "ewallet",
      name: "E-Wallet",
      icon: Smartphone,
      description: "GoPay, OVO, DANA, ShopeePay",
      available: true,
    },
    {
      id: "qris",
      name: "QRIS",
      icon: QrCode,
      description: "Scan QR Code untuk pembayaran",
      available: true,
    },
    {
      id: "credit_card",
      name: "Kartu Kredit",
      icon: CreditCard,
      description: "Visa, Mastercard",
      available: false,
    },
  ]

  const handleUpgrade = async () => {
    if (!selectedMethod) {
      setError("Silakan pilih metode pembayaran")
      return
    }

    if (!user || !userProfile) {
      setError("User tidak terautentikasi")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await createUpgradeRequest(
        user.uid,
        user.email!,
        userProfile.displayName || user.email!,
        currentTier,
        selectedTier,
        selectedTierInfo.price
      )

      setSuccess(true)
    } catch (error: any) {
      console.error("Upgrade request error:", error)
      setError(error.message || "Gagal membuat request upgrade")
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setSelectedTier(targetTier)
    setSelectedMethod(null)
    setLoading(false)
    setSuccess(false)
    setError(null)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      resetModal()
    }
  }

  if (userProfile?.subscriptionType === "institution") {
    return null // Already at highest tier
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-600" />
            Upgrade ke Premium
          </DialogTitle>
          <DialogDescription>
            Tingkatkan akun Anda untuk mendapatkan fitur unlimited dan lebih banyak kemudahan
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Request Upgrade Berhasil!</h3>
            <p className="text-muted-foreground mb-6">
              Request upgrade Anda telah dikirim dan sedang diproses oleh admin. 
              Anda akan menerima notifikasi melalui email setelah request disetujui.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">Langkah Selanjutnya:</h4>
              <ol className="text-sm text-blue-700 text-left space-y-1">
                <li>1. Admin akan review request Anda dalam 1-2 hari kerja</li>
                <li>2. Setelah disetujui, Anda akan menerima link pembayaran</li>
                <li>3. Lakukan pembayaran sesuai instruksi</li>
                <li>4. Akun akan otomatis upgrade setelah pembayaran dikonfirmasi</li>
              </ol>
            </div>
            <Button onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current vs Target Tier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Paket Saat Ini</CardTitle>
                  <CardDescription>{SUBSCRIPTION_TIERS[currentTier].description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatPrice(SUBSCRIPTION_TIERS[currentTier].price)}
                  </div>
                  <div className="space-y-1">
                    {getTierFeaturesList(SUBSCRIPTION_TIERS[currentTier]).slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200 bg-amber-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-600" />
                    {selectedTierInfo.name}
                  </CardTitle>
                  <CardDescription>{selectedTierInfo.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold text-amber-600">
                    {formatPrice(selectedTierInfo.price)}
                  </div>
                  <div className="space-y-1">
                    {getTierFeaturesList(selectedTierInfo).slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className={feature.includes("Unlimited") ? "font-semibold" : ""}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tier Selection */}
            {availableTiers.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Pilih Paket Upgrade</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableTiers.map((tier) => (
                    <Card 
                      key={tier.id} 
                      className={`cursor-pointer transition-all ${
                        selectedTier === tier.id
                          ? "border-amber-500 bg-amber-50"
                          : "hover:border-amber-300"
                      }`}
                      onClick={() => setSelectedTier(tier.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="flex justify-center mb-2">
                          <Crown className="h-6 w-6 text-amber-600" />
                        </div>
                        <h4 className="font-medium">{tier.name}</h4>
                        <div className="text-xl font-bold text-amber-600 mt-2">
                          {formatPrice(tier.price)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          per {tier.billingPeriod === "monthly" ? "bulan" : "tahun"}
                        </p>
                        {tier.popular && (
                          <Badge className="mt-2 bg-blue-100 text-blue-800">Popular</Badge>
                        )}
                        {tier.recommended && (
                          <Badge className="mt-2 bg-amber-100 text-amber-800">Recommended</Badge>
                        )}
                      </CardContent>
                    Rp 750.000/bulan
                  ))}
                </div>
              </div>
            )}

            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Pilih Metode Pembayaran</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {paymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5"
                        : method.available
                          ? "hover:border-primary/50"
                          : "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => method.available && setSelectedMethod(method.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <method.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                      {!method.available && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Segera Hadir
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Development Notice */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Proses Upgrade:</strong> Setelah Anda submit request, admin akan review dan mengirimkan 
                link pembayaran dalam 1-2 hari kerja. Akun akan otomatis upgrade setelah pembayaran dikonfirmasi.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleUpgrade} 
                disabled={!selectedMethod || loading} 
                className="flex-1" 
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses Request...
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    Request Upgrade ke {selectedTierInfo.name}
                  </>
                )}
              </Button>
            </div>

            {/* Contact Info */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Butuh Bantuan?</h4>
              <div className="space-y-1 text-sm">
                <p>📱 WhatsApp: +62 812-3456-7890</p>
                <p>📧 Email: support@tasmi.app</p>
                <p className="text-muted-foreground mt-2">
                  Upgrade ke Premium untuk unlimited data - hanya Rp 750.000/bulan
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
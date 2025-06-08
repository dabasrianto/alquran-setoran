"use client"

import type React from "react"

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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Check, CreditCard, Smartphone, Building, Info } from "lucide-react"

interface UpgradeModalProps {
  children: React.ReactNode
}

export default function UpgradeModal({ children }: UpgradeModalProps) {
  const { userProfile } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  if (userProfile?.subscriptionType === "premium") {
    return null
  }

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
      id: "credit_card",
      name: "Kartu Kredit",
      icon: CreditCard,
      description: "Visa, Mastercard",
      available: false,
    },
  ]

  const handleUpgrade = async () => {
    if (!selectedMethod) return

    setLoading(true)
    try {
      // Simulasi proses pembayaran
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Untuk saat ini, tampilkan instruksi manual
      alert(
        `Metode pembayaran: ${paymentMethods.find((m) => m.id === selectedMethod)?.name}\n\n` +
          "Fitur upgrade otomatis sedang dalam pengembangan.\n" +
          "Silakan hubungi admin untuk upgrade manual:\n\n" +
          "WhatsApp: +62 812-3456-7890\n" +
          "Email: admin@tasmi.app\n\n" +
          "Sertakan email akun Anda untuk proses upgrade.",
      )
      setOpen(false)
    } catch (error) {
      console.error("Upgrade error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-600" />
            Upgrade ke Premium
          </DialogTitle>
          <DialogDescription>Nikmati fitur unlimited dengan berlangganan premium</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Paket Gratis</CardTitle>
                <CardDescription>Paket saat ini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">5 Murid</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">1 Ustadz</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">1 Ustadzah</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Dashboard & Laporan</span>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                    Gratis
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-600" />
                  Paket Premium
                </CardTitle>
                <CardDescription>Rekomendasi untuk institusi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold">Unlimited Murid</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold">Unlimited Ustadz</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold">Unlimited Ustadzah</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Dashboard & Laporan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Export PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Backup Otomatis</span>
                </div>
                <div className="mt-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-amber-600 text-white">
                    Rp 50.000/bulan
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pilih Metode Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground mt-2">
                        Segera Hadir
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Development Notice */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Info Pengembangan:</strong> Fitur upgrade otomatis sedang dalam pengembangan. Untuk saat ini,
              silakan hubungi admin untuk upgrade manual setelah melakukan pembayaran.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleUpgrade} disabled={!selectedMethod || loading} className="flex-1" size="lg">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade ke Premium
                </>
              )}
            </Button>
          </div>

          {/* Contact Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Kontak Admin untuk Upgrade Manual:</h4>
            <div className="space-y-1 text-sm">
              <p>📱 WhatsApp: +62 812-3456-7890</p>
              <p>📧 Email: admin@tasmi.app</p>
              <p className="text-muted-foreground mt-2">
                Sertakan email akun Anda: <strong>{userProfile?.email}</strong>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

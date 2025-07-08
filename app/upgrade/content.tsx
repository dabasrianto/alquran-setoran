"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Check, Users, BarChart, FileText, Shield, Info } from "lucide-react"
import UpgradeModal from "@/components/auth/upgrade-modal"
import LoginPage from "@/components/auth/login-page"

export default function UpgradeContent() {
  const { user, userProfile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  const isPremium = userProfile?.subscriptionType === "premium"

  if (isPremium) {
    return (
      <div className="text-center py-12">
        <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Anda Sudah Premium!</h2>
        <p className="text-muted-foreground mb-6">
          Terima kasih telah berlangganan premium. Nikmati semua fitur unlimited.
        </p>
        <Button asChild>
          <a href="/">Kembali ke Aplikasi</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <Crown className="h-16 w-16 text-amber-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Tingkatkan Pengalaman Anda</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Dapatkan akses unlimited untuk mengelola lebih banyak murid dan ustadz/ustadzah dengan fitur premium yang
          lengkap.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Paket Gratis
            </CardTitle>
            <CardDescription>Paket saat ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Maksimal 5 Murid</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Maksimal 1 Ustadz</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Maksimal 1 Ustadzah</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Dashboard & Laporan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Sinkronisasi Cloud</span>
              </div>
            </div>
            <div className="pt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Gratis
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-amber-50 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-amber-600 text-white px-4 py-1">Rekomendasi</Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              Paket Premium
            </CardTitle>
            <CardDescription>Untuk institusi & madrasah</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
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
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm">Priority Support</span>
              </div>
            </div>
            <div className="pt-4">
              <Badge className="bg-amber-600 text-white text-lg px-4 py-2">Rp 750.000/bulan</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <BarChart className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Analytics Lengkap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Dashboard interaktif dengan visualisasi data hafalan yang komprehensif dan real-time.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Export & Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Export data ke PDF, cetak laporan profesional untuk evaluasi dan dokumentasi.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle className="text-lg">Backup Otomatis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Data Anda aman dengan sistem backup otomatis dan recovery yang handal.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <UpgradeModal>
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3">
            <Crown className="mr-2 h-5 w-5" />
            Upgrade ke Premium Sekarang
          </Button>
        </UpgradeModal>
        <p className="text-sm text-muted-foreground mt-4">Mulai dari Rp 50.000/bulan • Batalkan kapan saja</p>
      </div>

      {/* Development Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Info Pengembangan:</strong> Sistem pembayaran otomatis sedang dalam pengembangan. Untuk upgrade saat
          ini, silakan hubungi admin melalui WhatsApp atau email yang tersedia di modal upgrade.
        </AlertDescription>
      </Alert>
    </div>
  )
}

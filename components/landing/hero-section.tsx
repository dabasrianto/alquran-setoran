"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Users, 
  BarChart, 
  Crown, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Shield,
  Cloud,
  Smartphone,
  GraduationCap,
  Target,
  TrendingUp
} from "lucide-react"

export default function HeroSection() {
  const handleTrialClick = () => {
    // This would typically redirect to registration
    window.location.href = "/register"
  }

  const handleUpgradeClick = () => {
    const phoneNumber = "+628977712345"
    const message = "Bismillah, afwan Admin saya ingin upgrade ke premium"
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  const handleProClick = () => {
    const phoneNumber = "+628977712345"
    const message = "Bismillah, afwan Admin saya ingin konsultasi paket pro"
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-primary rounded-full p-3 mr-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Platform Pembelajaran Tasmi'
              </h1>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
              Solusi Digital untuk Pembelajaran yang Lebih Efektif
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Platform pembelajaran digital terdepan untuk mengelola kelas, melacak progres murid, 
              dan meningkatkan efektivitas pembelajaran dengan teknologi modern.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={handleTrialClick}
              >
                <Play className="mr-2 h-5 w-5" />
                Mulai Trial Gratis 14 Hari
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleUpgradeClick}
              >
                <Crown className="mr-2 h-5 w-5" />
                Upgrade ke Premium
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-600">Murid Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-gray-600">Ustadz/Ustadzah</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fitur Unggulan Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dilengkapi dengan berbagai fitur canggih untuk mendukung pembelajaran yang efektif
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "Manajemen Kelas Digital",
                description: "Kelola kelas, murid, dan materi pembelajaran dalam satu platform terintegrasi"
              },
              {
                icon: TrendingUp,
                title: "Tracking Progress Pembelajaran",
                description: "Pantau perkembangan setiap murid dengan analitik yang detail dan real-time"
              },
              {
                icon: Cloud,
                title: "Resource Sharing",
                description: "Bagikan materi pembelajaran, tugas, dan sumber belajar dengan mudah"
              },
              {
                icon: BarChart,
                title: "Advanced Analytics",
                description: "Dashboard analitik lengkap untuk evaluasi dan peningkatan kualitas pembelajaran"
              },
              {
                icon: Shield,
                title: "Keamanan Data",
                description: "Database terenkripsi dengan backup otomatis untuk menjaga keamanan data"
              },
              {
                icon: Smartphone,
                title: "Mobile Responsive",
                description: "Akses dari berbagai perangkat dengan tampilan yang optimal"
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pilih Paket yang Sesuai
            </h2>
            <p className="text-lg text-gray-600">
              Mulai dengan trial gratis 14 hari, upgrade sesuai kebutuhan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Trial Plan */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Trial Gratis</CardTitle>
                <CardDescription>Coba semua fitur selama 7 hari</CardDescription>
                <div className="text-3xl font-bold mt-4">Gratis</div>
                <div className="text-gray-500">7 hari</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "1 ustadz",
                    "Maksimal 3 murid",
                    "Akses semua fitur dasar",
                    "Dukungan teknis",
                    "Manajemen kelas digital",
                    "Tracking progress pembelajaran"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full" onClick={handleTrialClick}>
                  Mulai Trial Gratis
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-amber-200 bg-amber-50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-amber-600 text-white px-4 py-1">
                  Rekomendasi
                </Badge>
              </div>
              <CardHeader className="text-center">
                <div className="bg-amber-100 text-amber-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <CardDescription>Untuk ustadz/ustadzah profesional</CardDescription>
                <div className="text-3xl font-bold mt-4">Rp 750.000</div>
                <div className="text-gray-500">Per bulan</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "Unlimited ustadz/ustadzah",
                    "Unlimited murid",
                    "Perpanjangan otomatis",
                    "Semua fitur premium",
                    "Resource sharing",
                    "Advanced analytics",
                    "Export data"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className={index < 2 ? "font-semibold" : ""}>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={handleUpgradeClick}>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Premium
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardHeader className="text-center">
                <div className="bg-purple-100 text-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>Untuk institusi dan madrasah</CardDescription>
                <div className="text-3xl font-bold mt-4">Rp 150.000</div>
                <div className="text-gray-500">Per bulan</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    "Maksimal 5 ustadz",
                    "Maksimal 15 murid",
                    "Perpanjangan otomatis",
                    "Semua fitur premium",
                    "Priority support",
                    "Export data",
                    "Untuk 1 nama lembaga"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className={index < 2 ? "font-semibold" : ""}>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleProClick}>
                  <Star className="mr-2 h-4 w-4" />
                  Upgrade Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Siap Meningkatkan Kualitas Pembelajaran?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ribuan ustadz dan ustadzah yang telah merasakan manfaatnya. Trial gratis 7 hari!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={handleTrialClick}
            >
              <Play className="mr-2 h-5 w-5" />
              Mulai Trial Gratis 7 Hari
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
              onClick={handleUpgradeClick}
            >
              <Crown className="mr-2 h-5 w-5" />
              Upgrade Premium
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
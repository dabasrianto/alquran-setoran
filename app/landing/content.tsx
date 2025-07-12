"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PricingSection from "@/components/landing/pricing-section"
import {
  BookOpen,
  Users,
  BarChart3,
  Shield,
  Smartphone,
  Cloud,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
} from "lucide-react"

export default function LandingContent() {
  const [showDemo, setShowDemo] = useState(false)

  const features = [
    {
      icon: BookOpen,
      title: "Manajemen Setoran Al-Quran",
      description: "Catat dan pantau progress hafalan setiap murid dengan mudah dan terstruktur",
    },
    {
      icon: Users,
      title: "Multi Penguji/Ustadz",
      description: "Kelola beberapa penguji sekaligus dengan sistem role yang fleksibel",
    },
    {
      icon: BarChart3,
      title: "Laporan & Analytics",
      description: "Dashboard lengkap dengan statistik dan laporan progress yang detail",
    },
    {
      icon: Shield,
      title: "Data Aman & Terpercaya",
      description: "Sistem keamanan tingkat enterprise dengan backup otomatis",
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Akses dari mana saja, kapan saja melalui smartphone atau komputer",
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description: "Data tersimpan aman di cloud dengan sinkronisasi real-time",
    },
  ]

  const testimonials = [
    {
      name: "Ustadz Ahmad",
      role: "Pengajar TPQ Al-Hidayah",
      content:
        "Aplikasi ini sangat membantu dalam mengelola setoran hafalan murid-murid. Interface yang mudah dan fitur yang lengkap.",
      rating: 5,
    },
    {
      name: "Ustadzah Fatimah",
      role: "Koordinator Tahfidz",
      content:
        "Dengan aplikasi ini, saya bisa memantau progress semua murid dengan lebih efisien. Laporan yang dihasilkan juga sangat detail.",
      rating: 5,
    },
    {
      name: "Ust. Muhammad",
      role: "Pengelola Madrasah",
      content:
        "Fitur multi penguji sangat membantu madrasah kami yang memiliki banyak ustadz. Koordinasi jadi lebih mudah.",
      rating: 5,
    },
  ]

  const handleGetStarted = () => {
    // Scroll to pricing section
    const pricingSection = document.getElementById("pricing-section")
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSelectPlan = (planId: string) => {
    // Redirect to registration with selected plan
    window.location.href = `/auth?plan=${planId}`
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            🚀 Platform Terdepan untuk Manajemen Tahfidz
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Kelola Setoran Al-Quran
            <br />
            dengan Mudah & Efisien
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Platform digital terpercaya untuk mengelola hafalan Al-Quran murid-murid Anda. Dilengkapi fitur lengkap,
            interface yang intuitif, dan sistem keamanan terbaik.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
              Mulai Gratis Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowDemo(true)} className="text-lg px-8">
              <Play className="mr-2 h-5 w-5" />
              Lihat Demo
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Gratis untuk 10 murid
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Setup dalam 5 menit
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Dukungan 24/7
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Fitur Lengkap untuk Kebutuhan Anda</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola setoran Al-Quran dalam satu platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dipercaya oleh Ribuan Ustadz</h2>
            <p className="text-lg text-muted-foreground">Lihat apa kata para pengguna tentang aplikasi kami</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-20 px-4 bg-muted/30">
        <PricingSection onSelectPlan={handleSelectPlan} />
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai Perjalanan Digital Anda?</h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ribuan ustadz yang telah mempercayai platform kami
          </p>
          <Button size="lg" variant="secondary" onClick={handleGetStarted} className="text-lg px-8">
            Mulai Gratis Hari Ini
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import PricingSection from "@/components/landing/pricing-section"

export default function LandingContent() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      icon: BookOpen,
      title: "Manajemen Hafalan",
      description: "Kelola progress hafalan Al-Quran murid dengan mudah dan terstruktur",
    },
    {
      icon: Users,
      title: "Multi Penguji",
      description: "Dukung banyak ustadz dan ustadzah untuk menguji hafalan murid",
    },
    {
      icon: BarChart3,
      title: "Laporan Lengkap",
      description: "Dapatkan insight mendalam tentang progress hafalan setiap murid",
    },
    {
      icon: Shield,
      title: "Data Aman",
      description: "Data tersimpan aman di cloud dengan backup otomatis",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Akses dari mana saja menggunakan smartphone atau tablet",
    },
    {
      icon: Cloud,
      title: "Sinkronisasi Real-time",
      description: "Data tersinkronisasi secara real-time antar perangkat",
    },
  ]

  const testimonials = [
    {
      name: "Ustadz Ahmad",
      role: "Pengajar TPQ Al-Hidayah",
      content:
        "Aplikasi ini sangat membantu dalam mengelola hafalan murid-murid saya. Interface yang mudah dipahami dan fitur yang lengkap.",
      rating: 5,
    },
    {
      name: "Ustadzah Fatimah",
      role: "Koordinator Tahfidz",
      content:
        "Dengan Tasmi, saya bisa memantau progress semua murid dengan mudah. Laporan yang dihasilkan sangat detail dan membantu.",
      rating: 5,
    },
    {
      name: "Ust. Muhammad",
      role: "Kepala Madrasah",
      content:
        "Sistem yang sangat baik untuk madrasah kami. Memudahkan koordinasi antar ustadz dan monitoring progress murid.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800">Platform Terdepan untuk Tahfidz</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Kelola Hafalan Al-Quran dengan <span className="text-blue-600">Mudah & Efektif</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Platform digital terpercaya untuk mengelola progress hafalan Al-Quran murid. Dilengkapi fitur lengkap
                untuk ustadz, madrasah, dan lembaga tahfidz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Mulai Gratis Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setIsVideoPlaying(true)}>
                  <Play className="mr-2 h-5 w-5" />
                  Lihat Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Gratis untuk 10 murid
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Setup dalam 5 menit
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Support 24/7
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Tasmi</h3>
                    <p className="text-gray-600">Interface yang intuitif dan mudah digunakan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Lengkap untuk Kebutuhan Tahfidz</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola hafalan Al-Quran dalam satu platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Dipercaya oleh Ribuan Ustadz</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Bergabunglah dengan komunitas ustadz dan madrasah yang telah merasakan manfaatnya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Siap Memulai Perjalanan Digital Tahfidz?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan ustadz dan madrasah yang telah mempercayai Tasmi untuk mengelola hafalan Al-Quran
            murid-murid mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Daftar Gratis Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Hubungi Tim Sales
            </Button>
          </div>
          <div className="mt-8 text-blue-100">
            <p>Gratis untuk 10 murid • Tidak perlu kartu kredit • Setup dalam 5 menit</p>
          </div>
        </div>
      </section>
    </div>
  )
}

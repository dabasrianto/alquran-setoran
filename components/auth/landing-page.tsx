"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Users, BarChart3, Shield, Star, ArrowRight, Heart } from "lucide-react"
import Link from "next/link"
import { PricingSection } from "@/components/landing/pricing-section"
import HeroSection from "@/components/landing/hero-section"
import Navbar from "@/components/landing/navbar"

const features = [
  {
    icon: BookOpen,
    title: "Manajemen Hafalan",
    description: "Kelola progress hafalan Al-Quran santri dengan mudah dan terstruktur",
  },
  {
    icon: Users,
    title: "Multi User",
    description: "Dukung multiple ustadz, ustadzah, dan santri dalam satu platform",
  },
  {
    icon: BarChart3,
    title: "Laporan Detail",
    description: "Dapatkan insight mendalam tentang progress hafalan dengan analytics",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    description: "Data tersimpan aman dengan backup otomatis dan keamanan tingkat enterprise",
  },
]

const testimonials = [
  {
    name: "Ustadz Ahmad",
    role: "Pengajar Tahfidz",
    content:
      "Aplikasi ini sangat membantu dalam memantau progress hafalan santri. Interface yang mudah digunakan dan fitur yang lengkap.",
    rating: 5,
  },
  {
    name: "Ustadzah Fatimah",
    role: "Koordinator Tahfidz",
    content:
      "Dengan Tasmi App, saya bisa dengan mudah melacak kemajuan setiap santri dan memberikan evaluasi yang tepat.",
    rating: 5,
  },
  {
    name: "KH. Abdullah",
    role: "Pimpinan Pondok",
    content: "Sistem yang sangat membantu dalam mengelola program tahfidz di pondok kami. Highly recommended!",
    rating: 5,
  },
]

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dilengkapi dengan fitur-fitur canggih untuk mendukung pembelajaran tahfidz yang efektif
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
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

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Testimoni Pengguna</h2>
            <p className="text-xl text-muted-foreground">Apa kata para ustadz dan ustadzah tentang Tasmi App</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Perjalanan Tahfidz Digital?</h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ribuan ustadz dan santri yang telah merasakan kemudahan Tasmi App
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Daftar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              <Link href="/panduan">Lihat Panduan</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Tasmi App
              </h3>
              <p className="text-gray-400">Platform digital terdepan untuk manajemen hafalan Al-Quran</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produk</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/panduan" className="hover:text-white">
                    Panduan
                  </Link>
                </li>
                <li>
                  <Link href="/landing" className="hover:text-white">
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link href="/landing" className="hover:text-white">
                    Harga
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/panduan" className="hover:text-white">
                    Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Daftar
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@tasmiapp.com</li>
                <li>WhatsApp: +62 812-3456-7890</li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 Tasmi App. All rights reserved.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span className="text-gray-400">Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-gray-400">for Islamic Education</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

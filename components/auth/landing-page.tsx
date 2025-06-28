"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Loader2,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import EmailAuthForm from "./email-auth-form"

export default function LandingPage() {
  const { signIn, error: authError } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      await signIn()
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Gagal login. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const displayError = error || authError

  const features = [
    {
      icon: Users,
      title: "Kelola Murid & Ustadz",
      description: "Tambahkan unlimited murid dan ustadz/ustadzah dengan paket premium"
    },
    {
      icon: BookOpen,
      title: "Tracking Hafalan",
      description: "Catat setoran hafalan per ayat dengan sistem penilaian yang detail"
    },
    {
      icon: BarChart,
      title: "Dashboard Analytics",
      description: "Visualisasi progres hafalan per surat, juz, dan statistik lengkap"
    },
    {
      icon: Cloud,
      title: "Sinkronisasi Cloud",
      description: "Data tersimpan aman di cloud dan tersinkronisasi real-time"
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Akses dari berbagai perangkat dengan tampilan responsif"
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description: "Menggunakan Firebase Google Cloud untuk keamanan data"
    }
  ]

  const steps = [
    {
      number: "1",
      title: "Daftar & Login",
      description: "Masuk dengan akun Google atau email untuk mulai menggunakan aplikasi"
    },
    {
      number: "2", 
      title: "Tambah Murid",
      description: "Daftarkan murid-murid yang akan dikelola hafalannya"
    },
    {
      number: "3",
      title: "Input Setoran",
      description: "Catat setiap setoran hafalan dengan detail surat, ayat, dan penilaian"
    },
    {
      number: "4",
      title: "Monitor Progres",
      description: "Pantau perkembangan hafalan melalui dashboard yang interaktif"
    }
  ]

  const testimonials = [
    {
      name: "Ustadz Ahmad",
      role: "Pengajar TPQ Al-Hidayah",
      content: "Aplikasi ini sangat membantu dalam mengelola hafalan 50+ murid saya. Dashboard yang detail memudahkan evaluasi progres.",
      rating: 5
    },
    {
      name: "Ustadzah Fatimah", 
      role: "Koordinator Tahfidz",
      content: "Fitur sinkronisasi cloud memungkinkan saya mengakses data dari mana saja. Sangat praktis untuk koordinasi dengan tim pengajar.",
      rating: 5
    },
    {
      name: "Ustadz Yusuf",
      role: "Pengelola Pondok Pesantren",
      content: "Sistem penilaian yang detail dan laporan yang komprehensif membantu evaluasi kualitas hafalan santri.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="bg-primary rounded-full p-3 mr-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Tasmi'
                </h1>
              </div>
              
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                Aplikasi Analisa Setoran Hafalan Quran
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                Platform digital terdepan untuk mengelola, memantau, dan menganalisis progres hafalan Al-Quran 
                dengan sistem yang terintegrasi dan user-friendly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setActiveTab("login")}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Mulai Sekarang
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setActiveTab("demo")}
                >
                  <BarChart className="mr-2 h-5 w-5" />
                  Lihat Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-gray-600">Murid Terdaftar</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-gray-600">Ustadz/Ustadzah</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-gray-600">Cloud Sync</div>
                </div>
              </div>
            </div>

            {/* Right Content - Login Form */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">Masuk ke Tasmi'</CardTitle>
                  <CardDescription>
                    Kelola hafalan Al-Quran dengan mudah dan efektif
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {displayError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{displayError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Email Auth Form */}
                  <EmailAuthForm onSuccess={() => {
                    // Login berhasil, akan redirect otomatis
                  }} />

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Atau</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleGoogleSignIn} 
                    disabled={loading} 
                    variant="outline" 
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Masuk dengan Google"
                    )}
                  </Button>

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">Paket Langganan:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>🆓 Gratis:</span>
                        <span>5 Murid, 1 Ustadz, 1 Ustadzah</span>
                      </div>
                      <div className="flex justify-between">
                        <span>⭐ Premium:</span>
                        <span>Unlimited - Rp 50.000/bulan</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fitur Unggulan Aplikasi Tasmi'
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dilengkapi dengan berbagai fitur canggih untuk memudahkan pengelolaan hafalan Al-Quran
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
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

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cara Menggunakan Aplikasi
            </h2>
            <p className="text-lg text-gray-600">
              Mulai kelola hafalan dalam 4 langkah mudah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-400 mx-auto mt-4 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Testimoni Pengguna
            </h2>
            <p className="text-lg text-gray-600">
              Apa kata para ustadz dan ustadzah tentang Tasmi'
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
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
              Mulai gratis, upgrade kapan saja sesuai kebutuhan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Paket Gratis</CardTitle>
                <CardDescription>Cocok untuk pengajar pemula</CardDescription>
                <div className="text-3xl font-bold mt-4">Rp 0</div>
                <div className="text-gray-500">Selamanya</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Maksimal 5 Murid</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>1 Ustadz & 1 Ustadzah</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Dashboard & Laporan</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Sinkronisasi Cloud</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" onClick={() => setActiveTab("login")}>
                  Mulai Gratis
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-amber-200 bg-amber-50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Rekomendasi
                </span>
              </div>
              <CardHeader className="text-center">
                <div className="bg-amber-100 text-amber-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Paket Premium</CardTitle>
                <CardDescription>Untuk institusi & madrasah</CardDescription>
                <div className="text-3xl font-bold mt-4">Rp 50.000</div>
                <div className="text-gray-500">Per bulan</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="font-semibold">Unlimited Murid</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="font-semibold">Unlimited Ustadz/Ustadzah</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Dashboard & Laporan</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Export PDF</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Priority Support</span>
                  </div>
                </div>
                <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => setActiveTab("login")}>
                  <Crown className="mr-2 h-4 w-4" />
                  Mulai Premium
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
            Siap Mengelola Hafalan dengan Lebih Efektif?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ribuan ustadz dan ustadzah yang telah mempercayai Tasmi'
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => setActiveTab("login")}
          >
            <Play className="mr-2 h-5 w-5" />
            Mulai Sekarang - Gratis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-primary rounded-full p-2 mr-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Tasmi'</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Platform digital terdepan untuk mengelola hafalan Al-Quran dengan sistem yang terintegrasi dan mudah digunakan.
              </p>
              <p className="text-gray-400 text-sm">
                © 2024 Tasmi'. Semua hak dilindungi.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Fitur</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Kelola Murid</li>
                <li>Tracking Hafalan</li>
                <li>Dashboard Analytics</li>
                <li>Export Laporan</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Panduan Penggunaan</li>
                <li>FAQ</li>
                <li>Kontak Support</li>
                <li>Tutorial Video</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
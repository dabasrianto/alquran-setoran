"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, BookOpen, AlertCircle, Mail, ArrowLeft } from "lucide-react"
import LandingPage from "./landing-page"

export default function LoginPage() {
  const { signIn, error: authError } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSimpleLogin, setShowSimpleLogin] = useState(false)
  
  // Email login states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = async () => {
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("Fitur login email sedang dalam pengembangan. Silakan gunakan login Google untuk saat ini.")
  }

  const displayError = error || authError

  // Show landing page by default, simple login as fallback
  if (!showSimpleLogin) {
    return <LandingPage />
  }

  // Simple login page (fallback)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSimpleLogin(false)}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Selamat Datang di Tasmi'</CardTitle>
          <CardDescription>Aplikasi Analisa Setoran Hafalan Quran</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              {displayError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{displayError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Masuk...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Masuk dengan Email
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Atau</span>
                </div>
              </div>

              <Button onClick={handleSignIn} disabled={loading} variant="outline" className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Masuk dengan Google"
                )}
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Untuk saat ini, silakan gunakan login Google untuk mendaftar akun baru.
                </AlertDescription>
              </Alert>

              <Button onClick={handleSignIn} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Daftar dengan Google"
                )}
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="font-semibold text-amber-800 mb-2">Paket Langganan:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>🆓 Gratis:</span>
                <span>1 Ustadz, 1 Ustadzah, 5 Murid</span>
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
  )
}
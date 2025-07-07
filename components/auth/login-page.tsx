"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, BookOpen, AlertCircle, ArrowLeft } from "lucide-react"
import LandingPage from "./landing-page"
import { useRouter } from "next/navigation"
import EmailAuthForm from "./email-auth-form"

export default function LoginPage() {
  const { signIn, error: authError } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSimpleLogin, setShowSimpleLogin] = useState(false)
  const [showEmailAuth, setShowEmailAuth] = useState(false)

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

  // Show landing page by default
  if (!showSimpleLogin && !showEmailAuth) {
    router.push("/")
    return null
  }

  // Show email auth form
  if (showEmailAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowEmailAuth(false)}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Masuk ke Tasmi'</CardTitle>
            <CardDescription>Kelola hafalan Al-Quran dengan mudah dan efektif</CardDescription>
          </CardHeader>
          <CardContent>
            <EmailAuthForm onSuccess={() => {
              // Login berhasil, akan redirect otomatis oleh auth context
            }} />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Atau</span>
              </div>
            </div>

            <Button onClick={handleGoogleSignIn} disabled={loading} variant="outline" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Masuk dengan Google"
              )}
            </Button>

            {displayError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
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
        <CardContent className="space-y-4">
          <Button onClick={() => setShowEmailAuth(true)} className="w-full">
            Masuk dengan Email
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Atau</span>
            </div>
          </div>

          <Button onClick={handleGoogleSignIn} disabled={loading} variant="outline" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Masuk dengan Google"
            )}
          </Button>

          {displayError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
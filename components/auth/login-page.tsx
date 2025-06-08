"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, BookOpen, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const { signIn, error: authError } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const displayError = error || authError

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Selamat Datang di Tasmi'</CardTitle>
          <CardDescription>Aplikasi Analisa Setoran Hafalan Quran</CardDescription>
        </CardHeader>
        <CardContent>
          {displayError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleSignIn} disabled={loading} className="w-full" size="lg">
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

          {/* Development info */}
       
        </CardContent>
      </Card>
    </div>
  )
}

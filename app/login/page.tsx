"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, BookOpen, AlertCircle } from "lucide-react"
import EmailAuthForm from "@/components/auth/email-auth-form"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const { signIn, error: authError, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If user is already logged in, redirect to home
  if (user) {
    router.push("/")
    return null
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      await signIn()
      router.push("/")
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
          <Link href="/" className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-700">
            ← Kembali ke Beranda
          </Link>
          
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Masuk ke Tasmi'</CardTitle>
          <CardDescription>Kelola hafalan Al-Quran dengan mudah dan efektif</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailAuthForm onSuccess={() => {
            router.push("/")
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
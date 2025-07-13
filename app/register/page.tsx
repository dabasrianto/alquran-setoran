"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, BookOpen, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { EmailAuthForm } from '@/components/auth/email-auth-form'

export default function RegisterPage() {
  const { signUpEmail, error: authError, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // If user is already logged in, redirect to home
  if (user) {
    router.push("/")
    return null
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email || !password || !confirmPassword || !displayName) {
        throw new Error("Semua field harus diisi")
      }

      if (password !== confirmPassword) {
        throw new Error("Password dan konfirmasi password tidak sama")
      }

      if (password.length < 6) {
        throw new Error("Password minimal 6 karakter")
      }

      if (displayName.length < 2) {
        throw new Error("Nama lengkap minimal 2 karakter")
      }

      await signUpEmail(email, password, displayName)
      router.push("/")
    } catch (error: any) {
      setError(error.message)
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
          <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
          <CardDescription>Buat akun untuk mulai menggunakan Tasmi'</CardDescription>
        </CardHeader>
        <CardContent>
          {displayError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <EmailAuthForm type="register" />

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

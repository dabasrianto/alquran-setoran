"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, BookOpen, AlertCircle } from 'lucide-react'
import EmailAuthForm from "@/components/auth/email-auth-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LoginPage from '@/components/auth/login-page'

export default function Login() {
  return <LoginPage />
}

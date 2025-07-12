"use client"

import TasmiApp from "@/components/tasmi-app"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, Users, BookOpen, Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import LandingPage from "@/app/landing/page"
import SubscriptionBanner from "@/components/auth/subscription-banner"
import SubscriptionGuard from "@/components/subscription/subscription-guard"
import UserMenu from "@/components/auth/user-menu"

export default function Home() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return (
    <SubscriptionGuard>
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6 md:mb-8">
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">Analisa Setoran Hafalan Quran</h1>
            <div className="hidden md:flex gap-2 items-center">
              <Button asChild variant="outline">
                <Link href="/penguji">
                  <Users className="mr-2 h-4 w-4" />
                  Ustadz/Ustadzah
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/panduan">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Panduan
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">
                  <BarChart className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="destructive">
                  <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <UserMenu />
            </div>
          </div>
          <SubscriptionBanner />
          <TasmiApp />
        </div>
      </main>
    </SubscriptionGuard>
  )
}

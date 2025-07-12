"use client"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import { LandingNavbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { PricingSection } from "@/components/landing/pricing-section"

export function LandingPage() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <PricingSection />
      </main>
      <footer className="bg-gray-100 p-4 text-center dark:bg-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">&copy; 2023 Tasmi App. All rights reserved.</p>
      </footer>
    </div>
  )
}

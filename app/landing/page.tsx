import { LandingNavbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { PricingSection } from '@/components/landing/pricing-section'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <PricingSection />
      </main>
    </div>
  )
}

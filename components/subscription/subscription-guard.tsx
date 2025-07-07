"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserSubscription, createTrialSubscription } from "@/lib/firebase-subscription"
import { getSubscriptionStatus } from "@/lib/subscription-system"
import type { UserSubscription } from "@/lib/subscription-system"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Clock, AlertTriangle } from "lucide-react"

interface SubscriptionGuardProps {
  children: React.ReactNode
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const { user, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        let userSubscription = await getUserSubscription(user.uid)

        // If no subscription exists, create a trial
        if (!userSubscription) {
          console.log("No subscription found, creating trial for user:", user.uid)
          userSubscription = await createTrialSubscription(user.uid)
        }

        setSubscription(userSubscription)
        setError(null)
      } catch (err: any) {
        console.error("Error loading subscription:", err)
        setError(err.message || "Failed to load subscription")
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      loadSubscription()
    } else if (!authLoading && !user) {
      setLoading(false)
    }
  }, [user, authLoading])

  const handleUpgradeClick = () => {
    const phoneNumber = "+628977712345"
    const message = "Bismillah, afwan Admin saya ingin upgrade ke premium"
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  const handleProUpgradeClick = () => {
    const phoneNumber = "+628977712345"
    const message = "Bismillah, afwan Admin saya ingin upgrade ke paket pro"
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">Subscription Required</CardTitle>
            <CardDescription>Unable to load subscription information</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const status = getSubscriptionStatus(subscription)

  // If trial expired, show upgrade screen
  if (!status.canUseApp) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Clock className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-red-600">Trial Berakhir</CardTitle>
            <CardDescription className="text-lg">
              Trial 7 hari Anda telah berakhir. Pilih paket premium untuk melanjutkan menggunakan aplikasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Premium Plan */}
              <Card className="border-2 border-amber-200 bg-amber-50">
                <CardHeader className="text-center pb-2">
                  <Crown className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <CardTitle className="text-xl">Premium</CardTitle>
                  <div className="text-2xl font-bold text-amber-600">Rp 750.000</div>
                  <div className="text-sm text-muted-foreground">Per bulan</div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1 text-sm">
                    <div>✓ Unlimited ustadz/ustadzah</div>
                    <div>✓ Unlimited murid</div>
                    <div>✓ Semua fitur premium</div>
                    <div>✓ Export data</div>
                    <div>✓ Untuk 1 nama lembaga</div>
                  </div>
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700" 
                    onClick={handleUpgradeClick}
                  >
                    Upgrade Premium
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader className="text-center pb-2">
                  <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-xl">Pro</CardTitle>
                  <div className="text-2xl font-bold text-purple-600">Rp 150.000</div>
                  <div className="text-sm text-muted-foreground">Per bulan</div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1 text-sm">
                    <div>✓ Maksimal 5 ustadz</div>
                    <div>✓ Maksimal 15 murid</div>
                    <div>✓ Priority support</div>
                    <div>✓ Custom reports</div>
                  </div>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    onClick={handleProUpgradeClick}
                  >
                    Upgrade Pro
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Hubungi admin melalui WhatsApp untuk proses upgrade
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show warning if trial is ending soon
  if (status.needsUpgrade && subscription.subscriptionType === "trial") {
    return (
      <div className="min-h-screen">
        <Alert className="m-4 border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{status.message}</span>
            <Button size="sm" onClick={handleUpgradeClick} className="bg-orange-600 hover:bg-orange-700">
              Upgrade Sekarang
            </Button>
          </AlertDescription>
        </Alert>
        {children}
      </div>
    )
  }

  // Allow access to app
  return <>{children}</>
}

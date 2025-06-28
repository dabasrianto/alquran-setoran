"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, AlertTriangle, Clock } from "lucide-react"
import { getUserSubscription } from "@/lib/firebase-subscription"
import { isTrialExpired, getDaysRemaining } from "@/lib/subscription-system"
import type { UserSubscription } from "@/lib/subscription-system"

interface SubscriptionGuardProps {
  children: React.ReactNode
  requiredFeature?: 'add_teacher' | 'add_student'
}

export default function SubscriptionGuard({ children, requiredFeature }: SubscriptionGuardProps) {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user?.uid) {
        setLoading(false)
        return
      }

      try {
        const userSubscription = await getUserSubscription(user.uid)
        setSubscription(userSubscription)
      } catch (error) {
        console.error("Error loading subscription:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()
  }, [user?.uid])

  const handleUpgradeClick = () => {
    const phoneNumber = "+628977712345"
    const message = "Bismillah, afwan Admin saya ingin upgrade ke premium"
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Gagal memuat informasi langganan. Silakan refresh halaman.
        </AlertDescription>
      </Alert>
    )
  }

  // Check if trial has expired
  if (subscription.subscriptionType === 'trial' && isTrialExpired(subscription)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-red-600">Trial Berakhir</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Trial period 7 hari Anda telah berakhir. Upgrade ke Premium untuk melanjutkan menggunakan aplikasi.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">Premium Benefits:</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Maksimal 3 ustadz</li>
                <li>• Maksimal 10 murid</li>
                <li>• Akses seumur hidup</li>
                <li>• Semua fitur premium</li>
              </ul>
              <p className="text-sm font-semibold text-amber-800 mt-2">
                Hanya Rp 150.000 (sekali bayar)
              </p>
            </div>

            <Button onClick={handleUpgradeClick} className="w-full">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade ke Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if subscription is inactive
  if (!subscription.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-red-600">Akun Tidak Aktif</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Akun Anda saat ini tidak aktif. Silakan hubungi admin untuk mengaktifkan kembali.
            </p>
            <Button onClick={handleUpgradeClick} className="w-full">
              Hubungi Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show trial warning if less than 2 days remaining
  if (subscription.subscriptionType === 'trial') {
    const daysRemaining = getDaysRemaining(subscription)
    if (daysRemaining <= 2) {
      return (
        <div className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  Trial Anda akan berakhir dalam {daysRemaining} hari. Upgrade sekarang untuk melanjutkan akses.
                </span>
                <Button size="sm" onClick={handleUpgradeClick}>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade
                </Button>
              </div>
            </AlertDescription>
          </Alert>
          {children}
        </div>
      )
    }
  }

  return <>{children}</>
}
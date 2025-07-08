"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserSubscription } from "@/lib/firebase-subscription"
import { getSubscriptionStatus, SUBSCRIPTION_PLANS } from "@/lib/subscription-system"
import type { UserSubscription } from "@/lib/subscription-system"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Clock, Users, GraduationCap } from "lucide-react"

export default function SubscriptionBanner() {
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
        console.error("Error loading subscription for banner:", error)
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

  if (loading || !subscription) {
    return null
  }

  const status = getSubscriptionStatus(subscription)
  const plan = SUBSCRIPTION_PLANS[subscription.subscriptionType]

  // Don't show banner for premium/pro users
  if (subscription.subscriptionType !== "trial") {
    return null
  }

  // Show trial banner
  return (
    <Card className="border-blue-200 bg-blue-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Trial Gratis</h3>
              {status.daysRemaining !== undefined && (
                <span className="text-sm text-blue-600 font-medium">
                  {status.daysRemaining} hari tersisa
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Murid: {plan.limits.maxStudents}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span>Ustadz: {plan.limits.maxUstadz}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span>Ustadzah: {plan.limits.maxUstadzah}</span>
              </div>
            </div>
            <p className="text-xs text-blue-700">
              Upgrade ke Premium untuk unlimited data - hanya Rp 50.000/bulan
            </p>
          </div>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleUpgradeClick}
          >
            <Crown className="h-4 w-4 mr-1" />
            Upgrade Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

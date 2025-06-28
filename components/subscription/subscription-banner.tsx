"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Users, GraduationCap, Clock, AlertTriangle } from "lucide-react"
import { getUserSubscription } from "@/lib/firebase-subscription"
import { getDaysRemaining, isTrialExpired } from "@/lib/subscription-system"
import type { UserSubscription } from "@/lib/subscription-system"

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

  if (loading || !subscription) {
    return null
  }

  // Don't show banner for premium/unlimited users
  if (subscription.subscriptionType === 'premium' || subscription.subscriptionType === 'unlimited') {
    return null
  }

  const daysRemaining = getDaysRemaining(subscription)
  const expired = isTrialExpired(subscription)
  const teacherUsage = (subscription.currentTeachers / subscription.maxTeachers) * 100
  const studentUsage = (subscription.currentStudents / subscription.maxStudents) * 100

  return (
    <Card className={`border-2 ${expired ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'} mb-6`}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {expired ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <Clock className="h-5 w-5 text-amber-600" />
              )}
              <h3 className={`font-semibold ${expired ? 'text-red-800' : 'text-amber-800'}`}>
                {expired ? 'Trial Berakhir' : `Trial - ${daysRemaining} hari tersisa`}
              </h3>
              <Badge variant={expired ? "destructive" : "secondary"}>
                {subscription.subscriptionType.toUpperCase()}
              </Badge>
            </div>

            {expired ? (
              <p className="text-red-700 text-sm mb-3">
                Trial period Anda telah berakhir. Upgrade ke Premium untuk melanjutkan menggunakan aplikasi.
              </p>
            ) : (
              <div className="space-y-2 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4 text-amber-600" />
                        Ustadz: {subscription.currentTeachers}/{subscription.maxTeachers}
                      </span>
                      <span className="text-xs text-amber-700">{Math.round(teacherUsage)}%</span>
                    </div>
                    <Progress value={teacherUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-amber-600" />
                        Murid: {subscription.currentStudents}/{subscription.maxStudents}
                      </span>
                      <span className="text-xs text-amber-700">{Math.round(studentUsage)}%</span>
                    </div>
                    <Progress value={studentUsage} className="h-2" />
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-amber-700">
              Upgrade ke Premium untuk unlimited ustadz & murid - hanya Rp 150.000 (akses seumur hidup)
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              size="sm" 
              className="bg-amber-600 hover:bg-amber-700" 
              onClick={handleUpgradeClick}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Premium
            </Button>
            {subscription.subscriptionType === 'trial' && !expired && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleUpgradeClick}
                className="text-xs"
              >
                Konsultasi Unlimited
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
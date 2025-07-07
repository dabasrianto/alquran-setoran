"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { useFirebaseData } from "@/hooks/use-firebase-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Users, GraduationCap, Clock } from "lucide-react"

export default function SubscriptionBanner() {
  const { subscription, status } = useSubscription()
  const { students, pengujis } = useFirebaseData()

  if (!subscription || subscription.subscriptionType !== "trial") {
    return null
  }

  const ustadzCount = pengujis.filter((p) => p.gender === "L").length
  const ustadzahCount = pengujis.filter((p) => p.gender === "P").length

  const handleUpgradeClick = () => {
    const phoneNumber = "+628977712345"
    const message = "Bismillah, afwan Admin saya ingin upgrade ke premium"
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Trial Gratis</h3>
              {status?.daysRemaining !== undefined && (
                <span className="text-sm text-blue-600 font-medium">
                  {status.daysRemaining} hari tersisa
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Murid: {students.length}/3</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span>Ustadz: {ustadzCount}/1</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span>Ustadzah: {ustadzahCount}/1</span>
              </div>
            </div>
            <p className="text-xs text-blue-700">
              Upgrade ke Premium untuk unlimited data - hanya Rp 750.000/bulan
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
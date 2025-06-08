"use client"

import { useAuth } from "@/contexts/auth-context"
import { useFirebaseData } from "@/hooks/use-firebase-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Users, GraduationCap } from "lucide-react"

export default function SubscriptionBanner() {
  const { userProfile } = useAuth()
  const { subscriptionStatus } = useFirebaseData()

  if (!userProfile || userProfile.subscriptionType === "premium") {
    return null
  }

  if (!subscriptionStatus) {
    return null
  }

  const { limits } = subscriptionStatus

  const handleUpgradeClick = () => {
    alert(
      "Upgrade ke Premium!\n\n" +
        "Untuk upgrade saat ini, silakan hubungi admin:\n\n" +
        "📱 WhatsApp: +628977712345\n" +
        "📧 Email: akhisejahtera@gmail.com\n\n" +
        `Sertakan email akun Anda: ${userProfile.email}\n\n` +
        "Harga: Rp 50.000/bulan\n" +
        "Benefit: Unlimited murid, ustadz, dan ustadzah",
    )
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">Akun Gratis</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-amber-600" />
                <span>Murid: {subscriptionStatus.limits.maxStudents}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-amber-600" />
                <span>Ustadz: {limits.maxUstadz}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4 text-amber-600" />
                <span>Ustadzah: {limits.maxUstadzah}</span>
              </div>
            </div>
            <p className="text-xs text-amber-700">Upgrade ke Premium untuk unlimited data - hanya Rp 50.000/bulan</p>
          </div>
          <Button size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={handleUpgradeClick}>
            Upgrade Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

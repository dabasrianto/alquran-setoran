'use client'

import { useAuth } from '@/contexts/auth-context'
import { useSubscription } from '@/hooks/use-subscription'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Loader2, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PricingPlan, getPricingPlans } from '@/data/pricing-plans'

const SubscriptionBanner = () => {
  const { currentUser, authLoading } = useAuth()
  const { userSubscription, subscriptionLoading } = useSubscription()
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([])
  const [loadingPricing, setLoadingPricing] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPricing(true)
      const plans = await getPricingPlans()
      setPricingPlans(plans)
      setLoadingPricing(false)
    }
    fetchPlans()
  }, [])

  if (authLoading || subscriptionLoading || loadingPricing) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!currentUser) {
    return null // Don't show banner if not logged in
  }

  const currentPlan = pricingPlans.find(plan => plan.id === userSubscription?.tier)

  if (userSubscription?.status === 'active' && currentPlan?.price === 0) {
    return (
      <Alert className="mb-4 bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-100">
        <Info className="h-4 w-4" />
        <AlertTitle>Paket Anda Saat Ini: {currentPlan?.name || 'Gratis'}</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>Anda sedang menggunakan paket gratis. Upgrade untuk fitur lebih!</span>
          <Button asChild size="sm" className="ml-4">
            <Link href="/upgrade">Upgrade Sekarang</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (userSubscription?.status === 'active') {
    return (
      <Alert className="mb-4 bg-green-100 border-green-400 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-100">
        <Info className="h-4 w-4" />
        <AlertTitle>Paket Anda Saat Ini: {currentPlan?.name || 'Premium'}</AlertTitle>
        <AlertDescription>
          Langganan Anda aktif hingga {userSubscription.endDate?.toLocaleDateString()}.
        </AlertDescription>
      </Alert>
    )
  }

  if (userSubscription?.status === 'pending') {
    return (
      <Alert className="mb-4 bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-100">
        <Info className="h-4 w-4" />
        <AlertTitle>Permintaan Upgrade Tertunda</AlertTitle>
        <AlertDescription>
          Permintaan upgrade Anda ke paket {userSubscription.tier} sedang diproses.
          Kami akan memberitahu Anda setelah disetujui.
        </AlertDescription>
      </Alert>
    )
  }

  if (userSubscription?.status === 'inactive' || userSubscription?.status === 'cancelled') {
    return (
      <Alert className="mb-4 bg-red-100 border-red-400 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-100">
        <Info className="h-4 w-4" />
        <AlertTitle>Langganan Tidak Aktif</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>Langganan Anda saat ini tidak aktif atau telah dibatalkan.</span>
          <Button asChild size="sm" className="ml-4">
            <Link href="/upgrade">Perbarui Langganan</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return null // Default: no banner
}

export default SubscriptionBanner

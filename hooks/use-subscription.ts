"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserSubscription, createTrialSubscription } from "@/lib/firebase-subscription"
import { getSubscriptionStatus, canAddStudent, canAddUstadz, canAddUstadzah, SUBSCRIPTION_PLANS } from "@/lib/subscription-system"
import type { UserSubscription } from "@/lib/subscription-system"

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSubscription = async () => {
    if (!user?.uid) {
      setSubscription(null)
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

  useEffect(() => {
    loadSubscription()
  }, [user?.uid])

  const checkLimits = (currentCounts: {
    students: number
    ustadz: number
    ustadzah: number
  }) => {
    if (!subscription) {
      return {
        canAddStudent: false,
        canAddUstadz: false,
        canAddUstadzah: false,
        limits: SUBSCRIPTION_PLANS.trial.limits,
      }
    }

    const status = getSubscriptionStatus(subscription)
    if (!status.canUseApp) {
      return {
        canAddStudent: false,
        canAddUstadz: false,
        canAddUstadzah: false,
        limits: SUBSCRIPTION_PLANS[subscription.subscriptionType].limits,
      }
    }

    return {
      canAddStudent: canAddStudent(subscription, currentCounts.students),
      canAddUstadz: canAddUstadz(subscription, currentCounts.ustadz),
      canAddUstadzah: canAddUstadzah(subscription, currentCounts.ustadzah),
      limits: SUBSCRIPTION_PLANS[subscription.subscriptionType].limits,
    }
  }

  return {
    subscription,
    loading,
    error,
    status: subscription ? getSubscriptionStatus(subscription) : null,
    checkLimits,
    refreshSubscription: loadSubscription,
  }
}

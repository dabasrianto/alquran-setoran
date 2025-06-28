"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getUserSubscription, updateUserCounts } from "@/lib/firebase-subscription"
import { checkSubscriptionLimits, isTrialExpired } from "@/lib/subscription-system"
import type { UserSubscription } from "@/lib/subscription-system"

interface SubscriptionMiddlewareProps {
  children: React.ReactNode
}

export function SubscriptionMiddleware({ children }: SubscriptionMiddlewareProps) {
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
        
        // Update user counts based on actual data
        // This would typically be done when data changes
        // For now, we'll just ensure the subscription exists
        
      } catch (error) {
        console.error("Error loading subscription:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()
  }, [user?.uid])

  // Provide subscription context to children
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}

// Hook to use subscription data
export function useSubscription() {
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

  const canAddTeacher = () => {
    if (!subscription) return { canAdd: false, message: "Subscription not loaded" }
    return checkSubscriptionLimits(subscription, 'add_teacher')
  }

  const canAddStudent = () => {
    if (!subscription) return { canAdd: false, message: "Subscription not loaded" }
    return checkSubscriptionLimits(subscription, 'add_student')
  }

  const isExpired = () => {
    if (!subscription) return false
    return isTrialExpired(subscription)
  }

  return {
    subscription,
    loading,
    canAddTeacher,
    canAddStudent,
    isExpired,
    refreshSubscription: async () => {
      if (user?.uid) {
        const userSubscription = await getUserSubscription(user.uid)
        setSubscription(userSubscription)
      }
    }
  }
}
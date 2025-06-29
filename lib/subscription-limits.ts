import { SUBSCRIPTION_PLANS } from "./subscription-system"
import type { SubscriptionType } from "./subscription-system"

export interface SubscriptionLimits {
  maxStudents: number
  maxUstadz: number
  maxUstadzah: number
}

export const checkSubscriptionLimits = (
  subscriptionType: SubscriptionType,
  currentCounts: {
    students: number
    ustadz: number
    ustadzah: number
  },
): {
  canAddStudent: boolean
  canAddUstadz: boolean
  canAddUstadzah: boolean
  limits: SubscriptionLimits
} => {
  const limits = SUBSCRIPTION_PLANS[subscriptionType].limits

  return {
    canAddStudent: currentCounts.students < limits.maxStudents,
    canAddUstadz: currentCounts.ustadz < limits.maxUstadz,
    canAddUstadzah: currentCounts.ustadzah < limits.maxUstadzah,
    limits: {
      maxStudents: limits.maxStudents,
      maxUstadz: limits.maxUstadz,
      maxUstadzah: limits.maxUstadzah,
    },
  }
}
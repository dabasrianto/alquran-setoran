export interface SubscriptionLimits {
  maxStudents: number
  maxUstadz: number
  maxUstadzah: number
}

export const SUBSCRIPTION_LIMITS: Record<"free" | "premium", SubscriptionLimits> = {
  free: {
    maxStudents: 5,
    maxUstadz: 1,
    maxUstadzah: 1,
  },
  premium: {
    maxStudents: Number.POSITIVE_INFINITY,
    maxUstadz: Number.POSITIVE_INFINITY,
    maxUstadzah: Number.POSITIVE_INFINITY,
  },
}

export const checkSubscriptionLimits = (
  subscriptionType: "free" | "premium",
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
  const limits = SUBSCRIPTION_LIMITS[subscriptionType]

  return {
    canAddStudent: currentCounts.students < limits.maxStudents,
    canAddUstadz: currentCounts.ustadz < limits.maxUstadz,
    canAddUstadzah: currentCounts.ustadzah < limits.maxUstadzah,
    limits,
  }
}

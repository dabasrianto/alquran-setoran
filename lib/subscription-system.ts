export type SubscriptionType = "trial" | "premium" | "pro"

export interface SubscriptionLimits {
  maxStudents: number
  maxUstadz: number
  maxUstadzah: number
  trialDays?: number
}

export interface UserSubscription {
  id?: string
  userId: string
  subscriptionType: SubscriptionType
  status: "active" | "expired" | "cancelled"
  startDate: Date
  endDate?: Date
  trialEndDate?: Date
  isTrialExpired: boolean
  createdAt: Date
  updatedAt: Date
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionType, {
  name: string
  price: number
  currency: string
  billingPeriod: "trial" | "monthly"
  limits: SubscriptionLimits
  features: string[]
  description: string
}> = {
  trial: {
    name: "Trial Gratis",
    price: 0,
    currency: "IDR",
    billingPeriod: "trial",
    limits: {
      maxStudents: 3,
      maxUstadz: 1,
      maxUstadzah: 1,
      trialDays: 7,
    },
    features: [
      "1 ustadz",
      "Maksimal 3 murid",
      "Akses semua fitur dasar",
      "Dukungan teknis",
      "Manajemen kelas digital",
      "Tracking progress pembelajaran"
    ],
    description: "Coba semua fitur selama 7 hari"
  },
  premium: {
    name: "Premium (Institusi)",
    price: 750000,
    currency: "IDR",
    billingPeriod: "monthly",
    limits: {
      maxStudents: Number.POSITIVE_INFINITY,
      maxUstadz: Number.POSITIVE_INFINITY,
      maxUstadzah: Number.POSITIVE_INFINITY,
    },
    features: [
      "Unlimited ustadz/ustadzah",
      "Unlimited murid",
      "Perpanjangan otomatis",
      "Semua fitur premium",
      "Resource sharing",
      "Advanced analytics",
      "Export data",
      "Untuk 1 nama lembaga"
    ],
    description: "Untuk institusi dan madrasah"
  },
  pro: {
    name: "Pro",
    price: 150000,
    currency: "IDR",
    billingPeriod: "monthly",
    limits: {
      maxStudents: 15,
      maxUstadz: 5,
      maxUstadzah: 5,
    },
    features: [
      "Maksimal 5 ustadz",
      "Maksimal 15 murid",
      "Perpanjangan otomatis",
      "Semua fitur premium",
      "Priority support",
      "Custom reports",
      "Bulk import/export"
    ],
    description: "Untuk institusi dan madrasah"
  }
}

export const calculateTrialEndDate = (startDate: Date): Date => {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 7) // 7 days trial
  return endDate
}

export const isTrialExpired = (subscription: UserSubscription): boolean => {
  if (subscription.subscriptionType !== "trial") return false
  if (!subscription.trialEndDate) return true
  
  return new Date() > subscription.trialEndDate
}

export const canAddStudent = (
  subscription: UserSubscription,
  currentStudentCount: number
): boolean => {
  if (isTrialExpired(subscription)) return false
  
  const limits = SUBSCRIPTION_PLANS[subscription.subscriptionType].limits
  return currentStudentCount < limits.maxStudents
}

export const canAddUstadz = (
  subscription: UserSubscription,
  currentUstadzCount: number
): boolean => {
  if (isTrialExpired(subscription)) return false
  
  const limits = SUBSCRIPTION_PLANS[subscription.subscriptionType].limits
  return currentUstadzCount < limits.maxUstadz
}

export const canAddUstadzah = (
  subscription: UserSubscription,
  currentUstadzahCount: number
): boolean => {
  if (isTrialExpired(subscription)) return false
  
  const limits = SUBSCRIPTION_PLANS[subscription.subscriptionType].limits
  return currentUstadzahCount < limits.maxUstadzah
}

export const getDaysRemaining = (subscription: UserSubscription): number => {
  if (subscription.subscriptionType !== "trial" || !subscription.trialEndDate) {
    return 0
  }
  
  const now = new Date()
  const endDate = subscription.trialEndDate
  const diffTime = endDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.max(0, diffDays)
}

export const formatPrice = (price: number, currency: string = "IDR"): string => {
  if (price === 0) return "Gratis"
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const getSubscriptionStatus = (subscription: UserSubscription): {
  canUseApp: boolean
  needsUpgrade: boolean
  message: string
  daysRemaining?: number
} => {
  if (subscription.subscriptionType === "trial") {
    const expired = isTrialExpired(subscription)
    const daysRemaining = getDaysRemaining(subscription)
    
    if (expired) {
      return {
        canUseApp: false,
        needsUpgrade: true,
        message: "Trial Anda telah berakhir. Silakan upgrade ke paket premium untuk melanjutkan.",
      }
    }
    
    return {
      canUseApp: true,
      needsUpgrade: daysRemaining <= 3,
      message: daysRemaining <= 3 
        ? `Trial berakhir dalam ${daysRemaining} hari. Upgrade sekarang untuk akses tanpa batas.`
        : `Trial aktif - ${daysRemaining} hari tersisa`,
      daysRemaining,
    }
  }
  
  // Premium and Pro subscriptions
  return {
    canUseApp: true,
    needsUpgrade: false,
    message: `Paket ${subscription.subscriptionType} aktif`,
  }
}
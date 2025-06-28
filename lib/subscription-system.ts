export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  duration: number // in days, 0 for lifetime
  maxTeachers: number
  maxStudents: number
  features: string[]
  isActive: boolean
}

export interface UserSubscription {
  userId: string
  subscriptionType: 'trial' | 'premium' | 'unlimited'
  trialStartDate?: Date
  trialEndDate?: Date
  subscriptionStartDate?: Date
  subscriptionEndDate?: Date
  isActive: boolean
  maxTeachers: number
  maxStudents: number
  currentTeachers: number
  currentStudents: number
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  trial: {
    id: 'trial',
    name: 'Trial Gratis',
    price: 0,
    duration: 7,
    maxTeachers: 1,
    maxStudents: 5,
    features: [
      'Akses fitur dasar',
      'Coba semua fungsi utama',
      'Dukungan teknis',
      'Manajemen kelas digital',
      'Tracking progress pembelajaran'
    ],
    isActive: true
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 150000,
    duration: 0, // lifetime
    maxTeachers: 3,
    maxStudents: 10,
    features: [
      'Maksimal 3 ustadz',
      'Maksimal 10 murid',
      'Akses seumur hidup',
      'Semua fitur premium',
      'Resource sharing',
      'Advanced analytics',
      'Export data'
    ],
    isActive: true
  },
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited',
    price: 0, // custom pricing
    duration: 0, // lifetime
    maxTeachers: Number.POSITIVE_INFINITY,
    maxStudents: Number.POSITIVE_INFINITY,
    features: [
      'Ustadz & murid unlimited',
      'Semua fitur premium',
      'Dukungan prioritas',
      'Konsultasi personal',
      'White-label options',
      'Custom integrations',
      'Dedicated support'
    ],
    isActive: true
  }
}

export const checkSubscriptionLimits = (
  subscription: UserSubscription,
  action: 'add_teacher' | 'add_student'
): { canAdd: boolean; message?: string } => {
  if (!subscription.isActive) {
    return {
      canAdd: false,
      message: 'Langganan Anda tidak aktif. Silakan hubungi admin untuk mengaktifkan kembali.'
    }
  }

  // Check if trial has expired
  if (subscription.subscriptionType === 'trial' && subscription.trialEndDate) {
    const now = new Date()
    if (now > subscription.trialEndDate) {
      return {
        canAdd: false,
        message: 'Trial period Anda telah berakhir. Upgrade ke Premium untuk melanjutkan.'
      }
    }
  }

  if (action === 'add_teacher') {
    if (subscription.currentTeachers >= subscription.maxTeachers) {
      return {
        canAdd: false,
        message: `Anda telah mencapai batas maksimal ${subscription.maxTeachers} ustadz. Upgrade untuk menambah lebih banyak ustadz.`
      }
    }
  }

  if (action === 'add_student') {
    if (subscription.currentStudents >= subscription.maxStudents) {
      return {
        canAdd: false,
        message: `Anda telah mencapai batas maksimal ${subscription.maxStudents} murid. Upgrade untuk menambah lebih banyak murid.`
      }
    }
  }

  return { canAdd: true }
}

export const calculateTrialEndDate = (startDate: Date): Date => {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 7)
  return endDate
}

export const isTrialExpired = (subscription: UserSubscription): boolean => {
  if (subscription.subscriptionType !== 'trial' || !subscription.trialEndDate) {
    return false
  }
  
  return new Date() > subscription.trialEndDate
}

export const getDaysRemaining = (subscription: UserSubscription): number => {
  if (subscription.subscriptionType !== 'trial' || !subscription.trialEndDate) {
    return 0
  }
  
  const now = new Date()
  const diffTime = subscription.trialEndDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.max(0, diffDays)
}

export const formatPrice = (price: number): string => {
  if (price === 0) return 'Gratis'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}
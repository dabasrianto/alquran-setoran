export interface Setoran {
  id: string
  surah: string
  start: number
  end: number
  penilaian: string
  catatan?: string
  timestamp: string
  pengujiId?: string // ID ustadz/ustadzah yang menguji
}

export interface Student {
  id: string
  name: string
  kelas: string
  target: string
  hafalan: Setoran[]
}

export interface Penguji {
  id: string
  name: string
  gender: "L" | "P" // L untuk Ustadz, P untuk Ustadzah
  keterangan?: string
}

export interface JuzProgress {
  started: number
  completed: number
  details?: Record<
    string,
    {
      memorized: number
      total: number
      percentage: number
      isComplete: boolean
    }
  >
}

export interface StudentSummary {
  totalMemorizedVerses: number
  startedSurahsCount: number
  completedSurahsCount: number
  juzProgress: JuzProgress
  kelas: string
  target: string
  totalUniqueVersesMemorizedSet: Set<string>
}

export interface StudentWithSummary extends Student {
  summary: StudentSummary
}

// Premium Tier Types
export type SubscriptionTier = "basic" | "premium" | "pro" | "institution"

export interface TierFeatures {
  maxStudents: number
  maxUstadz: number
  maxUstadzah: number
  exportPDF: boolean
  prioritySupport: boolean
  customReports: boolean
  multipleInstitutions: boolean
  apiAccess: boolean
  advancedAnalytics: boolean
  bulkImport: boolean
}

export interface SubscriptionTierInfo {
  id: SubscriptionTier
  name: string
  description: string
  price: number
  currency: string
  billingPeriod: "monthly" | "yearly"
  features: TierFeatures
  popular?: boolean
  recommended?: boolean
}

// Upgrade Request Types
export interface UpgradeRequest {
  id: string
  userId: string
  userEmail: string
  userName: string
  currentTier: SubscriptionTier
  requestedTier: SubscriptionTier
  status: "pending" | "approved" | "rejected" | "payment_pending" | "completed"
  paymentStatus: "none" | "pending" | "processing" | "completed" | "failed" | "refunded"
  paymentId?: string
  paymentMethod?: string
  amount: number
  currency: string
  requestDate: string
  processedDate?: string
  processedBy?: string
  notes?: string
  paymentUrl?: string
  expiryDate?: string
}

// Payment Types
export interface PaymentInfo {
  id: string
  upgradeRequestId: string
  userId: string
  amount: number
  currency: string
  method: "bank_transfer" | "ewallet" | "credit_card" | "qris"
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  gatewayTransactionId?: string
  gatewayResponse?: any
  createdAt: string
  completedAt?: string
  failureReason?: string
}

// Admin Action Log
export interface AdminActionLog {
  id: string
  adminId: string
  adminEmail: string
  action: string
  targetType: "user" | "upgrade_request" | "payment"
  targetId: string
  details: any
  timestamp: string
  ipAddress?: string
}
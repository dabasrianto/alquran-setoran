import type { SubscriptionTierInfo, TierFeatures } from "./types"

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTierInfo> = {
  basic: {
    id: "basic",
    name: "Basic (Gratis)",
    description: "Cocok untuk pengajar individual dengan murid terbatas",
    price: 0,
    currency: "IDR",
    billingPeriod: "monthly",
    features: {
      maxStudents: 5,
      maxUstadz: 1,
      maxUstadzah: 1,
      exportPDF: false,
      prioritySupport: false,
      customReports: false,
      multipleInstitutions: false,
      apiAccess: false,
      advancedAnalytics: false,
      bulkImport: false,
    },
  },
  premium: {
    id: "premium",
    name: "Premium (Institusi)",
    description: "Untuk institusi dan madrasah",
    price: 750000,
    currency: "IDR",
    billingPeriod: "monthly",
    popular: true,
    features: {
      maxStudents: Number.POSITIVE_INFINITY,
      maxUstadz: Number.POSITIVE_INFINITY,
      maxUstadzah: Number.POSITIVE_INFINITY,
      exportPDF: true,
      prioritySupport: true,
      customReports: false,
      multipleInstitutions: true,
      apiAccess: false,
      advancedAnalytics: true,
      bulkImport: true,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Untuk madrasah dan lembaga pendidikan kecil",
    price: 150000,
    currency: "IDR",
    billingPeriod: "monthly",
    features: {
      maxStudents: 200,
      maxUstadz: 20,
      maxUstadzah: 20,
      exportPDF: true,
      prioritySupport: true,
      customReports: true,
      multipleInstitutions: false,
      apiAccess: true,
      advancedAnalytics: true,
      bulkImport: true,
    },
  },
  institution: {
    id: "institution",
    name: "Institution",
    description: "Untuk jaringan lembaga pendidikan",
    price: 1500000,
    currency: "IDR",
    billingPeriod: "monthly",
    recommended: true,
    features: {
      maxStudents: Number.POSITIVE_INFINITY,
      maxUstadz: Number.POSITIVE_INFINITY,
      maxUstadzah: Number.POSITIVE_INFINITY,
      exportPDF: true,
      prioritySupport: true,
      customReports: true,
      multipleInstitutions: true,
      apiAccess: true,
      advancedAnalytics: true,
      bulkImport: true,
    },
  },
}

export const formatPrice = (price: number, currency: string = "IDR"): string => {
  if (price === 0) return "Gratis"
  
  if (currency === "IDR") {
    return `Rp ${price.toLocaleString("id-ID")}`
  }
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
  }).format(price)
}

export const getTierFeaturesList = (tier: SubscriptionTierInfo): string[] => {
  const features: string[] = []
  
  if (tier.features.maxStudents === Number.POSITIVE_INFINITY) {
    features.push("Unlimited Murid")
  } else {
    features.push(`Maksimal ${tier.features.maxStudents} Murid`)
  }
  
  if (tier.features.maxUstadz === Number.POSITIVE_INFINITY) {
    features.push("Unlimited Ustadz")
  } else {
    features.push(`Maksimal ${tier.features.maxUstadz} Ustadz`)
  }
  
  if (tier.features.maxUstadzah === Number.POSITIVE_INFINITY) {
    features.push("Unlimited Ustadzah")
  } else {
    features.push(`Maksimal ${tier.features.maxUstadzah} Ustadzah`)
  }
  
  if (tier.features.exportPDF) features.push("Export PDF")
  if (tier.features.prioritySupport) features.push("Priority Support")
  if (tier.features.customReports) features.push("Custom Reports")
  if (tier.features.multipleInstitutions) features.push("Multiple Institutions")
  if (tier.features.apiAccess) features.push("API Access")
  if (tier.features.advancedAnalytics) features.push("Advanced Analytics")
  if (tier.features.bulkImport) features.push("Bulk Import")
  
  return features
}
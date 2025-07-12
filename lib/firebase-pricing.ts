import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"

export interface PricingPlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  maxStudents: number | "unlimited"
  maxTeachers: number | "unlimited"
  isPopular?: boolean
  isRecommended?: boolean
  isActive: boolean
  order: number
  createdAt?: Date
  updatedAt?: Date
}

export const defaultPricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Gratis",
    price: 0,
    description: "Cocok untuk ustadz pemula atau TPQ kecil",
    features: ["Maksimal 10 murid", "1 penguji/ustadz", "Laporan dasar", "Backup manual", "Support email"],
    maxStudents: 10,
    maxTeachers: 1,
    isActive: true,
    order: 1,
  },
  {
    id: "basic",
    name: "Basic",
    price: 49000,
    originalPrice: 69000,
    description: "Untuk TPQ atau madrasah kecil hingga menengah",
    features: [
      "Maksimal 50 murid",
      "3 penguji/ustadz",
      "Laporan lengkap",
      "Backup otomatis",
      "Export PDF",
      "Support prioritas",
    ],
    maxStudents: 50,
    maxTeachers: 3,
    isPopular: true,
    isActive: true,
    order: 2,
  },
  {
    id: "premium",
    name: "Premium",
    price: 99000,
    originalPrice: 149000,
    description: "Untuk madrasah besar atau yayasan",
    features: [
      "Murid unlimited",
      "Ustadz unlimited",
      "Analytics mendalam",
      "Multi-cabang",
      "API access",
      "Custom branding",
      "Support 24/7",
    ],
    maxStudents: "unlimited",
    maxTeachers: "unlimited",
    isRecommended: true,
    isActive: true,
    order: 3,
  },
]

// Get all pricing plans
export const getPricingPlans = async (): Promise<PricingPlan[]> => {
  try {
    const pricingDoc = await getDoc(doc(db, "settings", "pricing"))

    if (pricingDoc.exists()) {
      const data = pricingDoc.data()
      return data.plans || defaultPricingPlans
    } else {
      // Initialize with default plans
      await initializePricingPlans()
      return defaultPricingPlans
    }
  } catch (error) {
    console.error("Error fetching pricing plans:", error)
    return defaultPricingPlans
  }
}

// Initialize pricing plans with defaults
export const initializePricingPlans = async (): Promise<void> => {
  try {
    const pricingRef = doc(db, "settings", "pricing")
    await setDoc(pricingRef, {
      plans: defaultPricingPlans,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    console.log("✅ Pricing plans initialized")
  } catch (error) {
    console.error("❌ Error initializing pricing plans:", error)
    throw error
  }
}

// Update pricing plans (admin only)
export const updatePricingPlans = async (plans: PricingPlan[]): Promise<void> => {
  try {
    const pricingRef = doc(db, "settings", "pricing")
    await updateDoc(pricingRef, {
      plans: plans,
      updatedAt: serverTimestamp(),
    })
    console.log("✅ Pricing plans updated")
  } catch (error) {
    console.error("❌ Error updating pricing plans:", error)
    throw error
  }
}

// Subscribe to pricing changes (real-time)
export const subscribeToPricingPlans = (callback: (plans: PricingPlan[]) => void) => {
  const pricingRef = doc(db, "settings", "pricing")

  return onSnapshot(
    pricingRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        callback(data.plans || defaultPricingPlans)
      } else {
        callback(defaultPricingPlans)
      }
    },
    (error) => {
      console.error("Error listening to pricing changes:", error)
      callback(defaultPricingPlans)
    },
  )
}

// Get single pricing plan
export const getPricingPlan = async (planId: string): Promise<PricingPlan | null> => {
  try {
    const plans = await getPricingPlans()
    return plans.find((plan) => plan.id === planId) || null
  } catch (error) {
    console.error("Error fetching pricing plan:", error)
    return null
  }
}

// Format price to Indonesian Rupiah
export const formatPrice = (price: number): string => {
  if (price === 0) return "Gratis"

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Calculate discount percentage
export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  if (!originalPrice || originalPrice <= currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

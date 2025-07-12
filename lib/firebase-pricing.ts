import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  features: string[]
  maxStudents: number | "unlimited"
  maxTeachers: number | "unlimited"
  isActive: boolean
  isPopular: boolean
  isRecommended: boolean
  order: number
  createdAt?: any
  updatedAt?: any
}

const PRICING_COLLECTION = "pricing"
const SETTINGS_DOC = "settings"

// Default pricing plans
const DEFAULT_PRICING_PLANS: Omit<PricingPlan, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Gratis",
    description: "Cocok untuk TPQ kecil atau trial",
    price: 0,
    features: ["Maksimal 10 murid", "Maksimal 2 ustadz", "Laporan dasar", "Data tersimpan 30 hari", "Dukungan email"],
    maxStudents: 10,
    maxTeachers: 2,
    isActive: true,
    isPopular: false,
    isRecommended: false,
    order: 1,
  },
  {
    name: "Standar",
    description: "Untuk madrasah menengah",
    price: 99000,
    originalPrice: 149000,
    features: [
      "Maksimal 50 murid",
      "Maksimal 5 ustadz",
      "Laporan lengkap",
      "Data tersimpan selamanya",
      "Dukungan prioritas",
      "Export data",
      "Backup otomatis",
    ],
    maxStudents: 50,
    maxTeachers: 5,
    isActive: true,
    isPopular: true,
    isRecommended: true,
    order: 2,
  },
  {
    name: "Premium",
    description: "Untuk madrasah besar",
    price: 199000,
    originalPrice: 299000,
    features: [
      "Murid unlimited",
      "Ustadz unlimited",
      "Laporan advanced",
      "Analytics mendalam",
      "API access",
      "Custom branding",
      "Dukungan 24/7",
      "Training gratis",
    ],
    maxStudents: "unlimited",
    maxTeachers: "unlimited",
    isActive: true,
    isPopular: false,
    isRecommended: false,
    order: 3,
  },
]

// Get all pricing plans
export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    // Try to get from pricing collection first
    const pricingQuery = query(collection(db, PRICING_COLLECTION), orderBy("order"))
    const pricingSnapshot = await getDocs(pricingQuery)

    if (!pricingSnapshot.empty) {
      return pricingSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as PricingPlan,
      )
    }

    // Fallback to settings document
    const settingsDoc = await getDoc(doc(db, "settings", SETTINGS_DOC))
    if (settingsDoc.exists() && settingsDoc.data().pricing) {
      return settingsDoc.data().pricing as PricingPlan[]
    }

    // If no data exists, initialize with defaults
    await initializePricingPlans()
    return DEFAULT_PRICING_PLANS.map((plan, index) => ({
      ...plan,
      id: `plan_${index + 1}`,
    }))
  } catch (error) {
    console.error("Error fetching pricing plans:", error)
    // Return default plans as fallback
    return DEFAULT_PRICING_PLANS.map((plan, index) => ({
      ...plan,
      id: `plan_${index + 1}`,
    }))
  }
}

// Get single pricing plan
export async function getPricingPlan(planId: string): Promise<PricingPlan | null> {
  try {
    const planDoc = await getDoc(doc(db, PRICING_COLLECTION, planId))
    if (planDoc.exists()) {
      return {
        id: planDoc.id,
        ...planDoc.data(),
      } as PricingPlan
    }
    return null
  } catch (error) {
    console.error("Error fetching pricing plan:", error)
    return null
  }
}

// Create or update pricing plan
export async function savePricingPlan(plan: Omit<PricingPlan, "createdAt" | "updatedAt">): Promise<void> {
  try {
    const planData = {
      ...plan,
      updatedAt: serverTimestamp(),
      ...(plan.id ? {} : { createdAt: serverTimestamp() }),
    }

    if (plan.id) {
      await setDoc(doc(db, PRICING_COLLECTION, plan.id), planData)
    } else {
      const newPlanRef = doc(collection(db, PRICING_COLLECTION))
      await setDoc(newPlanRef, { ...planData, id: newPlanRef.id })
    }

    // Also update settings document for fallback
    await updateSettingsPricing()
  } catch (error) {
    console.error("Error saving pricing plan:", error)
    throw error
  }
}

// Delete pricing plan
export async function deletePricingPlan(planId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRICING_COLLECTION, planId))
    await updateSettingsPricing()
  } catch (error) {
    console.error("Error deleting pricing plan:", error)
    throw error
  }
}

// Initialize default pricing plans
export async function initializePricingPlans(): Promise<void> {
  try {
    const batch = []

    for (let i = 0; i < DEFAULT_PRICING_PLANS.length; i++) {
      const plan = DEFAULT_PRICING_PLANS[i]
      const planId = `plan_${i + 1}`
      const planData = {
        ...plan,
        id: planId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      batch.push(setDoc(doc(db, PRICING_COLLECTION, planId), planData))
    }

    await Promise.all(batch)
    await updateSettingsPricing()
  } catch (error) {
    console.error("Error initializing pricing plans:", error)
    throw error
  }
}

// Update settings document with current pricing
async function updateSettingsPricing(): Promise<void> {
  try {
    const plans = await getPricingPlans()
    await setDoc(
      doc(db, "settings", SETTINGS_DOC),
      {
        pricing: plans,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (error) {
    console.error("Error updating settings pricing:", error)
  }
}

// Utility functions
export function formatPrice(price: number): string {
  if (price === 0) return "Gratis"
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= currentPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

// Get pricing plan by features (for subscription matching)
export async function getPricingPlanByLimits(maxStudents: number, maxTeachers: number): Promise<PricingPlan | null> {
  try {
    const plans = await getPricingPlans()

    // Find the most suitable plan
    const suitablePlans = plans.filter((plan) => {
      const studentLimit = plan.maxStudents === "unlimited" ? Number.POSITIVE_INFINITY : plan.maxStudents
      const teacherLimit = plan.maxTeachers === "unlimited" ? Number.POSITIVE_INFINITY : plan.maxTeachers

      return studentLimit >= maxStudents && teacherLimit >= maxTeachers && plan.isActive
    })

    // Return the cheapest suitable plan
    return suitablePlans.sort((a, b) => a.price - b.price)[0] || null
  } catch (error) {
    console.error("Error finding suitable pricing plan:", error)
    return null
  }
}

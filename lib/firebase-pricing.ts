import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"

export interface PricingPlan {
  id: string
  name: string
  price: number
  yearlyPrice?: number
  currency: string
  interval: "month" | "year"
  description: string
  features: string[]
  maxStudents: number | null // null means unlimited
  maxTeachers: number | null // null means unlimited
  isPopular?: boolean
  isRecommended?: boolean
  order: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PricingSettings {
  plans: PricingPlan[]
  lastUpdated: Date
  version: number
}

const PRICING_COLLECTION = "pricing"
const SETTINGS_DOC = "settings/pricing"

// Default pricing plans
const DEFAULT_PLANS: Omit<PricingPlan, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    currency: "IDR",
    interval: "month",
    description: "Cocok untuk pengguna individual",
    features: ["Maksimal 5 santri", "Maksimal 1 penguji", "Fitur dasar tasmi", "Laporan sederhana"],
    maxStudents: 5,
    maxTeachers: 1,
    isPopular: false,
    isRecommended: false,
    order: 1,
    active: true,
  },
  {
    name: "Premium",
    price: 50000,
    yearlyPrice: 480000, // 20% discount
    currency: "IDR",
    interval: "month",
    description: "Untuk lembaga kecil hingga menengah",
    features: [
      "Santri tidak terbatas",
      "Penguji tidak terbatas",
      "Semua fitur tasmi",
      "Laporan lengkap",
      "Export data",
      "Backup otomatis",
      "Support prioritas",
    ],
    maxStudents: null, // unlimited
    maxTeachers: null, // unlimited
    isPopular: true,
    isRecommended: true,
    order: 2,
    active: true,
  },
]

// Get all pricing plans
export async function getPricingPlans(): Promise<PricingPlan[]> {
  try {
    // Try to get from pricing collection first
    const pricingSnapshot = await getDocs(collection(db, PRICING_COLLECTION))

    if (!pricingSnapshot.empty) {
      const plans = pricingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as PricingPlan[]

      return plans.sort((a, b) => a.order - b.order)
    }

    // Fallback to settings document
    const settingsDoc = await getDoc(doc(db, "settings", "pricing"))
    if (settingsDoc.exists()) {
      const data = settingsDoc.data() as PricingSettings
      return data.plans.sort((a, b) => a.order - b.order)
    }

    // If no data exists, initialize with defaults
    await initializeDefaultPricing()
    return DEFAULT_PLANS.map((plan, index) => ({
      ...plan,
      id: `plan_${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  } catch (error) {
    console.error("Error getting pricing plans:", error)
    // Return default plans as fallback
    return DEFAULT_PLANS.map((plan, index) => ({
      ...plan,
      id: `plan_${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  }
}

// Initialize default pricing
export async function initializeDefaultPricing(): Promise<void> {
  try {
    const batch = writeBatch(db)

    // Add to pricing collection
    DEFAULT_PLANS.forEach((plan, index) => {
      const planId = `plan_${index + 1}`
      const planRef = doc(db, PRICING_COLLECTION, planId)
      batch.set(planRef, {
        ...plan,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    })

    // Add to settings document
    const settingsRef = doc(db, "settings", "pricing")
    const plansWithIds = DEFAULT_PLANS.map((plan, index) => ({
      ...plan,
      id: `plan_${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    batch.set(settingsRef, {
      plans: plansWithIds,
      lastUpdated: new Date(),
      version: 1,
    })

    await batch.commit()
    console.log("Default pricing initialized successfully")
  } catch (error) {
    console.error("Error initializing default pricing:", error)
    throw error
  }
}

// Create a new pricing plan
export async function createPricingPlan(
  planData: Omit<PricingPlan, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  try {
    const planId = `plan_${Date.now()}`
    const now = new Date()

    const newPlan: PricingPlan = {
      ...planData,
      id: planId,
      createdAt: now,
      updatedAt: now,
    }

    // Add to pricing collection
    await setDoc(doc(db, PRICING_COLLECTION, planId), newPlan)

    // Update settings document
    await updatePricingSettings()

    return planId
  } catch (error) {
    console.error("Error creating pricing plan:", error)
    throw error
  }
}

// Update a pricing plan
export async function updatePricingPlan(
  planId: string,
  updates: Partial<Omit<PricingPlan, "id" | "createdAt">>,
): Promise<void> {
  try {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    }

    // Update in pricing collection
    await updateDoc(doc(db, PRICING_COLLECTION, planId), updateData)

    // Update settings document
    await updatePricingSettings()
  } catch (error) {
    console.error("Error updating pricing plan:", error)
    throw error
  }
}

// Delete a pricing plan
export async function deletePricingPlan(planId: string): Promise<void> {
  try {
    // Delete from pricing collection
    await deleteDoc(doc(db, PRICING_COLLECTION, planId))

    // Update settings document
    await updatePricingSettings()
  } catch (error) {
    console.error("Error deleting pricing plan:", error)
    throw error
  }
}

// Update pricing settings document with current plans
async function updatePricingSettings(): Promise<void> {
  try {
    const plans = await getPricingPlans()
    const settingsRef = doc(db, "settings", "pricing")

    await setDoc(settingsRef, {
      plans,
      lastUpdated: new Date(),
      version: Date.now(),
    })
  } catch (error) {
    console.error("Error updating pricing settings:", error)
  }
}

// Subscribe to pricing changes
export function subscribeToPricingChanges(callback: (plans: PricingPlan[]) => void): () => void {
  const unsubscribePricing = onSnapshot(
    collection(db, PRICING_COLLECTION),
    (snapshot) => {
      const plans = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as PricingPlan[]

      callback(plans.sort((a, b) => a.order - b.order))
    },
    (error) => {
      console.error("Error subscribing to pricing changes:", error)
      // Fallback to getting plans once
      getPricingPlans().then(callback)
    },
  )

  return unsubscribePricing
}

// Format price for display
export function formatPrice(price: number, currency = "IDR"): string {
  if (price === 0) return "Gratis"

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Calculate yearly price with discount
export function calculateYearlyPrice(monthlyPrice: number, discountPercent = 20): number {
  const yearlyPrice = monthlyPrice * 12
  const discount = yearlyPrice * (discountPercent / 100)
  return yearlyPrice - discount
}

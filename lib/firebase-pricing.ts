import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "./firebase"
import type { SubscriptionTierInfo } from "./types"

// Default pricing plans
const DEFAULT_PRICING_PLANS: SubscriptionTierInfo[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Cocok untuk guru individual atau madrasah kecil",
    price: 0,
    currency: "IDR",
    billingPeriod: "monthly",
    features: {
      maxStudents: 10,
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
  {
    id: "premium",
    name: "Premium",
    description: "Untuk madrasah menengah dengan lebih banyak santri",
    price: 99000,
    currency: "IDR",
    billingPeriod: "monthly",
    features: {
      maxStudents: 50,
      maxUstadz: 3,
      maxUstadzah: 3,
      exportPDF: true,
      prioritySupport: true,
      customReports: true,
      multipleInstitutions: false,
      apiAccess: false,
      advancedAnalytics: true,
      bulkImport: true,
    },
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Untuk madrasah besar dengan banyak ustadz dan santri",
    price: 199000,
    currency: "IDR",
    billingPeriod: "monthly",
    features: {
      maxStudents: 200,
      maxUstadz: 10,
      maxUstadzah: 10,
      exportPDF: true,
      prioritySupport: true,
      customReports: true,
      multipleInstitutions: true,
      apiAccess: true,
      advancedAnalytics: true,
      bulkImport: true,
    },
    recommended: true,
  },
  {
    id: "institution",
    name: "Institution",
    description: "Untuk yayasan dengan multiple madrasah",
    price: 399000,
    currency: "IDR",
    billingPeriod: "monthly",
    features: {
      maxStudents: -1, // unlimited
      maxUstadz: -1, // unlimited
      maxUstadzah: -1, // unlimited
      exportPDF: true,
      prioritySupport: true,
      customReports: true,
      multipleInstitutions: true,
      apiAccess: true,
      advancedAnalytics: true,
      bulkImport: true,
    },
  },
]

// Get all pricing plans
export async function getPricingPlans(): Promise<SubscriptionTierInfo[]> {
  try {
    // Try to get from pricing collection first
    const pricingRef = collection(db, "pricing")
    const pricingQuery = query(pricingRef, orderBy("price"))
    const pricingSnapshot = await getDocs(pricingQuery)

    if (!pricingSnapshot.empty) {
      const plans = pricingSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as SubscriptionTierInfo[]

      console.log("Loaded pricing plans from pricing collection:", plans.length)
      return plans
    }

    // Fallback to settings document
    const settingsRef = doc(db, "settings", "pricing")
    const settingsDoc = await getDoc(settingsRef)

    if (settingsDoc.exists()) {
      const data = settingsDoc.data()
      if (data.plans && Array.isArray(data.plans)) {
        console.log("Loaded pricing plans from settings:", data.plans.length)
        return data.plans
      }
    }

    // If no data exists, initialize with defaults
    console.log("No pricing data found, initializing defaults")
    await initializePricingPlans()
    return DEFAULT_PRICING_PLANS
  } catch (error) {
    console.error("Error fetching pricing plans:", error)
    // Return defaults on error
    return DEFAULT_PRICING_PLANS
  }
}

// Initialize pricing plans with defaults
export async function initializePricingPlans(): Promise<void> {
  try {
    // Save to both pricing collection and settings document
    const batch = []

    // Save to pricing collection
    for (const plan of DEFAULT_PRICING_PLANS) {
      const planRef = doc(db, "pricing", plan.id)
      batch.push(setDoc(planRef, plan))
    }

    // Save to settings document as backup
    const settingsRef = doc(db, "settings", "pricing")
    batch.push(
      setDoc(settingsRef, {
        plans: DEFAULT_PRICING_PLANS,
        lastUpdated: new Date().toISOString(),
        version: 1,
      }),
    )

    await Promise.all(batch)
    console.log("Pricing plans initialized successfully")
  } catch (error) {
    console.error("Error initializing pricing plans:", error)
    throw error
  }
}

// Create or update a pricing plan
export async function savePricingPlan(plan: SubscriptionTierInfo): Promise<void> {
  try {
    // Save to pricing collection
    const planRef = doc(db, "pricing", plan.id)
    await setDoc(planRef, {
      ...plan,
      lastUpdated: new Date().toISOString(),
    })

    // Update settings document as well
    const allPlans = await getPricingPlans()
    const updatedPlans = allPlans.filter((p) => p.id !== plan.id)
    updatedPlans.push(plan)

    const settingsRef = doc(db, "settings", "pricing")
    await setDoc(settingsRef, {
      plans: updatedPlans,
      lastUpdated: new Date().toISOString(),
      version: 1,
    })

    console.log("Pricing plan saved:", plan.id)
  } catch (error) {
    console.error("Error saving pricing plan:", error)
    throw error
  }
}

// Delete a pricing plan
export async function deletePricingPlan(planId: string): Promise<void> {
  try {
    // Delete from pricing collection
    const planRef = doc(db, "pricing", planId)
    await deleteDoc(planRef)

    // Update settings document
    const allPlans = await getPricingPlans()
    const updatedPlans = allPlans.filter((p) => p.id !== planId)

    const settingsRef = doc(db, "settings", "pricing")
    await setDoc(settingsRef, {
      plans: updatedPlans,
      lastUpdated: new Date().toISOString(),
      version: 1,
    })

    console.log("Pricing plan deleted:", planId)
  } catch (error) {
    console.error("Error deleting pricing plan:", error)
    throw error
  }
}

// Get a single pricing plan
export async function getPricingPlan(planId: string): Promise<SubscriptionTierInfo | null> {
  try {
    const planRef = doc(db, "pricing", planId)
    const planDoc = await getDoc(planRef)

    if (planDoc.exists()) {
      return { ...planDoc.data(), id: planDoc.id } as SubscriptionTierInfo
    }

    return null
  } catch (error) {
    console.error("Error fetching pricing plan:", error)
    return null
  }
}

// Subscribe to pricing changes (real-time)
export function subscribeToPricingChanges(callback: (plans: SubscriptionTierInfo[]) => void) {
  const pricingRef = collection(db, "pricing")
  const pricingQuery = query(pricingRef, orderBy("price"))

  return onSnapshot(
    pricingQuery,
    (snapshot) => {
      const plans = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as SubscriptionTierInfo[]

      callback(plans)
    },
    (error) => {
      console.error("Error in pricing subscription:", error)
      // Fallback to default plans on error
      callback(DEFAULT_PRICING_PLANS)
    },
  )
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

// Calculate yearly discount
export function calculateYearlyPrice(monthlyPrice: number, discountPercent = 20): number {
  const yearlyPrice = monthlyPrice * 12
  const discount = yearlyPrice * (discountPercent / 100)
  return yearlyPrice - discount
}

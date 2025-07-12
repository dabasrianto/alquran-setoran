import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"
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
  createdAt?: any
  updatedAt?: any
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

// Helper function to ensure db is available
const ensureDb = () => {
  if (!db) {
    throw new Error("Firestore not initialized. Please check your Firebase configuration.")
  }
  return db
}

// Get all pricing plans from Firestore
export const getPricingPlans = async (): Promise<PricingPlan[]> => {
  try {
    console.log("🔄 Fetching pricing plans...")
    const database = ensureDb()

    // Try to get from pricing collection first
    const pricingRef = collection(database, "pricing")
    const q = query(pricingRef, orderBy("order", "asc"))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      console.log("✅ Found pricing plans in collection")
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PricingPlan[]
    }

    // Fallback: try to get from settings document
    console.log("🔄 Trying settings document...")
    const settingsRef = doc(database, "settings", "pricing")
    const settingsDoc = await getDoc(settingsRef)

    if (settingsDoc.exists()) {
      const data = settingsDoc.data()
      console.log("✅ Found pricing plans in settings")
      return data.plans || defaultPricingPlans
    }

    // If nothing exists, initialize with defaults
    console.log("🔄 No pricing data found, initializing defaults...")
    await initializePricingPlans()
    return defaultPricingPlans
  } catch (error) {
    console.error("❌ Error fetching pricing plans:", error)
    // Return defaults as fallback
    return defaultPricingPlans
  }
}

// Initialize pricing plans with defaults
export const initializePricingPlans = async (): Promise<void> => {
  try {
    console.log("🔄 Initializing pricing plans...")
    const database = ensureDb()

    // Create individual documents in pricing collection
    for (const plan of defaultPricingPlans) {
      const planRef = doc(database, "pricing", plan.id)
      await setDoc(planRef, {
        ...plan,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    // Also save to settings for backup
    const settingsRef = doc(database, "settings", "pricing")
    await setDoc(settingsRef, {
      plans: defaultPricingPlans,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log("✅ Pricing plans initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing pricing plans:", error)
    throw new Error(`Failed to initialize pricing: ${(error as any).message}`)
  }
}

// Update a single pricing plan
export const updatePricingPlan = async (planId: string, updates: Partial<PricingPlan>): Promise<void> => {
  try {
    console.log(`🔄 Updating pricing plan ${planId}`)
    const database = ensureDb()

    // Update in pricing collection
    const planRef = doc(database, "pricing", planId)
    await updateDoc(planRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })

    // Also update in settings for backup
    const plans = await getPricingPlans()
    const updatedPlans = plans.map((plan) => (plan.id === planId ? { ...plan, ...updates } : plan))

    const settingsRef = doc(database, "settings", "pricing")
    await updateDoc(settingsRef, {
      plans: updatedPlans,
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Successfully updated pricing plan ${planId}`)
  } catch (error) {
    console.error(`❌ Error updating pricing plan ${planId}:`, error)
    throw new Error(`Failed to update pricing plan: ${(error as any).message}`)
  }
}

// Update all pricing plans (admin bulk update)
export const updatePricingPlans = async (plans: PricingPlan[]): Promise<void> => {
  try {
    console.log("🔄 Updating all pricing plans...")
    const database = ensureDb()

    // Update each plan in pricing collection
    for (const plan of plans) {
      const planRef = doc(database, "pricing", plan.id)
      await setDoc(
        planRef,
        {
          ...plan,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
    }

    // Update settings document
    const settingsRef = doc(database, "settings", "pricing")
    await setDoc(
      settingsRef,
      {
        plans: plans,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )

    console.log("✅ All pricing plans updated successfully")
  } catch (error) {
    console.error("❌ Error updating pricing plans:", error)
    throw new Error(`Failed to update pricing plans: ${(error as any).message}`)
  }
}

// Subscribe to pricing changes (real-time)
export const subscribeToPricingPlans = (callback: (plans: PricingPlan[]) => void) => {
  try {
    const database = ensureDb()
    const pricingRef = collection(database, "pricing")
    const q = query(pricingRef, orderBy("order", "asc"))

    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const plans = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as PricingPlan[]
          callback(plans)
        } else {
          // Fallback to settings document
          const settingsRef = doc(database, "settings", "pricing")
          return onSnapshot(settingsRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data()
              callback(data.plans || defaultPricingPlans)
            } else {
              callback(defaultPricingPlans)
            }
          })
        }
      },
      (error) => {
        console.error("Error listening to pricing changes:", error)
        callback(defaultPricingPlans)
      },
    )
  } catch (error) {
    console.error("Error setting up pricing subscription:", error)
    callback(defaultPricingPlans)
    return () => {} // Return empty unsubscribe function
  }
}

// Get single pricing plan
export const getPricingPlan = async (planId: string): Promise<PricingPlan | null> => {
  try {
    const database = ensureDb()
    const planRef = doc(database, "pricing", planId)
    const planDoc = await getDoc(planRef)

    if (planDoc.exists()) {
      return {
        id: planDoc.id,
        ...planDoc.data(),
      } as PricingPlan
    }

    // Fallback: search in all plans
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

// Delete a pricing plan (admin only)
export const deletePricingPlan = async (planId: string): Promise<void> => {
  try {
    console.log(`🔄 Deleting pricing plan ${planId}`)
    const database = ensureDb()

    // Delete from pricing collection
    const planRef = doc(database, "pricing", planId)
    await deleteDoc(planRef)

    // Update settings document
    const plans = await getPricingPlans()
    const updatedPlans = plans.filter((plan) => plan.id !== planId)

    const settingsRef = doc(database, "settings", "pricing")
    await updateDoc(settingsRef, {
      plans: updatedPlans,
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Successfully deleted pricing plan ${planId}`)
  } catch (error) {
    console.error(`❌ Error deleting pricing plan ${planId}:`, error)
    throw new Error(`Failed to delete pricing plan: ${(error as any).message}`)
  }
}

// Add a new pricing plan (admin only)
export const addPricingPlan = async (plan: Omit<PricingPlan, "createdAt" | "updatedAt">): Promise<void> => {
  try {
    console.log(`🔄 Adding new pricing plan ${plan.id}`)
    const database = ensureDb()

    // Add to pricing collection
    const planRef = doc(database, "pricing", plan.id)
    await setDoc(planRef, {
      ...plan,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Update settings document
    const plans = await getPricingPlans()
    const updatedPlans = [...plans, plan].sort((a, b) => a.order - b.order)

    const settingsRef = doc(database, "settings", "pricing")
    await updateDoc(settingsRef, {
      plans: updatedPlans,
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Successfully added pricing plan ${plan.id}`)
  } catch (error) {
    console.error(`❌ Error adding pricing plan ${plan.id}:`, error)
    throw new Error(`Failed to add pricing plan: ${(error as any).message}`)
  }
}

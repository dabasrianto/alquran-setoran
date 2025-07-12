import { collection, doc, getDocs, updateDoc, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore"
import { db } from "./firebase"
import type { SubscriptionTierInfo } from "./types"

// Helper function to ensure db is available
const ensureDb = () => {
  if (!db) {
    throw new Error("Firestore not initialized. Please check your Firebase configuration.")
  }
  return db
}

// Get all pricing tiers from Firestore
export const getPricingTiers = async (): Promise<SubscriptionTierInfo[]> => {
  try {
    const database = ensureDb()
    const pricingRef = collection(database, "pricing")
    const q = query(pricingRef, orderBy("order", "asc"))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      // If no pricing data exists, return default tiers and save them
      console.log("No pricing data found, initializing default tiers...")
      await initializeDefaultPricing()
      return getDefaultTiers()
    }

    return snapshot.docs.map((doc) => ({
      id: doc.data().id,
      name: doc.data().name,
      description: doc.data().description,
      price: doc.data().price,
      currency: doc.data().currency,
      billingPeriod: doc.data().billingPeriod,
      features: doc.data().features,
      popular: doc.data().popular || false,
      recommended: doc.data().recommended || false,
    })) as SubscriptionTierInfo[]
  } catch (error) {
    console.error("Error getting pricing tiers:", error)
    // Return default tiers as fallback
    return getDefaultTiers()
  }
}

// Update a pricing tier
export const updatePricingTier = async (tierId: string, updates: Partial<SubscriptionTierInfo>): Promise<void> => {
  try {
    console.log(`🔄 Updating pricing tier ${tierId}`)

    const database = ensureDb()
    const tierRef = doc(database, "pricing", tierId)

    await updateDoc(tierRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Successfully updated pricing tier ${tierId}`)
  } catch (error) {
    console.error(`❌ Error updating pricing tier ${tierId}:`, error)
    throw new Error(`Failed to update pricing tier: ${(error as any).message}`)
  }
}

// Initialize default pricing in Firestore
export const initializeDefaultPricing = async (): Promise<void> => {
  try {
    console.log("🔄 Initializing default pricing tiers...")

    const database = ensureDb()
    const pricingRef = collection(database, "pricing")

    const defaultTiers = getDefaultTiers()

    for (let i = 0; i < defaultTiers.length; i++) {
      const tier = defaultTiers[i]
      await addDoc(pricingRef, {
        ...tier,
        order: i,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    console.log("✅ Successfully initialized default pricing tiers")
  } catch (error) {
    console.error("❌ Error initializing default pricing:", error)
    throw new Error(`Failed to initialize pricing: ${(error as any).message}`)
  }
}

// Get default pricing tiers (fallback)
const getDefaultTiers = (): SubscriptionTierInfo[] => {
  return [
    {
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
    {
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
    {
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
    {
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
  ]
}

// Format price for display
export const formatPrice = (price: number, currency = "IDR"): string => {
  if (price === 0) return "Gratis"

  if (currency === "IDR") {
    return `Rp ${price.toLocaleString("id-ID")}`
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency,
  }).format(price)
}

// Get tier features list for display
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

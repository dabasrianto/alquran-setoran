import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"
import type { UserSubscription, SubscriptionType } from "./subscription-system"
import { calculateTrialEndDate, SUBSCRIPTION_PLANS } from "./subscription-system"

// Helper function to ensure db is available
const ensureDb = () => {
  if (!db) {
    throw new Error("Firestore not initialized. Please check your Firebase configuration.")
  }
  return db
}

// Helper function to convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate()
  }
  if (timestamp instanceof Date) {
    return timestamp
  }
  return new Date(timestamp || Date.now())
}

export const createTrialSubscription = async (userId: string): Promise<UserSubscription> => {
  try {
    const database = ensureDb()
    const subscriptionsRef = collection(database, "subscriptions")
    
    const startDate = new Date()
    const trialEndDate = calculateTrialEndDate(startDate)
    
    const subscription: Omit<UserSubscription, "id"> = {
      userId,
      subscriptionType: "trial",
      status: "active",
      startDate,
      trialEndDate,
      isTrialExpired: false,
      createdAt: startDate,
      updatedAt: startDate,
    }

    const docRef = await addDoc(subscriptionsRef, {
      ...subscription,
      startDate: serverTimestamp(),
      trialEndDate: trialEndDate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Created trial subscription for user ${userId}`)
    return { ...subscription, id: docRef.id }
  } catch (error) {
    console.error("❌ Error creating trial subscription:", error)
    throw new Error(`Failed to create trial subscription: ${(error as any).message}`)
  }
}

export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  try {
    const database = ensureDb()
    const subscriptionsRef = collection(database, "subscriptions")
    const q = query(subscriptionsRef, where("userId", "==", userId), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    const data = doc.data()

    return {
      id: doc.id,
      userId: data.userId,
      subscriptionType: data.subscriptionType,
      status: data.status,
      startDate: convertTimestamp(data.startDate),
      endDate: data.endDate ? convertTimestamp(data.endDate) : undefined,
      trialEndDate: data.trialEndDate ? convertTimestamp(data.trialEndDate) : undefined,
      isTrialExpired: data.isTrialExpired || false,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    }
  } catch (error) {
    console.error("❌ Error getting user subscription:", error)
    throw new Error(`Failed to get user subscription: ${(error as any).message}`)
  }
}

export const upgradeSubscription = async (
  userId: string,
  newSubscriptionType: SubscriptionType,
  endDate?: Date
): Promise<void> => {
  try {
    const database = ensureDb()
    const subscriptionsRef = collection(database, "subscriptions")
    
    // Get current subscription
    const currentSubscription = await getUserSubscription(userId)
    
    if (currentSubscription) {
      // Update existing subscription
      const subscriptionRef = doc(database, "subscriptions", currentSubscription.id!)
      
      const updateData: any = {
        subscriptionType: newSubscriptionType,
        status: "active",
        updatedAt: serverTimestamp(),
      }
      
      if (newSubscriptionType !== "trial") {
        updateData.trialEndDate = null
        updateData.isTrialExpired = false
        if (endDate) {
          updateData.endDate = endDate
        }
      }
      
      await updateDoc(subscriptionRef, updateData)
    } else {
      // Create new subscription
      const startDate = new Date()
      const subscription: Omit<UserSubscription, "id"> = {
        userId,
        subscriptionType: newSubscriptionType,
        status: "active",
        startDate,
        endDate,
        isTrialExpired: false,
        createdAt: startDate,
        updatedAt: startDate,
      }

      await addDoc(subscriptionsRef, {
        ...subscription,
        startDate: serverTimestamp(),
        endDate: endDate || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    console.log(`✅ Upgraded subscription for user ${userId} to ${newSubscriptionType}`)
  } catch (error) {
    console.error("❌ Error upgrading subscription:", error)
    throw new Error(`Failed to upgrade subscription: ${(error as any).message}`)
  }
}

export const checkAndUpdateExpiredTrials = async (): Promise<number> => {
  try {
    const database = ensureDb()
    const subscriptionsRef = collection(database, "subscriptions")
    const q = query(
      subscriptionsRef,
      where("subscriptionType", "==", "trial"),
      where("status", "==", "active")
    )
    const snapshot = await getDocs(q)

    let expiredCount = 0
    const batch = writeBatch(database)

    snapshot.docs.forEach((doc) => {
      const data = doc.data()
      const trialEndDate = convertTimestamp(data.trialEndDate)
      
      if (new Date() > trialEndDate) {
        batch.update(doc.ref, {
          status: "expired",
          isTrialExpired: true,
          updatedAt: serverTimestamp(),
        })
        expiredCount++
      }
    })

    if (expiredCount > 0) {
      await batch.commit()
      console.log(`✅ Marked ${expiredCount} trial subscriptions as expired`)
    }

    return expiredCount
  } catch (error) {
    console.error("❌ Error checking expired trials:", error)
    throw new Error(`Failed to check expired trials: ${(error as any).message}`)
  }
}

export const getAllSubscriptions = async (): Promise<UserSubscription[]> => {
  try {
    const database = ensureDb()
    const subscriptionsRef = collection(database, "subscriptions")
    const q = query(subscriptionsRef, orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        subscriptionType: data.subscriptionType,
        status: data.status,
        startDate: convertTimestamp(data.startDate),
        endDate: data.endDate ? convertTimestamp(data.endDate) : undefined,
        trialEndDate: data.trialEndDate ? convertTimestamp(data.trialEndDate) : undefined,
        isTrialExpired: data.isTrialExpired || false,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      }
    })
  } catch (error) {
    console.error("❌ Error getting all subscriptions:", error)
    throw new Error(`Failed to get all subscriptions: ${(error as any).message}`)
  }
}

export const deleteSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const database = ensureDb()
    const subscriptionRef = doc(database, "subscriptions", subscriptionId)
    await deleteDoc(subscriptionRef)
    
    console.log(`✅ Deleted subscription ${subscriptionId}`)
  } catch (error) {
    console.error("❌ Error deleting subscription:", error)
    throw new Error(`Failed to delete subscription: ${(error as any).message}`)
  }
}
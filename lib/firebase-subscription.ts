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
import type { UserSubscription } from "./subscription-system"
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
    const now = new Date()
    const trialEndDate = calculateTrialEndDate(now)
    
    const subscription: UserSubscription = {
      userId,
      subscriptionType: 'trial',
      trialStartDate: now,
      trialEndDate,
      isActive: true,
      maxTeachers: SUBSCRIPTION_PLANS.trial.maxTeachers,
      maxStudents: SUBSCRIPTION_PLANS.trial.maxStudents,
      currentTeachers: 0,
      currentStudents: 0
    }

    const subscriptionRef = doc(database, "subscriptions", userId)
    await updateDoc(subscriptionRef, {
      ...subscription,
      trialStartDate: serverTimestamp(),
      trialEndDate: trialEndDate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Created trial subscription for user ${userId}`)
    return subscription
  } catch (error) {
    console.error("❌ Error creating trial subscription:", error)
    throw new Error(`Failed to create trial subscription: ${(error as any).message}`)
  }
}

export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  try {
    const database = ensureDb()
    const subscriptionRef = doc(database, "subscriptions", userId)
    const subscriptionDoc = await getDoc(subscriptionRef)

    if (!subscriptionDoc.exists()) {
      // Create trial subscription for new users
      return await createTrialSubscription(userId)
    }

    const data = subscriptionDoc.data()
    return {
      userId: data.userId,
      subscriptionType: data.subscriptionType,
      trialStartDate: data.trialStartDate ? convertTimestamp(data.trialStartDate) : undefined,
      trialEndDate: data.trialEndDate ? convertTimestamp(data.trialEndDate) : undefined,
      subscriptionStartDate: data.subscriptionStartDate ? convertTimestamp(data.subscriptionStartDate) : undefined,
      subscriptionEndDate: data.subscriptionEndDate ? convertTimestamp(data.subscriptionEndDate) : undefined,
      isActive: data.isActive,
      maxTeachers: data.maxTeachers,
      maxStudents: data.maxStudents,
      currentTeachers: data.currentTeachers || 0,
      currentStudents: data.currentStudents || 0,
    }
  } catch (error) {
    console.error("❌ Error getting user subscription:", error)
    throw new Error(`Failed to get user subscription: ${(error as any).message}`)
  }
}

export const updateSubscription = async (
  userId: string,
  subscriptionType: 'trial' | 'premium' | 'unlimited',
  adminId?: string
): Promise<void> => {
  try {
    const database = ensureDb()
    const subscriptionRef = doc(database, "subscriptions", userId)
    
    const plan = SUBSCRIPTION_PLANS[subscriptionType]
    const now = new Date()
    
    const updateData: any = {
      subscriptionType,
      maxTeachers: plan.maxTeachers,
      maxStudents: plan.maxStudents,
      isActive: true,
      updatedAt: serverTimestamp(),
    }

    if (subscriptionType === 'premium' || subscriptionType === 'unlimited') {
      updateData.subscriptionStartDate = now
      // For lifetime subscriptions, we don't set an end date
      if (plan.duration > 0) {
        const endDate = new Date(now)
        endDate.setDate(endDate.getDate() + plan.duration)
        updateData.subscriptionEndDate = endDate
      }
    }

    await updateDoc(subscriptionRef, updateData)

    // Log the upgrade
    if (adminId) {
      const upgradeLogRef = collection(database, "upgradeLog")
      await addDoc(upgradeLogRef, {
        userId,
        adminId,
        fromType: 'trial', // We could get this from current subscription
        toType: subscriptionType,
        timestamp: serverTimestamp(),
      })
    }

    console.log(`✅ Updated subscription for user ${userId} to ${subscriptionType}`)
  } catch (error) {
    console.error("❌ Error updating subscription:", error)
    throw new Error(`Failed to update subscription: ${(error as any).message}`)
  }
}

export const updateUserCounts = async (
  userId: string,
  teacherCount: number,
  studentCount: number
): Promise<void> => {
  try {
    const database = ensureDb()
    const subscriptionRef = doc(database, "subscriptions", userId)
    
    await updateDoc(subscriptionRef, {
      currentTeachers: teacherCount,
      currentStudents: studentCount,
      updatedAt: serverTimestamp(),
    })

    console.log(`✅ Updated user counts for ${userId}: ${teacherCount} teachers, ${studentCount} students`)
  } catch (error) {
    console.error("❌ Error updating user counts:", error)
    throw new Error(`Failed to update user counts: ${(error as any).message}`)
  }
}

export const checkExpiredTrials = async (): Promise<string[]> => {
  try {
    const database = ensureDb()
    const subscriptionsRef = collection(database, "subscriptions")
    const now = new Date()
    
    const q = query(
      subscriptionsRef,
      where("subscriptionType", "==", "trial"),
      where("isActive", "==", true),
      where("trialEndDate", "<=", now)
    )
    
    const snapshot = await getDocs(q)
    const expiredUserIds: string[] = []
    const batch = writeBatch(database)

    snapshot.docs.forEach((doc) => {
      const userId = doc.id
      expiredUserIds.push(userId)
      
      // Deactivate expired trial
      batch.update(doc.ref, {
        isActive: false,
        updatedAt: serverTimestamp(),
      })
    })

    if (expiredUserIds.length > 0) {
      await batch.commit()
      console.log(`✅ Deactivated ${expiredUserIds.length} expired trial subscriptions`)
    }

    return expiredUserIds
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
        userId: doc.id,
        subscriptionType: data.subscriptionType,
        trialStartDate: data.trialStartDate ? convertTimestamp(data.trialStartDate) : undefined,
        trialEndDate: data.trialEndDate ? convertTimestamp(data.trialEndDate) : undefined,
        subscriptionStartDate: data.subscriptionStartDate ? convertTimestamp(data.subscriptionStartDate) : undefined,
        subscriptionEndDate: data.subscriptionEndDate ? convertTimestamp(data.subscriptionEndDate) : undefined,
        isActive: data.isActive,
        maxTeachers: data.maxTeachers,
        maxStudents: data.maxStudents,
        currentTeachers: data.currentTeachers || 0,
        currentStudents: data.currentStudents || 0,
      }
    })
  } catch (error) {
    console.error("❌ Error getting all subscriptions:", error)
    throw new Error(`Failed to get all subscriptions: ${(error as any).message}`)
  }
}
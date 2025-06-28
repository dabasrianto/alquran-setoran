import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore"
import { db } from "./firebase"
import type { UpgradeRequest, PaymentInfo, AdminActionLog, SubscriptionTier } from "./types"

// Helper function to ensure db is available
const ensureDb = () => {
  if (!db) {
    throw new Error("Firestore not initialized. Please check your Firebase configuration.")
  }
  return db
}

// Upgrade Requests Management
export const createUpgradeRequest = async (
  userId: string,
  userEmail: string,
  userName: string,
  currentTier: SubscriptionTier,
  requestedTier: SubscriptionTier,
  amount: number
): Promise<string> => {
  try {
    const database = ensureDb()
    const upgradeRequestsRef = collection(database, "upgradeRequests")
    
    const upgradeRequest: Omit<UpgradeRequest, "id"> = {
      userId,
      userEmail,
      userName,
      currentTier,
      requestedTier,
      status: "pending",
      paymentStatus: "none",
      amount,
      currency: "IDR",
      requestDate: new Date().toISOString(),
    }

    const docRef = await addDoc(upgradeRequestsRef, {
      ...upgradeRequest,
      createdAt: serverTimestamp(),
    })

    console.log(`✅ Created upgrade request ${docRef.id} for user ${userEmail}`)
    return docRef.id
  } catch (error) {
    console.error("❌ Error creating upgrade request:", error)
    throw new Error(`Failed to create upgrade request: ${(error as any).message}`)
  }
}

export const getAllUpgradeRequests = async (): Promise<UpgradeRequest[]> => {
  try {
    const database = ensureDb()
    const upgradeRequestsRef = collection(database, "upgradeRequests")
    const q = query(upgradeRequestsRef, orderBy("requestDate", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UpgradeRequest[]
  } catch (error) {
    console.error("❌ Error getting upgrade requests:", error)
    throw new Error(`Failed to load upgrade requests: ${(error as any).message}`)
  }
}

export const updateUpgradeRequestStatus = async (
  requestId: string,
  status: UpgradeRequest["status"],
  adminId: string,
  notes?: string
): Promise<void> => {
  try {
    const database = ensureDb()
    const requestRef = doc(database, "upgradeRequests", requestId)
    
    const updateData: any = {
      status,
      processedDate: new Date().toISOString(),
      processedBy: adminId,
      updatedAt: serverTimestamp(),
    }
    
    if (notes) {
      updateData.notes = notes
    }

    await updateDoc(requestRef, updateData)

    // Log admin action
    await logAdminAction(adminId, "update_upgrade_request_status", "upgrade_request", requestId, {
      newStatus: status,
      notes,
    })

    console.log(`✅ Updated upgrade request ${requestId} status to ${status}`)
  } catch (error) {
    console.error("❌ Error updating upgrade request status:", error)
    throw new Error(`Failed to update upgrade request status: ${(error as any).message}`)
  }
}

export const approveUpgradeRequest = async (
  requestId: string,
  adminId: string,
  paymentUrl?: string
): Promise<void> => {
  try {
    const database = ensureDb()
    const requestRef = doc(database, "upgradeRequests", requestId)
    
    const updateData: any = {
      status: "approved",
      paymentStatus: paymentUrl ? "pending" : "none",
      processedDate: new Date().toISOString(),
      processedBy: adminId,
      updatedAt: serverTimestamp(),
    }
    
    if (paymentUrl) {
      updateData.paymentUrl = paymentUrl
    }

    await updateDoc(requestRef, updateData)

    // Log admin action
    await logAdminAction(adminId, "approve_upgrade_request", "upgrade_request", requestId, {
      paymentUrl,
    })

    console.log(`✅ Approved upgrade request ${requestId}`)
  } catch (error) {
    console.error("❌ Error approving upgrade request:", error)
    throw new Error(`Failed to approve upgrade request: ${(error as any).message}`)
  }
}

export const rejectUpgradeRequest = async (
  requestId: string,
  adminId: string,
  reason: string
): Promise<void> => {
  try {
    const database = ensureDb()
    const requestRef = doc(database, "upgradeRequests", requestId)
    
    await updateDoc(requestRef, {
      status: "rejected",
      notes: reason,
      processedDate: new Date().toISOString(),
      processedBy: adminId,
      updatedAt: serverTimestamp(),
    })

    // Log admin action
    await logAdminAction(adminId, "reject_upgrade_request", "upgrade_request", requestId, {
      reason,
    })

    console.log(`✅ Rejected upgrade request ${requestId}`)
  } catch (error) {
    console.error("❌ Error rejecting upgrade request:", error)
    throw new Error(`Failed to reject upgrade request: ${(error as any).message}`)
  }
}

// Payment Management
export const createPayment = async (
  upgradeRequestId: string,
  userId: string,
  amount: number,
  method: PaymentInfo["method"]
): Promise<string> => {
  try {
    const database = ensureDb()
    const paymentsRef = collection(database, "payments")
    
    const payment: Omit<PaymentInfo, "id"> = {
      upgradeRequestId,
      userId,
      amount,
      currency: "IDR",
      method,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    const docRef = await addDoc(paymentsRef, {
      ...payment,
      createdAt: serverTimestamp(),
    })

    console.log(`✅ Created payment ${docRef.id} for upgrade request ${upgradeRequestId}`)
    return docRef.id
  } catch (error) {
    console.error("❌ Error creating payment:", error)
    throw new Error(`Failed to create payment: ${(error as any).message}`)
  }
}

export const updatePaymentStatus = async (
  paymentId: string,
  status: PaymentInfo["status"],
  gatewayTransactionId?: string,
  gatewayResponse?: any,
  failureReason?: string
): Promise<void> => {
  try {
    const database = ensureDb()
    const paymentRef = doc(database, "payments", paymentId)
    
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    }
    
    if (status === "completed") {
      updateData.completedAt = new Date().toISOString()
    }
    
    if (gatewayTransactionId) {
      updateData.gatewayTransactionId = gatewayTransactionId
    }
    
    if (gatewayResponse) {
      updateData.gatewayResponse = gatewayResponse
    }
    
    if (failureReason) {
      updateData.failureReason = failureReason
    }

    await updateDoc(paymentRef, updateData)

    console.log(`✅ Updated payment ${paymentId} status to ${status}`)
  } catch (error) {
    console.error("❌ Error updating payment status:", error)
    throw new Error(`Failed to update payment status: ${(error as any).message}`)
  }
}

export const getPaymentsByUpgradeRequest = async (upgradeRequestId: string): Promise<PaymentInfo[]> => {
  try {
    const database = ensureDb()
    const paymentsRef = collection(database, "payments")
    const q = query(paymentsRef, where("upgradeRequestId", "==", upgradeRequestId), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PaymentInfo[]
  } catch (error) {
    console.error("❌ Error getting payments:", error)
    throw new Error(`Failed to load payments: ${(error as any).message}`)
  }
}

// Admin Action Logging
export const logAdminAction = async (
  adminId: string,
  action: string,
  targetType: AdminActionLog["targetType"],
  targetId: string,
  details: any,
  ipAddress?: string
): Promise<void> => {
  try {
    const database = ensureDb()
    const logsRef = collection(database, "adminLogs")
    
    const log: Omit<AdminActionLog, "id"> = {
      adminId,
      adminEmail: "", // Will be filled by the calling function
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
      ipAddress,
    }

    await addDoc(logsRef, {
      ...log,
      createdAt: serverTimestamp(),
    })

    console.log(`📝 Logged admin action: ${action} by ${adminId}`)
  } catch (error) {
    console.error("❌ Error logging admin action:", error)
    // Don't throw error for logging failures
  }
}

export const getAdminLogs = async (limit: number = 100): Promise<AdminActionLog[]> => {
  try {
    const database = ensureDb()
    const logsRef = collection(database, "adminLogs")
    const q = query(logsRef, orderBy("timestamp", "desc"))
    const snapshot = await getDocs(q)

    return snapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AdminActionLog[]
  } catch (error) {
    console.error("❌ Error getting admin logs:", error)
    throw new Error(`Failed to load admin logs: ${(error as any).message}`)
  }
}

// Payment Gateway Integration (Mock Implementation)
export const generatePaymentUrl = async (
  upgradeRequest: UpgradeRequest,
  method: PaymentInfo["method"]
): Promise<string> => {
  try {
    // In a real implementation, this would integrate with payment gateways like:
    // - Midtrans
    // - Xendit
    // - DOKU
    // - OVO
    // - GoPay
    // etc.
    
    // For now, we'll create a mock payment URL
    const paymentId = await createPayment(upgradeRequest.id, upgradeRequest.userId, upgradeRequest.amount, method)
    
    // Mock payment URL - in production, this would be from the payment gateway
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://tasmi-app.com"
    const paymentUrl = `${baseUrl}/payment/${paymentId}?method=${method}&amount=${upgradeRequest.amount}`
    
    // Update upgrade request with payment URL
    const database = ensureDb()
    const requestRef = doc(database, "upgradeRequests", upgradeRequest.id)
    await updateDoc(requestRef, {
      paymentUrl,
      paymentStatus: "pending",
      updatedAt: serverTimestamp(),
    })
    
    console.log(`✅ Generated payment URL for upgrade request ${upgradeRequest.id}`)
    return paymentUrl
  } catch (error) {
    console.error("❌ Error generating payment URL:", error)
    throw new Error(`Failed to generate payment URL: ${(error as any).message}`)
  }
}

// Process successful payment and upgrade user
export const processSuccessfulPayment = async (
  paymentId: string,
  upgradeRequestId: string,
  adminId: string
): Promise<void> => {
  try {
    const database = ensureDb()
    const batch = writeBatch(database)
    
    // Get upgrade request
    const upgradeRequestRef = doc(database, "upgradeRequests", upgradeRequestId)
    const upgradeRequestDoc = await getDoc(upgradeRequestRef)
    
    if (!upgradeRequestDoc.exists()) {
      throw new Error("Upgrade request not found")
    }
    
    const upgradeRequest = upgradeRequestDoc.data() as UpgradeRequest
    
    // Update payment status
    const paymentRef = doc(database, "payments", paymentId)
    batch.update(paymentRef, {
      status: "completed",
      completedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    })
    
    // Update upgrade request status
    batch.update(upgradeRequestRef, {
      status: "completed",
      paymentStatus: "completed",
      processedDate: new Date().toISOString(),
      processedBy: adminId,
      updatedAt: serverTimestamp(),
    })
    
    // Update user subscription
    const userRef = doc(database, "users", upgradeRequest.userId)
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + 1) // 1 month from now
    
    batch.update(userRef, {
      subscriptionType: upgradeRequest.requestedTier,
      subscriptionExpiry: expiryDate,
      updatedAt: serverTimestamp(),
    })
    
    await batch.commit()
    
    // Log admin action
    await logAdminAction(adminId, "process_successful_payment", "payment", paymentId, {
      upgradeRequestId,
      newTier: upgradeRequest.requestedTier,
      userId: upgradeRequest.userId,
    })
    
    console.log(`✅ Processed successful payment ${paymentId} and upgraded user ${upgradeRequest.userId}`)
  } catch (error) {
    console.error("❌ Error processing successful payment:", error)
    throw new Error(`Failed to process successful payment: ${(error as any).message}`)
  }
}
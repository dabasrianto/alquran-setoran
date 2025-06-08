import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, type User } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, googleProvider, db } from "./firebase"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  subscriptionType: "free" | "premium"
  subscriptionExpiry?: Date
  createdAt: Date
  updatedAt: Date
}

export const signInWithGoogle = async (): Promise<UserProfile | null> => {
  try {
    // Wait for auth to be ready
    if (!auth) {
      throw new Error("Firebase Auth not initialized")
    }

    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    if (!user.email) {
      throw new Error("No email found in Google account")
    }

    // Create or update user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email,
      photoURL: user.photoURL || undefined,
      subscriptionType: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Check if user already exists
    const userDocRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      // New user - set initial profile
      await setDoc(userDocRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      // Existing user - update last login
      const existingData = userDoc.data()
      await setDoc(
        userDocRef,
        {
          ...existingData,
          displayName: user.displayName || existingData.displayName,
          photoURL: user.photoURL || existingData.photoURL,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
    }

    return userProfile
  } catch (error: any) {
    console.error("Error signing in with Google:", error)

    // Handle specific Firebase auth errors
    if (error.code) {
      switch (error.code) {
        case "auth/unauthorized-domain":
          throw new Error("Domain tidak diizinkan. Silakan hubungi administrator.")
        case "auth/popup-blocked":
          throw new Error("Popup diblokir browser. Silakan izinkan popup dan coba lagi.")
        case "auth/popup-closed-by-user":
          throw new Error("Login dibatalkan oleh pengguna.")
        case "auth/network-request-failed":
          throw new Error("Koneksi internet bermasalah. Silakan coba lagi.")
        case "auth/too-many-requests":
          throw new Error("Terlalu banyak percobaan login. Silakan coba lagi nanti.")
        case "auth/user-disabled":
          throw new Error("Akun telah dinonaktifkan.")
        default:
          throw new Error(`Error login: ${error.message}`)
      }
    }

    throw error
  }
}

export const signOut = async (): Promise<void> => {
  try {
    if (!auth) {
      throw new Error("Firebase Auth not initialized")
    }
    await firebaseSignOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.error("Firebase Auth not initialized")
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

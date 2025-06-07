import {
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
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

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: "select_account",
})

export const signInWithGoogleRedirect = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, googleProvider)
  } catch (error: any) {
    console.error("Error initiating Google sign in:", error)
    throw error
  }
}

export const handleRedirectResult = async (): Promise<UserProfile | null> => {
  try {
    const result = await getRedirectResult(auth)

    if (!result) {
      return null // No redirect result
    }

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
      await setDoc(userDocRef, userProfile)
    } else {
      // Existing user - update last login
      await setDoc(
        userDocRef,
        {
          ...userDoc.data(),
          updatedAt: new Date(),
        },
        { merge: true },
      )
    }

    return userProfile
  } catch (error: any) {
    console.error("Error handling redirect result:", error)
    throw error
  }
}

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

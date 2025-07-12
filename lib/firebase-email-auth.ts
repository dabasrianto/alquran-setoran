import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "./firebase"

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

export const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<UserProfile> => {
  try {
    if (!auth) {
      throw new Error("Firebase Auth not initialized")
    }

    // Validasi input
    if (!email || !password || !displayName) {
      throw new Error("Email, password, dan nama lengkap harus diisi")
    }

    if (password.length < 6) {
      throw new Error("Password minimal 6 karakter")
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error("Format email tidak valid")
    }

    console.log("🔄 Creating user with email:", email)

    // Create user dengan email dan password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("✅ User created successfully:", user.uid)

    // Update profile dengan display name
    await updateProfile(user, {
      displayName: displayName,
    })

    // Create user profile di Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName,
      subscriptionType: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const userDocRef = doc(db, "users", user.uid)
    const firestoreData = {
      ...userProfile,
      photoURL: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(userDocRef, firestoreData)
    console.log("✅ User profile created in Firestore")

    return userProfile
  } catch (error: any) {
    console.error("❌ Error signing up with email:", error)

    // Handle specific Firebase auth errors
    if (error.code) {
      switch (error.code) {
        case "auth/email-already-in-use":
          throw new Error("Email sudah terdaftar. Silakan gunakan email lain atau login.")
        case "auth/invalid-email":
          throw new Error("Format email tidak valid.")
        case "auth/operation-not-allowed":
          throw new Error("Pendaftaran dengan email tidak diizinkan.")
        case "auth/weak-password":
          throw new Error("Password terlalu lemah. Gunakan minimal 6 karakter.")
        case "auth/network-request-failed":
          throw new Error("Koneksi internet bermasalah. Silakan coba lagi.")
        case "auth/too-many-requests":
          throw new Error("Terlalu banyak percobaan. Silakan coba lagi nanti.")
        default:
          throw new Error(`Error pendaftaran: ${error.message}`)
      }
    }

    throw error
  }
}

export const signInWithEmail = async (email: string, password: string): Promise<UserProfile> => {
  try {
    if (!auth) {
      throw new Error("Firebase Auth not initialized")
    }

    // Validasi input
    if (!email || !password) {
      throw new Error("Email dan password harus diisi")
    }

    // Clean and validate email
    email = email.trim().toLowerCase()
    password = password.trim()

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error("Format email tidak valid")
    }

    console.log("🔄 Attempting to sign in with email:", email)

    // Sign in dengan email dan password
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    console.log("✅ User signed in successfully:", user.uid)

    // Get atau create user profile di Firestore
    const userDocRef = doc(db, "users", user.uid)
    let userDoc

    try {
      userDoc = await getDoc(userDocRef)
    } catch (firestoreError) {
      console.warn("⚠️ Error fetching user profile from Firestore:", firestoreError)
      // Continue without profile for now
    }

    let userProfile: UserProfile

    if (!userDoc || !userDoc.exists()) {
      console.log("📝 Creating new user profile for existing user")
      // Create profile jika belum ada (untuk user lama)
      userProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || user.email!.split("@")[0],
        subscriptionType: "free",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      try {
        const firestoreData = {
          ...userProfile,
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }

        await setDoc(userDocRef, firestoreData)
        console.log("✅ User profile created in Firestore")
      } catch (firestoreError) {
        console.warn("⚠️ Error creating user profile in Firestore:", firestoreError)
        // Continue without saving to Firestore for now
      }
    } else {
      console.log("✅ User profile found, updating last login")
      try {
        // Update last login
        const existingData = userDoc.data()
        const updateData = {
          ...existingData,
          updatedAt: serverTimestamp(),
        }

        await setDoc(userDocRef, updateData, { merge: true })

        userProfile = {
          ...existingData,
          createdAt: existingData.createdAt?.toDate() || new Date(),
          updatedAt: new Date(),
        } as UserProfile
      } catch (firestoreError) {
        console.warn("⚠️ Error updating user profile in Firestore:", firestoreError)
        // Fallback to basic profile
        userProfile = {
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || user.email!.split("@")[0],
          subscriptionType: "free",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
    }

    return userProfile
  } catch (error: any) {
    console.error("❌ Error signing in with email:", error)

    // Handle specific Firebase auth errors
    if (error.code) {
      switch (error.code) {
        case "auth/user-not-found":
          throw new Error("Email tidak terdaftar. Silakan daftar terlebih dahulu.")
        case "auth/wrong-password":
          throw new Error("Password salah. Silakan coba lagi.")
        case "auth/invalid-email":
          throw new Error("Format email tidak valid.")
        case "auth/user-disabled":
          throw new Error("Akun telah dinonaktifkan.")
        case "auth/too-many-requests":
          throw new Error("Terlalu banyak percobaan login. Silakan coba lagi nanti.")
        case "auth/network-request-failed":
          throw new Error("Koneksi internet bermasalah. Silakan coba lagi.")
        case "auth/invalid-credential":
          throw new Error("Email atau password salah. Pastikan email dan password benar.")
        case "auth/invalid-login-credentials":
          throw new Error("Email atau password salah. Pastikan email dan password benar.")
        case "auth/missing-password":
          throw new Error("Password harus diisi.")
        case "auth/missing-email":
          throw new Error("Email harus diisi.")
        default:
          throw new Error(`Error login: ${error.message}`)
      }
    }

    throw error
  }
}

export const resetPassword = async (email: string): Promise<void> => {
  try {
    if (!auth) {
      throw new Error("Firebase Auth not initialized")
    }

    if (!email) {
      throw new Error("Email harus diisi")
    }

    // Trim and validate email
    email = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error("Format email tidak valid")
    }

    console.log("🔄 Sending password reset email to:", email)
    await sendPasswordResetEmail(auth, email)
    console.log("✅ Password reset email sent successfully")
  } catch (error: any) {
    console.error("❌ Error sending password reset email:", error)

    if (error.code) {
      switch (error.code) {
        case "auth/user-not-found":
          throw new Error("Email tidak terdaftar.")
        case "auth/invalid-email":
          throw new Error("Format email tidak valid.")
        case "auth/too-many-requests":
          throw new Error("Terlalu banyak permintaan. Silakan coba lagi nanti.")
        case "auth/network-request-failed":
          throw new Error("Koneksi internet bermasalah. Silakan coba lagi.")
        default:
          throw new Error(`Error reset password: ${error.message}`)
      }
    }

    throw error
  }
}

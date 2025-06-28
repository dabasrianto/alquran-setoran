import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  type User 
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

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<UserProfile> => {
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

    // Create user dengan email dan password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile dengan display name
    await updateProfile(user, {
      displayName: displayName
    })

    // Create user profile di Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: displayName,
      photoURL: undefined,
      subscriptionType: "free",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const userDocRef = doc(db, "users", user.uid)
    await setDoc(userDocRef, {
      ...userProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return userProfile
  } catch (error: any) {
    console.error("Error signing up with email:", error)

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

    // Sign in dengan email dan password
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Get atau create user profile di Firestore
    const userDocRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userDocRef)

    let userProfile: UserProfile

    if (!userDoc.exists()) {
      // Create profile jika belum ada (untuk user lama)
      userProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || user.email!,
        photoURL: user.photoURL || undefined,
        subscriptionType: "free",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(userDocRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      // Update last login
      const existingData = userDoc.data()
      await setDoc(
        userDocRef,
        {
          ...existingData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      userProfile = {
        ...existingData,
        createdAt: existingData.createdAt?.toDate() || new Date(),
        updatedAt: new Date(),
      } as UserProfile
    }

    return userProfile
  } catch (error: any) {
    console.error("Error signing in with email:", error)

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
          throw new Error("Email atau password salah.")
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

    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    console.error("Error sending password reset email:", error)

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
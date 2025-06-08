import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate required config
const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"]
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig])

if (missingKeys.length > 0) {
  console.error("Missing Firebase configuration keys:", missingKeys)
  throw new Error(`Missing Firebase configuration: ${missingKeys.join(", ")}`)
}

// Initialize Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase Auth
const auth = getAuth(app)

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: "select_account",
})

// Initialize Firestore
const db = getFirestore(app)

export { auth, googleProvider, db }
export default app

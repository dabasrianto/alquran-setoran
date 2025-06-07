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
let app
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
} catch (error) {
  console.error("Error initializing Firebase app:", error)
  throw error
}

// Initialize Firebase Auth
let auth
let googleProvider
try {
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()

  // Configure Google provider
  googleProvider.setCustomParameters({
    prompt: "select_account",
  })
} catch (error) {
  console.error("Error initializing Firebase Auth:", error)
  throw error
}

// Initialize Firestore
let db
try {
  db = getFirestore(app)
} catch (error) {
  console.error("Error initializing Firestore:", error)
  throw error
}

// Only connect to emulators in development and if not already connected
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  try {
    // Check if emulators are already connected
    if (!auth._delegate._config?.emulator) {
      // connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
    }
    // if (!db._delegate._databaseId?.projectId?.includes('demo-')) {
    //   connectFirestoreEmulator(db, 'localhost', 8080)
    // }
  } catch (error) {
    // Emulator connection errors are non-critical in production
    console.warn("Could not connect to Firebase emulators:", error)
  }
}

export { auth, googleProvider, db }
export default app

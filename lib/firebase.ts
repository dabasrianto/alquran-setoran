import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: 'AIzaSyAxQboWL01Kp26ZObj4A7LVfR2cQ67cJWg',
  authDomain: 'tasmi-web.firebaseapp.com',
  projectId: 'tasmi-web',
  storageBucket: 'tasmi-web.firebasestorage.app',
  messagingSenderId: '944178222011',
  appId: '1:944178222011:web:e3deadab61b4d5b7772a9e',
};


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

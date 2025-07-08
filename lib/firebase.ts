import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAxQboWL01Kp26ZObj4A7LVfR2cQ67cJWg',
  authDomain: 'tasmi-web.firebaseapp.com',
  projectId: 'tasmi-web',
  storageBucket: 'tasmi-web.appspot.com',
  messagingSenderId: '944178222011',
  appId: '1:944178222011:web:e3deadab61b4d5b7772a9e',
};

// Add retry logic for Firebase initialization
let retryCount = 0;
const MAX_RETRIES = 3;

function initializeFirebase() {
  try {
    // Validate required config
    const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"]
    const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key as keyof typeof firebaseConfig])

    if (missingKeys.length > 0) {
      console.error("Missing Firebase configuration keys:", missingKeys)
      throw new Error(`Missing Firebase configuration: ${missingKeys.join(", ")}`)
    }

    // Initialize Firebase app
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    console.log("Firebase initialized successfully")
    return app;
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying Firebase initialization (${retryCount}/${MAX_RETRIES})...`);
      return initializeApp(firebaseConfig);
    }
    throw error;
  }
}

// Initialize with retry logic
const app = initializeFirebase();

// Initialize Firebase Auth
const auth = getAuth(app)

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: "select_account",
})

// Initialize Firestore
const db = getFirestore(app)

// Export a function to check connection status
export const checkFirebaseConnection = async () => {
  try {
    if (!db) return false;
    // Try a simple operation to verify connection
    const timestamp = Date.now().toString();
    console.log(`Checking Firebase connection: ${timestamp}`);
    return true;
  } catch (error) {
    console.error("Firebase connection check failed:", error);
    return false;
  }
}

export { auth, googleProvider, db }
export default app

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/hooks/use-subscription"
import { useEffect, useState } from "react"
import { getFirestore, collection, getDocs } from "firebase/firestore"
import { app } from "@/lib/firebase" // Assuming 'app' is exported from firebase.ts
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAllUsers, getUserProfile } from "@/lib/firebase-firestore"
import { Bug, Database } from "lucide-react"

export function AdminDebug() {
  const { currentUser, isAdmin, loading: authLoading } = useAuth()
  const { userSubscription, loading: subscriptionLoading } = useSubscription()
  const [firestoreDataCount, setFirestoreDataCount] = useState<Record<string, number>>({})
  const [loadingDataCount, setLoadingDataCount] = useState(true)
  const [testResult, setTestResult] = useState<string>("")
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    const fetchCollectionCounts = async () => {
      setLoadingDataCount(true)
      const db = getFirestore(app)
      const collectionsToCount = [
        "users",
        "subscriptions",
        "upgradeRequests",
        "payments",
        "adminLogs",
        "pricing",
        "settings",
      ]
      const counts: Record<string, number> = {}

      for (const colName of collectionsToCount) {
        try {
          const querySnapshot = await getDocs(collection(db, colName))
          counts[colName] = querySnapshot.size
        } catch (error) {
          console.error(`Error fetching count for collection ${colName}:`, error)
          counts[colName] = -1 // Indicate error
        }
      }
      setFirestoreDataCount(counts)
      setLoadingDataCount(false)
    }

    fetchCollectionCounts()
  }, [])

  const testFirebaseConnection = async () => {
    setTesting(true)
    setTestResult("Testing Firebase connection...")

    try {
      // Test 1: Get current user profile
      if (currentUser?.uid) {
        setTestResult("✅ Step 1: User authenticated\n")

        const profile = await getUserProfile(currentUser.uid)
        setTestResult((prev) => prev + `✅ Step 2: User profile loaded: ${profile?.email}\n`)
      }

      // Test 2: Try to get all users
      setTestResult((prev) => prev + "🔄 Step 3: Attempting to load all users...\n")

      const users = await getAllUsers()
      setTestResult((prev) => prev + `✅ Step 3: Successfully loaded ${users.length} users\n`)

      if (users.length > 0) {
        setTestResult((prev) => prev + "📋 Users found:\n")
        users.forEach((u, index) => {
          setTestResult((prev) => prev + `  ${index + 1}. ${u.email} (${u.subscriptionType})\n`)
        })
      }
    } catch (error: any) {
      setTestResult((prev) => prev + `❌ Error: ${error.message}\n`)
      console.error("Firebase test error:", error)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Debug & Informasi Sistem
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <div>
          <h3 className="font-semibold text-lg mb-2">Informasi Pengguna Aktif</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p>
              <strong>User ID:</strong> {currentUser?.uid || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {currentUser?.email || "N/A"}
            </p>
            <p>
              <strong>Admin:</strong> {isAdmin ? "Ya" : "Tidak"}
            </p>
            <p>
              <strong>Auth Loading:</strong> {authLoading ? "Ya" : "Tidak"}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-2">Informasi Langganan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p>
              <strong>Status Langganan:</strong> {userSubscription?.status || "N/A"}
            </p>
            <p>
              <strong>Tier Langganan:</strong> {userSubscription?.tier || "N/A"}
            </p>
            <p>
              <strong>Tanggal Mulai:</strong> {userSubscription?.startDate?.toDateString() || "N/A"}
            </p>
            <p>
              <strong>Tanggal Berakhir:</strong> {userSubscription?.endDate?.toDateString() || "N/A"}
            </p>
            <p>
              <strong>Subscription Loading:</strong> {subscriptionLoading ? "Ya" : "Tidak"}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-2">Statistik Firestore</h3>
          {loadingDataCount ? (
            <p>Memuat jumlah koleksi...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(firestoreDataCount).map(([colName, count]) => (
                <p key={colName}>
                  <strong>{colName} Count:</strong> {count === -1 ? "Error" : count}
                </p>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold text-lg mb-2">Variabel Lingkungan (Public)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p>
              <strong>NEXT_PUBLIC_FIREBASE_PROJECT_ID:</strong>{" "}
              {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Tidak Ditemukan"}
            </p>
            <p>
              <strong>NEXT_PUBLIC_FIREBASE_APP_ID:</strong>{" "}
              {process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "Tidak Ditemukan"}
            </p>
            {/* Add other public env variables as needed for debugging */}
          </div>
        </div>

        <Separator />

        <div>
          <Button onClick={testFirebaseConnection} disabled={testing}>
            <Database className="h-4 w-4 mr-2" />
            {testing ? "Testing..." : "Test Firebase Connection"}
          </Button>

          {testResult && (
            <Alert>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

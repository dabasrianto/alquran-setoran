"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getAllUsers, getUserProfile } from "@/lib/firebase-firestore"
import { useAuth } from "@/contexts/auth-context"
import { Bug, Database } from "lucide-react"

export default function AdminDebug() {
  const { user } = useAuth()
  const [testResult, setTestResult] = useState<string>("")
  const [testing, setTesting] = useState(false)

  const testFirebaseConnection = async () => {
    setTesting(true)
    setTestResult("Testing Firebase connection...")

    try {
      // Test 1: Get current user profile
      if (user?.uid) {
        setTestResult("✅ Step 1: User authenticated\n")

        const profile = await getUserProfile(user.uid)
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Debug Firebase Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Current User:</strong> {user?.email}
          </p>
          <p>
            <strong>User ID:</strong> {user?.uid}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { 
  Shield, 
  Database, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  User
} from "lucide-react"
import { 
  collection, 
  getDocs, 
  query, 
  limit, 
  doc, 
  getDoc 
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function FirebasePermissionDiagnostic() {
  const { user } = useAuth()
  const [testResult, setTestResult] = useState<string>("")
  const [testing, setTesting] = useState(false)

  const testFirebasePermissions = async () => {
    setTesting(true)
    setTestResult("🔍 Testing Firebase permissions...\n\n")
    
    try {
      // Step 1: Check basic connection
      setTestResult(prev => prev + "Step 1: Checking basic connection...\n")
      if (!db) {
        setTestResult(prev => prev + "❌ Firebase db not initialized\n\n")
        return
      }
      setTestResult(prev => prev + "✅ Firebase db initialized\n\n")
      
      // Step 2: Check authentication
      setTestResult(prev => prev + "Step 2: Checking authentication...\n")
      if (!user) {
        setTestResult(prev => prev + "❌ User not authenticated\n\n")
        return
      }
      setTestResult(prev => prev + `✅ User authenticated as ${user.email}\n\n`)
      
      // Step 3: Check admin status
      setTestResult(prev => prev + "Step 3: Checking admin status...\n")
      const isAdminEmail = user.email === 'dabasrianto@gmail.com'
      setTestResult(prev => prev + `${isAdminEmail ? '✅' : '❓'} Email match with admin rule: ${isAdminEmail}\n`)
      
      // Get ID token result to check custom claims
      const tokenResult = await user.getIdTokenResult(true)
      const hasAdminClaim = tokenResult.claims.admin === true
      setTestResult(prev => prev + `${hasAdminClaim ? '✅' : '❓'} Has admin custom claim: ${hasAdminClaim}\n\n`)
      
      // Step 4: Test reading users collection
      setTestResult(prev => prev + "Step 4: Testing users collection access...\n")
      try {
        const usersRef = collection(db, "users")
        const q = query(usersRef, limit(1))
        const snapshot = await getDocs(q)
        setTestResult(prev => prev + `✅ Successfully read users collection (${snapshot.size} docs)\n\n`)
      } catch (error: any) {
        setTestResult(prev => prev + `❌ Failed to read users collection: ${error.message}\n\n`)
      }
      
      // Step 5: Test reading own user document
      setTestResult(prev => prev + "Step 5: Testing own user document access...\n")
      try {
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        setTestResult(prev => prev + `✅ Successfully read own user document (exists: ${userDoc.exists()})\n\n`)
      } catch (error: any) {
        setTestResult(prev => prev + `❌ Failed to read own user document: ${error.message}\n\n`)
      }
      
      // Step 6: Test reading upgradeRequests collection
      setTestResult(prev => prev + "Step 6: Testing upgradeRequests collection access...\n")
      try {
        const requestsRef = collection(db, "upgradeRequests")
        const q = query(requestsRef, limit(1))
        const snapshot = await getDocs(q)
        setTestResult(prev => prev + `✅ Successfully read upgradeRequests collection (${snapshot.size} docs)\n\n`)
      } catch (error: any) {
        setTestResult(prev => prev + `❌ Failed to read upgradeRequests collection: ${error.message}\n\n`)
      }
      
      // Step 7: Test reading adminLogs collection
      setTestResult(prev => prev + "Step 7: Testing adminLogs collection access...\n")
      try {
        const logsRef = collection(db, "adminLogs")
        const q = query(logsRef, limit(1))
        const snapshot = await getDocs(q)
        setTestResult(prev => prev + `✅ Successfully read adminLogs collection (${snapshot.size} docs)\n\n`)
      } catch (error: any) {
        setTestResult(prev => prev + `❌ Failed to read adminLogs collection: ${error.message}\n\n`)
      }
      
      // Final summary
      setTestResult(prev => prev + "🔍 Diagnosis Summary:\n")
      if (prev.includes("❌")) {
        setTestResult(prev => prev + "⚠️ Some permission tests failed. Please check the Firebase rules deployment.\n")
        setTestResult(prev => prev + "1. Verify the rules were published in Firebase Console\n")
        setTestResult(prev => prev + "2. Ensure you're logged in with the admin email (dabasrianto@gmail.com)\n")
        setTestResult(prev => prev + "3. Wait a few minutes for rules to propagate and try again\n")
      } else {
        setTestResult(prev => prev + "✅ All permission tests passed! If you're still seeing errors, check for other issues.\n")
      }
      
    } catch (error: any) {
      setTestResult(prev => prev + `❌ Error during permission test: ${error.message}\n`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          Firebase Permission Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Permission Error Detected:</strong> This tool will help diagnose why you're getting "Missing or insufficient permissions" errors.
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span><strong>Current User:</strong> {user?.email || 'Not logged in'}</span>
        </div>

        <Button onClick={testFirebasePermissions} disabled={testing} className="w-full">
          {testing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Permission Tests...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Run Permission Diagnostic
            </>
          )}
        </Button>

        {testResult && (
          <div className="bg-muted p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-[400px]">{testResult}</pre>
          </div>
        )}

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Tip:</strong> After updating Firebase rules in the console, wait 1-2 minutes for them to take effect, then refresh the page.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
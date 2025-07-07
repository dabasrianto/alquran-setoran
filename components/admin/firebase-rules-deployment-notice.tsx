"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ExternalLink, Shield, CheckCircle } from "lucide-react"

export default function FirebaseRulesDeploymentNotice() {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          Firebase Security Rules Not Deployed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Action Required:</strong> The Firebase Security Rules need to be manually deployed to fix permission errors.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-semibold text-red-700">Quick Fix Steps:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
            <li>Select project: <strong>"tasmi-web"</strong></li>
            <li>Go to <strong>Firestore Database</strong> → <strong>Rules</strong> tab</li>
            <li>Copy rules from <code>firestore.rules</code> file</li>
            <li>Replace all existing rules and click <strong>Publish</strong></li>
            <li>Wait 1-2 minutes, then refresh this page</li>
          </ol>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a 
              href="https://console.firebase.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Open Firebase Console
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Test After Deploy
          </Button>
        </div>

        <div className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
          <strong>Why this happens:</strong> Firebase Security Rules in your code files are templates. 
          They must be manually published in Firebase Console to take effect on your live database.
        </div>
      </CardContent>
    </Card>
  )
}
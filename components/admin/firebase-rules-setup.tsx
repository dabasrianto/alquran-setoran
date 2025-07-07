"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink, Shield, Database, CheckCircle } from "lucide-react"

export default function FirebaseRulesSetup() {
  const [copied, setCopied] = useState(false)

  const firestoreRules = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Function to check if user is admin
    function isAdmin() {
      return request.auth != null && request.auth.token.email in [
        'dabasrianto@gmail.com'
      ];
    }
    
    // Function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Function to check if user owns the document
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Users collection - Admin can read all, users can read/write their own
    match /users/{userId} {
      // Admin can read all user documents
      allow read: if isAdmin();
      
      // Users can read and write their own profile
      allow read, write: if isOwner(userId);
      
      // Admin can update any user (for subscription management)
      allow write: if isAdmin();
      
      // Allow user creation during signup
      allow create: if isAuthenticated() && isOwner(userId);
      
      // Students subcollection
      match /students/{studentId} {
        allow read, write: if isOwner(userId);
        allow read: if isAdmin(); // Admin can read all students
      }
      
      // Pengujis subcollection  
      match /pengujis/{pengujiId} {
        allow read, write: if isOwner(userId);
        allow read: if isAdmin(); // Admin can read all pengujis
      }
    }
    
    // Admin-only collections (if needed in future)
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // System logs (admin only)
    match /logs/{logId} {
      allow read, write: if isAdmin();
    }
  }
}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(firestoreRules)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          Firebase Security Rules Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Penting:</strong> Firebase Security Rules perlu diupdate untuk memberikan akses admin. Ikuti
            langkah-langkah di bawah ini.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList>
            <TabsTrigger value="rules">Security Rules</TabsTrigger>
            <TabsTrigger value="steps">Langkah Setup</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Firestore Security Rules</h3>
              <Button onClick={copyToClipboard} variant="outline" size="sm">
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Rules
                  </>
                )}
              </Button>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm whitespace-pre-wrap">{firestoreRules}</pre>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cara Update Firebase Security Rules:</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Buka Firebase Console</p>
                    <p className="text-sm text-muted-foreground">
                      Pergi ke{" "}
                      <a
                        href="https://console.firebase.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        Firebase Console
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Pilih Project Tasmi</p>
                    <p className="text-sm text-muted-foreground">Pilih project "tasmi-web" dari daftar project</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Buka Firestore Database</p>
                    <p className="text-sm text-muted-foreground">Klik "Firestore Database" di menu sebelah kiri</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Buka Tab Rules</p>
                    <p className="text-sm text-muted-foreground">Klik tab "Rules" di bagian atas halaman</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <div>
                    <p className="font-medium">Replace Rules</p>
                    <p className="text-sm text-muted-foreground">
                      Hapus semua rules yang ada, lalu paste rules baru dari tab "Security Rules" di atas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    6
                  </div>
                  <div>
                    <p className="font-medium">Publish Rules</p>
                    <p className="text-sm text-muted-foreground">Klik tombol "Publish" untuk menerapkan rules baru</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium">Test Admin Access</p>
                    <p className="text-sm text-muted-foreground">
                      Kembali ke halaman admin dan test koneksi Firebase lagi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Catatan:</strong> Rules ini memberikan akses penuh kepada admin (dabasrianto@gmail.com) untuk
            membaca semua data pengguna, sambil tetap menjaga privacy pengguna biasa yang hanya bisa akses data mereka
            sendiri.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
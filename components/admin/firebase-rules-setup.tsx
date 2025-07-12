"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Copy, CheckCircle2 } from "lucide-react"
import { useState } from "react"

const firestoreRules = `
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Function to check if user is admin
    function isAdmin() {
      return request.auth != null && (
        request.auth.token.email in [
          'dabasrianto@gmail.com'
        ] || 
        (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin')
      );
    }
    
    // Function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Function to check if user owns the document
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Settings collection - Public read for pricing, admin write
    match /settings/{settingId} {
      // Anyone can read pricing settings (for landing page)
      allow read: if settingId == 'pricing' || isAuthenticated();
      
      // Only admin can write settings
      allow write: if isAdmin();
      
      // Allow creation of settings if they don't exist
      allow create: if isAdmin();
    }
    
    // Pricing collection - Public read, admin write
    match /pricing/{planId} {
      // Anyone can read pricing plans (for landing page and user dashboard)
      allow read: if true;
      
      // Only admin can write pricing
      allow write: if isAdmin();
      
      // Allow creation of pricing plans
      allow create: if isAdmin();
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
    }
    
    // Students subcollection
    match /students/{studentId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Pengujis subcollection  
    match /penguji/{pengujiId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Subscriptions collection - Users can read their own, admin can read/write all
    match /subscriptions/{subscriptionId} {
      // Users can read their own subscription data
      allow read: if isAuthenticated() && request.auth.uid == resource.data.userId;
      
      // Admin can read and write all subscriptions
      allow read, write: if isAdmin();
      
      // Allow subscription creation for authenticated users
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      
      // Users can update their own subscription (for upgrade requests)
      allow update: if isAuthenticated() && request.auth.uid == resource.data.userId;
    }
    
    // Upgrade Requests collection - Users can create their own, admin can read/write all
    match /upgradeRequests/{requestId} {
      // Users can create upgrade requests for themselves
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      
      // Users can read their own upgrade requests
      allow read: if isAuthenticated() && request.auth.uid == resource.data.userId;
      
      // Admin can read and write all upgrade requests
      allow read, write: if isAdmin();
    }
    
    // Payments collection - Admin only
    match /payments/{paymentId} {
      // Only admin can read and write payments
      allow read, write: if isAdmin();
      
      // Users can read their own payment records
      allow read: if isAuthenticated() && request.auth.uid == resource.data.userId;
    }
    
    // Admin Logs collection - Admin only
    match /adminLogs/{logId} {
      allow read, write: if isAdmin();
    }
    
    // Admin-only collections (if needed in future)
    match /admin/{document=**} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // System logs (admin only)
    match /logs/{logId} {
      allow read, write: if isAdmin();
    }
    
    // Subscription tiers - public read, admin write
    match /subscriptionTiers/{tierId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Action logs - admin only
    match /actionLogs/{logId} {
      allow read, write: if isAdmin();
    }
    
    // Payment records - users can read their own, admins can read all
    match /paymentRecords/{paymentRecordId} {
      allow read: if isAuthenticated() && 
        (request.auth.uid == resource.data.userId ||
         isAdmin());
      allow write: if isAdmin();
    }
  }
}
`

const deployCommand = `firebase deploy --only firestore:rules`

export function FirebaseRulesSetup() {
  const { toast } = useToast()
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRules)
    setCopySuccess(true)
    toast({
      title: "Aturan Disalin!",
      description: "Aturan Firestore telah disalin ke clipboard Anda.",
    })
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(deployCommand)
    setCopySuccess(true)
    toast({
      title: "Perintah Disalin!",
      description: "Perintah deploy Firebase CLI telah disalin.",
    })
    setTimeout(() => setCopySuccess(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aturan Keamanan Firebase Firestore</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Aturan di bawah ini mengontrol akses ke database Firestore Anda. Pastikan Anda memahami setiap aturan sebelum
          menerapkannya. Aturan ini memungkinkan akses baca publik ke koleksi `pricing` dan `subscriptionTiers` untuk
          menampilkan harga di landing page dan dashboard pengguna. Akses tulis ke koleksi ini hanya diizinkan untuk
          admin.
        </p>

        <div className="relative rounded-md bg-muted p-4 font-mono text-sm overflow-auto max-h-[400px]">
          <pre>{firestoreRules}</pre>
          <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={handleCopyRules}>
            {copySuccess ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy rules</span>
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Cara Menerapkan Aturan:</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Pastikan Anda telah menginstal Firebase CLI (`npm install -g firebase-tools`).</li>
            <li>
              Login ke Firebase di terminal Anda:{" "}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                firebase login
              </code>
            </li>
            <li>
              Pilih proyek Firebase Anda:{" "}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                firebase use --add
              </code>
            </li>
            <li>
              Salin aturan di atas ke file{" "}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                firestore.rules
              </code>{" "}
              di root proyek Anda.
            </li>
            <li>Jalankan perintah deploy:</li>
          </ol>
          <div className="relative rounded-md bg-muted p-4 font-mono text-sm">
            <pre>{deployCommand}</pre>
            <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={handleCopyCommand}>
              {copySuccess ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy command</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

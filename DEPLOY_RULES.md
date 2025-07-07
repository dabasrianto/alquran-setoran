# 🚨 URGENT: Deploy Firebase Security Rules

## The Problem
Your application is getting "Missing or insufficient permissions" errors because the Firebase Security Rules in your project are not deployed to Firebase.

## ✅ **IMMEDIATE ACTION REQUIRED:**

### 1. **Open Firebase Console**
- Go to: https://console.firebase.google.com
- Login with your Google account
- Select your project: **"tasmi-web"**

### 2. **Navigate to Firestore Rules**
- Click **"Firestore Database"** in the left sidebar
- Click the **"Rules"** tab at the top

### 3. **Replace All Rules**
Copy this EXACT code and replace ALL existing rules:

\`\`\`javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Function to check if user is admin
    function isAdmin() {
      return request.auth != null && (
        request.auth.token.email in [
          'dabasrianto@gmail.com'
        ] || 
        request.auth.token.admin == true
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
      allow read, write: if isAdmin();
    }
    
    // System logs (admin only)
    match /logs/{logId} {
      allow read, write: if isAdmin();
    }
  }
}
\`\`\`

### 4. **Publish the Rules**
- Click the **"Publish"** button
- Wait for the confirmation message
- **IMPORTANT:** Wait 1-2 minutes for rules to propagate

### 5. **Test the Fix**
- Go back to your application
- Refresh the page (Ctrl+F5 or Cmd+Shift+R)
- The subscription errors should be resolved

## 🔍 **What These Rules Do:**

### For Subscriptions Collection:
- ✅ **Users can read their own subscription** (where `userId` matches their auth ID)
- ✅ **Users can create subscriptions** for themselves
- ✅ **Users can update their own subscription**
- ✅ **Admin can read/write all subscriptions**

### Security Features:
- 🔒 **Authentication required** for all operations
- 🔒 **Users can only access their own data**
- 🔒 **Admin has full access** (dabasrianto@gmail.com or users with admin custom claim)
- 🔒 **No anonymous access** allowed

## 🚨 **If Still Getting Errors:**

1. **Double-check the admin email** in the rules matches exactly: `dabasrianto@gmail.com`
2. **Wait 2-3 minutes** after publishing rules
3. **Clear browser cache** and refresh
4. **Check Firebase Console** → Authentication → Users to verify user is logged in
5. **Verify project name** is correct in Firebase Console

## ✅ **Success Indicators:**
- No more "Missing or insufficient permissions" errors
- Users can see their subscription status
- Trial subscriptions are created automatically
- Upgrade prompts work correctly

---

**⚠️ CRITICAL:** You MUST deploy these rules to Firebase Console for the application to work. The rules in your code files are just templates - they need to be published in Firebase Console to take effect.

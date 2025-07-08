# Firebase Security Rules Setup untuk Admin

## Masalah
Admin tidak bisa mengakses data semua pengguna karena Firebase Security Rules belum dikonfigurasi.

## Solusi
Update Firebase Security Rules untuk memberikan akses admin dan subscription access.

## Langkah-langkah:

### 1. Buka Firebase Console
- Pergi ke [Firebase Console](https://console.firebase.google.com)
- Login dengan akun Google yang sama dengan project

### 2. Pilih Project
- Pilih project "tasmi-web"

### 3. Buka Firestore Database
- Klik "Firestore Database" di menu sebelah kiri
- Klik tab "Rules"

### 4. Update Rules
Copy dan paste rules berikut, replace semua rules yang ada:

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

### 5. Publish Rules
- Klik tombol "Publish" untuk menerapkan rules baru
- Tunggu beberapa detik hingga rules ter-deploy

### 6. Test
- Kembali ke aplikasi Tasmi'
- Login sebagai admin (dabasrianto@gmail.com)
- Buka halaman admin (/admin)
- Klik "Test Firebase Connection"
- Seharusnya sekarang bisa membaca data semua pengguna

## Keamanan
Rules ini memberikan:
- **Admin**: Akses penuh untuk membaca semua data pengguna dan mengupdate subscription
- **User biasa**: Hanya bisa akses data mereka sendiri dan subscription mereka
- **Guest**: Tidak ada akses

## Subscription Rules
Rules subscription memberikan:
- **User**: Bisa membaca dan update subscription mereka sendiri
- **Admin**: Akses penuh ke semua subscription
- **Keamanan**: Hanya user dengan userId yang sesuai yang bisa akses subscription mereka

## Troubleshooting
Jika masih error:
1. Pastikan email admin benar: `dabasrianto@gmail.com`
2. Tunggu 1-2 menit setelah publish rules
3. Refresh halaman admin
4. Check console browser untuk error details

## 🔧 **Yang Perlu Dilakukan:**

### ✅ **Update Firebase Security Rules**
1. **Buka Firebase Console** → https://console.firebase.google.com
2. **Pilih project "tasmi-web"**
3. **Firestore Database** → **Rules tab**
4. **Copy rules** dari komponen FirebaseRulesSetup
5. **Replace semua rules** yang ada
6. **Klik Publish**

### ✅ **Test Setelah Update**
1. **Tunggu 1-2 menit** setelah publish
2. **Refresh halaman admin**
3. **Klik "Test Firebase Connection"**
4. **Seharusnya berhasil** membaca data users

### 🔒 **Keamanan Rules:**
- **Admin** (`dabasrianto@gmail.com` atau user dengan custom claim `admin: true`): Akses penuh semua data
- **User biasa**: Hanya data mereka sendiri dan subscription mereka
- **Guest**: Tidak ada akses

### 🔐 **Subscription Security:**
- **User**: Akses read/update subscription sendiri berdasarkan userId
- **Admin**: Akses penuh semua subscription
- **Validation**: Subscription hanya bisa diakses jika userId cocok dengan auth.uid

Setelah update rules, admin panel akan bisa membaca dan mengelola data semua pengguna, dan users bisa mengakses subscription mereka! 🚀

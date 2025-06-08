# Firebase Security Rules Setup untuk Admin

## Masalah
Admin tidak bisa mengakses data semua pengguna karena Firebase Security Rules belum dikonfigurasi.

## Solusi
Update Firebase Security Rules untuk memberikan akses admin.

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
- **User biasa**: Hanya bisa akses data mereka sendiri
- **Guest**: Tidak ada akses

## Troubleshooting
Jika masih error:
1. Pastikan email admin benar: `dabasrianto@gmail.com`
2. Tunggu 1-2 menit setelah publish rules
3. Refresh halaman admin
4. Check console browser untuk error details
\`\`\`

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
- **Admin** (`dabasrianto@gmail.com`): Akses penuh semua data
- **User biasa**: Hanya data mereka sendiri
- **Guest**: Tidak ada akses

Setelah update rules, admin panel akan bisa membaca dan mengelola data semua pengguna! 🚀

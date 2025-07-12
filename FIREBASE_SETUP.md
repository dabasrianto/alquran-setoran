# Firebase Setup Guide

This guide will walk you through setting up Firebase for your project, including creating a project, configuring environment variables, and initializing Firebase in your application.

## 1. Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click "Add project" or "Create a project".
3.  Follow the steps to create a new project. You can enable Google Analytics if you wish.
4.  Once the project is created, click on the "Web" icon (`</>`) to add a web app to your Firebase project.
5.  Register your app and copy the Firebase configuration object. It will look something like this:

    \`\`\`javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    \`\`\`

## 2. Configure Environment Variables

To keep your Firebase configuration secure and separate from your code, you should use environment variables.

1.  Create a `.env.local` file in the root of your project (if it doesn't exist).
2.  Add the Firebase configuration values to this file, prefixed with `NEXT_PUBLIC_` for Next.js to expose them to the browser:

    \`\`\`
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
    \`\`\`
    Replace the placeholder values with the actual values from your Firebase project.

3.  **For Vercel Deployment**:
    When deploying to Vercel, you'll need to add these environment variables to your Vercel project settings:
    *   Go to your Vercel project dashboard.
    *   Navigate to `Settings` -> `Environment Variables`.
    *   Add each variable with its corresponding value. Make sure to select "Preview" and "Production" (and "Development" if you use Vercel for local development) for the environments.

## 3. Initialize Firebase in Your Application

The `lib/firebase.ts` file is responsible for initializing Firebase. It reads the environment variables and initializes the Firebase app.

\`\`\`typescript
// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
\`\`\`

**Ensure this file is correctly configured and imports the `process.env` variables.**

## 4. Set up Firestore Database

1.  In the Firebase Console, navigate to `Firestore Database`.
2.  Click "Create database".
3.  Choose "Start in production mode" (you will set up rules later) and select a location.
4.  Click "Enable".

## 5. Deploy Firestore Security Rules

After setting up your database, you need to deploy the security rules to control access to your data. The `firestore.rules` file contains these rules.

1.  Make sure your `firestore.rules` file is correctly configured for your application's needs.
2.  Deploy the rules using the Firebase CLI:
    \`\`\`bash
    firebase deploy --only firestore:rules
    \`\`\`
    Refer to `DEPLOY_RULES.md` for more detailed instructions on deploying rules.

By following these steps, your Firebase project will be correctly set up and integrated with your Next.js application.

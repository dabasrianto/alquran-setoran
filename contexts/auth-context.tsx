"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChange, signInWithGoogle, signOut } from "@/lib/firebase-auth"
import { signInWithEmail, signUpWithEmail, resetPassword } from "@/lib/firebase-email-auth"
import { getUserProfile, isAdmin } from "@/lib/firebase-firestore"

interface AuthContextType {
  user: User | null
  userProfile: any | null
  loading: boolean
  isAdmin: boolean
  signIn: () => Promise<void>
  signInEmail: (email: string, password: string) => Promise<void>
  signUpEmail: (email: string, password: string, displayName: string) => Promise<void>
  resetPasswordEmail: (email: string) => Promise<void>
  signOut: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUserAdmin, setIsUserAdmin] = useState(false)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    // Add a small delay to ensure Firebase is fully initialized
    const initializeAuth = async () => {
      try {
        // Wait a bit for Firebase to initialize
        await new Promise((resolve) => setTimeout(resolve, 100))

        unsubscribe = onAuthStateChange(async (user) => {
          console.log("🔄 Auth state changed:", { 
            userEmail: user?.email, 
            userUid: user?.uid,
            timestamp: new Date().toISOString()
          })
          
          setUser(user)
          setError(null)

          if (user) {
            try {
              // Check admin status first
              const adminStatus = isAdmin(user.email || "")
              setIsUserAdmin(adminStatus)
              console.log("👑 Admin status check:", { 
                email: user.email, 
                isAdmin: adminStatus 
              })

              // Then load profile
              const profile = await getUserProfile(user.uid)
              setUserProfile(profile)
              console.log("👤 User profile loaded successfully")
            } catch (error) {
              console.error("❌ Error fetching user profile:", error)
              setError("Failed to load user profile")
              // Don't reset admin status on profile error
            }
          } else {
            console.log("👤 No user, clearing auth state")
            setUserProfile(null)
            setIsUserAdmin(false)
          }

          setLoading(false)
        })
      } catch (error: any) {
        console.error("❌ Error setting up auth state listener:", error)
        setError("Failed to initialize authentication")
        setLoading(false)
      }
    }

    initializeAuth()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const handleSignIn = async () => {
    try {
      setError(null)
      console.log("🔄 Attempting Google sign in...")
      await signInWithGoogle()
    } catch (error: any) {
      console.error("❌ Error signing in:", error)
      setError(error.message || "Failed to sign in")
      throw error
    }
  }

  const handleSignInEmail = async (email: string, password: string) => {
    try {
      setError(null)
      console.log("🔄 Attempting email sign in for:", email)
      await signInWithEmail(email, password)
    } catch (error: any) {
      console.error("❌ Error signing in with email:", error)
      setError(error.message || "Failed to sign in with email")
      throw error
    }
  }

  const handleSignUpEmail = async (email: string, password: string, displayName: string) => {
    try {
      setError(null)
      console.log("🔄 Attempting email sign up for:", email)
      await signUpWithEmail(email, password, displayName)
    } catch (error: any) {
      console.error("❌ Error signing up with email:", error)
      setError(error.message || "Failed to sign up with email")
      throw error
    }
  }

  const handleResetPasswordEmail = async (email: string) => {
    try {
      setError(null)
      console.log("🔄 Attempting password reset for:", email)
      await resetPassword(email)
    } catch (error: any) {
      console.error("❌ Error resetting password:", error)
      setError(error.message || "Failed to reset password")
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      setError(null)
      console.log("🔄 Attempting sign out...")
      await signOut()
    } catch (error: any) {
      console.error("❌ Error signing out:", error)
      setError(error.message || "Failed to sign out")
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    isAdmin: isUserAdmin,
    signIn: handleSignIn,
    signInEmail: handleSignInEmail,
    signUpEmail: handleSignUpEmail,
    resetPasswordEmail: handleResetPasswordEmail,
    signOut: handleSignOut,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
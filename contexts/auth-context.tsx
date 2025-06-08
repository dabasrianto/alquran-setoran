"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChange, signInWithGoogle, signOut } from "@/lib/firebase-auth"
import { getUserProfile, isAdmin } from "@/lib/firebase-firestore"

interface AuthContextType {
  user: User | null
  userProfile: any | null
  loading: boolean
  isAdmin: boolean
  signIn: () => Promise<void>
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
          setUser(user)
          setError(null)

          if (user) {
            try {
              const profile = await getUserProfile(user.uid)
              setUserProfile(profile)
              setIsUserAdmin(isAdmin(user.email || ""))
            } catch (error) {
              console.error("Error fetching user profile:", error)
              setError("Failed to load user profile")
            }
          } else {
            setUserProfile(null)
            setIsUserAdmin(false)
          }

          setLoading(false)
        })
      } catch (error: any) {
        console.error("Error setting up auth state listener:", error)
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
      await signInWithGoogle()
    } catch (error: any) {
      console.error("Error signing in:", error)
      setError(error.message || "Failed to sign in")
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      setError(null)
      await signOut()
    } catch (error: any) {
      console.error("Error signing out:", error)
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

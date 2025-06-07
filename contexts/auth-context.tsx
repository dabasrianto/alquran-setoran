"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChange, signInWithGoogle, signOut } from "@/lib/firebase-auth"
import { getUserProfile } from "@/lib/firebase-firestore"

interface AuthContextType {
  user: User | null
  userProfile: any | null
  loading: boolean
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

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    try {
      unsubscribe = onAuthStateChange(async (user) => {
        setUser(user)
        setError(null)

        if (user) {
          try {
            const profile = await getUserProfile(user.uid)
            setUserProfile(profile)
          } catch (error) {
            console.error("Error fetching user profile:", error)
            setError("Failed to load user profile")
          }
        } else {
          setUserProfile(null)
        }

        setLoading(false)
      })
    } catch (error: any) {
      console.error("Error setting up auth state listener:", error)
      setError("Failed to initialize authentication")
      setLoading(false)
    }

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

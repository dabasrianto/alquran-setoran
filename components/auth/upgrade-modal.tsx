"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Crown, Check, CreditCard, Smartphone, Building, Info } from "lucide-react"
import PremiumUpgradeModal from "./premium-upgrade-modal"

interface UpgradeModalProps {
  children: React.ReactNode
}

export default function UpgradeModal({ children }: UpgradeModalProps) {
  const { userProfile } = useAuth()

  if (userProfile?.subscriptionType === "premium" || userProfile?.subscriptionType === "pro" || userProfile?.subscriptionType === "institution") {
    return null
  }

  return (
    <PremiumUpgradeModal>
      {children}
    </PremiumUpgradeModal>
  )
}

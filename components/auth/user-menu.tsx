"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Crown, User, Sparkles } from "lucide-react"

export default function UserMenu() {
  const { user, userProfile, signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeClick = () => {
    // Simple alert for now to test if click works
    alert("Upgrade feature clicked! Modal akan segera ditampilkan.")
  }

  if (!user) return null

  const isPremium = userProfile?.subscriptionType === "premium"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
            <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-1 mt-1">
              {isPremium ? (
                <>
                  <Crown className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600 font-medium">Premium</span>
                </>
              ) : (
                <>
                  <User className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">Free</span>
                </>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {!isPremium && (
          <>
            <DropdownMenuItem onClick={handleUpgradeClick}>
              <Sparkles className="mr-2 h-4 w-4 text-amber-600" />
              <span className="text-amber-600 font-medium">Upgrade Premium</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={handleSignOut} disabled={loading}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

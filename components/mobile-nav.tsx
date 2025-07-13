'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Home, LineChart, Package, Package2, PanelLeft, Settings, ShoppingCart, Users2 } from 'lucide-react'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { UserMenu } from './auth/user-menu'
import Image from 'next/image'

export function MobileNav() {
  const pathname = usePathname()
  const { isAdmin } = useAuth()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden fixed top-4 left-4 z-40">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Navigation Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs flex flex-col">
        <nav className="grid gap-6 text-lg font-medium pt-8">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Image src="/placeholder-logo.svg" alt="Logo" width={24} height={24} />
            <span className="sr-only">Tasmi App</span>
          </Link>
          <Link
            href="/dashboard"
            className={`flex items-center gap-4 px-2.5 ${pathname === '/dashboard' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/penguji"
            className={`flex items-center gap-4 px-2.5 ${pathname === '/penguji' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Users2 className="h-5 w-5" />
            Penguji
          </Link>
          <Link
            href="/panduan"
            className={`flex items-center gap-4 px-2.5 ${pathname === '/panduan' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Package className="h-5 w-5" />
            Panduan
          </Link>
          <Link
            href="/upgrade"
            className={`flex items-center gap-4 px-2.5 ${pathname === '/upgrade' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <ShoppingCart className="h-5 w-5" />
            Upgrade
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-4 px-2.5 ${pathname === '/admin' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LineChart className="h-5 w-5" />
              Admin
            </Link>
          )}
          <Link
            href="/settings"
            className={`flex items-center gap-4 px-2.5 ${pathname === '/settings' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
        <div className="mt-auto">
          <UserMenu />
        </div>
      </SheetContent>
    </Sheet>
  )
}

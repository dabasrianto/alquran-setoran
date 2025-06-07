"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, BarChart, Users, BookOpen, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
        <div className="grid h-full grid-cols-4">
          <Link
            href="/"
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted",
              pathname === "/" && "text-primary",
            )}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Beranda</span>
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted",
              pathname === "/dashboard" && "text-primary",
            )}
          >
            <BarChart className="w-6 h-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link
            href="/penguji"
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted",
              pathname === "/penguji" && "text-primary",
            )}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">Penguji</span>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted">
                <Menu className="w-6 h-6" />
                <span className="text-xs mt-1">Menu</span>
              </button>
            </DialogTrigger>
            <DialogContent side="right" className="p-0 w-72 sm:w-80">
              <div className="py-4 space-y-4">
                <h3 className="text-lg font-medium px-4">Menu Aplikasi</h3>
                <div className="space-y-2">
                  <Button asChild variant="ghost" className="w-full justify-start" size="lg">
                    <Link href="/">
                      <Home className="mr-2 h-5 w-5" />
                      Beranda
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start" size="lg">
                    <Link href="/dashboard">
                      <BarChart className="mr-2 h-5 w-5" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start" size="lg">
                    <Link href="/penguji">
                      <Users className="mr-2 h-5 w-5" />
                      Ustadz/Ustadzah
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full justify-start" size="lg">
                    <Link href="/panduan">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Panduan
                    </Link>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Padding bottom for mobile to account for bottom navigation */}
      <div className="pb-16 md:pb-0"></div>
    </>
  )
}

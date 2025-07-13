import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import UpgradeContent from "./content"

export default function UpgradePage() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 md:mb-6">
          <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Aplikasi Utama
            </Link>
          </Button>
        </div>

        <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8">Upgrade ke Premium</h1>

        {UpgradeContent()}
      </div>
    </main>
  )
}

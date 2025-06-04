import TasmiApp from "@/components/tasmi-app"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart, Users, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <main className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">Analisa Setoran Hafalan Quran</h1>
          <div className="hidden md:flex gap-2">
            <Button asChild variant="outline">
              <Link href="/penguji">
                <Users className="mr-2 h-4 w-4" />
                Ustadz/Ustadzah
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/panduan">
                <BookOpen className="mr-2 h-4 w-4" />
                Panduan
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                <BarChart className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          </div>
        </div>
        <TasmiApp />
      </div>
    </main>
  )
}

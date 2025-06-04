import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script" // Tambahkan import Script
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MobileNav } from "@/components/mobile-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tasmi' - Aplikasi Analisa Setoran Hafalan Quran",
  description: "Aplikasi untuk melacak dan menganalisis hafalan Quran murid",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Google Analytics - tambahkan di sini */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-W92L2CKV57" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-W92L2CKV57');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  )
}

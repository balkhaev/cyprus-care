import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import DebugPanel from "@/components/DebugPanel"
import RouteGuard from "@/components/RouteGuard"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "ENOCYPRUS - Crisis Relief Coordination",
  description:
    "Platform for coordinating volunteers and relief during emergencies",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Show DebugPanel only in development
  const showDebugPanel = process.env.NODE_ENV === 'development';
  
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <RouteGuard>
          {children}
        </RouteGuard>
        {showDebugPanel && <DebugPanel />}
      </body>
    </html>
  )
}

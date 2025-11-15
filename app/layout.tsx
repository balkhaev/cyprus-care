import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import DebugPanel from "@/components/DebugPanel"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Cyprus Care - Crisis Relief Coordination",
  description:
    "Platform for coordinating volunteers and relief during emergencies in Cyprus",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <DebugPanel />
      </body>
    </html>
  )
}

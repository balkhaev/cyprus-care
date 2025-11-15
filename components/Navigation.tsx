"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Building2 } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const isMapPage = pathname === "/map"
  const isVenuesPage = pathname?.startsWith("/venues")

  return (
    <nav className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
      <Link
        href="/venues"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          isVenuesPage
            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
      >
        <Building2 className="h-4 w-4" />
        <span>Venues</span>
      </Link>
      <Link
        href="/map"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          isMapPage
            ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        }`}
      >
        <MapPin className="h-4 w-4" />
        <span>Map</span>
      </Link>
    </nav>
  )
}


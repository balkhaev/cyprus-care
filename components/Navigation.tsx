"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Building2 } from "lucide-react"
import { textClasses, interactiveClasses } from "@/lib/theme-utils"

export default function Navigation() {
  const pathname = usePathname()

  const isMapPage = pathname === "/map"
  const isVenuesPage = pathname?.startsWith("/venues")

  return (
    <nav className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Link
        href="/venues"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          isVenuesPage
            ? "bg-card text-primary shadow-sm"
            : `${textClasses.secondary} ${interactiveClasses.hoverPrimary}`
        }`}
      >
        <Building2 className="h-4 w-4" />
        <span>Venues</span>
      </Link>
      <Link
        href="/map"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          isMapPage
            ? "bg-card text-primary shadow-sm"
            : `${textClasses.secondary} ${interactiveClasses.hoverPrimary}`
        }`}
      >
        <MapPin className="h-4 w-4" />
        <span>Map</span>
      </Link>
    </nav>
  )
}


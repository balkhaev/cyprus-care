"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MapPin, Building2 } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  const isMapPage = pathname === "/map"
  const isVenuesPage = pathname?.startsWith("/venues")

  const links = [
    {
      href: "/venues",
      label: "Venues",
      icon: Building2,
      active: isVenuesPage,
    },
    {
      href: "/map",
      label: "Map",
      icon: MapPin,
      active: isMapPage,
    },
  ]

  return (
    <nav className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              link.active
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}


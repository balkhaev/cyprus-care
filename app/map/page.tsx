"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Search, Menu, X, User } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import type { Venue } from "@/types/venue"
import { fetchVenues } from "@/lib/api/venues"
import { getCurrentUser } from "@/lib/mock-data/user-roles"
import CategoryTreeFilter from "@/components/venue-functions/CategoryTreeFilter"
import NavigationTabs from "@/components/Navigation"
import type { MapMarker } from "@/components/LeafletMap"

// Dynamic import of map component to avoid SSR issues
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Loading map...
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Please wait
        </p>
      </div>
    </div>
  ),
})

export default function MapPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentUser] = useState(() => getCurrentUser())

  const loadVenues = async () => {
    const data = await fetchVenues()
    setVenues(data)
  }

  // Load venues from API
  useEffect(() => {
    loadVenues()
  }, [])

  // Filter venues by categories
  const filteredVenues = venues.filter((venue) => {
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      const hasSelectedCategory = venue.functions.some((func) => {
        if (
          func.type === "collection_point" ||
          func.type === "distribution_point"
        ) {
          return func.items.some((item) =>
            selectedCategories.includes(item.categoryId)
          )
        }
        if (func.type === "custom" && func.items) {
          return func.items.some((item) =>
            selectedCategories.includes(item.categoryId)
          )
        }
        return false
      })
      if (!hasSelectedCategory) return false
    }

    return true
  })

  // Convert venues to markers
  const markers: MapMarker[] = filteredVenues.map((venue) => {
    // Check if venue has distribution point function
    const hasDistributionPoint = venue.functions.some(
      (func) => func.type === 'distribution_point'
    )
    
    return {
      id: venue.id,
      lat: venue.location.lat,
      lng: venue.location.lng,
      title: venue.title,
      description: venue.description,
      venue: venue, // Include full venue object for rich popups
      isDistributionPoint: hasDistributionPoint,
    }
  })

  // Determine if we should highlight distribution points (for beneficiaries)
  const highlightDistributionPoints = currentUser.role === 'beneficiary'
  
  // Determine if we should show ETA (for volunteers and beneficiaries with location)
  const showETA = (currentUser.role === 'volunteer' || currentUser.role === 'beneficiary') && userLocation !== null

  // Get function summary for a venue
  const getVenueFunctions = (venue: Venue): string[] => {
    const functions: string[] = []
    venue.functions.forEach((func) => {
      switch (func.type) {
        case "collection_point":
          functions.push("Collection Point")
          break
        case "distribution_point":
          functions.push("Distribution Point")
          break
        case "services_needed":
          const services = func.services.map((s) => {
            if (s.type === "transport_big") return "Large Transport"
            if (s.type === "transport_small") return "Small Transport"
            if (s.type === "carrying") return "Carrying"
            if (s.type === "language") return "Language"
            if (s.type === "admin") return "Admin"
            if (s.type === "tech") return "Tech"
            return s.type
          })
          functions.push(`Services: ${services.join(", ")}`)
          break
        case "custom":
          functions.push(func.customTypeName)
          break
      }
    })
    return functions
  }

  // Get user geolocation on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting geolocation:", error)
        }
      )
    }
  }, [])

  // Mark map as loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(newLocation)
          console.log(
            "Your location:",
            position.coords.latitude,
            position.coords.longitude
          )
        },
        (error) => {
          console.error("Error getting geolocation:", error)
          alert("Unable to get your location. Please allow geolocation access.")
        }
      )
    } else {
      alert("Your browser does not support geolocation")
    }
  }

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker)
    const venue = venues.find((v) => v.id === marker.id)
    setSelectedVenue(venue || null)
  }

  const handleBuildRoute = () => {
    if (selectedMarker) {
      alert(`Building route to: ${selectedMarker.title}`)
      // Add route building logic here
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-1000 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
              <span className="font-bold text-xl text-zinc-900 dark:text-zinc-100">
                Care Hub
              </span>
            </Link>
            <NavigationTabs />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search (desktop) */}
            <div className="hidden md:flex">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>
            </div>

            {/* User menu */}
            <Link
              href="/organizer"
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="User profile"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
            {/* Search (mobile) */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search on map..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>

            {/* Links */}
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
          </div>
        )}
      </header>

      {/* Main map area */}
      <div className="h-full w-full pt-[60px]">
        {/* Category Tree Filter - Always visible */}
        <div className="absolute top-20 left-12 z-999 w-80 max-w-[calc(100vw-3rem)]">
          <CategoryTreeFilter
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
        </div>

        {isMapLoaded && (
          <LeafletMap
            markers={markers}
            center={[35.1264, 33.4299]}
            zoom={13}
            onMarkerClick={handleMarkerClick}
            userLocation={userLocation}
            highlightDistributionPoints={highlightDistributionPoints}
            showETA={showETA}
          />
        )}

        {/* Selected marker info */}
        {selectedMarker && selectedVenue && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 z-1000 animate-slide-up max-h-[70vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {selectedMarker.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {selectedMarker.description}
                </p>

                {/* Functions List */}
                {selectedVenue.functions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                      Functions
                    </h4>
                    <div className="space-y-1">
                      {getVenueFunctions(selectedVenue).map(
                        (funcName, index) => (
                          <div
                            key={index}
                            className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded"
                          >
                            {funcName}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedMarker(null)
                  setSelectedVenue(null)
                }}
                className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBuildRoute}
                className="flex-1 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Build Route
              </button>
              <Link
                href={`/venues/${selectedVenue.id}`}
                className="flex-1 text-center px-3 py-2 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        )}

        {/* "My Location" button */}
        <button
          onClick={handleLocateMe}
          className="absolute right-6 p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all z-999 hover:scale-110"
          style={{
            bottom: selectedMarker ? "calc(24px + 160px)" : "24px",
            transition: "bottom 0.3s ease",
          }}
          title="My Location"
          aria-label="My Location"
        >
          <Navigation className="h-6 w-6" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

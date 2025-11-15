"use client"

import { useState, useEffect, useMemo } from "react"
import { Navigation, Search, Menu, X } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import type { Venue } from "@/types/venue"
import { fetchVenues } from "@/lib/api/venues"
import { getCurrentUser } from "@/lib/mock-data/user-roles"
import CategoryTreeFilter from "@/components/venue-functions/CategoryTreeFilter"
import Header from "@/components/Header"
import type { MapMarker } from "@/components/LeafletMap"
import { fetchCategoryHierarchy } from "@/lib/api/item-categories"
import type { CategoryHierarchy } from "@/types/item-category"

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

// Helper function to get all descendant category IDs
function getAllDescendantIds(categoryId: string, hierarchy: CategoryHierarchy[]): string[] {
  const result: string[] = [categoryId]
  
  const findChildren = (id: string, nodes: CategoryHierarchy[]) => {
    for (const node of nodes) {
      if (node.category.id === id) {
        node.children.forEach(child => {
          result.push(child.category.id)
          findChildren(child.category.id, [child])
        })
        return
      }
      if (node.children.length > 0) {
        findChildren(id, node.children)
      }
    }
  }
  
  findChildren(categoryId, hierarchy)
  return result
}

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
  const [categoryHierarchy, setCategoryHierarchy] = useState<CategoryHierarchy[]>([])

  const loadVenues = async () => {
    const data = await fetchVenues()
    console.log('Loaded venues from API:', data.length, data)
    setVenues(data)
  }

  const loadCategoryHierarchy = async () => {
    const data = await fetchCategoryHierarchy()
    setCategoryHierarchy(data)
  }

  // Load venues from API
  useEffect(() => {
    loadVenues()
    loadCategoryHierarchy()
  }, [])

  // Filter venues by categories (memoized to prevent recalculation on every render)
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      // Filter by selected categories
      if (selectedCategories.length > 0 && categoryHierarchy.length > 0) {
        // Get all descendant IDs for selected categories (including parent and all children)
        const allSelectedIds = new Set<string>()
        selectedCategories.forEach(catId => {
          const descendants = getAllDescendantIds(catId, categoryHierarchy)
          descendants.forEach(id => allSelectedIds.add(id))
        })

        // Check if venue has any functions with items
        const hasFunctionsWithItems = venue.functions.some((func) => 
          func.type === "collection_point" || 
          func.type === "distribution_point" || 
          (func.type === "custom" && func.items)
        )

        // If venue has no functions with items (e.g., only services_needed), always show it
        if (!hasFunctionsWithItems) {
          return true
        }

        // If venue has functions with items, check if any match selected categories (including descendants)
        const hasSelectedCategory = venue.functions.some((func) => {
          if (
            func.type === "collection_point" ||
            func.type === "distribution_point"
          ) {
            return func.items.some((item) =>
              allSelectedIds.has(item.categoryId)
            )
          }
          if (func.type === "custom" && func.items) {
            return func.items.some((item) =>
              allSelectedIds.has(item.categoryId)
            )
          }
          return false
        })
        if (!hasSelectedCategory) return false
      }

      return true
    })
  }, [venues, selectedCategories, categoryHierarchy])

  console.log('Venues:', venues.length, 'Filtered:', filteredVenues.length, 'Selected categories:', selectedCategories.length, 'Hierarchy loaded:', categoryHierarchy.length > 0)

  // Convert venues to markers (memoized to prevent recreation on every render)
  const markers: MapMarker[] = useMemo(() => {
    console.log('Recalculating markers from', filteredVenues.length, 'venues')
    return filteredVenues.map((venue) => {
      // Check if venue has distribution point function
      const hasDistributionPoint = venue.functions.some(
        (func) => func.type === "distribution_point"
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
  }, [filteredVenues])

  // Determine if we should highlight distribution points (for beneficiaries)
  const highlightDistributionPoints = currentUser.role === "beneficiary"

  // Determine if we should show ETA (for volunteers and beneficiaries with location)
  const showETA =
    (currentUser.role === "volunteer" || currentUser.role === "beneficiary") &&
    userLocation !== null

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
    <div className="relative h-screen w-full overflow-hidden bg-bgsoft flex flex-col">
      {/* Header */}
      <div className="relative z-[1000]">
        <Header />
      </div>

      {/* Main map area */}
      <div className="flex-1 relative w-full">
        {/* Category Tree Filter - Always visible */}
        <div className="absolute top-6 left-12 z-[500] w-80 max-w-[calc(100vw-3rem)]">
          <CategoryTreeFilter
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
        </div>

        {/* Map - always rendered */}
        <LeafletMap
          markers={markers}
          center={[35.1264, 33.4299]}
          zoom={13}
          onMarkerClick={handleMarkerClick}
          userLocation={userLocation}
          highlightDistributionPoints={highlightDistributionPoints}
          showETA={showETA}
        />

        {/* Loading overlay */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 z-[100]">
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
        )}

        {/* Selected marker info */}
        {selectedMarker && selectedVenue && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 z-[400] animate-slide-up max-h-[70vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
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
                className="flex-1 px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/80 transition-colors"
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
          className="absolute right-6 p-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all z-[300] hover:scale-110"
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

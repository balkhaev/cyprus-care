"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  MapPin,
  Clock,
  Plus,
  Building2,
  Warehouse,
  Users,
  Wrench,
} from "lucide-react"
import type { Venue, VenueFunctionType } from "@/types/venue"
import { fetchVenues } from "@/lib/api/venues"
import type { User } from "@/lib/mock-data/user-roles"
import { canEditVenue, canCreateVenue } from "@/lib/venue-permissions"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VenueFilters, type VenueFilterState } from "@/components/VenueFilters"
import {
  getVenueFunctionTypes,
  venueHasAnyFunctionType,
  getFunctionTypeLabel,
} from "@/lib/venue-type-utils"
import {
  backgroundClasses,
  textClasses,
  stateClasses,
  getIconContainerClasses,
} from "@/lib/theme-utils"

const functionTypeIcons: Record<VenueFunctionType, React.ReactNode> = {
  collection_point: <Building2 className="h-5 w-5" />,
  distribution_point: <Warehouse className="h-5 w-5" />,
  services_needed: <Users className="h-5 w-5" />,
  custom: <Wrench className="h-5 w-5" />,
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [filters, setFilters] = useState<VenueFilterState>({
    searchQuery: "",
    functionTypes: [],
    openNow: null,
  })

  const loadVenues = async () => {
    setIsLoading(true)
    const data = await fetchVenues()
    setVenues(data)
    setIsLoading(false)
  }

  const loadCurrentUser = async () => {
    try {
      const response = await fetch("/api/me")
      if (response.ok) {
        const user = await response.json()
        setCurrentUser(user)
      }
    } catch (error) {
      console.error("Failed to load user:", error)
    }
  }

  // Load data on mount
  useEffect(() => {
    const load = async () => {
      await Promise.all([loadCurrentUser(), loadVenues()])
    }
    void load()
  }, [])

  const getTodayHours = (venue: Venue) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
    const hours = venue.operatingHours.find((h) => h.dayOfWeek === today)

    if (!hours || hours.isClosed) {
      return "Closed"
    }

    return `${hours.openTime} - ${hours.closeTime}`
  }

  const isOpenNow = (venue: Venue): boolean => {
    const now = new Date()
    const today = now.toLocaleDateString("en-US", { weekday: "long" })
    const hours = venue.operatingHours.find((h) => h.dayOfWeek === today)

    if (!hours || hours.isClosed) {
      return false
    }

    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`
    return currentTime >= hours.openTime && currentTime <= hours.closeTime
  }

  // Apply filters
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesSearch =
          venue.title.toLowerCase().includes(query) ||
          venue.description.toLowerCase().includes(query) ||
          venue.location.address.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }

      // Function type filter
      if (filters.functionTypes.length > 0) {
        if (!venueHasAnyFunctionType(venue, filters.functionTypes)) return false
      }

      // Open now filter
      if (filters.openNow !== null) {
        const open = isOpenNow(venue)
        if (filters.openNow !== open) return false
      }

      return true
    })
  }, [venues, filters])

  return (
    <div className={`min-h-screen ${backgroundClasses.page}`}>
      {/* Header */}
      <Header
        actions={
          canCreateVenue(currentUser) ? (
            <Button asChild size="default">
              <Link href="/venues/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Venue</span>
              </Link>
            </Button>
          ) : null
        }
      />

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <VenueFilters filters={filters} onFiltersChange={setFilters} />

        {isLoading ? (
          <div className="text-center py-16">
            <div className={`${stateClasses.loading} mx-auto mb-4`}></div>
            <p className={stateClasses.loadingText}>Loading venues...</p>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-16">
            <div className={stateClasses.emptyIcon}>
              <MapPin className={stateClasses.emptyIconInner} />
            </div>
            <h2 className={stateClasses.emptyTitle}>
              {venues.length === 0 ? "No Venues" : "No Results Found"}
            </h2>
            <p className={stateClasses.emptyDescription}>
              {venues.length === 0
                ? "Create your first venue to get started"
                : "Try adjusting your filter criteria"}
            </p>
            {venues.length === 0 && (
              <Button asChild size="sm">
                <Link
                  href="/venues/new"
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Venue
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-4">
              <p className={`text-sm ${textClasses.secondary}`}>
                Showing {filteredVenues.length} of {venues.length} venues
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => {
                const functionTypes = getVenueFunctionTypes(venue)
                const primaryFunctionType = functionTypes[0]

                return (
                  <Card key={venue.id} className="overflow-hidden">
                    {/* Card header */}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {primaryFunctionType && (
                            <div
                              className={getIconContainerClasses(
                                "primary",
                                "md"
                              )}
                            >
                              {functionTypeIcons[primaryFunctionType]}
                            </div>
                          )}
                          <div>
                            <h3
                              className={`font-semibold text-lg ${textClasses.heading}`}
                            >
                              {venue.title}
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {functionTypes.map((type) => (
                                <Badge
                                  key={type}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {getFunctionTypeLabel(type)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className={`text-sm ${textClasses.secondary} mb-4 line-clamp-2`}
                      >
                        {venue.description}
                      </p>

                      {/* Location */}
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin
                          className={`h-4 w-4 ${textClasses.secondary} mt-0.5 shrink-0`}
                        />
                        <span className={`text-sm ${textClasses.secondary}`}>
                          {venue.location.address}
                        </span>
                      </div>

                      {/* Operating hours */}
                      <div className="flex items-center gap-2">
                        <Clock
                          className={`h-4 w-4 ${textClasses.secondary} shrink-0`}
                        />
                        <span className={`text-sm ${textClasses.secondary}`}>
                          Today: {getTodayHours(venue)}
                        </span>
                      </div>
                    </CardContent>

                    {/* Card footer */}
                    <div className="px-6 py-4 bg-muted/30 border-t border-border flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Link href={`/venues/${venue.id}`}>Details</Link>
                      </Button>
                      {canEditVenue(venue, currentUser) && (
                        <Button
                          asChild
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                        >
                          <Link href={`/venues/${venue.id}/edit`}>Edit</Link>
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

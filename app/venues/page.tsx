"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Clock, Plus, Building2, Warehouse, Home } from "lucide-react"
import type { Venue, VenueType } from "@/types/venue"
import { fetchVenues } from "@/lib/api/venues"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  backgroundClasses,
  textClasses,
  headerClasses,
  stateClasses,
  getIconContainerClasses,
  interactiveClasses,
} from "@/lib/theme-utils"

const venueTypeIcons: Record<VenueType, React.ReactNode> = {
  collection_point: <Building2 className="h-5 w-5" />,
  distribution_hub: <Warehouse className="h-5 w-5" />,
  shelter: <Home className="h-5 w-5" />,
}

const venueTypeLabels: Record<VenueType, string> = {
  collection_point: "Collection Point",
  distribution_hub: "Distribution Hub",
  shelter: "Shelter",
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadVenues = async () => {
    setIsLoading(true)
    const data = await fetchVenues()
    setVenues(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadVenues()
  }, [])

  const getTodayHours = (venue: Venue) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
    const hours = venue.operatingHours.find((h) => h.dayOfWeek === today)

    if (!hours || hours.isClosed) {
      return "Closed"
    }

    return `${hours.openTime} - ${hours.closeTime}`
  }

  return (
    <div className={`min-h-screen ${backgroundClasses.page}`}>
      {/* Header */}
      <Header
        actions={
          <Button asChild size="default">
            <Link href="/venues/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Venue</span>
            </Link>
          </Button>
        }
      />

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-16">
            <div className={`${stateClasses.loading} mx-auto mb-4`}></div>
            <p className={stateClasses.loadingText}>Loading venues...</p>
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center py-16">
            <div className={stateClasses.emptyIcon}>
              <MapPin className={stateClasses.emptyIconInner} />
            </div>
            <h2 className={stateClasses.emptyTitle}>No Venues</h2>
            <p className={stateClasses.emptyDescription}>
              Create your first venue to get started
            </p>
            <Button asChild size="lg">
              <Link
                href="/venues/new"
                className="inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Venue
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden">
                {/* Card header */}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={getIconContainerClasses("primary", "md")}>
                        {venueTypeIcons[venue.type]}
                      </div>
                      <div>
                        <h3
                          className={`font-semibold text-lg ${textClasses.heading}`}
                        >
                          {venue.title}
                        </h3>
                        <span className={`text-sm ${textClasses.secondary}`}>
                          {venueTypeLabels[venue.type]}
                        </span>
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
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    <Link href={`/venues/${venue.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

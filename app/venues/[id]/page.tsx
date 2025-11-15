"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Edit,
  Trash2,
  Building2,
  Warehouse,
  Home,
  ChevronDown,
} from "lucide-react"
import type { Venue, VenueType } from "@/types/venue"
import { fetchVenueById, deleteVenue } from "@/lib/api/venues"
import { removeVenueFunction } from "@/lib/api/venue-functions"
import { getCurrentUser } from "@/lib/mock-data/user-roles"
import VolunteerVenueView from "@/components/venue-views/VolunteerVenueView"
import OrganizerVenueView from "@/components/venue-views/OrganizerVenueView"
import BeneficiaryVenueView from "@/components/venue-views/BeneficiaryVenueView"
import Header from "@/components/Header"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

// Dynamic map import
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 mx-auto mb-4"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Loading map...
        </p>
      </div>
    </div>
  ),
})

const venueTypeIcons: Record<VenueType, React.ReactNode> = {
  collection_point: <Building2 className="h-6 w-6" />,
  distribution_hub: <Warehouse className="h-6 w-6" />,
  shelter: <Home className="h-6 w-6" />,
}

const venueTypeLabels: Record<VenueType, string> = {
  collection_point: "Collection Point",
  distribution_hub: "Distribution Hub",
  shelter: "Shelter",
}

const venueTypeDescriptions: Record<VenueType, string> = {
  collection_point: "Place for collecting humanitarian aid",
  distribution_hub: "Center for distributing aid",
  shelter: "Temporary shelter for those in need",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function VenueDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingFunctionId, setDeletingFunctionId] = useState<string | null>(
    null
  )
  const [currentUser] = useState(() => getCurrentUser())
  const [isOperatingHoursOpen, setIsOperatingHoursOpen] = useState(false)

  useEffect(() => {
    loadVenue()
  }, [])

  const loadVenue = async () => {
    const resolvedParams = await params
    const venueData = await fetchVenueById(resolvedParams.id)
    setVenue(venueData)
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!venue) return

    const success = await deleteVenue(venue.id)
    if (success) {
      window.location.href = "/venues"
    } else {
      alert("Failed to delete venue")
      setShowDeleteModal(false)
    }
  }

  const handleDeleteFunction = async (functionId: string) => {
    if (!venue || !confirm("Are you sure you want to delete this function?"))
      return

    setDeletingFunctionId(functionId)
    const success = await removeVenueFunction(venue.id, functionId)

    if (success) {
      // Reload venue data
      await loadVenue()
    } else {
      alert("Failed to delete function")
    }

    setDeletingFunctionId(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
            <MapPin className="h-8 w-8 text-zinc-400" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Venue Not Found
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            The requested venue does not exist or was deleted
          </p>
          <Link
            href="/venues"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to List
          </Link>
        </div>
      </div>
    )
  }

  const getTodayHours = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
    const hours = venue.operatingHours.find((h) => h.dayOfWeek === today)

    if (!hours || hours.isClosed) {
      return { text: "Closed", isOpen: false }
    }

    return { text: `${hours.openTime} - ${hours.closeTime}`, isOpen: true }
  }

  const todayHours = getTodayHours()

  // Determine which view to show based on user role
  const renderRoleBasedView = () => {
    if (!venue) return null

    if (currentUser.role === "volunteer") {
      return <VolunteerVenueView venue={venue} />
    } else if (currentUser.role === "organizer") {
      // Only show organizer view if they own this venue
      if (currentUser.organizerId === venue.organizerId) {
        return <OrganizerVenueView venue={venue} />
      }
      // Otherwise show volunteer view
      return <VolunteerVenueView venue={venue} />
    } else if (currentUser.role === "beneficiary") {
      return <BeneficiaryVenueView venue={venue} />
    }

    return null
  }

  // Check if user can edit this venue
  const canEdit =
    currentUser.role === "organizer" &&
    currentUser.organizerId === venue?.organizerId

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <Header
        actions={
          canEdit ? (
            <>
              <Link
                href={`/venues/${venue.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          ) : null
        }
      />

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Venue Title and Status */}
          <div
            className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 ${
              canEdit
                ? "cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                : ""
            }`}
            onClick={() => canEdit && router.push(`/venues/${venue.id}/edit`)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {venue.title}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {venueTypeLabels[venue.type]}
                  </span>
                  <span className="text-zinc-400">•</span>
                  <span
                    className={`text-sm font-medium ${
                      todayHours.isOpen
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {todayHours.text}
                  </span>
                </div>
              </div>
              {canEdit && (
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  Click to edit
                </div>
              )}
            </div>
          </div>

          {/* Type and description */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300">
                {venueTypeIcons[venue.type]}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  {venueTypeLabels[venue.type]}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {venueTypeDescriptions[venue.type]}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Description
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {venue.description}
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Location
            </h2>
            <div className="mb-4">
              <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{venue.location.address}</span>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden h-[400px] relative">
              <LeafletMap
                markers={[
                  {
                    id: venue.id,
                    lat: venue.location.lat,
                    lng: venue.location.lng,
                    title: venue.title,
                    description: venue.description,
                  },
                ]}
                center={[venue.location.lat, venue.location.lng]}
                zoom={15}
              />
            </div>
          </div>

          {/* Operating hours */}
          <Collapsible
            open={isOperatingHoursOpen}
            onOpenChange={setIsOperatingHoursOpen}
            className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="p-6">
              <CollapsibleTrigger className="w-full group">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Operating Hours
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-zinc-500 transition-transform duration-200 ${
                      isOperatingHoursOpen ? "rotate-180" : ""
                    }`}
                  />
                </h2>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-4">
                <div className="space-y-2">
                  {venue.operatingHours.map((hours) => {
                    const isToday =
                      new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                      }) === hours.dayOfWeek

                    return (
                      <div
                        key={hours.dayOfWeek}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isToday
                            ? "bg-zinc-100 dark:bg-zinc-800"
                            : "bg-zinc-50 dark:bg-zinc-800/50"
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            isToday
                              ? "text-zinc-900 dark:text-zinc-100"
                              : "text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {hours.dayOfWeek}
                          {isToday && (
                            <span className="ml-2 text-xs font-normal text-zinc-600 dark:text-zinc-400">
                              (Today)
                            </span>
                          )}
                        </span>
                        {hours.isClosed ? (
                          <span className="text-sm text-zinc-500 dark:text-zinc-500">
                            Closed
                          </span>
                        ) : (
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {hours.openTime} — {hours.closeTime}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Role-based view */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              {currentUser.role === "organizer" && canEdit
                ? "Manage Functions & Responses"
                : currentUser.role === "volunteer"
                ? "Volunteer Opportunities"
                : "Available Distribution Points"}
            </h2>
            {currentUser.role === "organizer" && canEdit ? (
              <OrganizerVenueView
                venue={venue}
                onDeleteFunction={handleDeleteFunction}
              />
            ) : (
              renderRoleBasedView()
            )}
          </div>
        </div>
      </main>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Delete Venue?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Are you sure you want to delete venue "{venue.title}"? This action
              cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

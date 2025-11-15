"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  Building2,
  Warehouse,
  Home,
  Plus,
  Trash2,
} from "lucide-react"
import type { VenueType, VenueLocation, OperatingHours } from "@/types/venue"
import { createVenue } from "@/lib/api/venues"

// Dynamic map import
const LocationPickerMap = dynamic(
  () => import("@/components/LocationPickerMap"),
  {
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
  }
)

const defaultOperatingHours: OperatingHours[] = [
  {
    dayOfWeek: "Monday",
    openTime: "09:00",
    closeTime: "18:00",
    isClosed: false,
  },
  {
    dayOfWeek: "Tuesday",
    openTime: "09:00",
    closeTime: "18:00",
    isClosed: false,
  },
  {
    dayOfWeek: "Wednesday",
    openTime: "09:00",
    closeTime: "18:00",
    isClosed: false,
  },
  {
    dayOfWeek: "Thursday",
    openTime: "09:00",
    closeTime: "18:00",
    isClosed: false,
  },
  {
    dayOfWeek: "Friday",
    openTime: "09:00",
    closeTime: "18:00",
    isClosed: false,
  },
  {
    dayOfWeek: "Saturday",
    openTime: "10:00",
    closeTime: "16:00",
    isClosed: false,
  },
  {
    dayOfWeek: "Sunday",
    openTime: "00:00",
    closeTime: "00:00",
    isClosed: true,
  },
]

export default function NewVenuePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "collection_point" as VenueType,
  })

  const [location, setLocation] = useState<VenueLocation>({
    lat: 55.7558,
    lng: 37.6173,
    address: "",
  })

  // Автоматически получить геолокацию пользователя при загрузке страницы
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "",
          })
        },
        (error) => {
          console.error("Ошибка получения геолокации:", error)
          // Оставляем координаты по умолчанию (Москва)
        }
      )
    }
  }, [])

  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>(
    defaultOperatingHours
  )

  const venueTypes: Array<{
    value: VenueType
    label: string
    icon: React.ReactNode
    description: string
  }> = [
    {
      value: "collection_point",
      label: "Collection Point",
      icon: <Building2 className="h-5 w-5" />,
      description: "Place for collecting humanitarian aid",
    },
    {
      value: "distribution_hub",
      label: "Distribution Hub",
      icon: <Warehouse className="h-5 w-5" />,
      description: "Center for distributing aid",
    },
    {
      value: "shelter",
      label: "Shelter",
      icon: <Home className="h-5 w-5" />,
      description: "Temporary shelter for those in need",
    },
  ]

  const handleLocationSelect = (newLocation: VenueLocation) => {
    setLocation(newLocation)
  }

  const handleOperatingHoursChange = (
    index: number,
    field: keyof OperatingHours,
    value: string | boolean
  ) => {
    const newHours = [...operatingHours]
    newHours[index] = { ...newHours[index], [field]: value }
    setOperatingHours(newHours)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newVenue = await createVenue({
        ...formData,
        location,
        operatingHours,
        organizerId: "org-1", // TODO: Get from auth
      })

      // Redirect to the new venue detail page
      router.push(`/venues/${newVenue.id}`)
    } catch (error) {
      console.error("Failed to create venue:", error)
      alert("Failed to create venue")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/venues"
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Add New Venue
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Fill in the information about the new venue
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
          {/* Basic information */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Basic Information
            </h2>

            {/* Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Venue Name *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="E.g.: Central Collection Point"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the purpose and functions of the venue..."
                rows={4}
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all resize-none"
                required
              />
            </div>

            {/* Venue type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Venue Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {venueTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: type.value })
                    }
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.type === type.value
                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`${
                          formData.type === type.value
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {type.icon}
                      </div>
                      <span
                        className={`font-medium ${
                          formData.type === type.value
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {type.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Location
            </h2>

            <LocationPickerMap
              initialLocation={{ lat: location.lat, lng: location.lng }}
              onLocationSelect={handleLocationSelect}
            />

            {/* Address */}
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                value={location.address}
                onChange={(e) =>
                  setLocation({ ...location, address: e.target.value })
                }
                placeholder="Address will be determined automatically"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
              />
            </div>
          </div>

          {/* Operating hours */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Operating Hours
            </h2>

            <div className="space-y-3">
              {operatingHours.map((hours, index) => (
                <div
                  key={hours.dayOfWeek}
                  className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                >
                  <div className="w-32 flex-shrink-0">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {hours.dayOfWeek}
                    </span>
                  </div>

                  {hours.isClosed ? (
                    <div className="flex-1">
                      <span className="text-sm text-zinc-500 dark:text-zinc-500">
                        Closed
                      </span>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="time"
                        value={hours.openTime}
                        onChange={(e) =>
                          handleOperatingHoursChange(
                            index,
                            "openTime",
                            e.target.value
                          )
                        }
                        className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                      />
                      <span className="text-zinc-500">—</span>
                      <input
                        type="time"
                        value={hours.closeTime}
                        onChange={(e) =>
                          handleOperatingHoursChange(
                            index,
                            "closeTime",
                            e.target.value
                          )
                        }
                        className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hours.isClosed}
                      onChange={(e) =>
                        handleOperatingHoursChange(
                          index,
                          "isClosed",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                    />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Closed
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/venues"
              className="px-6 py-3 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white dark:border-zinc-900 border-t-transparent"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Create Venue
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

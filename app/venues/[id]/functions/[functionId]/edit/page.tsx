"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import type {
  VenueFunction,
  ItemWithQuantity,
  ServiceRequest,
  OperatingHours,
  QuantityLevel,
} from "@/types/venue"
import type { Venue } from "@/types/venue"
import { fetchVenueById } from "@/lib/api/venues"
import {
  fetchVenueFunctionById,
  updateVenueFunction,
} from "@/lib/api/venue-functions"
import { getCategoryPath } from "@/lib/api/item-categories"
import ItemCategoryTreePicker from "@/components/venue-functions/ItemCategoryTreePicker"
import ServiceSelector from "@/components/venue-functions/ServiceSelector"

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

const quantityLevels: {
  value: QuantityLevel
  label: string
  color: string
}[] = [
  {
    value: "a_lot",
    label: "A lot",
    color:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
  },
  {
    value: "some",
    label: "Some",
    color:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
  },
  {
    value: "few",
    label: "Few",
    color:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700",
  },
]

interface PageProps {
  params: Promise<{ id: string; functionId: string }>
}

export default function EditFunctionPage({ params }: PageProps) {
  const router = useRouter()
  const [venueId, setVenueId] = useState<string>("")
  const [functionId, setFunctionId] = useState<string>("")
  const [venue, setVenue] = useState<Venue | null>(null)
  const [venueFunction, setVenueFunction] = useState<VenueFunction | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedItems, setSelectedItems] = useState<ItemWithQuantity[]>([])
  const [selectedServices, setSelectedServices] = useState<ServiceRequest[]>([])
  const [openingTimes, setOpeningTimes] = useState<OperatingHours[]>(
    defaultOperatingHours
  )
  const [specialRequests, setSpecialRequests] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const resolvedParams = await params
    setVenueId(resolvedParams.id)
    setFunctionId(resolvedParams.functionId)

    const venueData = await fetchVenueById(resolvedParams.id)
    const functionData = await fetchVenueFunctionById(
      resolvedParams.id,
      resolvedParams.functionId
    )

    if (venueData && functionData) {
      setVenue(venueData)
      setVenueFunction(functionData)

      // Populate form data based on function type
      if (
        functionData.type === "collection_point" ||
        functionData.type === "distribution_point"
      ) {
        setSelectedItems(functionData.items)
        setOpeningTimes(functionData.openingTimes)
        setSpecialRequests(functionData.specialRequests || "")
      } else if (functionData.type === "services_needed") {
        setSelectedServices(functionData.services)
        setSpecialRequests(functionData.specialRequests || "")
      }
    }

    setIsLoading(false)
  }

  const handleOperatingHoursChange = (
    index: number,
    field: keyof OperatingHours,
    value: string | boolean
  ) => {
    const newHours = [...openingTimes]
    newHours[index] = { ...newHours[index], [field]: value }
    setOpeningTimes(newHours)
  }

  const updateItemQuantity = (categoryId: string, quantity: QuantityLevel) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.categoryId === categoryId ? { ...item, quantity } : item
      )
    )
  }

  const removeItem = (categoryId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.categoryId !== categoryId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!venueFunction) return

    setIsSubmitting(true)

    try {
      let updateData: Partial<VenueFunction> = {}

      if (
        venueFunction.type === "collection_point" ||
        venueFunction.type === "distribution_point"
      ) {
        updateData = {
          items: selectedItems,
          openingTimes,
          specialRequests: specialRequests || undefined,
        } as Partial<VenueFunction>
      } else if (venueFunction.type === "services_needed") {
        updateData = {
          services: selectedServices,
          specialRequests: specialRequests || undefined,
        } as Partial<VenueFunction>
      }

      await updateVenueFunction(venueId, functionId, updateData)
      router.push(`/venues/${venueId}`)
    } catch (error) {
      console.error("Error updating function:", error)
      alert("Failed to update function. Please try again.")
      setIsSubmitting(false)
    }
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

  if (!venue || !venueFunction) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Function Not Found
          </h2>
          <Link
            href="/venues"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Back to Venues
          </Link>
        </div>
      </div>
    )
  }

  const getFunctionTitle = () => {
    switch (venueFunction.type) {
      case "collection_point":
        return "Collection Point"
      case "distribution_point":
        return "Distribution Point"
      case "services_needed":
        return "Services Needed"
      case "custom":
        return venueFunction.customTypeName
      default:
        return "Function"
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/venues/${venueId}`}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Edit {getFunctionTitle()}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {venue.title}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Items Configuration (for collection/distribution) */}
          {(venueFunction.type === "collection_point" ||
            venueFunction.type === "distribution_point") && (
            <>
              {/* Current Items List */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Items ({selectedItems.length})
                </h2>
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div
                      key={item.categoryId}
                      className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                          {item.categoryPath[item.categoryPath.length - 1]}
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-500">
                          {item.categoryPath.slice(0, -1).join(" → ")}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex gap-2">
                        {quantityLevels.map((level) => (
                          <button
                            key={level.value}
                            type="button"
                            onClick={() =>
                              updateItemQuantity(item.categoryId, level.value)
                            }
                            className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                              item.quantity === level.value
                                ? level.color
                                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600"
                            }`}
                          >
                            {level.label}
                          </button>
                        ))}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.categoryId)}
                        className="p-2 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add More Items */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Add More Items
                </h2>
                <ItemCategoryTreePicker
                  selectedItems={selectedItems}
                  onItemsChange={setSelectedItems}
                />
              </div>

              {/* Opening Times */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Opening Times
                </h2>
                <div className="space-y-3">
                  {openingTimes.map((hours, index) => (
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
            </>
          )}

          {/* Services Configuration (for services_needed) */}
          {venueFunction.type === "services_needed" && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Services Needed
              </h2>
              <ServiceSelector
                selectedServices={selectedServices}
                onServicesChange={setSelectedServices}
              />
            </div>
          )}

          {/* Special Requests */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Special Requests (Optional)
            </h2>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any special instructions or requirements..."
              rows={4}
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href={`/venues/${venueId}`}
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}


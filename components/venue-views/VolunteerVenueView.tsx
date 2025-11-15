"use client"

import { useState, useEffect } from "react"
import { Hand, Package, Check } from "lucide-react"
import type {
  Venue,
  VenueFunction,
  ItemWithQuantity,
  ServiceRequest,
} from "@/types/venue"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface VolunteerVenueViewProps {
  venue: Venue
}

interface VolunteerResponse {
  id: string
  venueId: string
  functionId: string
  volunteerId: string
  volunteerName: string
  volunteerEmail: string
  responseType: "item" | "service"
  categoryId?: string
  serviceType?: string
  quantity?: number
  message?: string
  status: "pending" | "approved" | "rejected"
  timestamp: string
}

interface SelectedItem {
  functionId: string
  item?: ItemWithQuantity
  service?: ServiceRequest
}

export default function VolunteerVenueView({ venue }: VolunteerVenueViewProps) {
  const [userResponses, setUserResponses] = useState<VolunteerResponse[]>([])
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedCount, setSubmittedCount] = useState(0)

  // Получаем текущего пользователя (здесь заглушка, в реальном приложении из auth)
  const currentUser = {
    id: "volunteer-1",
    name: "John Volunteer",
    email: "john@example.com",
  }

  useEffect(() => {
    loadUserResponses()
  }, [venue.id])

  const loadUserResponses = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/responses?venueId=${venue.id}&volunteerId=${currentUser.id}`
      )
      if (response.ok) {
        const data = await response.json()
        setUserResponses(data)
      }
    } catch (error) {
      console.error("Error loading responses:", error)
    } finally {
      setLoading(false)
    }
  }

  const hasResponded = (
    functionId: string,
    categoryId?: string,
    serviceType?: string
  ): boolean => {
    return userResponses.some(
      (r) =>
        r.functionId === functionId &&
        (categoryId
          ? r.categoryId === categoryId
          : r.serviceType === serviceType)
    )
  }

  const toggleItemSelection = (
    functionId: string,
    item?: ItemWithQuantity,
    service?: ServiceRequest
  ) => {
    // Проверяем, не откликнулся ли уже на этот item/service
    if (
      hasResponded(
        functionId,
        item?.categoryId,
        service?.type
      )
    ) {
      return
    }

    const exists = selectedItems.find(
      (s) =>
        (s.item &&
          item &&
          s.functionId === functionId &&
          s.item.categoryId === item.categoryId) ||
        (s.service &&
          service &&
          s.functionId === functionId &&
          s.service.type === service.type)
    )

    if (exists) {
      setSelectedItems(
        selectedItems.filter(
          (s) =>
            !(
              (s.item &&
                item &&
                s.functionId === functionId &&
                s.item.categoryId === item.categoryId) ||
              (s.service &&
                service &&
                s.functionId === functionId &&
                s.service.type === service.type)
            )
        )
      )
    } else {
      setSelectedItems([...selectedItems, { functionId, item, service }])
    }
  }

  const isItemSelected = (
    functionId: string,
    item?: ItemWithQuantity,
    service?: ServiceRequest
  ) => {
    return selectedItems.some(
      (s) =>
        (s.item &&
          item &&
          s.functionId === functionId &&
          s.item.categoryId === item.categoryId) ||
        (s.service &&
          service &&
          s.functionId === functionId &&
          s.service.type === service.type)
    )
  }

  const handleQuantityChange = (
    functionId: string,
    categoryId: string,
    value: number
  ) => {
    const key = `${functionId}-${categoryId}`
    setQuantities((prev) => ({ ...prev, [key]: value }))
  }

  const handleBulkRespond = () => {
    if (selectedItems.length > 0) {
      setShowBulkModal(true)
    }
  }

  const handleSubmitBulkResponse = async (e: React.FormEvent) => {
    e.preventDefault()

    if (submitting || selectedItems.length === 0) return

    setSubmitting(true)

    try {
      const responses = await Promise.all(
        selectedItems.map(async ({ functionId, item, service }) => {
          const key = item ? `${functionId}-${item.categoryId}` : ""
          return fetch("/api/responses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              venueId: venue.id,
              functionId,
              volunteerId: currentUser.id,
              volunteerName: currentUser.name,
              volunteerEmail: currentUser.email,
              responseType: item ? "item" : "service",
              categoryId: item?.categoryId,
              serviceType: service?.type,
              quantity: item ? quantities[key] || 1 : undefined,
              message: message || undefined,
            }),
          })
        })
      )

      const allSuccessful = responses.every((r) => r.ok)

      if (allSuccessful) {
        const newResponses = await Promise.all(
          responses.map((r) => r.json())
        )
        setUserResponses([...userResponses, ...newResponses])
        
        // Сохраняем количество до очистки
        const count = selectedItems.length
        
        setShowBulkModal(false)
        setSelectedItems([])
        setQuantities({})
        setMessage("")
        setSubmittedCount(count)
        setShowSuccessModal(true)

        setTimeout(() => {
          setShowSuccessModal(false)
        }, 3000)
      } else {
        console.error("Some responses failed")
      }
    } catch (error) {
      console.error("Error submitting bulk response:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const renderItemCard = (
    func: VenueFunction,
    item: ItemWithQuantity,
    index: number
  ) => {
    const isResponded = hasResponded(func.id, item.categoryId)
    const isSelected = isItemSelected(func.id, item)
    const itemName = item.categoryPath[item.categoryPath.length - 1]

    return (
      <div
        key={index}
        onClick={() => !isResponded && toggleItemSelection(func.id, item)}
        className={`flex items-center p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg ${
          !isResponded
            ? "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            : "opacity-60"
        }`}
      >
        {!isResponded && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleItemSelection(func.id, item)}
            className="mr-3"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {isResponded && <Check className="h-4 w-4 text-green-600 mr-3" />}
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {itemName}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
            Need: {item.quantity.replace("_", " ")}
          </p>
        </div>
        {isResponded && (
          <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-none text-xs">
            Responded
          </Badge>
        )}
      </div>
    )
  }

  const renderServiceCard = (
    func: VenueFunction,
    service: ServiceRequest,
    index: number
  ) => {
    const isResponded = hasResponded(func.id, undefined, service.type)
    const isSelected = isItemSelected(func.id, undefined, service)

    return (
      <div
        key={index}
        onClick={() => !isResponded && toggleItemSelection(func.id, undefined, service)}
        className={`flex items-center p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg ${
          !isResponded
            ? "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            : "opacity-60"
        }`}
      >
        {!isResponded && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleItemSelection(func.id, undefined, service)}
            className="mr-3"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {isResponded && <Check className="h-4 w-4 text-green-600 mr-3" />}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">
              {service.type.replace("_", " ")}
            </p>
            {service.isRequired && (
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-medium rounded">
                Required
              </span>
            )}
          </div>
          {service.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {service.description}
            </p>
          )}
        </div>
        {isResponded && (
          <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-none text-xs">
            Responded
          </Badge>
        )}
      </div>
    )
  }

  const renderFunction = (func: VenueFunction) => {
    const isCollection = func.type === "collection_point"
    const isDistribution = func.type === "distribution_point"
    const isService = func.type === "services_needed"

    return (
      <Card key={func.id} className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`p-2 rounded-lg ${
              isService
                ? "bg-green-100 dark:bg-green-900"
                : "bg-blue-100 dark:bg-blue-900"
            }`}
          >
            {isService ? (
              <Hand className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {isCollection
                ? "Items Needed"
                : isDistribution
                ? "Items Available"
                : "Services Needed"}
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {isCollection
                ? "Items needed for collection"
                : isDistribution
                ? "Items available for distribution"
                : "Volunteer services required"}
            </p>
          </div>
        </div>

        {func.items && func.items.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
              Items ({func.items.length})
            </p>
            {func.items.map((item, idx) => renderItemCard(func, item, idx))}
          </div>
        )}

        {func.services && func.services.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
              Services ({func.services.length})
            </p>
            {func.services.map((service, idx) =>
              renderServiceCard(func, service, idx)
            )}
          </div>
        )}

        {func.specialRequests && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-xs font-semibold text-amber-900 dark:text-amber-300 mb-1">
              Special Requests
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-400">
              {func.specialRequests}
            </p>
          </div>
        )}
      </Card>
    )
  }

  const itemsToRespond = selectedItems.filter((s) => s.item)
  const servicesToRespond = selectedItems.filter((s) => s.service)

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {venue.functions && venue.functions.length > 0 ? (
        <>
          <div className="space-y-4">
            {venue.functions.map(renderFunction)}
          </div>

          {/* Кнопка Respond внизу */}
          {selectedItems.length > 0 && (
            <div className="sticky bottom-4 flex justify-center">
              <Button
                onClick={handleBulkRespond}
                size="lg"
                className="flex items-center gap-2 shadow-lg"
              >
                <Hand className="h-5 w-5" />
                Respond ({selectedItems.length})
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            No opportunities available at this venue yet.
          </p>
        </Card>
      )}

      {/* Bulk Response Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Respond to {selectedItems.length} item{selectedItems.length !== 1 ? "s" : ""}
            </h3>

            <form onSubmit={handleSubmitBulkResponse} className="space-y-4">
              {itemsToRespond.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    Items ({itemsToRespond.length})
                  </p>
                  <div className="space-y-3">
                    {itemsToRespond.map(({ functionId, item }) => {
                      if (!item) return null
                      const key = `${functionId}-${item.categoryId}`
                      const itemName =
                        item.categoryPath[item.categoryPath.length - 1]
                      return (
                        <div
                          key={key}
                          className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg"
                        >
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {itemName}
                          </p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 capitalize">
                            Need level: {item.quantity.replace("_", " ")}
                          </p>
                          <div className="mt-2">
                            <Label htmlFor={`quantity-${key}`} className="text-xs">
                              Quantity you can provide
                            </Label>
                            <Input
                              id={`quantity-${key}`}
                              type="number"
                              min="1"
                              value={quantities[key] || 1}
                              onChange={(e) =>
                                handleQuantityChange(
                                  functionId,
                                  item.categoryId,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="mt-1"
                              required
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {servicesToRespond.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    Services ({servicesToRespond.length})
                  </p>
                  <div className="space-y-2">
                    {servicesToRespond.map(({ functionId, service }) => {
                      if (!service) return null
                      return (
                        <div
                          key={`${functionId}-${service.type}`}
                          className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg"
                        >
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                            {service.type.replace("_", " ")}
                          </p>
                          {service.description && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="bulk-message">Message (optional)</Label>
                <textarea
                  id="bulk-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  rows={3}
                  placeholder="Add a message for all selected items and services..."
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="flex-1"
                  variant="outline"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? "Submitting..." : `Submit ${selectedItems.length} Response${selectedItems.length !== 1 ? "s" : ""}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div className="bg-green-600 text-white rounded-xl px-6 py-4 shadow-lg flex items-center gap-3">
            <Check className="h-5 w-5" />
            <p className="font-medium">
              {submittedCount} response{submittedCount !== 1 ? "s" : ""} submitted successfully!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Package,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import type {
  Venue,
  VenueFunction,
  CollectionPointFunction,
  DistributionPointFunction,
  ServicesNeededFunction,
  CustomFunction,
} from "@/types/venue"
import type { NeedStatus } from "@/types/response"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface OrganizerVenueViewProps {
  venue: Venue
  onDeleteFunction?: (functionId: string) => void
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

interface NeedStatusData {
  id: string
  venueId: string
  functionId: string
  itemCategoryId?: string
  serviceType?: string
  status: NeedStatus
  updatedBy: string
  updatedAt: string
}

function NeedStatusButton({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: NeedStatus | undefined
  onStatusChange: (status: NeedStatus) => void
}) {
  const statuses: { status: NeedStatus; label: string; color: string }[] = [
    {
      status: "need_a_lot",
      label: "Need a lot",
      color: "bg-red-500",
    },
    {
      status: "need_few_more",
      label: "Need few more",
      color: "bg-amber-500",
    },
    {
      status: "dont_need",
      label: "Don't need",
      color: "bg-green-500",
    },
  ]

  return (
    <div className="flex gap-1.5">
      {statuses.map(({ status, label, color }) => (
        <Button
          key={status}
          size="sm"
          variant={currentStatus === status ? "default" : "outline"}
          className={
            currentStatus === status
              ? `${color} text-white hover:opacity-90 h-7 text-xs`
              : "h-7 text-xs"
          }
          onClick={() => onStatusChange(status)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}

export default function OrganizerVenueView({
  venue,
  onDeleteFunction,
}: OrganizerVenueViewProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [responses, setResponses] = useState<VolunteerResponse[]>([])
  const [needStatuses, setNeedStatuses] = useState<NeedStatusData[]>([])
  const [loading, setLoading] = useState(true)

  // Текущий пользователь (в реальности из auth)
  const currentUser = {
    id: "org-1",
    name: "Organizer",
  }

  useEffect(() => {
    loadData()
  }, [venue.id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [responsesRes, statusesRes] = await Promise.all([
        fetch(`/api/responses?venueId=${venue.id}`),
        fetch(`/api/need-status?venueId=${venue.id}`),
      ])

      if (responsesRes.ok) {
        const responsesData = await responsesRes.json()
        setResponses(responsesData)
      }

      if (statusesRes.ok) {
        const statusesData = await statusesRes.json()
        setNeedStatuses(statusesData)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getNeedStatus = (
    functionId: string,
    categoryId?: string,
    serviceType?: string
  ): NeedStatusData | undefined => {
    return needStatuses.find(
      (s) =>
        s.functionId === functionId &&
        (categoryId
          ? s.itemCategoryId === categoryId
          : s.serviceType === serviceType)
    )
  }

  const getResponsesForFunction = (functionId: string): VolunteerResponse[] => {
    return responses.filter((r) => r.functionId === functionId)
  }

  const toggleItem = (key: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedItems(newExpanded)
  }

  const handleStatusChange = async (
    functionId: string,
    itemOrServiceId: string,
    status: NeedStatus,
    isService: boolean
  ) => {
    try {
      const response = await fetch("/api/need-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          venueId: venue.id,
          functionId,
          [isService ? "serviceType" : "itemCategoryId"]: itemOrServiceId,
          status,
          updatedBy: currentUser.id,
        }),
      })

      if (response.ok) {
        const updatedStatus = await response.json()
        // Обновляем локальное состояние
        setNeedStatuses((prev) => {
          const existingIndex = prev.findIndex(
            (s) =>
              s.functionId === functionId &&
              (isService
                ? s.serviceType === itemOrServiceId
                : s.itemCategoryId === itemOrServiceId)
          )
          if (existingIndex >= 0) {
            const newStatuses = [...prev]
            newStatuses[existingIndex] = updatedStatus
            return newStatuses
          } else {
            return [...prev, updatedStatus]
          }
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleDelete = (functionId: string) => {
    if (onDeleteFunction) {
      onDeleteFunction(functionId)
    }
  }

  const hasAnyFunctions = venue.functions && venue.functions.length > 0

  // Рендер элемента (товара/услуги) с компактным дизайном
  const renderItemRow = (
    func: VenueFunction,
    itemName: string,
    categoryId: string,
    responsesCount: number,
    totalQuantity?: number,
    isService?: boolean
  ) => {
    const currentStatus = getNeedStatus(
      func.id,
      isService ? undefined : categoryId,
      isService ? categoryId : undefined
    )
    const itemKey = `${func.id}-${categoryId}`
    const isExpanded = expandedItems.has(itemKey)
    const itemResponses = getResponsesForFunction(func.id).filter((r) =>
      isService ? r.serviceType === categoryId : r.categoryId === categoryId
    )

    return (
      <div key={itemKey}>
        <div className="flex items-center gap-3 py-2.5 px-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
          {/* Название */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {itemName}
            </p>
          </div>

          {/* Ответы волонтеров */}
          {responsesCount > 0 ? (
            <button
              onClick={() => toggleItem(itemKey)}
              className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded text-xs font-medium text-blue-700 dark:text-blue-300 transition-colors"
            >
              <Users className="h-3 w-3" />
              <span>{responsesCount}</span>
              {totalQuantity !== undefined && (
                <span>• {totalQuantity} units</span>
              )}
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <Badge variant="outline" className="text-xs">
              No responses
            </Badge>
          )}

          {/* Статус потребности */}
          <div className="flex items-center gap-2">
            <NeedStatusButton
              currentStatus={currentStatus?.status}
              onStatusChange={(status) =>
                handleStatusChange(func.id, categoryId, status, !!isService)
              }
            />
          </div>
        </div>

        {/* Детали ответов */}
        {isExpanded && itemResponses.length > 0 && (
          <div className="px-3 pb-2 space-y-1">
            {itemResponses.map((response) => (
              <div
                key={response.id}
                className="text-xs p-2 bg-blue-50 dark:bg-blue-900/10 rounded"
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {response.volunteerName}
                </p>
                {response.quantity && (
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Quantity: {response.quantity}
                  </p>
                )}
                {response.message && (
                  <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                    {response.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Рендер карточки функции
  const renderFunctionCard = (func: VenueFunction, index: number) => {
    const funcResponses = getResponsesForFunction(func.id)
    const isCollection = func.type === "collection_point"
    const isDistribution = func.type === "distribution_point"
    const isService = func.type === "services_needed"

    // Type guards для безопасного доступа к свойствам
    const hasItems = (
      fn: VenueFunction
    ): fn is
      | CollectionPointFunction
      | DistributionPointFunction
      | CustomFunction => {
      return (
        fn.type === "collection_point" ||
        fn.type === "distribution_point" ||
        fn.type === "custom"
      )
    }

    const hasServices = (
      fn: VenueFunction
    ): fn is ServicesNeededFunction | CustomFunction => {
      return fn.type === "services_needed" || fn.type === "custom"
    }

    const itemsCount = hasItems(func) && func.items ? func.items.length : 0
    const servicesCount =
      hasServices(func) && func.services ? func.services.length : 0

    return (
      <Card key={func.id} className="overflow-hidden">
        {/* Хедер функции */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isService
                  ? "bg-green-100 dark:bg-green-900"
                  : "bg-blue-100 dark:bg-blue-900"
              }`}
            >
              {isService ? (
                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {isCollection
                  ? "Humanitarian Aid Collection"
                  : isDistribution
                  ? "Aid Distribution"
                  : "Volunteers Needed"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isService
                  ? `${servicesCount} services`
                  : `${itemsCount} categories`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/venues/${venue.id}/functions/${func.id}/edit`}
              className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition-colors"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDelete(func.id)}
              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Список элементов */}
        <div className="p-3 space-y-1">
          {hasServices(func) && func.services
            ? func.services.map((service, idx) => {
                const serviceResponses = funcResponses.filter(
                  (r) =>
                    r.responseType === "service" &&
                    r.serviceType === service.type
                )
                return renderItemRow(
                  func,
                  service.type.replace("_", " "),
                  service.type,
                  serviceResponses.length,
                  undefined,
                  true // isService flag
                )
              })
            : hasItems(func) && func.items
            ? func.items.map((item) => {
                const itemResponses = funcResponses.filter(
                  (r) => r.categoryId === item.categoryId
                )
                const totalQuantity = itemResponses.reduce(
                  (sum, r) => sum + (r.quantity || 0),
                  0
                )
                // Используем последний элемент categoryPath как имя
                const itemName =
                  item.categoryPath[item.categoryPath.length - 1] ||
                  "Unknown Item"
                return renderItemRow(
                  func,
                  itemName,
                  item.categoryId,
                  itemResponses.length,
                  totalQuantity,
                  false // isService flag
                )
              })
            : null}
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </Card>
    )
  }

  if (!hasAnyFunctions) {
    return (
      <Card className="p-8 text-center">
        <div className="max-w-sm mx-auto">
          <div className="mb-4 inline-flex p-4 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Package className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            No Functions
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Add the first function for your venue
          </p>
          <Link
            href={`/venues/${venue.id}/functions/new`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Function
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Manage venue functions and volunteer responses
          </p>
        </div>
        <Link
          href={`/venues/${venue.id}/functions/new`}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add
        </Link>
      </div>

      {/* List of all functions */}
      <div className="space-y-3">
        {venue.functions?.map((func, idx) => renderFunctionCard(func, idx))}
      </div>
    </div>
  )
}

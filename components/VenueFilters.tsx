"use client"

import { useState } from "react"
import { Search, Building2, Warehouse, Home, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { VenueType } from "@/types/venue"
import {
  textClasses,
  interactiveClasses,
} from "@/lib/theme-utils"

export interface VenueFilterState {
  searchQuery: string
  types: VenueType[]
  openNow: boolean | null
}

interface VenueFiltersProps {
  filters: VenueFilterState
  onFiltersChange: (filters: VenueFilterState) => void
}

const venueTypeOptions: Array<{
  value: VenueType
  label: string
  icon: React.ReactNode
}> = [
  {
    value: "collection_point",
    label: "Collection Point",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    value: "distribution_hub",
    label: "Distribution Hub",
    icon: <Warehouse className="h-4 w-4" />,
  },
  {
    value: "shelter",
    label: "Shelter",
    icon: <Home className="h-4 w-4" />,
  },
]

export function VenueFilters({ filters, onFiltersChange }: VenueFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.searchQuery)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onFiltersChange({
      ...filters,
      searchQuery: value,
    })
  }

  const toggleType = (type: VenueType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type]

    onFiltersChange({
      ...filters,
      types: newTypes,
    })
  }

  const toggleOpenNow = () => {
    const newOpenNow = filters.openNow === null ? true : filters.openNow === true ? false : null
    onFiltersChange({
      ...filters,
      openNow: newOpenNow,
    })
  }

  const clearFilters = () => {
    setSearchValue("")
    onFiltersChange({
      searchQuery: "",
      types: [],
      openNow: null,
    })
  }

  const hasActiveFilters =
    filters.searchQuery ||
    filters.types.length > 0 ||
    filters.openNow !== null

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textClasses.secondary}`} />
            <Input
              type="text"
              placeholder="Search by name, description or address..."
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
            {searchValue && (
              <button
                onClick={() => handleSearchChange("")}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${textClasses.secondary} hover:${textClasses.primary}`}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Type filters */}
        <div className="mb-4">
          <label className={`text-sm font-medium ${textClasses.primary} mb-2 block`}>
            Venue Type:
          </label>
          <div className="flex flex-wrap gap-2">
            {venueTypeOptions.map((option) => (
              <Button
                key={option.value}
                variant={filters.types.includes(option.value) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleType(option.value)}
                className="gap-2"
              >
                {option.icon}
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Open now filter */}
        <div className="mb-4">
          <label className={`text-sm font-medium ${textClasses.primary} mb-2 block`}>
            Operating Hours:
          </label>
          <div className="flex gap-2">
            <Button
              variant={filters.openNow === true ? "default" : "outline"}
              size="sm"
              onClick={toggleOpenNow}
            >
              Open Now
            </Button>
            <Button
              variant={filters.openNow === false ? "default" : "outline"}
              size="sm"
              onClick={toggleOpenNow}
            >
              Closed
            </Button>
          </div>
        </div>

        {/* Active filters summary and clear button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {filters.searchQuery && (
                <Badge variant="secondary">
                  Search: {filters.searchQuery}
                </Badge>
              )}
              {filters.types.map((type) => {
                const option = venueTypeOptions.find((o) => o.value === type)
                return (
                  <Badge key={type} variant="secondary">
                    {option?.label}
                  </Badge>
                )
              })}
              {filters.openNow !== null && (
                <Badge variant="secondary">
                  {filters.openNow ? "Open Now" : "Closed"}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


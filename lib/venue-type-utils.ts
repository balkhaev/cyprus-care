/**
 * Utility functions for determining venue types based on their functions
 */

import type { Venue, VenueFunctionType } from "@/types/venue"

/**
 * Get all unique function types for a venue
 */
export function getVenueFunctionTypes(venue: Venue): VenueFunctionType[] {
  const types = new Set<VenueFunctionType>()
  
  for (const func of venue.functions) {
    types.add(func.type)
  }
  
  return Array.from(types)
}

/**
 * Check if venue has a specific function type
 */
export function venueHasFunctionType(
  venue: Venue,
  functionType: VenueFunctionType
): boolean {
  return venue.functions.some((func) => func.type === functionType)
}

/**
 * Check if venue has any of the specified function types
 */
export function venueHasAnyFunctionType(
  venue: Venue,
  functionTypes: VenueFunctionType[]
): boolean {
  if (functionTypes.length === 0) return true
  
  return venue.functions.some((func) => functionTypes.includes(func.type))
}

/**
 * Filter venues by function types
 */
export function filterVenuesByFunctionTypes(
  venues: Venue[],
  functionTypes: VenueFunctionType[]
): Venue[] {
  if (functionTypes.length === 0) return venues
  
  return venues.filter((venue) =>
    venueHasAnyFunctionType(venue, functionTypes)
  )
}

/**
 * Get display label for function type
 */
export function getFunctionTypeLabel(functionType: VenueFunctionType): string {
  const labels: Record<VenueFunctionType, string> = {
    collection_point: "Collection Point",
    distribution_point: "Distribution Point",
    services_needed: "Services Needed",
    custom: "Custom Function",
  }
  
  return labels[functionType] || functionType
}

/**
 * Get icon name for function type (for use with lucide-react)
 */
export function getFunctionTypeIcon(
  functionType: VenueFunctionType
): string {
  const icons: Record<VenueFunctionType, string> = {
    collection_point: "Building2",
    distribution_point: "Warehouse",
    services_needed: "Users",
    custom: "Wrench",
  }
  
  return icons[functionType] || "HelpCircle"
}

/**
 * Get all unique function types from a list of venues
 */
export function getAllFunctionTypes(venues: Venue[]): VenueFunctionType[] {
  const types = new Set<VenueFunctionType>()
  
  for (const venue of venues) {
    for (const func of venue.functions) {
      types.add(func.type)
    }
  }
  
  return Array.from(types).sort()
}

/**
 * Get summary of function types for display
 * E.g., "Collection Point, Distribution Point"
 */
export function getVenueFunctionTypesSummary(venue: Venue): string {
  const types = getVenueFunctionTypes(venue)
  
  if (types.length === 0) return "No functions"
  
  return types.map(getFunctionTypeLabel).join(", ")
}


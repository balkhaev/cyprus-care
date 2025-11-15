import type {
  VenueFunction,
  CollectionPointFunction,
  DistributionPointFunction,
  ServicesNeededFunction,
  CustomFunction,
} from "@/types/venue"
import { fetchVenueById, updateVenue } from "./venues"

// Type helpers for creating new functions (without id, createdAt, updatedAt)
export type NewCollectionPointFunction = Omit<
  CollectionPointFunction,
  "id" | "createdAt" | "updatedAt"
>
export type NewDistributionPointFunction = Omit<
  DistributionPointFunction,
  "id" | "createdAt" | "updatedAt"
>
export type NewServicesNeededFunction = Omit<
  ServicesNeededFunction,
  "id" | "createdAt" | "updatedAt"
>
export type NewCustomFunction = Omit<
  CustomFunction,
  "id" | "createdAt" | "updatedAt"
>
export type NewVenueFunction =
  | NewCollectionPointFunction
  | NewDistributionPointFunction
  | NewServicesNeededFunction
  | NewCustomFunction

// Simulate network delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetch all functions for a venue
 */
export async function fetchVenueFunctions(
  venueId: string
): Promise<VenueFunction[]> {
  await delay()

  const venue = await fetchVenueById(venueId)
  if (!venue) return []

  return [...venue.functions]
}

/**
 * Add a function to a venue
 */
export async function addFunctionToVenue(
  venueId: string,
  functionData: NewVenueFunction
): Promise<VenueFunction | null> {
  await delay()

  const venue = await fetchVenueById(venueId)
  if (!venue) return null

  const newFunction: VenueFunction = {
    ...functionData,
    id: `func-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as VenueFunction

  const updatedFunctions = [...venue.functions, newFunction]
  await updateVenue(venueId, {
    ...venue,
    functions: updatedFunctions,
  })

  return newFunction
}

/**
 * Update a venue function
 */
export async function updateVenueFunction(
  venueId: string,
  functionId: string,
  functionData: Partial<Omit<VenueFunction, "id" | "createdAt" | "updatedAt">>
): Promise<VenueFunction | null> {
  await delay()

  const venue = await fetchVenueById(venueId)
  if (!venue) return null

  const functionIndex = venue.functions.findIndex((f) => f.id === functionId)
  if (functionIndex === -1) return null

  const updatedFunction: VenueFunction = {
    ...venue.functions[functionIndex],
    ...functionData,
    updatedAt: new Date(),
  } as VenueFunction

  const updatedFunctions = [...venue.functions]
  updatedFunctions[functionIndex] = updatedFunction

  await updateVenue(venueId, {
    ...venue,
    functions: updatedFunctions,
  })

  return updatedFunction
}

/**
 * Remove a function from a venue
 */
export async function removeVenueFunction(
  venueId: string,
  functionId: string
): Promise<boolean> {
  await delay()

  const venue = await fetchVenueById(venueId)
  if (!venue) return false

  const updatedFunctions = venue.functions.filter((f) => f.id !== functionId)

  if (updatedFunctions.length === venue.functions.length) {
    return false // Function not found
  }

  await updateVenue(venueId, {
    ...venue,
    functions: updatedFunctions,
  })

  return true
}

/**
 * Get a specific function by ID
 */
export async function fetchVenueFunctionById(
  venueId: string,
  functionId: string
): Promise<VenueFunction | null> {
  await delay()

  const venue = await fetchVenueById(venueId)
  if (!venue) return null

  const venueFunction = venue.functions.find((f) => f.id === functionId)
  return venueFunction ? { ...venueFunction } : null
}

/**
 * Type guards for function types
 */
export function isCollectionPointFunction(
  func: VenueFunction
): func is CollectionPointFunction {
  return func.type === "collection_point"
}

export function isDistributionPointFunction(
  func: VenueFunction
): func is DistributionPointFunction {
  return func.type === "distribution_point"
}

export function isServicesNeededFunction(
  func: VenueFunction
): func is ServicesNeededFunction {
  return func.type === "services_needed"
}

export function isCustomFunction(func: VenueFunction): func is CustomFunction {
  return func.type === "custom"
}

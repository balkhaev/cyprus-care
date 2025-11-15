import type { Venue, VenueFormData } from "@/types/venue"
import { mockVenues } from "@/lib/mock-data/venues-with-functions"

// In-memory storage for venues (simulating external API)
let venuesStore: Venue[] = [...mockVenues]

// Simulate network delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Fetch all venues
 */
export async function fetchVenues(): Promise<Venue[]> {
  await delay()
  return [...venuesStore]
}

/**
 * Fetch venue by ID
 */
export async function fetchVenueById(id: string): Promise<Venue | null> {
  await delay()
  const venue = venuesStore.find((v) => v.id === id)
  return venue ? { ...venue } : null
}

/**
 * Create a new venue
 */
export async function createVenue(
  data: VenueFormData & { organizerId: number }
): Promise<Venue> {
  await delay()

  const newVenue: Venue = {
    id: `venue-${Date.now()}`,
    ...data,
    functions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  venuesStore.push(newVenue)
  return { ...newVenue }
}

/**
 * Update existing venue
 */
export async function updateVenue(
  id: string,
  data: Partial<Omit<Venue, "id" | "createdAt" | "updatedAt">>
): Promise<Venue | null> {
  await delay()

  const index = venuesStore.findIndex((v) => v.id === id)
  if (index === -1) return null

  venuesStore[index] = {
    ...venuesStore[index],
    ...data,
    updatedAt: new Date(),
  }

  return { ...venuesStore[index] }
}

/**
 * Delete venue
 */
export async function deleteVenue(id: string): Promise<boolean> {
  await delay()

  const index = venuesStore.findIndex((v) => v.id === id)
  if (index === -1) return false

  venuesStore.splice(index, 1)
  return true
}

/**
 * Filter venues by function type
 */
export async function fetchVenuesByFunctionType(
  functionType: string
): Promise<Venue[]> {
  await delay()

  return venuesStore.filter((venue) =>
    venue.functions.some((func) => func.type === functionType)
  )
}

/**
 * Search venues by query
 */
export async function searchVenues(query: string): Promise<Venue[]> {
  await delay()

  const lowerQuery = query.toLowerCase()
  return venuesStore.filter(
    (venue) =>
      venue.title.toLowerCase().includes(lowerQuery) ||
      venue.description.toLowerCase().includes(lowerQuery) ||
      venue.location.address.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Reset venues to initial mock data (for testing)
 */
export function resetVenues(): void {
  venuesStore = [...mockVenues]
}

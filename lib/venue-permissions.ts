/**
 * Venue ownership and permissions utilities
 */

import type { Venue as ContractVenue } from '@/contracts/venue';
import type { Venue as TypeVenue } from '@/types/venue';
import type { User } from '@/contracts/auth';

// Union type for both venue types
type AnyVenue = ContractVenue | TypeVenue;

/**
 * Check if user is the owner of the venue
 */
export function isVenueOwner(venue: AnyVenue | null | undefined, user: User | null | undefined): boolean {
  if (!user || !venue) return false;
  return venue.organizerId === user.id;
}

/**
 * Check if user can edit the venue
 * - Admin can edit any venue
 * - Organizer can only edit their own venues
 */
export function canEditVenue(venue: AnyVenue | null | undefined, user: User | null | undefined): boolean {
  if (!user || !venue) return false;
  
  // Admin can edit any venue
  if (user.role === 'admin') return true;
  
  // Organizer can only edit their own venues
  if (user.role === 'organizer') {
    return isVenueOwner(venue, user);
  }
  
  return false;
}

/**
 * Check if user can delete the venue
 * - Admin can delete any venue
 * - Organizer can only delete their own venues
 */
export function canDeleteVenue(venue: AnyVenue | null | undefined, user: User | null | undefined): boolean {
  if (!user || !venue) return false;
  
  // Admin can delete any venue
  if (user.role === 'admin') return true;
  
  // Organizer can only delete their own venues
  if (user.role === 'organizer') {
    return isVenueOwner(venue, user);
  }
  
  return false;
}

/**
 * Check if user can create venues
 * - Admin and Organizers can create venues
 */
export function canCreateVenue(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'organizer';
}

/**
 * Check if user can view venue details
 * All authenticated users can view venues
 */
export function canViewVenue(user: User | null | undefined): boolean {
  return !!user;
}

/**
 * Get error message for permission denial
 */
export function getPermissionDeniedMessage(action: 'edit' | 'delete' | 'create' | 'view'): string {
  const messages = {
    edit: 'You do not have permission to edit this venue. Only the venue owner can edit it.',
    delete: 'You do not have permission to delete this venue. Only the venue owner can delete it.',
    create: 'You do not have permission to create venues. Only organizers and admins can create venues.',
    view: 'You must be logged in to view venue details.',
  };
  
  return messages[action];
}

/**
 * Throw error if user cannot perform action
 */
export function assertCanEditVenue(venue: Venue | null | undefined, user: User | null | undefined): void {
  if (!canEditVenue(venue, user)) {
    throw new Error(getPermissionDeniedMessage('edit'));
  }
}

export function assertCanDeleteVenue(venue: Venue | null | undefined, user: User | null | undefined): void {
  if (!canDeleteVenue(venue, user)) {
    throw new Error(getPermissionDeniedMessage('delete'));
  }
}

export function assertCanCreateVenue(user: User | null | undefined): void {
  if (!canCreateVenue(user)) {
    throw new Error(getPermissionDeniedMessage('create'));
  }
}

export function assertCanViewVenue(user: User | null | undefined): void {
  if (!canViewVenue(user)) {
    throw new Error(getPermissionDeniedMessage('view'));
  }
}


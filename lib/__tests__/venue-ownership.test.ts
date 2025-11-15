/**
 * Tests for venue ownership and access control
 */

import { describe, test, expect } from '@jest/globals';
import type { Venue } from '@/contracts/venue';
import type { User } from '@/contracts/auth';
import {
  isVenueOwner,
  canEditVenue,
  canDeleteVenue,
  canCreateVenue,
  canViewVenue,
  getPermissionDeniedMessage,
  assertCanEditVenue,
  assertCanDeleteVenue,
  assertCanCreateVenue,
  assertCanViewVenue,
} from '../venue-permissions';

// Mock data for tests
const mockVenue: Venue = {
  id: 'venue-1',
  title: 'Test Venue',
  description: 'Test Description',
  type: 'collection_point',
  location: {
    lat: 34.6756,
    lng: 33.0431,
    address: 'Test Address',
  },
  operatingHours: [],
  organizerId: 1,
  status: 'active',
  functionsCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockOwner: User = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  role: 'organizer',
  phone: '+357 99 123 456',
  municipality: 'Limassol',
  is_organization: false,
  organization_name: '',
  volunteer_areas_of_interest: '',
  volunteer_services: '',
  interested_in_donations: false,
  association_name: '',
};

const mockNonOwner: User = {
  id: 2,
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane@example.com',
  role: 'organizer',
  phone: '+357 99 654 321',
  municipality: 'Nicosia',
  is_organization: false,
  organization_name: '',
  volunteer_areas_of_interest: '',
  volunteer_services: '',
  interested_in_donations: false,
  association_name: '',
};

const mockAdmin: User = {
  id: 3,
  first_name: 'Admin',
  last_name: 'User',
  email: 'admin@example.com',
  role: 'admin',
  phone: '+357 99 111 222',
  municipality: 'Paphos',
  is_organization: false,
  organization_name: '',
  volunteer_areas_of_interest: '',
  volunteer_services: '',
  interested_in_donations: false,
  association_name: '',
};

const mockVolunteer: User = {
  id: 4,
  first_name: 'Mike',
  last_name: 'Wilson',
  email: 'mike@example.com',
  role: 'volunteer',
  phone: '+357 99 333 444',
  municipality: 'Larnaca',
  is_organization: false,
  organization_name: '',
  volunteer_areas_of_interest: 'Healthcare',
  volunteer_services: 'Medical assistance',
  interested_in_donations: false,
  association_name: '',
};

describe('Venue Ownership', () => {
  test('should correctly identify venue owner', () => {
    expect(isVenueOwner(mockVenue, mockOwner)).toBe(true);
  });

  test('should correctly identify non-owner', () => {
    expect(isVenueOwner(mockVenue, mockNonOwner)).toBe(false);
  });

  test('should return false for null user', () => {
    expect(isVenueOwner(mockVenue, null)).toBe(false);
  });

  test('should handle different user roles', () => {
    expect(isVenueOwner(mockVenue, mockAdmin)).toBe(false);
    expect(isVenueOwner(mockVenue, mockVolunteer)).toBe(false);
  });
});

describe('Venue Edit Permissions', () => {
  test('venue owner can edit their venue', () => {
    expect(canEditVenue(mockVenue, mockOwner)).toBe(true);
  });

  test('non-owner organizer cannot edit venue', () => {
    expect(canEditVenue(mockVenue, mockNonOwner)).toBe(false);
  });

  test('admin can edit any venue', () => {
    expect(canEditVenue(mockVenue, mockAdmin)).toBe(true);
  });

  test('volunteer cannot edit venue', () => {
    expect(canEditVenue(mockVenue, mockVolunteer)).toBe(false);
  });

  test('null user cannot edit venue', () => {
    expect(canEditVenue(mockVenue, null)).toBe(false);
  });
});

describe('Venue Delete Permissions', () => {
  test('venue owner can delete their venue', () => {
    expect(canDeleteVenue(mockVenue, mockOwner)).toBe(true);
  });

  test('non-owner organizer cannot delete venue', () => {
    expect(canDeleteVenue(mockVenue, mockNonOwner)).toBe(false);
  });

  test('admin can delete any venue', () => {
    expect(canDeleteVenue(mockVenue, mockAdmin)).toBe(true);
  });

  test('volunteer cannot delete venue', () => {
    expect(canDeleteVenue(mockVenue, mockVolunteer)).toBe(false);
  });

  test('null user cannot delete venue', () => {
    expect(canDeleteVenue(mockVenue, null)).toBe(false);
  });
});

describe('Edge Cases', () => {
  test('should handle venue with organizerId as string (legacy)', () => {
    const legacyVenue = { ...mockVenue, organizerId: '1' as any };
    // Should fail type check but handle gracefully
    expect(isVenueOwner(legacyVenue, mockOwner)).toBe(false);
  });

  test('should handle missing organizerId', () => {
    const venueWithoutOrganizer = { ...mockVenue, organizerId: undefined as any };
    expect(isVenueOwner(venueWithoutOrganizer, mockOwner)).toBe(false);
  });

  test('should handle user with organizerId as 0', () => {
    const userWithZeroId = { ...mockOwner, id: 0 };
    const venueWithZeroId = { ...mockVenue, organizerId: 0 };
    expect(isVenueOwner(venueWithZeroId, userWithZeroId)).toBe(true);
  });
});

describe('Permission Helpers', () => {
  test('canCreateVenue allows organizers', () => {
    expect(canCreateVenue(mockOwner)).toBe(true);
  });

  test('canCreateVenue allows admins', () => {
    expect(canCreateVenue(mockAdmin)).toBe(true);
  });

  test('canCreateVenue denies volunteers', () => {
    expect(canCreateVenue(mockVolunteer)).toBe(false);
  });

  test('canCreateVenue denies null user', () => {
    expect(canCreateVenue(null)).toBe(false);
  });

  test('canViewVenue allows authenticated users', () => {
    expect(canViewVenue(mockOwner)).toBe(true);
    expect(canViewVenue(mockVolunteer)).toBe(true);
    expect(canViewVenue(mockAdmin)).toBe(true);
  });

  test('canViewVenue denies null user', () => {
    expect(canViewVenue(null)).toBe(false);
  });
});

describe('Permission Messages', () => {
  test('getPermissionDeniedMessage returns correct messages', () => {
    expect(getPermissionDeniedMessage('edit')).toContain('edit');
    expect(getPermissionDeniedMessage('delete')).toContain('delete');
    expect(getPermissionDeniedMessage('create')).toContain('create');
    expect(getPermissionDeniedMessage('view')).toContain('logged in');
  });
});

describe('Permission Assertions', () => {
  test('assertCanEditVenue throws for non-owner', () => {
    expect(() => assertCanEditVenue(mockVenue, mockNonOwner)).toThrow();
  });

  test('assertCanEditVenue does not throw for owner', () => {
    expect(() => assertCanEditVenue(mockVenue, mockOwner)).not.toThrow();
  });

  test('assertCanDeleteVenue throws for non-owner', () => {
    expect(() => assertCanDeleteVenue(mockVenue, mockNonOwner)).toThrow();
  });

  test('assertCanDeleteVenue does not throw for owner', () => {
    expect(() => assertCanDeleteVenue(mockVenue, mockOwner)).not.toThrow();
  });

  test('assertCanCreateVenue throws for volunteer', () => {
    expect(() => assertCanCreateVenue(mockVolunteer)).toThrow();
  });

  test('assertCanCreateVenue does not throw for organizer', () => {
    expect(() => assertCanCreateVenue(mockOwner)).not.toThrow();
  });

  test('assertCanViewVenue throws for null user', () => {
    expect(() => assertCanViewVenue(null)).toThrow();
  });

  test('assertCanViewVenue does not throw for authenticated user', () => {
    expect(() => assertCanViewVenue(mockOwner)).not.toThrow();
  });
});


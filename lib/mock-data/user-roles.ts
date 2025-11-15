// User roles simulation

import type { User as AuthUser, UserRole } from '@/contracts/auth';

export type { UserRole };
export type User = AuthUser;

export const mockUsers: Record<string, User> = {
  'user-guest': {
    id: 0,
    first_name: 'Guest',
    last_name: 'User',
    email: 'guest@example.com',
    role: 'guest',
    phone: '',
    municipality: '',
    is_organization: false,
    organization_name: '',
    volunteer_areas_of_interest: '',
    volunteer_services: '',
    interested_in_donations: false,
    association_name: '',
  },
  'user-org-1': {
    id: 1,
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@example.com',
    role: 'organizer',
    phone: '+357 99 123 456',
    municipality: 'Limassol',
    is_organization: false,
    organization_name: '',
    volunteer_areas_of_interest: '',
    volunteer_services: '',
    interested_in_donations: false,
    association_name: '',
  },
  'user-org-2': {
    id: 2,
    first_name: 'Maria',
    last_name: 'Garcia',
    email: 'maria.garcia@example.com',
    role: 'organizer',
    phone: '+357 99 234 567',
    municipality: 'Nicosia',
    is_organization: false,
    organization_name: '',
    volunteer_areas_of_interest: '',
    volunteer_services: '',
    interested_in_donations: false,
    association_name: '',
  },
  'user-org-3': {
    id: 3,
    first_name: 'Anna',
    last_name: 'Papadopoulou',
    email: 'anna@example.com',
    role: 'organizer',
    phone: '+357 99 345 678',
    municipality: 'Paphos',
    is_organization: false,
    organization_name: '',
    volunteer_areas_of_interest: '',
    volunteer_services: '',
    interested_in_donations: false,
    association_name: '',
  },
  'user-vol-1': {
    id: 4,
    first_name: 'Alex',
    last_name: 'Johnson',
    email: 'alex.johnson@example.com',
    role: 'volunteer',
    phone: '+357 99 456 789',
    municipality: 'Larnaca',
    is_organization: false,
    organization_name: '',
    volunteer_areas_of_interest: 'Healthcare,Education',
    volunteer_services: 'Medical assistance,Teaching',
    interested_in_donations: false,
    association_name: '',
  },
  'user-vol-2': {
    id: 5,
    first_name: 'Sarah',
    last_name: 'Williams',
    email: 'sarah.williams@example.com',
    role: 'volunteer',
    phone: '+357 99 567 890',
    municipality: 'Limassol',
    is_organization: false,
    organization_name: '',
    volunteer_areas_of_interest: 'Transportation,Food distribution',
    volunteer_services: 'Driving,Cooking',
    interested_in_donations: false,
    association_name: '',
  },
  'user-ben-1': {
    id: 6,
    first_name: 'Mohammed',
    last_name: 'Ali',
    email: 'mohammed.ali@example.com',
    role: 'beneficiary',
    phone: '+357 99 678 901',
    municipality: 'Nicosia',
    is_organization: false,
    organization_name: '',
    volunteer_areas_of_interest: '',
    volunteer_services: '',
    interested_in_donations: true,
    association_name: '',
  },
  'user-ben-2': {
    id: 7,
    first_name: 'Elena',
    last_name: 'Petrov',
    email: 'elena.petrov@example.com',
    role: 'beneficiary',
    phone: '+357 99 789 012',
    municipality: 'Paphos',
    is_organization: false,
    organization_name: '',
    volunteer_areas_of_interest: '',
    volunteer_services: '',
    interested_in_donations: true,
    association_name: '',
  },
};

// Current user simulation (can be changed for testing)
const STORAGE_KEY = 'care_hub_current_user';

// Get initial user ID from localStorage or use default
function getInitialUserId(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && mockUsers[stored]) {
      return stored;
    }
  }
  return 'user-guest'; // Default to guest
}

let currentUserId = getInitialUserId();

export function getCurrentUser(): User {
  // Always check localStorage in case it was updated
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && mockUsers[stored]) {
      currentUserId = stored;
    }
  }
  return mockUsers[currentUserId];
}

export function setCurrentUser(userId: string): void {
  if (mockUsers[userId]) {
    currentUserId = userId;
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, userId);
    }
  }
}

export function getCurrentUserRole(): UserRole {
  return getCurrentUser().role;
}

export function isOrganizer(): boolean {
  return getCurrentUserRole() === 'organizer';
}

export function isVolunteer(): boolean {
  return getCurrentUserRole() === 'volunteer';
}

export function isBeneficiary(): boolean {
  return getCurrentUserRole() === 'beneficiary';
}

export function isGuest(): boolean {
  return getCurrentUserRole() === 'guest';
}


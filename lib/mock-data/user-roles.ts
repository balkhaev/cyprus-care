// User roles simulation

export type UserRole = 'organizer' | 'volunteer' | 'beneficiary';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizerId?: string; // For organizers
  phone?: string;
  avatar?: string;
}

export const mockUsers: Record<string, User> = {
  'user-org-1': {
    id: 'user-org-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'organizer',
    organizerId: 'org-1',
    phone: '+357 99 123 456',
  },
  'user-org-2': {
    id: 'user-org-2',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    role: 'organizer',
    organizerId: 'org-2',
    phone: '+357 99 234 567',
  },
  'user-vol-1': {
    id: 'user-vol-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'volunteer',
    phone: '+357 99 345 678',
  },
  'user-vol-2': {
    id: 'user-vol-2',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'volunteer',
    phone: '+357 99 456 789',
  },
  'user-ben-1': {
    id: 'user-ben-1',
    name: 'Mohammed Ali',
    email: 'mohammed.ali@example.com',
    role: 'beneficiary',
    phone: '+357 99 567 890',
  },
  'user-ben-2': {
    id: 'user-ben-2',
    name: 'Elena Petrov',
    email: 'elena.petrov@example.com',
    role: 'beneficiary',
    phone: '+357 99 678 901',
  },
};

// Current user simulation (can be changed for testing)
let currentUserId = 'user-org-1'; // Default to organizer

export function getCurrentUser(): User {
  return mockUsers[currentUserId];
}

export function setCurrentUser(userId: string): void {
  if (mockUsers[userId]) {
    currentUserId = userId;
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


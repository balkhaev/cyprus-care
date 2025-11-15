/**
 * Authentication and authorization contracts
 */

import { UUID, Timestamp, ApiResponse } from './common';

export type UserRole = 'organizer' | 'volunteer' | 'beneficiary' | 'admin';

// === User === 

/**
 * User entity as returned from the backend API
 * Based on the actual database schema
 */
export interface User {
  id: number; // Database uses numeric IDs, not UUIDs
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  phone: string;
  municipality: string;
  
  // Organization fields
  is_organization: boolean;
  organization_name: string;
  
  // Volunteer-specific fields
  volunteer_areas_of_interest: string; // Comma-separated or JSON string
  volunteer_services: string; // Comma-separated or JSON string
  
  // Beneficiary-specific fields
  interested_in_donations: boolean;
  association_name: string;
}

/**
 * Computed helper to get full name
 */
export interface UserWithHelpers extends User {
  fullName: string; // computed: first_name + last_name
}

/**
 * Legacy User interface for backward compatibility
 * Maps new structure to old field names
 */
export interface UserLegacy {
  id: string; // Convert number to string
  email: string;
  name: string; // Maps to first_name + last_name
  role: UserRole;
  phone?: string;
  avatar?: string;
  organizerId?: UUID; // Deprecated
  isActive: boolean; // Always true if user exists
  isEmailVerified: boolean; // Assume true
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  languages?: string[];
  skills?: string[];
  availability?: {
    days: string[];
    hours: string;
  };
}

// === Registration ===

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone: string;
  municipality: string;
  
  // Organization fields (optional)
  is_organization?: boolean;
  organization_name?: string;
  
  // Volunteer fields (optional)
  volunteer_areas_of_interest?: string;
  volunteer_services?: string;
  
  // Beneficiary fields (optional)
  interested_in_donations?: boolean;
  association_name?: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// === Login ===

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// === Tokens ===

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: UUID;
  email: string;
  role: UserRole;
  organizerId?: UUID;
  iat: number; // issued at
  exp: number; // expiration
}

// === Password Reset ===

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetTokenExpiresAt: Timestamp;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// === Email Verification ===

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  user: User;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

// === Password Change ===

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// === Profile Update ===

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  municipality?: string;
  
  // Organization fields
  is_organization?: boolean;
  organization_name?: string;
  
  // Volunteer fields
  volunteer_areas_of_interest?: string;
  volunteer_services?: string;
  
  // Beneficiary fields
  interested_in_donations?: boolean;
  association_name?: string;
  
  // Extended profile (if supported)
  bio?: string;
  avatar?: string;
  languages?: string[];
  skills?: string[];
  availability?: {
    days: string[];
    hours: string;
  };
}

export interface UpdateProfileResponse {
  user: UserProfile;
}

// === Session Check ===

export interface CheckSessionResponse {
  user: User;
  isValid: boolean;
}

// === API endpoints types ===

export type AuthEndpoints = {
  'POST /auth/register': {
    request: RegisterRequest;
    response: ApiResponse<RegisterResponse>;
  };
  'POST /auth/login': {
    request: LoginRequest;
    response: ApiResponse<LoginResponse>;
  };
  'POST /auth/refresh': {
    request: RefreshTokenRequest;
    response: ApiResponse<RefreshTokenResponse>;
  };
  'POST /auth/logout': {
    request: Record<string, never>;
    response: ApiResponse<{ message: string }>;
  };
  'POST /auth/forgot-password': {
    request: ForgotPasswordRequest;
    response: ApiResponse<ForgotPasswordResponse>;
  };
  'POST /auth/reset-password': {
    request: ResetPasswordRequest;
    response: ApiResponse<ResetPasswordResponse>;
  };
  'POST /auth/verify-email': {
    request: VerifyEmailRequest;
    response: ApiResponse<VerifyEmailResponse>;
  };
  'POST /auth/resend-verification': {
    request: ResendVerificationRequest;
    response: ApiResponse<ResendVerificationResponse>;
  };
  'POST /auth/change-password': {
    request: ChangePasswordRequest;
    response: ApiResponse<ChangePasswordResponse>;
  };
  'GET /auth/me': {
    request: Record<string, never>;
    response: ApiResponse<User>;
  };
  'PATCH /auth/profile': {
    request: UpdateProfileRequest;
    response: ApiResponse<UpdateProfileResponse>;
  };
  'GET /auth/check-session': {
    request: Record<string, never>;
    response: ApiResponse<CheckSessionResponse>;
  };
};

// === Helper functions ===

/**
 * Convert User to legacy format for backward compatibility
 */
export function userToLegacy(user: User): UserLegacy {
  return {
    id: user.id.toString(),
    email: user.email,
    name: `${user.first_name} ${user.last_name}`.trim(),
    role: user.role,
    phone: user.phone || undefined,
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get full name from user
 */
export function getUserFullName(user: User): string {
  return `${user.first_name} ${user.last_name}`.trim();
}

/**
 * Parse volunteer areas of interest
 */
export function parseVolunteerAreas(areasString: string): string[] {
  if (!areasString) return [];
  try {
    return JSON.parse(areasString);
  } catch {
    return areasString.split(',').map(s => s.trim()).filter(Boolean);
  }
}

/**
 * Parse volunteer services
 */
export function parseVolunteerServices(servicesString: string): string[] {
  if (!servicesString) return [];
  try {
    return JSON.parse(servicesString);
  } catch {
    return servicesString.split(',').map(s => s.trim()).filter(Boolean);
  }
}


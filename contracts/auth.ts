/**
 * Authentication and authorization contracts
 */

import { UUID, Timestamp, ApiResponse } from './common';

export type UserRole = 'organizer' | 'volunteer' | 'beneficiary' | 'admin';

// === User === 

export interface User {
  id: UUID;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  organizerId?: UUID; // For organizers
  isActive: boolean;
  isEmailVerified: boolean;
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
  name: string;
  role: UserRole;
  phone?: string;
  organizerId?: UUID;
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
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
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

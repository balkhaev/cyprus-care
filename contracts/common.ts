/**
 * Common types for all API contracts
 */

// Basic success response
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  timestamp: string;
}

// Basic error response
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

// General response type
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Filtering
export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}

// Creation/update metadata
export interface EntityTimestamps {
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

export interface EntityWithCreator extends EntityTimestamps {
  createdBy: string; // User ID
  updatedBy?: string; // User ID
}

// ID types
export type UUID = string;
export type Timestamp = string; // ISO 8601

// Coordinates
export interface Coordinates {
  lat: number;
  lng: number;
}

// Geolocation with address
export interface GeoLocation extends Coordinates {
  address: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

// Statuses for various entities
export type EntityStatus = 'active' | 'inactive' | 'archived' | 'deleted';

// Operation types
export type OperationType = 'create' | 'update' | 'delete' | 'read';

// User context for requests
export interface RequestContext {
  userId: UUID;
  userRole: 'organizer' | 'volunteer' | 'beneficiary' | 'admin';
  organizerId?: UUID;
  timestamp: Timestamp;
  requestId?: string;
  ipAddress?: string;
}

// Errors
export enum ErrorCode {
  // General errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Authentication/authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Resources
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // Business logic
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  INVALID_STATE = 'INVALID_STATE',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  
  // External services
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

// Validation
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

// Files/media
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  url?: string;
}

export interface MediaFile {
  id: UUID;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  mimeType: string;
  originalName: string;
  uploadedAt: Timestamp;
  uploadedBy: UUID;
}

// Search queries
export interface SearchParams {
  query: string;
  filters?: FilterParams;
  pagination?: PaginationParams;
  includeInactive?: boolean;
}

export interface SearchResult<T> {
  results: T[];
  totalCount: number;
  searchQuery: string;
  executionTime: number; // ms
}

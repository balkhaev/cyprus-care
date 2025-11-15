/**
 * API Contracts - centralized types for all API endpoints
 * Used by both frontend and backend to ensure type safety
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * Basic API response with success/error
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ResponseMeta
}

/**
 * API error structure
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
  timestamp: string
}

/**
 * Response metadata for pagination
 */
export interface ResponseMeta {
  page?: number
  limit?: number
  total?: number
  totalPages?: number
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number
  limit?: number
}

/**
 * Sort parameters
 */
export interface SortParams {
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

/**
 * Time range
 */
export interface TimeRange {
  startTime: string // ISO 8601
  endTime: string // ISO 8601
}

/**
 * Geographic coordinates
 */
export interface Coordinates {
  lat: number
  lng: number
}

/**
 * Geo search parameters
 */
export interface GeoSearchParams {
  coordinates: Coordinates
  radiusKm: number
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

/**
 * Registration request
 */
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: "beneficiary" | "volunteer" | "organizer"
}

/**
 * Registration response
 */
export interface RegisterResponse {
  user: UserProfile
  token: string
}

/**
 * Login request
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Login response
 */
export interface LoginResponse {
  user: UserProfile
  token: string
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string
}

/**
 * New password request
 */
export interface PasswordResetConfirmRequest {
  token: string
  newPassword: string
}

// ============================================================================
// USERS
// ============================================================================

/**
 * User profile
 */
export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: "beneficiary" | "volunteer" | "organizer"
  avatar?: string
  createdAt: string
  updatedAt: string
}

/**
 * Profile update request
 */
export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  avatar?: string
}

/**
 * Password change request
 */
export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

// ============================================================================
// VENUES
// ============================================================================

/**
 * Venue type
 */
export type VenueType = "collection_point" | "distribution_hub" | "shelter"

/**
 * Venue location
 */
export interface VenueLocation {
  lat: number
  lng: number
  address: string
}

/**
 * Operating hours
 */
export interface OperatingHours {
  dayOfWeek: string
  openTime: string
  closeTime: string
  isClosed: boolean
}

/**
 * Complete venue information
 */
export interface Venue {
  id: string
  title: string
  description: string
  type: VenueType
  location: VenueLocation
  operatingHours: OperatingHours[]
  functions: VenueFunction[]
  organizerId: string
  createdAt: string
  updatedAt: string
}

/**
 * Create venue request
 */
export interface CreateVenueRequest {
  title: string
  description: string
  type: VenueType
  location: VenueLocation
  operatingHours: OperatingHours[]
}

/**
 * Update venue request
 */
export interface UpdateVenueRequest {
  title?: string
  description?: string
  type?: VenueType
  location?: VenueLocation
  operatingHours?: OperatingHours[]
}

/**
 * Search venues parameters
 */
export interface SearchVenuesRequest extends PaginationParams {
  query?: string
  type?: VenueType
  functionType?: VenueFunctionType
  geoSearch?: GeoSearchParams
}

/**
 * Venues list
 */
export interface VenuesListResponse {
  venues: Venue[]
  meta: ResponseMeta
}

// ============================================================================
// VENUE FUNCTIONS
// ============================================================================

/**
 * Venue function type
 */
export type VenueFunctionType =
  | "collection_point"
  | "distribution_point"
  | "services_needed"
  | "custom"

/**
 * Quantity level
 */
export type QuantityLevel = "a_lot" | "some" | "few"

/**
 * Item with quantity
 */
export interface ItemWithQuantity {
  categoryId: string
  categoryPath: string[]
  quantity: QuantityLevel
}

/**
 * Service type
 */
export type ServiceType =
  | "transport_big"
  | "transport_small"
  | "carrying"
  | "language"
  | "admin"
  | "tech"

/**
 * Service request
 */
export interface ServiceRequest {
  type: ServiceType
  description: string
  isRequired: boolean
}

/**
 * Base venue function
 */
interface BaseVenueFunction {
  id: string
  type: VenueFunctionType
  createdAt: string
  updatedAt: string
}

/**
 * Function: collection point
 */
export interface CollectionPointFunction extends BaseVenueFunction {
  type: "collection_point"
  items: ItemWithQuantity[]
  openingTimes: OperatingHours[]
  specialRequests?: string
}

/**
 * Function: distribution point
 */
export interface DistributionPointFunction extends BaseVenueFunction {
  type: "distribution_point"
  items: ItemWithQuantity[]
  openingTimes: OperatingHours[]
  specialRequests?: string
}

/**
 * Function: services needed
 */
export interface ServicesNeededFunction extends BaseVenueFunction {
  type: "services_needed"
  services: ServiceRequest[]
  specialRequests?: string
}

/**
 * Function: custom
 */
export interface CustomFunction extends BaseVenueFunction {
  type: "custom"
  customTypeId: string
  customTypeName: string
  customTypeDescription: string
  items?: ItemWithQuantity[]
  services?: ServiceRequest[]
  openingTimes?: OperatingHours[]
  specialRequests?: string
}

/**
 * Any venue function
 */
export type VenueFunction =
  | CollectionPointFunction
  | DistributionPointFunction
  | ServicesNeededFunction
  | CustomFunction

/**
 * Create collection point function request
 */
export interface CreateCollectionPointFunctionRequest {
  type: "collection_point"
  items: ItemWithQuantity[]
  openingTimes: OperatingHours[]
  specialRequests?: string
}

/**
 * Create distribution point function request
 */
export interface CreateDistributionPointFunctionRequest {
  type: "distribution_point"
  items: ItemWithQuantity[]
  openingTimes: OperatingHours[]
  specialRequests?: string
}

/**
 * Create services needed function request
 */
export interface CreateServicesNeededFunctionRequest {
  type: "services_needed"
  services: ServiceRequest[]
  specialRequests?: string
}

/**
 * Create custom function request
 */
export interface CreateCustomFunctionRequest {
  type: "custom"
  customTypeId: string
  items?: ItemWithQuantity[]
  services?: ServiceRequest[]
  openingTimes?: OperatingHours[]
  specialRequests?: string
}

/**
 * Create venue function request (any type)
 */
export type CreateVenueFunctionRequest =
  | CreateCollectionPointFunctionRequest
  | CreateDistributionPointFunctionRequest
  | CreateServicesNeededFunctionRequest
  | CreateCustomFunctionRequest

/**
 * Update venue function request
 */
export type UpdateVenueFunctionRequest = Partial<
  Omit<VenueFunction, "id" | "type" | "createdAt" | "updatedAt">
>

/**
 * Venue functions list
 */
export interface VenueFunctionsListResponse {
  functions: VenueFunction[]
}

// ============================================================================
// ITEM CATEGORIES
// ============================================================================

/**
 * Item category
 */
export interface ItemCategory {
  id: string
  name: string
  description?: string
  parentId: string | null
  level: number
  organizerId?: string
  isCustom: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Category hierarchy
 */
export interface CategoryHierarchy {
  category: ItemCategory
  children: CategoryHierarchy[]
}

/**
 * Create category request
 */
export interface CreateCategoryRequest {
  name: string
  description?: string
  parentId: string | null
}

/**
 * Update category request
 */
export interface UpdateCategoryRequest {
  name?: string
  description?: string
}

/**
 * Categories list
 */
export interface CategoriesListResponse {
  categories: ItemCategory[]
}

/**
 * Category hierarchy
 */
export interface CategoryHierarchyResponse {
  hierarchy: CategoryHierarchy[]
}

/**
 * Category path
 */
export interface CategoryPathResponse {
  categoryId: string
  path: string[]
}

// ============================================================================
// CUSTOM FUNCTION TYPES
// ============================================================================

/**
 * Custom function type
 */
export interface CustomFunctionType {
  id: string
  name: string
  description: string
  organizerId: string
  createdAt: string
  updatedAt: string
}

/**
 * Create custom function type request
 */
export interface CreateCustomFunctionTypeRequest {
  name: string
  description: string
}

/**
 * Update custom function type request
 */
export interface UpdateCustomFunctionTypeRequest {
  name?: string
  description?: string
}

/**
 * Custom function types list
 */
export interface CustomFunctionTypesListResponse {
  customFunctionTypes: CustomFunctionType[]
}

// ============================================================================
// RESPONSES (VOLUNTEER RESPONSES)
// ============================================================================

/**
 * Response type
 */
export type ResponseType = "item" | "service"

/**
 * Response status
 */
export type ResponseStatus = "pending" | "confirmed" | "completed" | "cancelled"

/**
 * Volunteer response
 */
export interface VolunteerResponse {
  id: string
  volunteerId: string
  volunteerName: string
  venueId: string
  functionId: string
  responseType: ResponseType
  categoryId?: string
  categoryPath?: string[]
  quantityOffered?: number
  serviceType?: ServiceType
  message?: string
  createdAt: string
  status: ResponseStatus
}

/**
 * Create item response request
 */
export interface CreateItemResponseRequest {
  venueId: string
  functionId: string
  categoryId: string
  quantityOffered: number
  message?: string
}

/**
 * Create service response request
 */
export interface CreateServiceResponseRequest {
  venueId: string
  functionId: string
  serviceType: ServiceType
  message?: string
}

/**
 * Update response status request
 */
export interface UpdateResponseStatusRequest {
  status: ResponseStatus
}

/**
 * Responses list
 */
export interface ResponsesListResponse {
  responses: VolunteerResponse[]
  meta: ResponseMeta
}

/**
 * Filter responses parameters
 */
export interface FilterResponsesRequest extends PaginationParams {
  venueId?: string
  functionId?: string
  status?: ResponseStatus
  responseType?: ResponseType
}

// ============================================================================
// COMMITMENTS (BENEFICIARY COMMITMENTS)
// ============================================================================

/**
 * Commitment status
 */
export type CommitmentStatus = "confirmed" | "cancelled"

/**
 * Beneficiary commitment
 */
export interface BeneficiaryCommitment {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  venueId: string
  functionId: string
  createdAt: string
  status: CommitmentStatus
}

/**
 * Create commitment request
 */
export interface CreateCommitmentRequest {
  venueId: string
  functionId: string
}

/**
 * Update commitment status request
 */
export interface UpdateCommitmentStatusRequest {
  status: CommitmentStatus
}

/**
 * Commitments list
 */
export interface CommitmentsListResponse {
  commitments: BeneficiaryCommitment[]
  meta: ResponseMeta
}

/**
 * Filter commitments parameters
 */
export interface FilterCommitmentsRequest extends PaginationParams {
  venueId?: string
  functionId?: string
  status?: CommitmentStatus
}

// ============================================================================
// NEED STATUS
// ============================================================================

/**
 * Need status
 */
export type NeedStatus = "need_a_lot" | "need_few_more" | "dont_need"

/**
 * Need status update
 */
export interface NeedStatusUpdate {
  id: string
  venueId: string
  functionId: string
  itemCategoryId?: string
  serviceType?: ServiceType
  status: NeedStatus
  updatedBy: string
  updatedAt: string
}

/**
 * Update item need status request
 */
export interface UpdateItemNeedStatusRequest {
  venueId: string
  functionId: string
  categoryId: string
  status: NeedStatus
}

/**
 * Update service need status request
 */
export interface UpdateServiceNeedStatusRequest {
  venueId: string
  functionId: string
  serviceType: ServiceType
  status: NeedStatus
}

/**
 * Need status list
 */
export interface NeedStatusListResponse {
  needStatuses: NeedStatusUpdate[]
}

// ============================================================================
// PROJECTIONS (ANALYTICS)
// ============================================================================

/**
 * Item projection
 */
export interface ItemProjection {
  categoryId: string
  categoryPath: string[]
  currentStatus: NeedStatus
  responseCount: number
  totalQuantityOffered: number
}

/**
 * Service projection
 */
export interface ServiceProjection {
  serviceType: ServiceType
  currentStatus: NeedStatus
  responseCount: number
  respondingVolunteers: Array<{
    id: string
    name: string
    message?: string
  }>
}

/**
 * Venue projection (analytics)
 */
export interface VenueProjection {
  venueId: string
  functionId: string
  items: ItemProjection[]
  services: ServiceProjection[]
  beneficiaryCommitments: number
}

/**
 * Get venue projection request
 */
export interface GetVenueProjectionRequest {
  venueId: string
  functionId?: string
}

/**
 * Venue projections response
 */
export interface VenueProjectionsResponse {
  projections: VenueProjection[]
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Notification type
 */
export type NotificationType =
  | "response_received"
  | "response_confirmed"
  | "response_cancelled"
  | "commitment_received"
  | "venue_updated"
  | "function_updated"
  | "need_status_changed"

/**
 * Notification
 */
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  relatedEntityType?: "venue" | "function" | "response" | "commitment"
  relatedEntityId?: string
  isRead: boolean
  createdAt: string
}

/**
 * Mark notification read request
 */
export interface MarkNotificationReadRequest {
  notificationIds: string[]
}

/**
 * Notifications list
 */
export interface NotificationsListResponse {
  notifications: Notification[]
  unreadCount: number
  meta: ResponseMeta
}

/**
 * Filter notifications parameters
 */
export interface FilterNotificationsRequest extends PaginationParams {
  isRead?: boolean
  type?: NotificationType
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Organizer statistics
 */
export interface OrganizerStats {
  totalVenues: number
  totalFunctions: number
  totalResponses: number
  totalCommitments: number
  activeResponses: number
  activeCommitments: number
}

/**
 * Volunteer statistics
 */
export interface VolunteerStats {
  totalResponses: number
  activeResponses: number
  completedResponses: number
  itemsContributed: number
  servicesContributed: number
}

/**
 * Beneficiary statistics
 */
export interface BeneficiaryStats {
  totalCommitments: number
  activeCommitments: number
  completedCommitments: number
}

/**
 * Statistics response
 */
export interface StatsResponse {
  organizer?: OrganizerStats
  volunteer?: VolunteerStats
  beneficiary?: BeneficiaryStats
}

// ============================================================================
// WEBSOCKET MESSAGES
// ============================================================================

/**
 * WebSocket event type
 */
export type WebSocketEventType =
  | "venue_updated"
  | "function_updated"
  | "response_created"
  | "response_updated"
  | "commitment_created"
  | "commitment_updated"
  | "need_status_updated"
  | "notification_created"

/**
 * WebSocket message
 */
export interface WebSocketMessage<T = unknown> {
  event: WebSocketEventType
  data: T
  timestamp: string
}

/**
 * Subscribe to venue updates
 */
export interface SubscribeToVenueRequest {
  venueId: string
}

/**
 * Unsubscribe from venue updates
 */
export interface UnsubscribeFromVenueRequest {
  venueId: string
}

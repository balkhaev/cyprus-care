/**
 * Централизованный API клиент для работы со всеми эндпоинтами
 * Использует контракты из /contracts
 */

import {
  ApiClient,
  isSuccessResponse,
  unwrapResponse,
  ApiError,
  type ApiResponse,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  type User,
  type CreateVenueRequest,
  type CreateVenueResponse,
  type GetVenuesRequest,
  type GetVenuesResponse,
  type Venue,
  type CreateFunctionRequest,
  type CreateFunctionResponse,
  type GetItemCategoriesRequest,
  type GetItemCategoriesResponse,
  type GetCategoryHierarchyResponse,
  type CreateVolunteerResponseRequest,
  type CreateVolunteerResponseResponse,
  type GetVolunteerResponsesResponse,
  type CreateBeneficiaryCommitmentRequest,
  type CreateBeneficiaryCommitmentResponse,
  type GetBeneficiaryCommitmentsResponse,
  type GetVenueProjectionRequest,
  type GetVenueProjectionResponse,
} from "@/contracts"

// Mock режим для разработки
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK === "true"

// Базовый URL API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Создаем singleton instance ApiClient
export const apiClient = new ApiClient({
  baseUrl: API_BASE_URL,
  getToken: () => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("accessToken")
  },
  onError: (error) => {
    console.error("API Error:", error.error.code, error.error.message)

    // Обработка специфичных ошибок
    if (
      error.error.code === "UNAUTHORIZED" ||
      error.error.code === "TOKEN_EXPIRED"
    ) {
      // Очищаем токены
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("currentUser")

        // Редирект на страницу входа
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"
        }
      }
    }
  },
})

// ============================================================================
// AUTHENTICATION
// ============================================================================

export class AuthAPI {
  /**
   * Регистрация нового пользователя
   */
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    if (USE_MOCK_API) {
      return mockRegister(data)
    }

    const response = await apiClient.post<RegisterRequest, RegisterResponse>(
      "/auth/register",
      data
    )

    return unwrapResponse(response)
  }

  /**
   * Вход в систему
   */
  static async login(data: LoginRequest): Promise<LoginResponse> {
    if (USE_MOCK_API) {
      return mockLogin(data)
    }

    const response = await apiClient.post<LoginRequest, LoginResponse>(
      "/auth/login",
      data
    )

    const result = unwrapResponse(response)

    // Сохраняем токены
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", result.accessToken)
      localStorage.setItem("refreshToken", result.refreshToken)
      localStorage.setItem("currentUser", JSON.stringify(result.user))
    }

    return result
  }

  /**
   * Выход из системы
   */
  static async logout(): Promise<void> {
    if (USE_MOCK_API) {
      mockLogout()
      return
    }

    try {
      await apiClient.post("/auth/logout", {})
    } finally {
      // Очищаем локальное хранилище в любом случае
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("currentUser")
      }
    }
  }

  /**
   * Получить текущего пользователя
   */
  static async getCurrentUser(): Promise<User | null> {
    if (USE_MOCK_API) {
      return mockGetCurrentUser()
    }

    try {
      const response = await apiClient.get<User>("/auth/me")

      if (isSuccessResponse(response)) {
        // Обновляем кеш пользователя
        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(response.data))
        }
        return response.data
      }

      return null
    } catch (error) {
      return null
    }
  }

  /**
   * Получить закешированного пользователя
   */
  static getCachedUser(): User | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem("currentUser")
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  /**
   * Проверить, авторизован ли пользователь
   */
  static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("accessToken")
  }
}

// ============================================================================
// VENUES
// ============================================================================

export class VenuesAPI {
  /**
   * Получить список площадок
   */
  static async getVenues(
    params?: GetVenuesRequest
  ): Promise<GetVenuesResponse> {
    if (USE_MOCK_API) {
      return mockGetVenues(params)
    }

    const response = await apiClient.get<GetVenuesResponse>(
      "/venues",
      params as Record<string, unknown> | undefined
    )
    return unwrapResponse(response)
  }

  /**
   * Получить площадку по ID
   */
  static async getVenue(venueId: string): Promise<Venue> {
    if (USE_MOCK_API) {
      return mockGetVenue(venueId)
    }

    const response = await apiClient.get<{ venue: Venue }>(`/venues/${venueId}`)
    return unwrapResponse(response).venue
  }

  /**
   * Создать новую площадку
   */
  static async createVenue(
    data: CreateVenueRequest
  ): Promise<CreateVenueResponse> {
    if (USE_MOCK_API) {
      return mockCreateVenue(data)
    }

    const response = await apiClient.post<
      CreateVenueRequest,
      CreateVenueResponse
    >("/venues", data)

    return unwrapResponse(response)
  }

  /**
   * Обновить площадку
   */
  static async updateVenue(
    venueId: string,
    data: Partial<CreateVenueRequest>
  ): Promise<Venue> {
    if (USE_MOCK_API) {
      return mockUpdateVenue(venueId, data)
    }

    const response = await apiClient.patch<
      Partial<CreateVenueRequest>,
      { venue: Venue }
    >(`/venues/${venueId}`, data)

    return unwrapResponse(response).venue
  }

  /**
   * Удалить площадку
   */
  static async deleteVenue(venueId: string): Promise<void> {
    if (USE_MOCK_API) {
      return mockDeleteVenue(venueId)
    }

    await apiClient.delete(`/venues/${venueId}`)
  }
}

// ============================================================================
// VENUE FUNCTIONS
// ============================================================================

export class VenueFunctionsAPI {
  /**
   * Создать функцию площадки
   */
  static async createFunction(
    data: CreateFunctionRequest
  ): Promise<CreateFunctionResponse> {
    if (USE_MOCK_API) {
      return mockCreateFunction(data)
    }

    const response = await apiClient.post<
      CreateFunctionRequest,
      CreateFunctionResponse
    >("/venue-functions", data)

    return unwrapResponse(response)
  }

  /**
   * Получить функции площадки
   */
  static async getFunctions(venueId: string) {
    if (USE_MOCK_API) {
      return mockGetFunctions(venueId)
    }

    const response = await apiClient.get(`/venue-functions`, { venueId })
    return unwrapResponse(response)
  }
}

// ============================================================================
// ITEM CATEGORIES
// ============================================================================

export class ItemCategoriesAPI {
  /**
   * Получить список категорий
   */
  static async getCategories(
    params?: GetItemCategoriesRequest
  ): Promise<GetItemCategoriesResponse> {
    if (USE_MOCK_API) {
      return mockGetCategories(params)
    }

    const response = await apiClient.get<GetItemCategoriesResponse>(
      "/item-categories",
      params as Record<string, unknown>
    )

    return unwrapResponse(response)
  }

  /**
   * Получить иерархию категорий
   */
  static async getHierarchy(): Promise<GetCategoryHierarchyResponse> {
    if (USE_MOCK_API) {
      return mockGetCategoryHierarchy()
    }

    const response = await apiClient.get<GetCategoryHierarchyResponse>(
      "/item-categories/hierarchy"
    )
    return unwrapResponse(response)
  }
}

// ============================================================================
// RESPONSES (VOLUNTEER)
// ============================================================================

export class ResponsesAPI {
  /**
   * Создать отклик волонтера
   */
  static async createResponse(
    data: CreateVolunteerResponseRequest
  ): Promise<CreateVolunteerResponseResponse> {
    if (USE_MOCK_API) {
      return mockCreateResponse(data)
    }

    const response = await apiClient.post<
      CreateVolunteerResponseRequest,
      CreateVolunteerResponseResponse
    >("/volunteer-responses", data)

    return unwrapResponse(response)
  }

  /**
   * Получить отклики волонтера
   */
  static async getMyResponses(): Promise<GetVolunteerResponsesResponse> {
    if (USE_MOCK_API) {
      return mockGetMyResponses()
    }

    const response = await apiClient.get<GetVolunteerResponsesResponse>(
      "/volunteer-responses"
    )
    return unwrapResponse(response)
  }
}

// ============================================================================
// COMMITMENTS (BENEFICIARY)
// ============================================================================

export class CommitmentsAPI {
  /**
   * Создать обязательство бенефициара
   */
  static async createCommitment(
    data: CreateBeneficiaryCommitmentRequest
  ): Promise<CreateBeneficiaryCommitmentResponse> {
    if (USE_MOCK_API) {
      return mockCreateCommitment(data)
    }

    const response = await apiClient.post<
      CreateBeneficiaryCommitmentRequest,
      CreateBeneficiaryCommitmentResponse
    >("/beneficiary-commitments", data)

    return unwrapResponse(response)
  }

  /**
   * Получить обязательства бенефициара
   */
  static async getMyCommitments(): Promise<GetBeneficiaryCommitmentsResponse> {
    if (USE_MOCK_API) {
      return mockGetMyCommitments()
    }

    const response = await apiClient.get<GetBeneficiaryCommitmentsResponse>(
      "/beneficiary-commitments"
    )
    return unwrapResponse(response)
  }
}

// ============================================================================
// PROJECTIONS (ORGANIZER)
// ============================================================================

export class ProjectionsAPI {
  /**
   * Получить проекцию площадки
   */
  static async getVenueProjection(
    params: GetVenueProjectionRequest
  ): Promise<GetVenueProjectionResponse> {
    if (USE_MOCK_API) {
      return mockGetVenueProjection(params)
    }

    const response = await apiClient.get<GetVenueProjectionResponse>(
      `/projections/venue/${params.venueId}`,
      params.functionId ? { functionId: params.functionId } : undefined
    )

    return unwrapResponse(response)
  }
}

// ============================================================================
// MOCK FUNCTIONS (для разработки)
// ============================================================================

// Импортируем моковые данные
import { mockVenues } from "@/lib/mock-data/venues-with-functions"
import type { Venue as OldVenue } from "@/types/venue"

// Преобразуем старый тип Venue в новый
function convertOldVenueToNew(oldVenue: OldVenue): Venue {
  return {
    id: oldVenue.id,
    title: oldVenue.title,
    description: oldVenue.description,
    type: oldVenue.type,
    location: {
      lat: oldVenue.location.lat,
      lng: oldVenue.location.lng,
      address: oldVenue.location.address,
    },
    operatingHours: oldVenue.operatingHours.map((oh) => ({
      dayOfWeek: oh.dayOfWeek,
      openTime: oh.openTime,
      closeTime: oh.closeTime,
      isClosed: oh.isClosed ?? false,
    })),
    organizerId: oldVenue.organizerId,
    status: "active", // Предполагаем, что все моковые площадки активны
    functionsCount: oldVenue.functions?.length || 0,
    createdAt: oldVenue.createdAt.toISOString(),
    updatedAt: oldVenue.updatedAt.toISOString(),
  }
}

function mockLogin(data: LoginRequest): LoginResponse {
  // Простая мок-авторизация
  const user: User = {
    id: 1,
    email: data.email,
    first_name: "Test",
    last_name: "User",
    role: "organizer",
    phone: "+357 99 000 000",
    municipality: "Limassol",
    is_organization: false,
    organization_name: "",
    volunteer_areas_of_interest: "",
    volunteer_services: "",
    interested_in_donations: false,
    association_name: "",
  }

  return {
    user,
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  }
}

function mockRegister(data: RegisterRequest): RegisterResponse {
  const user: User = {
    id: 2,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    role: data.role,
    phone: data.phone,
    municipality: data.municipality,
    is_organization: data.is_organization || false,
    organization_name: data.organization_name || "",
    volunteer_areas_of_interest: data.volunteer_areas_of_interest || "",
    volunteer_services: data.volunteer_services || "",
    interested_in_donations: data.interested_in_donations || false,
    association_name: data.association_name || "",
  }

  return {
    user,
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  }
}

function mockLogout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("currentUser")
  }
}

function mockGetCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const cached = localStorage.getItem("currentUser")
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch {
      return null
    }
  }

  return null
}

function mockGetVenues(params?: GetVenuesRequest): GetVenuesResponse {
  const allVenues = mockVenues.map(convertOldVenueToNew)

  // Простая фильтрация
  let filtered = allVenues

  if (params?.type) {
    filtered = filtered.filter((v) => v.type === params.type)
  }

  if (params?.searchQuery) {
    const query = params.searchQuery.toLowerCase()
    filtered = filtered.filter(
      (v) =>
        v.title.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query)
    )
  }

  const page = params?.page || 1
  const limit = params?.limit || 10
  const start = (page - 1) * limit
  const end = start + limit

  return {
    items: filtered.slice(start, end),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filtered.length / limit),
      totalItems: filtered.length,
      itemsPerPage: limit,
      hasNextPage: end < filtered.length,
      hasPreviousPage: page > 1,
    },
  }
}

function mockGetVenue(venueId: string): Venue {
  const venues = mockVenues.map(convertOldVenueToNew)
  const venue = venues.find((v) => v.id === venueId)

  if (!venue) {
    throw new ApiError("NOT_FOUND", `Venue ${venueId} not found`)
  }

  return venue
}

function mockCreateVenue(data: CreateVenueRequest): CreateVenueResponse {
  const venue: Venue = {
    id: `venue-${Date.now()}`,
    ...data,
    organizerId: "user-1",
    status: "active",
    functionsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return { venue }
}

function mockUpdateVenue(
  venueId: string,
  data: Partial<CreateVenueRequest>
): Venue {
  const venue = mockGetVenue(venueId)

  return {
    ...venue,
    ...data,
    updatedAt: new Date().toISOString(),
  }
}

function mockDeleteVenue(venueId: string): void {
  // В моке просто ничего не делаем
  console.log("Mock: deleted venue", venueId)
}

function mockCreateFunction(
  data: CreateFunctionRequest
): CreateFunctionResponse {
  // Создаем базовую функцию
  const baseFunction = {
    id: `function-${Date.now()}`,
    venueId: data.venueId,
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return {
    function: {
      ...baseFunction,
      ...data,
    } as any,
  }
}

function mockGetFunctions(venueId: string) {
  const oldVenue = mockVenues.find((v) => v.id === venueId)
  if (!oldVenue) {
    throw new ApiError("NOT_FOUND", `Venue ${venueId} not found`)
  }
  return { functions: oldVenue.functions || [] }
}

function mockGetCategories(
  params?: GetItemCategoriesRequest
): GetItemCategoriesResponse {
  // Моковые категории
  return {
    categories: [],
    totalCount: 0,
  }
}

function mockGetCategoryHierarchy() {
  return { hierarchy: [] }
}

function mockCreateResponse(
  data: CreateVolunteerResponseRequest
): CreateVolunteerResponseResponse {
  return {
    response: {
      id: `response-${Date.now()}`,
      volunteerId: "user-1",
      volunteerName: "Test Volunteer",
      venueId: data.venueId,
      venueName: "Test Venue",
      functionId: data.functionId,
      responseType: data.responseType,
      categoryId: data.categoryId,
      quantityOffered: data.quantityOffered,
      serviceType: data.serviceType,
      message: data.message,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
}

function mockGetMyResponses() {
  return {
    items: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    totalByStatus: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
    },
  }
}

function mockCreateCommitment(
  data: CreateBeneficiaryCommitmentRequest
): CreateBeneficiaryCommitmentResponse {
  return {
    commitment: {
      id: `commitment-${Date.now()}`,
      beneficiaryId: "user-1",
      beneficiaryName: "Test Beneficiary",
      venueId: data.venueId,
      venueName: "Test Venue",
      functionId: data.functionId,
      plannedVisitDate: data.plannedVisitDate,
      numberOfPeople: data.numberOfPeople,
      specialNeeds: data.specialNeeds,
      notes: data.notes,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
}

function mockGetMyCommitments() {
  return {
    items: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    totalByStatus: {
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    },
  }
}

function mockGetVenueProjection(
  params: GetVenueProjectionRequest
): GetVenueProjectionResponse {
  return {
    projection: {
      venueId: params.venueId,
      venueName: "Test Venue",
      functionId: params.functionId || "function-1",
      functionType: "collection_point",
      items: [],
      services: [],
      beneficiaryCommitments: 0,
      lastUpdated: new Date().toISOString(),
    },
  }
}

// Экспортируем для удобства
export { isSuccessResponse, unwrapResponse, ApiError, type ApiResponse }

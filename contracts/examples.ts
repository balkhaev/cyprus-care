/**
 * Примеры использования API контрактов
 */

import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  CreateVenueRequest,
  CreateVenueResponse,
  GetVenuesRequest,
  GetVenuesResponse,
  CreateVolunteerResponseRequest,
  CreateVolunteerResponseResponse,
  CreateBeneficiaryCommitmentRequest,
  CreateBeneficiaryCommitmentResponse,
  GetVenueProjectionRequest,
  GetVenueProjectionResponse,
  User,
} from "./index"

import {
  ApiClient,
  createSuccessResponse,
  createErrorResponse,
  isSuccessResponse,
  unwrapResponse,
  ApiError,
} from "./utils"

// === Пример 1: Аутентификация ===

async function exampleLogin() {
  const loginRequest: LoginRequest = {
    email: "organizer@example.com",
    password: "securePassword123",
  }

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginRequest),
  })

  const data: ApiResponse<LoginResponse> = await response.json()

  if (isSuccessResponse(data)) {
    console.log(
      "Logged in user:",
      `${data.data.user.first_name} ${data.data.user.last_name}`
    )
    console.log("Access token:", data.data.accessToken)

    // Сохранить токен
    localStorage.setItem("accessToken", data.data.accessToken)
    localStorage.setItem("refreshToken", data.data.refreshToken)
  } else {
    console.error("Login failed:", data.error.message)
  }
}

// === Пример 2: Создание площадки ===

async function exampleCreateVenue() {
  const request: CreateVenueRequest = {
    title: "Central Food Distribution Hub",
    description: "Main hub for food distribution in Limassol",
    type: "distribution_hub",
    location: {
      lat: 34.6756,
      lng: 33.0431,
      address: "123 Main Street, Limassol, Cyprus",
      city: "Limassol",
      country: "Cyprus",
    },
    operatingHours: [
      {
        dayOfWeek: "monday",
        openTime: "09:00",
        closeTime: "17:00",
        isClosed: false,
      },
      {
        dayOfWeek: "tuesday",
        openTime: "09:00",
        closeTime: "17:00",
        isClosed: false,
      },
      {
        dayOfWeek: "saturday",
        openTime: "10:00",
        closeTime: "14:00",
        isClosed: false,
      },
      {
        dayOfWeek: "sunday",
        openTime: "00:00",
        closeTime: "00:00",
        isClosed: true,
      },
    ],
    contactInfo: {
      phone: "+357 99 123 456",
      email: "contact@foodhub.cy",
    },
  }

  const response = await fetch("/api/venues", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(request),
  })

  const data: ApiResponse<CreateVenueResponse> = await response.json()

  if (isSuccessResponse(data)) {
    console.log("Venue created:", data.data.venue.id)
    return data.data.venue
  } else {
    throw new Error(data.error.message)
  }
}

// === Пример 3: Получение списка площадок с фильтрацией ===

async function exampleGetVenues() {
  const params: GetVenuesRequest = {
    page: 1,
    limit: 20,
    type: "distribution_hub",
    status: "active",
    nearLocation: {
      lat: 34.6756,
      lng: 33.0431,
      radiusKm: 10, // В радиусе 10 км
    },
    sortBy: "createdAt",
    sortOrder: "desc",
  }

  const queryString = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    type: params.type!,
    status: params.status!,
    nearLocation: JSON.stringify(params.nearLocation),
    sortBy: params.sortBy!,
    sortOrder: params.sortOrder!,
  }).toString()

  const response = await fetch(`/api/venues?${queryString}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })

  const data: ApiResponse<GetVenuesResponse> = await response.json()

  if (isSuccessResponse(data)) {
    console.log("Found venues:", data.data.items.length)
    console.log("Total pages:", data.data.pagination.totalPages)

    data.data.items.forEach((venue) => {
      console.log(`- ${venue.title} (${venue.location.address})`)
    })

    return data.data
  } else {
    console.error("Failed to fetch venues:", data.error.message)
    return null
  }
}

// === Пример 4: Отклик волонтера на потребность ===

async function exampleVolunteerResponse() {
  const request: CreateVolunteerResponseRequest = {
    venueId: "venue-uuid-123",
    functionId: "function-uuid-456",
    responseType: "item",
    categoryId: "medicine-painkillers-uuid",
    quantityOffered: 50,
    message: "I have 50 boxes of painkillers ready for delivery",
    deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  }

  const response = await fetch("/api/volunteer-responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(request),
  })

  const data: ApiResponse<CreateVolunteerResponseResponse> =
    await response.json()

  if (isSuccessResponse(data)) {
    console.log("Response submitted:", data.data.response.id)
    console.log("Status:", data.data.response.status)
    return data.data.response
  } else {
    throw new Error(data.error.message)
  }
}

// === Пример 5: Обязательство бенефициара ===

async function exampleBeneficiaryCommitment() {
  const request: CreateBeneficiaryCommitmentRequest = {
    venueId: "venue-uuid-123",
    functionId: "distribution-function-uuid-789",
    plannedVisitDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    numberOfPeople: 4, // Семья из 4 человек
    specialNeeds: ["wheelchair_access", "baby_supplies"],
    notes: "Will arrive around 10 AM",
  }

  const response = await fetch("/api/beneficiary-commitments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify(request),
  })

  const data: ApiResponse<CreateBeneficiaryCommitmentResponse> =
    await response.json()

  if (isSuccessResponse(data)) {
    console.log("Commitment created:", data.data.commitment.id)
    return data.data.commitment
  } else {
    throw new Error(data.error.message)
  }
}

// === Пример 6: Проекция для организатора ===

async function exampleGetProjection(venueId: string) {
  const params: GetVenueProjectionRequest = {
    venueId,
  }

  const response = await fetch(`/api/projections/venue/${venueId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  })

  const data: ApiResponse<GetVenueProjectionResponse> = await response.json()

  if (isSuccessResponse(data)) {
    const projection = data.data.projection

    console.log(`Venue: ${projection.venueName}`)
    console.log(`\nItems:`)
    projection.items.forEach((item) => {
      console.log(`  - ${item.categoryPath.join(" > ")}`)
      console.log(`    Status: ${item.currentStatus}`)
      console.log(`    Responses: ${item.responseCount}`)
      console.log(`    Total offered: ${item.totalQuantityOffered}`)
    })

    console.log(`\nServices:`)
    projection.services.forEach((service) => {
      console.log(`  - ${service.serviceType}`)
      console.log(`    Status: ${service.currentStatus}`)
      console.log(`    Volunteers: ${service.responseCount}`)
    })

    console.log(
      `\nBeneficiary commitments: ${projection.beneficiaryCommitments}`
    )

    return projection
  } else {
    throw new Error(data.error.message)
  }
}

// === Пример 7: Использование ApiClient ===

async function exampleWithApiClient() {
  const apiClient = new ApiClient({
    baseUrl: "http://localhost:3000/api",
    getToken: () => localStorage.getItem("accessToken"),
    onError: (error) => {
      if (error.error.code === "UNAUTHORIZED") {
        // Redirect to login
        window.location.href = "/login"
      }
    },
  })

  // Login
  const loginResponse = await apiClient.post<LoginRequest, LoginResponse>(
    "/auth/login",
    {
      email: "user@example.com",
      password: "password123",
    }
  )

  if (isSuccessResponse(loginResponse)) {
    const { accessToken, user } = loginResponse.data
    localStorage.setItem("accessToken", accessToken)
    console.log("Logged in as:", `${user.first_name} ${user.last_name}`)
  }

  // Get venues
  const venuesResponse = await apiClient.get<GetVenuesResponse>("/venues", {
    page: 1,
    limit: 10,
    type: "distribution_hub",
  })

  if (isSuccessResponse(venuesResponse)) {
    console.log("Venues:", venuesResponse.data.items)
  }

  // Create venue
  const createResponse = await apiClient.post<
    CreateVenueRequest,
    CreateVenueResponse
  >("/venues", {
    title: "New Distribution Center",
    description: "A new distribution center",
    type: "distribution_hub",
    location: {
      lat: 34.6756,
      lng: 33.0431,
      address: "123 Street",
    },
    operatingHours: [],
  })

  if (isSuccessResponse(createResponse)) {
    console.log("Created venue:", createResponse.data.venue.id)
  }
}

// === Пример 8: Обработка ошибок с unwrapResponse ===

async function exampleErrorHandling() {
  try {
    const response = await fetch("/api/venues/invalid-id")
    const data: ApiResponse<CreateVenueResponse> = await response.json()

    // Автоматически выбросит ошибку если response.success === false
    const venue = unwrapResponse(data)
    console.log("Venue:", venue)
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("API Error:", error.code, error.message)
      if (error.details) {
        console.error("Details:", error.details)
      }
    } else {
      console.error("Unknown error:", error)
    }
  }
}

// === Пример 9: Серверная сторона - создание ответов ===

function exampleServerResponses() {
  // Успешный ответ
  const successResponse = createSuccessResponse<User>({
    id: 1,
    email: "user@example.com",
    first_name: "John",
    last_name: "Doe",
    role: "organizer",
    phone: "+357 99 123 456",
    municipality: "Limassol",
    is_organization: false,
    organization_name: "",
    volunteer_areas_of_interest: "",
    volunteer_services: "",
    interested_in_donations: false,
    association_name: "",
  })

  // Ответ с ошибкой
  const errorResponse = createErrorResponse(
    "VALIDATION_ERROR",
    "Invalid input data",
    {
      fields: {
        email: "Email is already in use",
        password: "Password must be at least 8 characters",
      },
    }
  )

  return { successResponse, errorResponse }
}

// === Пример 10: React Hook для работы с API ===

/*
// hooks/useApi.ts
import { useState, useCallback } from 'react';
import type { ApiResponse } from '@/contracts';
import { isSuccessResponse, ApiError } from '@/contracts/utils';

export function useApi<TRequest, TResponse>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  const execute = useCallback(async (
    url: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    body?: TRequest
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const apiResponse: ApiResponse<TResponse> = await response.json();

      if (isSuccessResponse(apiResponse)) {
        setData(apiResponse.data);
        return apiResponse.data;
      } else {
        const apiError = ApiError.fromResponse(apiResponse);
        setError(apiError);
        throw apiError;
      }
    } catch (err) {
      const error = err instanceof ApiError 
        ? err 
        : new ApiError('INTERNAL_ERROR', 'An unexpected error occurred');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, execute };
}

// Использование в компоненте
function VenuesList() {
  const { loading, error, data, execute } = useApi<never, GetVenuesResponse>();

  useEffect(() => {
    execute('/api/venues?page=1&limit=10', 'GET');
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      {data.items.map(venue => (
        <div key={venue.id}>{venue.title}</div>
      ))}
    </div>
  );
}
*/

export {
  exampleLogin,
  exampleCreateVenue,
  exampleGetVenues,
  exampleVolunteerResponse,
  exampleBeneficiaryCommitment,
  exampleGetProjection,
  exampleWithApiClient,
  exampleErrorHandling,
  exampleServerResponses,
}

import { NextRequest, NextResponse } from "next/server"

export interface VolunteerResponse {
  id: string
  venueId: string
  functionId: string
  volunteerId: string
  volunteerName: string
  volunteerEmail: string
  responseType: "item" | "service"
  categoryId?: string
  serviceType?: string
  quantity?: number
  message?: string
  status: "pending" | "approved" | "rejected"
  timestamp: string
}

// In-memory storage with initial mock data
let responses: VolunteerResponse[] = [
  {
    id: "resp-1",
    venueId: "1",
    functionId: "func-1",
    volunteerId: "user-vol-1",
    volunteerName: "Alex Johnson",
    volunteerEmail: "alex.j@example.com",
    responseType: "item",
    categoryId: "cat-1-1-1", // Nurofen
    quantity: 10,
    message: "I have 10 boxes of Nurofen to donate",
    status: "pending",
    timestamp: "2024-01-20T10:00:00Z",
  },
  {
    id: "resp-2",
    venueId: "1",
    functionId: "func-2",
    volunteerId: "user-vol-2",
    volunteerName: "Sarah Williams",
    volunteerEmail: "sarah.w@example.com",
    responseType: "service",
    serviceType: "transport_big",
    message: "I have a large truck available on weekends",
    status: "pending",
    timestamp: "2024-01-21T10:00:00Z",
  },
]

// GET /api/responses - получить все отклики (с фильтрацией)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const venueId = searchParams.get("venueId")
  const functionId = searchParams.get("functionId")
  const volunteerId = searchParams.get("volunteerId")

  let filteredResponses = responses

  if (venueId) {
    filteredResponses = filteredResponses.filter((r) => r.venueId === venueId)
  }

  if (functionId) {
    filteredResponses = filteredResponses.filter(
      (r) => r.functionId === functionId
    )
  }

  if (volunteerId) {
    filteredResponses = filteredResponses.filter(
      (r) => r.volunteerId === volunteerId
    )
  }

  return NextResponse.json(filteredResponses)
}

// POST /api/responses - создать новый отклик
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newResponse: VolunteerResponse = {
      id: `resp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      venueId: body.venueId,
      functionId: body.functionId,
      volunteerId: body.volunteerId,
      volunteerName: body.volunteerName,
      volunteerEmail: body.volunteerEmail,
      responseType: body.responseType,
      categoryId: body.categoryId,
      serviceType: body.serviceType,
      quantity: body.quantity,
      message: body.message,
      status: "pending",
      timestamp: new Date().toISOString(),
    }

    responses.push(newResponse)

    return NextResponse.json(newResponse, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}


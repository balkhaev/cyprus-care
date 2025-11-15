import { NextRequest, NextResponse } from "next/server"
import { mockUsers, type User } from "@/lib/mock-data/user-roles"

// Текущий пользователь в памяти сервера
// По умолчанию - John Smith (organizer)
let currentUserId = "user-org-1"

/**
 * GET /api/me
 * Получить текущего авторизованного пользователя
 */
export async function GET(request: NextRequest) {
  const user = mockUsers[currentUserId]
  
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(user)
}

/**
 * PATCH /api/me
 * Обновить текущего пользователя (для DebugPanel)
 * Body: { userId: string }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    if (!mockUsers[userId]) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Обновляем текущего пользователя
    currentUserId = userId
    const user = mockUsers[userId]

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}


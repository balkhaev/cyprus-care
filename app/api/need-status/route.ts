import { NextRequest, NextResponse } from "next/server"

export interface NeedStatusUpdate {
  id: string
  venueId: string
  functionId: string
  itemCategoryId?: string
  serviceType?: string
  status: "need_a_lot" | "need_few_more" | "dont_need"
  updatedBy: string
  updatedAt: string
}

// In-memory storage
let needStatusUpdates: NeedStatusUpdate[] = []

// GET /api/need-status - получить все статусы потребностей
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const venueId = searchParams.get("venueId")
  const functionId = searchParams.get("functionId")

  let filteredStatuses = needStatusUpdates

  if (venueId) {
    filteredStatuses = filteredStatuses.filter((s) => s.venueId === venueId)
  }

  if (functionId) {
    filteredStatuses = filteredStatuses.filter(
      (s) => s.functionId === functionId
    )
  }

  return NextResponse.json(filteredStatuses)
}

// POST /api/need-status - обновить статус потребности
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Проверяем, есть ли уже статус для этой комбинации
    const existingIndex = needStatusUpdates.findIndex(
      (s) =>
        s.venueId === body.venueId &&
        s.functionId === body.functionId &&
        (body.itemCategoryId
          ? s.itemCategoryId === body.itemCategoryId
          : s.serviceType === body.serviceType)
    )

    const statusUpdate: NeedStatusUpdate = {
      id:
        existingIndex >= 0
          ? needStatusUpdates[existingIndex].id
          : `status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      venueId: body.venueId,
      functionId: body.functionId,
      itemCategoryId: body.itemCategoryId,
      serviceType: body.serviceType,
      status: body.status,
      updatedBy: body.updatedBy,
      updatedAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      // Обновляем существующий
      needStatusUpdates[existingIndex] = statusUpdate
    } else {
      // Добавляем новый
      needStatusUpdates.push(statusUpdate)
    }

    return NextResponse.json(statusUpdate, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}

// Функция для инициализации тестовыми данными
export function initializeTestData() {
  if (needStatusUpdates.length === 0) {
    needStatusUpdates = [
      // Collection Point items
      {
        id: "status-1",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-1-1-1", // Nurofen
        status: "need_few_more",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-2",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-1-1-2", // Paracetamol
        status: "need_a_lot",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-3",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-1-2-1", // Amoxicillin
        status: "need_few_more",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-4",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-1-3-1", // Bandages
        status: "need_a_lot",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-5",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-1-3-2", // Antiseptics
        status: "need_a_lot",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-6",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-2-1-1", // Canned Vegetables
        status: "dont_need",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-7",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-2-1-2", // Canned Meat
        status: "need_few_more",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-8",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-2-2-1", // Rice
        status: "need_a_lot",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-9",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-2-2-2", // Pasta
        status: "need_a_lot",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-10",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-3-1-1", // Jackets
        status: "need_few_more",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-11",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-3-2-1", // Winter Clothes
        status: "need_a_lot",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-12",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-4-1", // Soap
        status: "dont_need",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-13",
        venueId: "1",
        functionId: "func-1",
        itemCategoryId: "cat-4-2", // Diapers
        status: "need_a_lot",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      // Services
      {
        id: "status-14",
        venueId: "1",
        functionId: "func-2",
        serviceType: "transport_big",
        status: "need_a_lot",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-15",
        venueId: "1",
        functionId: "func-2",
        serviceType: "carrying",
        status: "need_few_more",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
      {
        id: "status-16",
        venueId: "1",
        functionId: "func-2",
        serviceType: "language",
        status: "need_a_lot",
        updatedBy: "org-1",
        updatedAt: "2024-01-15T10:00:00Z",
      },
    ]
  }
}

// Инициализируем при импорте модуля
initializeTestData()


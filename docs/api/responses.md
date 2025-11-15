# Volunteer Responses API

## Overview

Фейковое API для работы с откликами волонтеров. Данные хранятся в памяти сервера (in-memory storage).

## Endpoints

### GET /api/responses

Получить список откликов волонтеров.

**Query Parameters:**
- `venueId` (optional) - фильтр по ID площадки
- `functionId` (optional) - фильтр по ID функции
- `volunteerId` (optional) - фильтр по ID волонтера

**Response:**
```json
[
  {
    "id": "resp-1234567890-abc123",
    "venueId": "1",
    "functionId": "func-1",
    "volunteerId": "volunteer-1",
    "volunteerName": "John Volunteer",
    "volunteerEmail": "john@example.com",
    "responseType": "item",
    "categoryId": "med-pain-nurofen",
    "quantity": 10,
    "message": "I can bring this tomorrow",
    "status": "pending",
    "timestamp": "2024-01-15T10:00:00Z"
  }
]
```

### POST /api/responses

Создать новый отклик волонтера.

**Request Body:**
```json
{
  "venueId": "1",
  "functionId": "func-1",
  "volunteerId": "volunteer-1",
  "volunteerName": "John Volunteer",
  "volunteerEmail": "john@example.com",
  "responseType": "item",
  "categoryId": "med-pain-nurofen",
  "quantity": 10,
  "message": "I can bring this tomorrow"
}
```

**Response:** 201 Created
```json
{
  "id": "resp-1234567890-abc123",
  "venueId": "1",
  "functionId": "func-1",
  "volunteerId": "volunteer-1",
  "volunteerName": "John Volunteer",
  "volunteerEmail": "john@example.com",
  "responseType": "item",
  "categoryId": "med-pain-nurofen",
  "quantity": 10,
  "message": "I can bring this tomorrow",
  "status": "pending",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## Data Types

### VolunteerResponse

```typescript
interface VolunteerResponse {
  id: string                                    // Уникальный ID
  venueId: string                               // ID площадки
  functionId: string                            // ID функции
  volunteerId: string                           // ID волонтера
  volunteerName: string                         // Имя волонтера
  volunteerEmail: string                        // Email волонтера
  responseType: "item" | "service"              // Тип отклика
  categoryId?: string                           // ID категории (для items)
  serviceType?: string                          // Тип услуги (для services)
  quantity?: number                             // Количество (для items)
  message?: string                              // Сообщение от волонтера
  status: "pending" | "approved" | "rejected"   // Статус отклика
  timestamp: string                             // Время создания (ISO 8601)
}
```

## Usage Examples

### Получить все отклики для площадки

```typescript
const responses = await fetch('/api/responses?venueId=1')
  .then(res => res.json())
```

### Получить отклики конкретного волонтера

```typescript
const myResponses = await fetch('/api/responses?volunteerId=volunteer-1')
  .then(res => res.json())
```

### Создать новый отклик

```typescript
const response = await fetch('/api/responses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    venueId: '1',
    functionId: 'func-1',
    volunteerId: 'volunteer-1',
    volunteerName: 'John Volunteer',
    volunteerEmail: 'john@example.com',
    responseType: 'item',
    categoryId: 'med-pain-nurofen',
    quantity: 10,
    message: 'I can bring this tomorrow'
  })
})

const newResponse = await response.json()
```

## Notes

- Все данные хранятся в памяти процесса и будут потеряны при перезапуске сервера
- ID генерируются автоматически в формате `resp-{timestamp}-{random}`
- Статус по умолчанию: `pending`
- Timestamp генерируется автоматически при создании


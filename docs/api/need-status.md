# Need Status API

## Overview

Фейковое API для работы со статусами потребностей (Need Status). Данные хранятся в памяти сервера (in-memory storage).

## Endpoints

### GET /api/need-status

Получить список статусов потребностей.

**Query Parameters:**
- `venueId` (optional) - фильтр по ID площадки
- `functionId` (optional) - фильтр по ID функции

**Response:**
```json
[
  {
    "id": "status-1",
    "venueId": "1",
    "functionId": "func-1",
    "itemCategoryId": "med-pain-nurofen",
    "status": "need_few_more",
    "updatedBy": "org-1",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": "status-2",
    "venueId": "1",
    "functionId": "func-2",
    "serviceType": "transport_big",
    "status": "need_a_lot",
    "updatedBy": "org-1",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST /api/need-status

Обновить статус потребности.

**Request Body (для items):**
```json
{
  "venueId": "1",
  "functionId": "func-1",
  "itemCategoryId": "med-pain-nurofen",
  "status": "need_a_lot",
  "updatedBy": "org-1"
}
```

**Request Body (для services):**
```json
{
  "venueId": "1",
  "functionId": "func-2",
  "serviceType": "transport_big",
  "status": "need_few_more",
  "updatedBy": "org-1"
}
```

**Response:** 200 OK
```json
{
  "id": "status-1",
  "venueId": "1",
  "functionId": "func-1",
  "itemCategoryId": "med-pain-nurofen",
  "status": "need_a_lot",
  "updatedBy": "org-1",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## Data Types

### NeedStatusUpdate

```typescript
interface NeedStatusUpdate {
  id: string                                            // Уникальный ID
  venueId: string                                       // ID площадки
  functionId: string                                    // ID функции
  itemCategoryId?: string                               // ID категории (для items)
  serviceType?: string                                  // Тип услуги (для services)
  status: "need_a_lot" | "need_few_more" | "dont_need" // Статус потребности
  updatedBy: string                                     // ID пользователя, который обновил
  updatedAt: string                                     // Время обновления (ISO 8601)
}
```

## Status Values

- `need_a_lot` - Нужно много (красная кнопка)
- `need_few_more` - Нужно еще немного (оранжевая кнопка)
- `dont_need` - Не нужно (зеленая кнопка)

## Usage Examples

### Получить все статусы для площадки

```typescript
const statuses = await fetch('/api/need-status?venueId=1')
  .then(res => res.json())
```

### Обновить статус для item

```typescript
const response = await fetch('/api/need-status', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    venueId: '1',
    functionId: 'func-1',
    itemCategoryId: 'med-pain-nurofen',
    status: 'need_a_lot',
    updatedBy: 'org-1'
  })
})

const updatedStatus = await response.json()
```

### Обновить статус для service

```typescript
const response = await fetch('/api/need-status', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    venueId: '1',
    functionId: 'func-2',
    serviceType: 'transport_big',
    status: 'need_few_more',
    updatedBy: 'org-1'
  })
})

const updatedStatus = await response.json()
```

## Notes

- Все данные хранятся в памяти процесса и будут потеряны при перезапуске сервера
- При обновлении существующего статуса, старый статус перезаписывается
- ID генерируются автоматически в формате `status-{timestamp}-{random}`
- Timestamp обновляется автоматически при каждом изменении
- При старте сервера загружаются тестовые данные для всех items и services площадки с ID "1"


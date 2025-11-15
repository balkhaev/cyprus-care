# Площадки (Venues)

API для управления площадками сбора и раздачи помощи.

## Endpoints

- [POST /venues](#post-venues) - Создать площадку
- [GET /venues](#get-venues) - Получить список площадок
- [GET /venues/:id](#get-venuesid) - Получить площадку по ID
- [PATCH /venues/:id](#patch-venuesid) - Обновить площадку
- [DELETE /venues/:id](#delete-venuesid) - Удалить площадку

---

## POST /venues

Создать новую площадку.

**Требуется авторизация:** Да (роль: `organizer`)

### Request

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Центральный пункт помощи",
  "description": "Основной пункт сбора и раздачи гуманитарной помощи в Лимассоле",
  "type": "distribution_hub",
  "location": {
    "lat": 34.6756,
    "lng": 33.0431,
    "address": "ул. Ленина 123, Лимассол, Кипр",
    "city": "Лимассол",
    "country": "Кипр",
    "postalCode": "3040"
  },
  "operatingHours": [
    {
      "dayOfWeek": "monday",
      "openTime": "09:00",
      "closeTime": "17:00",
      "isClosed": false
    },
    {
      "dayOfWeek": "sunday",
      "openTime": "00:00",
      "closeTime": "00:00",
      "isClosed": true
    }
  ],
  "contactInfo": {
    "phone": "+357 99 123 456",
    "email": "info@hub.cy",
    "website": "https://hub.cy"
  }
}
```

**Поля:**
- `title` (string, required) - Название площадки (3-100 символов)
- `description` (string, required) - Описание (10-500 символов)
- `type` (string, required) - Тип: `collection_point`, `distribution_hub`, `shelter`
- `location` (object, required) - Местоположение
  - `lat` (number, required) - Широта (-90 до 90)
  - `lng` (number, required) - Долгота (-180 до 180)
  - `address` (string, required) - Полный адрес
  - `city` (string, optional) - Город
  - `country` (string, optional) - Страна
  - `postalCode` (string, optional) - Почтовый индекс
- `operatingHours` (array, required) - Часы работы
  - `dayOfWeek` (string) - День недели: `monday`, `tuesday`, etc.
  - `openTime` (string) - Время открытия (HH:MM)
  - `closeTime` (string) - Время закрытия (HH:MM)
  - `isClosed` (boolean) - Закрыто в этот день
- `contactInfo` (object, optional) - Контактная информация
  - `phone` (string, optional) - Телефон
  - `email` (string, optional) - Email
  - `website` (string, optional) - Веб-сайт

### Response

**Success (201):**
```json
{
  "success": true,
  "data": {
    "venue": {
      "id": "venue-123e4567-e89b-12d3-a456-426614174000",
      "title": "Центральный пункт помощи",
      "description": "Основной пункт сбора и раздачи гуманитарной помощи в Лимассоле",
      "type": "distribution_hub",
      "location": {
        "lat": 34.6756,
        "lng": 33.0431,
        "address": "ул. Ленина 123, Лимассол, Кипр",
        "city": "Лимассол",
        "country": "Кипр",
        "postalCode": "3040"
      },
      "operatingHours": [...],
      "organizerId": "user-123e4567-e89b-12d3-a456-426614174000",
      "status": "active",
      "functionsCount": 0,
      "contactInfo": {
        "phone": "+357 99 123 456",
        "email": "info@hub.cy",
        "website": "https://hub.cy"
      },
      "createdAt": "2024-11-15T10:30:00.000Z",
      "updatedAt": "2024-11-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

**Error (400 - Validation Error):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Ошибка валидации данных",
    "details": {
      "title": "Название должно содержать минимум 3 символа",
      "location.lat": "Широта должна быть между -90 и 90"
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Примеры

**cURL:**
```bash
curl -X POST http://localhost:3000/api/venues \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "title": "Центральный пункт помощи",
  "description": "Основной пункт сбора и раздачи",
  "type": "distribution_hub",
  "location": {
    "lat": 34.6756,
    "lng": 33.0431,
    "address": "ул. Ленина 123, Лимассол, Кипр"
  },
  "operatingHours": [
    {
      "dayOfWeek": "monday",
      "openTime": "09:00",
      "closeTime": "17:00",
      "isClosed": false
    }
  ]
}
EOF
```

---

## GET /venues

Получить список площадок с пагинацией и фильтрацией.

**Требуется авторизация:** Нет

### Request

**Headers:**
```http
Content-Type: application/json
```

**Query Parameters:**
```
?page=1
&limit=10
&type=distribution_hub
&status=active
&searchQuery=пункт
&sortBy=createdAt
&sortOrder=desc
```

**Параметры:**
- `page` (number, optional) - Номер страницы (по умолчанию: 1)
- `limit` (number, optional) - Элементов на странице (по умолчанию: 10, макс: 100)
- `type` (string, optional) - Фильтр по типу
- `status` (string, optional) - Фильтр по статусу: `active`, `inactive`, `archived`
- `searchQuery` (string, optional) - Поиск по названию/описанию/адресу
- `sortBy` (string, optional) - Поле для сортировки: `createdAt`, `title`
- `sortOrder` (string, optional) - Направление: `asc`, `desc`

### Response

**Success (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "venue-123e4567-e89b-12d3-a456-426614174000",
        "title": "Центральный пункт помощи",
        "description": "Основной пункт сбора и раздачи",
        "type": "distribution_hub",
        "location": {
          "lat": 34.6756,
          "lng": 33.0431,
          "address": "ул. Ленина 123, Лимассол, Кипр",
          "city": "Лимассол",
          "country": "Кипр"
        },
        "operatingHours": [],
        "organizerId": "user-123e4567-e89b-12d3-a456-426614174000",
        "status": "active",
        "functionsCount": 3,
        "createdAt": "2024-11-15T10:30:00.000Z",
        "updatedAt": "2024-11-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 47,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Примеры

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/venues?page=1&limit=10&type=distribution_hub"
```

**JavaScript:**
```javascript
const params = new URLSearchParams({
  page: '1',
  limit: '10',
  type: 'distribution_hub',
  status: 'active'
});

const response = await fetch(`/api/venues?${params}`);
const data = await response.json();

if (data.success) {
  console.log('Площадки:', data.data.items);
  console.log('Всего:', data.data.pagination.totalItems);
}
```

---

## GET /venues/:id

Получить подробную информацию о площадке.

**Требуется авторизация:** Нет

### Request

**Headers:**
```http
Content-Type: application/json
```

**Path Parameters:**
- `id` (string, required) - UUID площадки

### Response

**Success (200):**
```json
{
  "success": true,
  "data": {
    "venue": {
      "id": "venue-123e4567-e89b-12d3-a456-426614174000",
      "title": "Центральный пункт помощи",
      "description": "Основной пункт сбора и раздачи гуманитарной помощи в Лимассоле",
      "type": "distribution_hub",
      "location": {
        "lat": 34.6756,
        "lng": 33.0431,
        "address": "ул. Ленина 123, Лимассол, Кипр"
      },
      "operatingHours": [],
      "organizerId": "user-123e4567-e89b-12d3-a456-426614174000",
      "status": "active",
      "functionsCount": 3,
      "imageUrls": [
        "https://cdn.example.com/venues/venue-123/image1.jpg"
      ],
      "contactInfo": {
        "phone": "+357 99 123 456",
        "email": "info@hub.cy"
      },
      "createdAt": "2024-11-15T10:30:00.000Z",
      "updatedAt": "2024-11-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

**Error (404 - Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Площадка не найдена"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Примеры

**cURL:**
```bash
curl -X GET http://localhost:3000/api/venues/venue-123e4567-e89b-12d3-a456-426614174000
```

---

## PATCH /venues/:id

Обновить информацию о площадке.

**Требуется авторизация:** Да (роль: `organizer`, владелец площадки)

### Request

**Headers:**
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**
- `id` (string, required) - UUID площадки

**Body:**
```json
{
  "title": "Обновленное название площадки",
  "description": "Новое описание"
}
```

**Поля:** Все поля опциональные, отправляйте только те, что хотите обновить.

### Response

**Success (200):**
```json
{
  "success": true,
  "data": {
    "venue": {
      "id": "venue-123e4567-e89b-12d3-a456-426614174000",
      "title": "Обновленное название площадки",
      "description": "Новое описание",
      "type": "distribution_hub",
      "location": {...},
      "operatingHours": [],
      "organizerId": "user-123e4567-e89b-12d3-a456-426614174000",
      "status": "active",
      "functionsCount": 3,
      "createdAt": "2024-11-15T10:30:00.000Z",
      "updatedAt": "2024-11-15T11:00:00.000Z"
    }
  },
  "timestamp": "2024-11-15T11:00:00.000Z"
}
```

---

## DELETE /venues/:id

Удалить площадку.

**Требуется авторизация:** Да (роль: `organizer`, владелец площадки)

### Request

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Path Parameters:**
- `id` (string, required) - UUID площадки

### Response

**Success (200):**
```json
{
  "success": true,
  "data": {
    "message": "Площадка успешно удалена",
    "deletedAt": "2024-11-15T11:00:00.000Z"
  },
  "timestamp": "2024-11-15T11:00:00.000Z"
}
```

**Error (403 - Operation Not Allowed):**
```json
{
  "success": false,
  "error": {
    "code": "OPERATION_NOT_ALLOWED",
    "message": "Невозможно удалить площадку с активными функциями"
  },
  "timestamp": "2024-11-15T11:00:00.000Z"
}
```

---

## Типы данных

### VenueType

```typescript
type VenueType = 
  | 'collection_point'   // Точка сбора помощи
  | 'distribution_hub'   // Центр раздачи помощи
  | 'shelter';           // Приют/укрытие
```

### Venue

```typescript
{
  id: string;                    // UUID
  title: string;
  description: string;
  type: VenueType;
  location: {
    lat: number;
    lng: number;
    address: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  operatingHours: Array<{
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  organizerId: string;           // UUID владельца
  status: 'active' | 'inactive' | 'archived';
  functionsCount: number;        // Количество функций
  imageUrls?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
}
```

---

## Ошибки

- `VALIDATION_ERROR` (400) - Ошибка валидации данных
- `UNAUTHORIZED` (401) - Не авторизован
- `FORBIDDEN` (403) - Нет прав на эту операцию
- `NOT_FOUND` (404) - Площадка не найдена
- `OPERATION_NOT_ALLOWED` (403) - Операция не разрешена


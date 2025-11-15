# API Contracts

Общие контракты для фронтенда и бэкенда проекта Care Hub.

## Структура

```
contracts/
├── common.ts                    # Общие типы для всех контрактов
├── auth.ts                     # Аутентификация и авторизация
├── venue.ts                    # Площадки (venues)
├── venue-function.ts           # Функции площадок
├── response.ts                 # Отклики волонтеров и обязательства бенефициаров
├── item-category.ts            # Категории предметов
├── utils.ts                    # Вспомогательные функции
├── examples.ts                 # Примеры использования
├── user-examples.ts            # Примеры работы с User (NEW!)
├── api-responses.json          # Примеры JSON ответов от API
├── index.ts                    # Экспорт всех контрактов
├── CONTRACTS.md                # Полная документация
├── API_RESPONSES_GUIDE.md      # Гайд по api-responses.json
├── USER_DOCS_INDEX.md          # 📚 Индекс User документации (START HERE!)
├── USER_QUICK_REF.md           # 🚀 User Quick Reference
├── USER_FIELDS_REFERENCE.md    # 📖 Полный справочник полей User
├── USER_STRUCTURE.md           # 🏗️ Визуальная структура User
├── USER_SCHEMA_UPDATE.md       # 🔄 Гайд миграции User
├── USER_UPDATE_SUMMARY.md      # 📝 Сводка обновления User
└── README.md                   # Этот файл
```

## Использование

### На фронтенде

```typescript
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  CreateVenueRequest,
  Venue,
} from "@/contracts"

// Типобезопасный API вызов
async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return response.json()
}
```

### На бэкенде

```typescript
import type {
  LoginRequest,
  LoginResponse,
  ApiResponse,
  ErrorCode,
} from "../contracts"

// Типобезопасный обработчик
export async function handleLogin(
  req: LoginRequest
): Promise<ApiResponse<LoginResponse>> {
  try {
    // ... логика аутентификации
    return {
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: ErrorCode.UNAUTHORIZED,
        message: "Invalid credentials",
      },
      timestamp: new Date().toISOString(),
    }
  }
}
```

### Использование helper типов

```typescript
import type {
  ApiEndpoints,
  RequestOf,
  ResponseOf,
  ExtractEndpoint,
} from "@/contracts"

// Извлечение типов для конкретного эндпоинта
type LoginEndpoint = ExtractEndpoint<"POST", "/auth/login">
type LoginReq = RequestOf<LoginEndpoint>
type LoginRes = ResponseOf<LoginEndpoint>

// Универсальная функция для API вызовов
async function apiCall<T extends keyof ApiEndpoints>(
  endpoint: T,
  data: RequestOf<T>
): Promise<ResponseOf<T>> {
  // ... реализация
}
```

## Основные типы

### ApiResponse

Все API эндпоинты возвращают `ApiResponse<T>`:

```typescript
// Успешный ответ
{
  success: true,
  data: T,
  timestamp: "2024-01-15T10:30:00.000Z"
}

// Ответ с ошибкой
{
  success: false,
  error: {
    code: "UNAUTHORIZED",
    message: "Invalid credentials",
    details?: { ... }
  },
  timestamp: "2024-01-15T10:30:00.000Z"
}
```

### PaginatedResponse

Для списков с пагинацией:

```typescript
{
  items: T[],
  pagination: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    itemsPerPage: 10,
    hasNextPage: true,
    hasPreviousPage: false
  }
}
```

## Модули контрактов

### 1. common.ts

Базовые типы, используемые во всех контрактах:

- `ApiResponse`, `ApiSuccessResponse`, `ApiErrorResponse`
- `PaginationParams`, `PaginatedResponse`
- `FilterParams`, `SearchParams`, `SearchResult`
- `EntityTimestamps`, `EntityWithCreator`
- `Coordinates`, `GeoLocation`
- `ErrorCode` enum
- Helper типы: `UUID`, `Timestamp`

### 2. auth.ts

Аутентификация и управление пользователями:

- Типы: `User`, `UserProfile`, `UserRole`
- Регистрация: `RegisterRequest/Response`
- Вход: `LoginRequest/Response`
- Токены: `RefreshTokenRequest/Response`, `TokenPayload`
- Сброс пароля: `ForgotPasswordRequest/Response`, `ResetPasswordRequest/Response`
- Верификация email: `VerifyEmailRequest/Response`
- Обновление профиля: `UpdateProfileRequest/Response`

**⚡ NEW: User Schema Updated!**

User entity теперь соответствует реальной структуре backend API:
- `id: number` (было UUID)
- `first_name` + `last_name` (было `name`)
- Добавлено: `municipality`, organization/volunteer/beneficiary поля
- Добавлены helper функции: `getUserFullName()`, `parseVolunteerAreas()`, и др.

📚 **Полная документация User**: [USER_DOCS_INDEX.md](./USER_DOCS_INDEX.md)  
🚀 **Quick Start**: [USER_QUICK_REF.md](./USER_QUICK_REF.md)

### 3. venue.ts

Работа с площадками:

- Типы: `Venue`, `VenueType`, `OperatingHours`
- CRUD операции: Create, Read, Update, Delete
- Функции: `VenueFunction` (Collection Point, Distribution Point, Services Needed, Custom)
- Статистика: `VenueStatistics`
- Геофильтрация в `GetVenuesRequest`

### 4. venue-function.ts

Функции площадок:

- Создание различных типов функций
- Обновление функций
- Кастомные типы функций
- Статистика функций

### 5. response.ts

Отклики волонтеров и обязательства бенефициаров:

- `VolunteerResponse` - отклики волонтеров на потребности
- `BeneficiaryCommitment` - обязательства бенефициаров посетить точку раздачи
- `NeedStatusUpdate` - статус потребностей (управляется организаторами)
- Проекции для организаторов: `ItemProjection`, `ServiceProjection`, `VenueProjection`

### 6. item-category.ts

Иерархия категорий предметов:

- `ItemCategory` - категория с поддержкой иерархии
- `CategoryHierarchy` - дерево категорий
- `CategoryPath` - путь категории
- Поиск и валидация
- Статистика использования
- Массовое создание категорий

## Примеры JSON ответов

Все примеры JSON ответов от API эндпоинтов находятся в файле **[api-responses.json](./api-responses.json)**

Этот файл содержит:

- ✅ Примеры успешных ответов для всех эндпоинтов
- ✅ Примеры ответов с ошибками
- ✅ Примеры запросов (request body)
- ✅ Описание всех кодов ошибок
- ✅ Примеры HTTP заголовков

Используйте этот файл как справочник при разработке бэкенда и фронтенда.

## Правила

1. **Все даты в ISO 8601**: Используйте `Timestamp` тип (строка в формате ISO 8601)
2. **UUID для ID**: Используйте `UUID` тип вместо простых строк
3. **Статусы через union types**: Не используйте магические строки напрямую
4. **Опциональные поля**: Используйте `?` для необязательных полей
5. **Не используйте any или unknown**: Все типы должны быть явными

## Соглашения об именовании

- Типы запросов: `{Action}{Entity}Request` (например, `CreateVenueRequest`)
- Типы ответов: `{Action}{Entity}Response` (например, `CreateVenueResponse`)
- Эндпоинты: `{Method} {path}` (например, `POST /venues`)
- Статусы: `snake_case` (например, `need_a_lot`, `active`)
- Перечисления: `PascalCase` для enum, `snake_case` для значений

## Добавление новых контрактов

При добавлении новых контрактов:

1. Создайте новый файл в `/contracts/{module}.ts`
2. Определите все типы запросов и ответов
3. Создайте тип `{Module}Endpoints` с маппингом эндпоинтов
4. Экспортируйте типы в `index.ts`
5. Добавьте в `ApiEndpoints` union type
6. Обновите этот README

## Примеры использования

### Создание площадки

```typescript
import type {
  CreateVenueRequest,
  CreateVenueResponse,
  ApiResponse,
} from "@/contracts"

const request: CreateVenueRequest = {
  title: "Food Distribution Center",
  description: "Main distribution point for food supplies",
  type: "distribution_hub",
  location: {
    lat: 34.6756,
    lng: 33.0431,
    address: "123 Main St, Limassol, Cyprus",
  },
  operatingHours: [
    {
      dayOfWeek: "monday",
      openTime: "09:00",
      closeTime: "17:00",
      isClosed: false,
    },
  ],
}

const response: ApiResponse<CreateVenueResponse> = await fetch("/api/venues", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(request),
}).then((r) => r.json())

if (response.success) {
  console.log("Venue created:", response.data.venue)
} else {
  console.error("Error:", response.error.message)
}
```

### Получение списка площадок с фильтрацией

```typescript
import type {
  GetVenuesRequest,
  GetVenuesResponse,
  ApiResponse,
} from "@/contracts"

const params: GetVenuesRequest = {
  page: 1,
  limit: 10,
  type: "distribution_hub",
  nearLocation: {
    lat: 34.6756,
    lng: 33.0431,
    radiusKm: 5,
  },
  status: "active",
}

const queryString = new URLSearchParams(params as any).toString()
const response: ApiResponse<GetVenuesResponse> = await fetch(
  `/api/venues?${queryString}`
).then((r) => r.json())

if (response.success) {
  console.log("Found venues:", response.data.items)
  console.log("Pagination:", response.data.pagination)
}
```

### Создание отклика волонтера

```typescript
import type {
  CreateVolunteerResponseRequest,
  CreateVolunteerResponseResponse,
  ApiResponse,
} from "@/contracts"

const request: CreateVolunteerResponseRequest = {
  venueId: "venue-uuid",
  functionId: "function-uuid",
  responseType: "item",
  categoryId: "category-uuid",
  quantityOffered: 50,
  message: "I can bring 50 units of medicine",
  deliveryDate: "2024-01-20T10:00:00.000Z",
}

const response: ApiResponse<CreateVolunteerResponseResponse> = await fetch(
  "/api/volunteer-responses",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  }
).then((r) => r.json())

if (response.success) {
  console.log("Response created:", response.data.response)
}
```

## Валидация

Рекомендуется использовать Zod для валидации на обеих сторонах:

```typescript
import { z } from "zod"
import type { CreateVenueRequest } from "@/contracts"

const CreateVenueSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  type: z.enum(["collection_point", "distribution_hub", "shelter"]),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    address: z.string().min(5),
  }),
  operatingHours: z.array(
    z.object({
      dayOfWeek: z.string(),
      openTime: z.string().regex(/^\d{2}:\d{2}$/),
      closeTime: z.string().regex(/^\d{2}:\d{2}$/),
      isClosed: z.boolean(),
    })
  ),
}) satisfies z.ZodType<CreateVenueRequest>
```

## Миграция существующих типов

Существующие типы в `/types` можно постепенно мигрировать на контракты:

1. Импортируйте типы из `/contracts` вместо `/types`
2. Обновите API вызовы для использования новых типов
3. После полной миграции модуля удалите старые типы

## Вопросы и поддержка

При возникновении вопросов или необходимости расширения контрактов:

1. Проверьте существующие контракты
2. Следуйте установленным соглашениям
3. Документируйте новые типы
4. Обновляйте этот README

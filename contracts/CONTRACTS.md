# Документация API Контрактов

## Оглавление

1. [Введение](#введение)
2. [Общие типы (common.ts)](#общие-типы-commonts)
3. [Аутентификация (auth.ts)](#аутентификация-authts)
4. [Площадки (venue.ts)](#площадки-venuets)
5. [Функции площадок (venue-function.ts)](#функции-площадок-venue-functionts)
6. [Отклики и обязательства (response.ts)](#отклики-и-обязательства-responsets)
7. [Категории предметов (item-category.ts)](#категории-предметов-item-categoryts)
8. [Утилиты (utils.ts)](#утилиты-utilsts)
9. [Примеры использования](#примеры-использования)

---

## Введение

Контракты представляют собой набор TypeScript типов и интерфейсов, определяющих структуру данных для взаимодействия между фронтендом и бэкендом проекта Care Hub.

### Основные принципы

- **Типобезопасность**: Все API эндпоинты имеют строгую типизацию
- **Единый источник истины**: Контракты используются и на фронте, и на бэке
- **Консистентность**: Все ответы следуют единому формату `ApiResponse<T>`
- **Документированность**: Каждый тип имеет понятное название и описание

### Структура файлов

```
contracts/
├── common.ts              # Базовые типы для всех модулей
├── auth.ts               # Аутентификация и пользователи
├── venue.ts              # Площадки
├── venue-function.ts     # Функции площадок
├── response.ts           # Отклики волонтеров и обязательства
├── item-category.ts      # Категории предметов
├── utils.ts              # Вспомогательные функции
├── examples.ts           # Примеры использования
├── index.ts              # Экспорт всех модулей
└── README.md             # Краткая документация
```

---

## Общие типы (common.ts)

### ApiResponse<T>

Базовый тип для всех API ответов. Позволяет различать успешные и ошибочные ответы на уровне типов.

```typescript
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

#### ApiSuccessResponse<T>

Успешный ответ от API:

```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string; // ISO 8601
}
```

**Пример:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "123", "name": "John" }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### ApiErrorResponse

Ответ с ошибкой:

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}
```

**Пример:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### ErrorCode

Перечисление стандартных кодов ошибок:

| Код | Категория | Описание |
|-----|-----------|----------|
| `INTERNAL_ERROR` | Общие | Внутренняя ошибка сервера |
| `INVALID_REQUEST` | Общие | Некорректный запрос |
| `VALIDATION_ERROR` | Общие | Ошибка валидации данных |
| `UNAUTHORIZED` | Аутентификация | Не авторизован |
| `FORBIDDEN` | Аутентификация | Доступ запрещен |
| `TOKEN_EXPIRED` | Аутентификация | Токен истек |
| `INVALID_TOKEN` | Аутентификация | Невалидный токен |
| `NOT_FOUND` | Ресурсы | Ресурс не найден |
| `ALREADY_EXISTS` | Ресурсы | Ресурс уже существует |
| `CONFLICT` | Ресурсы | Конфликт данных |
| `INSUFFICIENT_PERMISSIONS` | Бизнес-логика | Недостаточно прав |
| `INVALID_STATE` | Бизнес-логика | Некорректное состояние |
| `OPERATION_NOT_ALLOWED` | Бизнес-логика | Операция не разрешена |
| `SERVICE_UNAVAILABLE` | Внешние сервисы | Сервис недоступен |
| `RATE_LIMIT_EXCEEDED` | Внешние сервисы | Превышен лимит запросов |

### PaginationParams

Параметры для пагинации:

```typescript
interface PaginationParams {
  page: number;           // Номер страницы (начиная с 1)
  limit: number;          // Количество элементов на странице
  sortBy?: string;        // Поле для сортировки
  sortOrder?: 'asc' | 'desc'; // Направление сортировки
}
```

### PaginatedResponse<T>

Ответ со списком и пагинацией:

```typescript
interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

### GeoLocation

Географическое местоположение:

```typescript
interface GeoLocation {
  lat: number;            // Широта (-90 до 90)
  lng: number;            // Долгота (-180 до 180)
  address: string;        // Полный адрес
  city?: string;          // Город
  country?: string;       // Страна
  postalCode?: string;    // Почтовый индекс
}
```

### EntityTimestamps

Временные метки для сущностей:

```typescript
interface EntityTimestamps {
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

### Вспомогательные типы

```typescript
type UUID = string;                    // UUID идентификатор
type Timestamp = string;               // ISO 8601 дата/время
type EntityStatus = 'active' | 'inactive' | 'archived' | 'deleted';
type OperationType = 'create' | 'update' | 'delete' | 'read';
```

---

## Аутентификация (auth.ts)

### User

Основная информация о пользователе:

```typescript
interface User {
  id: UUID;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  organizerId?: UUID;        // Только для организаторов
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### UserRole

Роли пользователей в системе:

```typescript
type UserRole = 'organizer' | 'volunteer' | 'beneficiary' | 'admin';
```

| Роль | Описание |
|------|----------|
| `organizer` | Организатор - создает и управляет площадками |
| `volunteer` | Волонтер - откликается на потребности |
| `beneficiary` | Бенефициар - получает помощь |
| `admin` | Администратор - управление системой |

### Регистрация

#### RegisterRequest

```typescript
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  organizerId?: UUID;  // Для привязки к организации
}
```

#### RegisterResponse

```typescript
interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

### Вход

#### LoginRequest

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

#### LoginResponse

```typescript
interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

### Токены

#### TokenPayload

Payload JWT токена:

```typescript
interface TokenPayload {
  userId: UUID;
  email: string;
  role: UserRole;
  organizerId?: UUID;
  iat: number;  // Issued at (timestamp)
  exp: number;  // Expiration (timestamp)
}
```

#### RefreshTokenRequest/Response

```typescript
interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
```

### Сброс пароля

#### ForgotPasswordRequest

```typescript
interface ForgotPasswordRequest {
  email: string;
}
```

#### ResetPasswordRequest

```typescript
interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
```

### Профиль пользователя

#### UserProfile

Расширенная информация о пользователе:

```typescript
interface UserProfile extends User {
  bio?: string;
  location?: string;
  languages?: string[];
  skills?: string[];
  availability?: {
    days: string[];
    hours: string;
  };
}
```

#### UpdateProfileRequest

```typescript
interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  languages?: string[];
  skills?: string[];
  availability?: {
    days: string[];
    hours: string;
  };
}
```

### API Endpoints

```typescript
type AuthEndpoints = {
  'POST /auth/register': { request: RegisterRequest; response: ApiResponse<RegisterResponse> };
  'POST /auth/login': { request: LoginRequest; response: ApiResponse<LoginResponse> };
  'POST /auth/refresh': { request: RefreshTokenRequest; response: ApiResponse<RefreshTokenResponse> };
  'POST /auth/logout': { request: {}; response: ApiResponse<{ message: string }> };
  'GET /auth/me': { request: {}; response: ApiResponse<User> };
  'PATCH /auth/profile': { request: UpdateProfileRequest; response: ApiResponse<UpdateProfileResponse> };
  // ... другие эндпоинты
};
```

---

## Площадки (venue.ts)

### Venue

Площадка - место, где происходит сбор или раздача помощи:

```typescript
interface Venue {
  id: UUID;
  title: string;
  description: string;
  type: VenueType;
  location: GeoLocation;
  operatingHours: OperatingHours[];
  organizerId: UUID;
  status: EntityStatus;
  functionsCount: number;
  imageUrls?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### VenueType

Типы площадок:

```typescript
type VenueType = 'collection_point' | 'distribution_hub' | 'shelter';
```

| Тип | Описание |
|-----|----------|
| `collection_point` | Точка сбора помощи |
| `distribution_hub` | Центр раздачи помощи |
| `shelter` | Приют/укрытие |

### OperatingHours

Часы работы:

```typescript
interface OperatingHours {
  dayOfWeek: string;    // 'monday', 'tuesday', ...
  openTime: string;     // 'HH:MM' (09:00)
  closeTime: string;    // 'HH:MM' (17:00)
  isClosed: boolean;    // true если закрыто в этот день
}
```

### Создание площадки

#### CreateVenueRequest

```typescript
interface CreateVenueRequest {
  title: string;
  description: string;
  type: VenueType;
  location: GeoLocation;
  operatingHours: OperatingHours[];
  imageUrls?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}
```

**Пример:**
```json
{
  "title": "Центральный пункт помощи",
  "description": "Основной пункт сбора и раздачи гуманитарной помощи",
  "type": "distribution_hub",
  "location": {
    "lat": 34.6756,
    "lng": 33.0431,
    "address": "ул. Ленина 123, Лимассол, Кипр",
    "city": "Лимассол",
    "country": "Кипр"
  },
  "operatingHours": [
    {
      "dayOfWeek": "monday",
      "openTime": "09:00",
      "closeTime": "17:00",
      "isClosed": false
    }
  ],
  "contactInfo": {
    "phone": "+357 99 123 456",
    "email": "info@hub.cy"
  }
}
```

### Получение списка площадок

#### GetVenuesRequest

```typescript
interface GetVenuesRequest extends PaginationParams {
  type?: VenueType;
  organizerId?: UUID;
  status?: EntityStatus;
  searchQuery?: string;
  nearLocation?: {
    lat: number;
    lng: number;
    radiusKm: number;
  };
  hasFunctionType?: string;
}
```

**Особенности:**
- Поддерживает геофильтрацию (поиск в радиусе)
- Полнотекстовый поиск по `searchQuery`
- Фильтрация по типу, статусу, организатору
- Фильтрация по наличию определенного типа функций

### Функции площадки

#### VenueFunction

Union-тип для всех типов функций:

```typescript
type VenueFunction = 
  | CollectionPointFunction 
  | DistributionPointFunction 
  | ServicesNeededFunction 
  | CustomFunction;
```

#### ItemWithQuantity

Предмет с уровнем количества:

```typescript
interface ItemWithQuantity {
  categoryId: UUID;
  categoryPath: string[];     // ['Медицина', 'Обезболивающие', 'Нурофен']
  quantity: QuantityLevel;    // 'a_lot' | 'some' | 'few'
}
```

#### ServiceRequest

Запрос на услугу:

```typescript
interface ServiceRequest {
  type: ServiceType;
  description: string;
  isRequired: boolean;
}
```

**ServiceType:**
```typescript
type ServiceType = 
  | 'transport_big'      // Грузовой транспорт
  | 'transport_small'    // Легковой транспорт
  | 'carrying'           // Переноска грузов
  | 'language'           // Языковая помощь
  | 'admin'              // Административная помощь
  | 'tech';              // Техническая помощь
```

### Статистика площадки

#### VenueStatistics

```typescript
interface VenueStatistics {
  venueId: UUID;
  totalResponses: number;
  itemResponsesCount: number;
  serviceResponsesCount: number;
  beneficiaryCommitmentsCount: number;
  mostNeededItems: Array<{
    categoryId: UUID;
    categoryPath: string[];
    requestCount: number;
  }>;
  mostNeededServices: Array<{
    serviceType: ServiceType;
    requestCount: number;
  }>;
}
```

### API Endpoints

```typescript
type VenueEndpoints = {
  'POST /venues': { request: CreateVenueRequest; response: ApiResponse<CreateVenueResponse> };
  'GET /venues': { request: GetVenuesRequest; response: ApiResponse<GetVenuesResponse> };
  'GET /venues/:id': { request: GetVenueRequest; response: ApiResponse<GetVenueResponse> };
  'GET /venues/:id/full': { request: { venueId: UUID }; response: ApiResponse<GetVenueWithFunctionsResponse> };
  'PATCH /venues/:id': { request: UpdateVenueRequest; response: ApiResponse<UpdateVenueResponse> };
  'DELETE /venues/:id': { request: DeleteVenueRequest; response: ApiResponse<DeleteVenueResponse> };
  'GET /venues/:id/statistics': { request: { venueId: UUID }; response: ApiResponse<GetVenueStatisticsResponse> };
};
```

---

## Функции площадок (venue-function.ts)

### VenueFunctionType

Типы функций площадки:

```typescript
type VenueFunctionType = 
  | 'collection_point'    // Точка сбора
  | 'distribution_point'  // Точка раздачи
  | 'services_needed'     // Требуются услуги
  | 'custom';             // Кастомная функция
```

### CollectionPointFunction

Функция точки сбора - принимает определенные предметы:

```typescript
interface CollectionPointFunction {
  id: UUID;
  venueId: UUID;
  type: 'collection_point';
  items: ItemWithQuantity[];
  openingTimes: OperatingHours[];
  specialRequests?: string;
  status: EntityStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### DistributionPointFunction

Функция точки раздачи - раздает определенные предметы:

```typescript
interface DistributionPointFunction {
  id: UUID;
  venueId: UUID;
  type: 'distribution_point';
  items: ItemWithQuantity[];
  openingTimes: OperatingHours[];
  specialRequests?: string;
  status: EntityStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### ServicesNeededFunction

Функция запроса услуг - требуются волонтерские услуги:

```typescript
interface ServicesNeededFunction {
  id: UUID;
  venueId: UUID;
  type: 'services_needed';
  services: ServiceRequest[];
  specialRequests?: string;
  status: EntityStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### CustomFunction

Кастомная функция, определенная организатором:

```typescript
interface CustomFunction {
  id: UUID;
  venueId: UUID;
  type: 'custom';
  customTypeId: UUID;
  customTypeName: string;
  customTypeDescription: string;
  items?: ItemWithQuantity[];
  services?: ServiceRequest[];
  openingTimes?: OperatingHours[];
  specialRequests?: string;
  status: EntityStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### CustomFunctionType

Определение кастомного типа функции:

```typescript
interface CustomFunctionType {
  id: UUID;
  name: string;
  description: string;
  organizerId: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Пример использования:**
Организатор может создать кастомный тип функции "Юридическая консультация", а затем использовать его для разных площадок.

### Создание функции

#### CreateCollectionPointRequest

```typescript
interface CreateCollectionPointRequest {
  venueId: UUID;
  type: 'collection_point';
  items: ItemWithQuantity[];
  openingTimes: OperatingHours[];
  specialRequests?: string;
}
```

**Пример:**
```json
{
  "venueId": "venue-123",
  "type": "collection_point",
  "items": [
    {
      "categoryId": "medicine-painkillers-uuid",
      "categoryPath": ["Медицина", "Обезболивающие"],
      "quantity": "a_lot"
    },
    {
      "categoryId": "food-canned-uuid",
      "categoryPath": ["Еда", "Консервы"],
      "quantity": "some"
    }
  ],
  "openingTimes": [
    {
      "dayOfWeek": "monday",
      "openTime": "10:00",
      "closeTime": "16:00",
      "isClosed": false
    }
  ],
  "specialRequests": "Пожалуйста, приносите только невскрытые упаковки"
}
```

### API Endpoints

```typescript
type VenueFunctionEndpoints = {
  'POST /venue-functions': { request: CreateFunctionRequest; response: ApiResponse<CreateFunctionResponse> };
  'GET /venue-functions': { request: GetFunctionsRequest; response: ApiResponse<GetFunctionsResponse> };
  'GET /venue-functions/:id': { request: GetFunctionRequest; response: ApiResponse<GetFunctionResponse> };
  'PATCH /venue-functions/:id': { request: UpdateFunctionRequest; response: ApiResponse<UpdateFunctionResponse> };
  'DELETE /venue-functions/:id': { request: DeleteFunctionRequest; response: ApiResponse<DeleteFunctionResponse> };
  
  // Custom function types
  'POST /custom-function-types': { request: CreateCustomFunctionTypeRequest; response: ApiResponse<CreateCustomFunctionTypeResponse> };
  'GET /custom-function-types': { request: GetCustomFunctionTypesRequest; response: ApiResponse<GetCustomFunctionTypesResponse> };
};
```

---

## Отклики и обязательства (response.ts)

### VolunteerResponse

Отклик волонтера на потребность:

```typescript
interface VolunteerResponse {
  id: UUID;
  volunteerId: UUID;
  volunteerName: string;
  venueId: UUID;
  venueName: string;
  functionId: UUID;
  responseType: ResponseType;
  
  // Для откликов на предметы
  categoryId?: UUID;
  categoryPath?: string[];
  quantityOffered?: number;
  
  // Для откликов на услуги
  serviceType?: ServiceType;
  
  // Общие поля
  message?: string;
  status: ResponseStatus;
  deliveryDate?: Timestamp;
  notes?: string;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### ResponseStatus

Статус отклика:

```typescript
type ResponseStatus = 
  | 'pending'      // Ожидает подтверждения
  | 'confirmed'    // Подтвержден организатором
  | 'completed'    // Выполнен
  | 'cancelled'    // Отменен
  | 'rejected';    // Отклонен
```

### ResponseType

Тип отклика:

```typescript
type ResponseType = 
  | 'item'      // Отклик на предмет
  | 'service';  // Отклик на услугу
```

### Создание отклика волонтера

#### CreateVolunteerResponseRequest

```typescript
interface CreateVolunteerResponseRequest {
  venueId: UUID;
  functionId: UUID;
  responseType: ResponseType;
  
  // Для предметов
  categoryId?: UUID;
  quantityOffered?: number;
  
  // Для услуг
  serviceType?: ServiceType;
  
  // Общее
  message?: string;
  deliveryDate?: Timestamp;
  notes?: string;
}
```

**Пример (отклик на предмет):**
```json
{
  "venueId": "venue-123",
  "functionId": "function-456",
  "responseType": "item",
  "categoryId": "medicine-painkillers-uuid",
  "quantityOffered": 50,
  "message": "У меня есть 50 упаковок обезболивающих",
  "deliveryDate": "2024-01-20T10:00:00.000Z"
}
```

**Пример (отклик на услугу):**
```json
{
  "venueId": "venue-123",
  "functionId": "function-789",
  "responseType": "service",
  "serviceType": "transport_big",
  "message": "Могу предоставить грузовик на целый день",
  "deliveryDate": "2024-01-20T08:00:00.000Z"
}
```

### BeneficiaryCommitment

Обязательство бенефициара посетить точку раздачи:

```typescript
interface BeneficiaryCommitment {
  id: UUID;
  beneficiaryId: UUID;
  beneficiaryName: string;
  venueId: UUID;
  venueName: string;
  functionId: UUID;  // Должна быть distribution_point функция
  
  plannedVisitDate?: Timestamp;
  actualVisitDate?: Timestamp;
  
  status: 'confirmed' | 'cancelled' | 'completed';
  
  notes?: string;
  numberOfPeople?: number;       // Количество людей в группе
  specialNeeds?: string[];       // Особые потребности
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Создание обязательства

#### CreateBeneficiaryCommitmentRequest

```typescript
interface CreateBeneficiaryCommitmentRequest {
  venueId: UUID;
  functionId: UUID;
  plannedVisitDate?: Timestamp;
  numberOfPeople?: number;
  specialNeeds?: string[];
  notes?: string;
}
```

**Пример:**
```json
{
  "venueId": "venue-123",
  "functionId": "distribution-function-456",
  "plannedVisitDate": "2024-01-20T14:00:00.000Z",
  "numberOfPeople": 4,
  "specialNeeds": ["wheelchair_access", "baby_supplies"],
  "notes": "Придем около 14:00"
}
```

### NeedStatus

Статус потребности (управляется организаторами):

```typescript
type NeedStatus = 
  | 'need_a_lot'      // Очень нужно
  | 'need_few_more'   // Нужно еще немного
  | 'dont_need';      // Больше не нужно
```

### NeedStatusUpdate

Обновление статуса потребности:

```typescript
interface NeedStatusUpdate {
  id: UUID;
  venueId: UUID;
  functionId: UUID;
  itemCategoryId?: UUID;
  serviceType?: ServiceType;
  status: NeedStatus;
  updatedBy: UUID;
  updatedAt: Timestamp;
}
```

### Проекции для организаторов

#### ItemProjection

Агрегированная информация о предмете:

```typescript
interface ItemProjection {
  categoryId: UUID;
  categoryPath: string[];
  currentStatus: NeedStatus;
  responseCount: number;
  totalQuantityOffered: number;
  pendingResponses: number;
  confirmedResponses: number;
}
```

#### ServiceProjection

Агрегированная информация об услуге:

```typescript
interface ServiceProjection {
  serviceType: ServiceType;
  currentStatus: NeedStatus;
  responseCount: number;
  pendingResponses: number;
  confirmedResponses: number;
  respondingVolunteers: Array<{
    id: UUID;
    name: string;
    message?: string;
    status: ResponseStatus;
  }>;
}
```

#### VenueProjection

Полная проекция площадки для организатора:

```typescript
interface VenueProjection {
  venueId: UUID;
  venueName: string;
  functionId: UUID;
  functionType: string;
  items: ItemProjection[];
  services: ServiceProjection[];
  beneficiaryCommitments: number;
  lastUpdated: Timestamp;
}
```

**Использование:**
Организатор может запросить проекцию, чтобы увидеть:
- Сколько откликов получено на каждую потребность
- Какие волонтеры откликнулись
- Сколько предметов предложено
- Сколько бенефициаров планирует прийти

### API Endpoints

```typescript
type ResponseEndpoints = {
  // Volunteer responses
  'POST /volunteer-responses': { request: CreateVolunteerResponseRequest; response: ApiResponse<CreateVolunteerResponseResponse> };
  'GET /volunteer-responses': { request: GetVolunteerResponsesRequest; response: ApiResponse<GetVolunteerResponsesResponse> };
  'PATCH /volunteer-responses/:id': { request: UpdateVolunteerResponseRequest; response: ApiResponse<UpdateVolunteerResponseResponse> };
  'DELETE /volunteer-responses/:id': { request: DeleteVolunteerResponseRequest; response: ApiResponse<DeleteVolunteerResponseResponse> };
  
  // Beneficiary commitments
  'POST /beneficiary-commitments': { request: CreateBeneficiaryCommitmentRequest; response: ApiResponse<CreateBeneficiaryCommitmentResponse> };
  'GET /beneficiary-commitments': { request: GetBeneficiaryCommitmentsRequest; response: ApiResponse<GetBeneficiaryCommitmentsResponse> };
  'PATCH /beneficiary-commitments/:id': { request: UpdateBeneficiaryCommitmentRequest; response: ApiResponse<UpdateBeneficiaryCommitmentResponse> };
  
  // Need status
  'POST /need-status': { request: UpdateNeedStatusRequest; response: ApiResponse<UpdateNeedStatusResponse> };
  'GET /need-status': { request: GetNeedStatusesRequest; response: ApiResponse<GetNeedStatusesResponse> };
  
  // Projections
  'GET /projections/venue/:venueId': { request: GetVenueProjectionRequest; response: ApiResponse<GetVenueProjectionResponse> };
};
```

---

## Категории предметов (item-category.ts)

### ItemCategory

Категория предметов с поддержкой иерархии:

```typescript
interface ItemCategory {
  id: UUID;
  name: string;
  description?: string;
  parentId: UUID | null;    // null для корневых категорий
  level: number;            // 0 = корень, 1 = первый уровень, и т.д.
  organizerId?: UUID;       // Если создана организатором
  isCustom: boolean;        // true если кастомная
  status: EntityStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Иерархия категорий

Категории организованы в древовидную структуру. Примеры:

```
Медицина (root, level 0)
├── Обезболивающие (level 1)
│   ├── Нурофен (level 2)
│   ├── Парацетамол (level 2)
│   └── Аспирин (level 2)
├── Антибиотики (level 1)
└── Перевязочные материалы (level 1)

Еда (root, level 0)
├── Консервы (level 1)
│   ├── Мясные (level 2)
│   └── Рыбные (level 2)
├── Крупы (level 1)
└── Напитки (level 1)
```

### CategoryHierarchy

Рекурсивная структура для представления дерева категорий:

```typescript
interface CategoryHierarchy {
  category: ItemCategory;
  children: CategoryHierarchy[];
}
```

### CategoryPath

Путь категории от корня до текущей:

```typescript
interface CategoryPath {
  categoryId: UUID;
  path: string[];              // ['Медицина', 'Обезболивающие', 'Нурофен']
  fullPath: ItemCategory[];    // Полная цепочка объектов
}
```

### Предопределенные корневые категории

```typescript
const DEFAULT_ROOT_CATEGORIES = [
  'Medicine',   // Медицина
  'Food',       // Еда
  'Clothing',   // Одежда
  'Hygiene',    // Гигиена
  'Other'       // Прочее
] as const;
```

### Создание категории

#### CreateItemCategoryRequest

```typescript
interface CreateItemCategoryRequest {
  name: string;
  description?: string;
  parentId: UUID | null;
}
```

**Пример (корневая категория):**
```json
{
  "name": "Бытовая техника",
  "description": "Техника для дома",
  "parentId": null
}
```

**Пример (подкатегория):**
```json
{
  "name": "Кухонная техника",
  "description": "Техника для кухни",
  "parentId": "household-appliances-uuid"
}
```

### Получение иерархии

#### GetCategoryHierarchyRequest

```typescript
interface GetCategoryHierarchyRequest {
  rootId?: UUID | null;    // Начальная категория
  organizerId?: UUID;      // Включить кастомные категории
  maxDepth?: number;       // Максимальная глубина
}
```

### Поиск категорий

#### SearchCategoriesRequest

```typescript
interface SearchCategoriesRequest {
  query: string;
  organizerId?: UUID;
  includeCustom?: boolean;
  limit?: number;
}
```

#### SearchCategoriesResponse

```typescript
interface SearchCategoriesResponse {
  results: Array<{
    category: ItemCategory;
    path: string[];
    relevanceScore: number;
  }>;
  totalFound: number;
}
```

### Удаление категории

При удалении категории нужно решить, что делать с дочерними категориями и ссылками на нее:

```typescript
interface DeleteItemCategoryRequest {
  categoryId: UUID;
  handleChildren: 
    | 'move_to_parent'           // Переместить к родителю
    | 'delete_cascade'           // Удалить каскадно
    | 'reject_if_has_children';  // Отклонить если есть дети
  handleReferences: 
    | 'move_to_parent'           // Заменить ссылки на родителя
    | 'delete_cascade'           // Удалить записи со ссылками
    | 'reject_if_referenced';    // Отклонить если есть ссылки
}
```

### Статистика категорий

#### CategoryUsageStatistics

```typescript
interface CategoryUsageStatistics {
  categoryId: UUID;
  categoryName: string;
  categoryPath: string[];
  
  // Использование в функциях
  usedInCollectionPoints: number;
  usedInDistributionPoints: number;
  
  // Отклики
  volunteerResponsesCount: number;
  totalQuantityOffered: number;
  
  // Временная статистика
  usageLastWeek: number;
  usageLastMonth: number;
  
  // Популярность
  popularityScore: number;
}
```

### Массовое создание

#### BulkCreateCategoriesRequest

```typescript
interface BulkCreateCategoriesRequest {
  categories: Array<{
    name: string;
    description?: string;
    parentId: UUID | null;
  }>;
}
```

**Пример:**
```json
{
  "categories": [
    {
      "name": "Обезболивающие",
      "parentId": "medicine-uuid"
    },
    {
      "name": "Нурофен",
      "parentId": "painkillers-uuid"
    },
    {
      "name": "Парацетамол",
      "parentId": "painkillers-uuid"
    }
  ]
}
```

### API Endpoints

```typescript
type ItemCategoryEndpoints = {
  'POST /item-categories': { request: CreateItemCategoryRequest; response: ApiResponse<CreateItemCategoryResponse> };
  'POST /item-categories/bulk': { request: BulkCreateCategoriesRequest; response: ApiResponse<BulkCreateCategoriesResponse> };
  'GET /item-categories': { request: GetItemCategoriesRequest; response: ApiResponse<GetItemCategoriesResponse> };
  'GET /item-categories/hierarchy': { request: GetCategoryHierarchyRequest; response: ApiResponse<GetCategoryHierarchyResponse> };
  'GET /item-categories/search': { request: SearchCategoriesRequest; response: ApiResponse<SearchCategoriesResponse> };
  'GET /item-categories/:id': { request: GetItemCategoryRequest; response: ApiResponse<GetItemCategoryResponse> };
  'GET /item-categories/:id/statistics': { request: { categoryId: UUID }; response: ApiResponse<CategoryUsageStatistics> };
  'PATCH /item-categories/:id': { request: UpdateItemCategoryRequest; response: ApiResponse<UpdateItemCategoryResponse> };
  'DELETE /item-categories/:id': { request: DeleteItemCategoryRequest; response: ApiResponse<DeleteItemCategoryResponse> };
};
```

---

## Утилиты (utils.ts)

### Создание ответов

#### createSuccessResponse

```typescript
function createSuccessResponse<T>(data: T): ApiSuccessResponse<T>
```

**Пример:**
```typescript
const response = createSuccessResponse({ 
  user: { id: '123', name: 'John' } 
});
// { success: true, data: { user: ... }, timestamp: "..." }
```

#### createErrorResponse

```typescript
function createErrorResponse(
  code: ErrorCode | string,
  message: string,
  details?: Record<string, unknown>
): ApiErrorResponse
```

**Пример:**
```typescript
const response = createErrorResponse(
  ErrorCode.VALIDATION_ERROR,
  'Invalid email format',
  { field: 'email', value: 'invalid' }
);
```

### Проверка типов ответов

#### isSuccessResponse

```typescript
function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T>
```

**Пример:**
```typescript
if (isSuccessResponse(response)) {
  console.log(response.data);  // TypeScript знает, что это success response
} else {
  console.error(response.error); // TypeScript знает, что это error response
}
```

### Извлечение данных

#### unwrapResponse

```typescript
function unwrapResponse<T>(response: ApiResponse<T>): T
```

Извлекает данные из успешного ответа или выбрасывает `ApiError`:

**Пример:**
```typescript
try {
  const user = unwrapResponse(response);
  console.log('User:', user);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.code, error.message);
  }
}
```

#### unwrapResponseOr

```typescript
function unwrapResponseOr<T>(
  response: ApiResponse<T>,
  defaultValue: T
): T
```

Извлекает данные или возвращает значение по умолчанию:

**Пример:**
```typescript
const user = unwrapResponseOr(response, { id: 'unknown', name: 'Guest' });
```

### ApiError

Класс ошибки для работы с API ответами:

```typescript
class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>
  )
  
  static fromResponse(response: ApiErrorResponse): ApiError
}
```

**Пример:**
```typescript
if (isErrorResponse(response)) {
  throw ApiError.fromResponse(response);
}
```

### Валидация

#### isValidUUID

```typescript
function isValidUUID(str: string): boolean
```

#### isValidTimestamp

```typescript
function isValidTimestamp(str: string): boolean
```

#### isValidCoordinates

```typescript
function isValidCoordinates(lat: number, lng: number): boolean
```

### Преобразование данных

#### dateToTimestamp / timestampToDate

```typescript
function dateToTimestamp(date: Date): string
function timestampToDate(timestamp: string): Date
```

#### createQueryString

```typescript
function createQueryString(params: Record<string, unknown>): string
```

**Пример:**
```typescript
const query = createQueryString({
  page: 1,
  limit: 10,
  type: 'distribution_hub',
  tags: ['food', 'medicine']
});
// "page=1&limit=10&type=distribution_hub&tags=food&tags=medicine"
```

### ApiClient

Базовый класс для типобезопасных API вызовов:

```typescript
class ApiClient {
  constructor(options: ApiClientOptions)
  
  get<TResponse>(path: string, params?: Record<string, unknown>): Promise<ApiResponse<TResponse>>
  post<TRequest, TResponse>(path: string, body: TRequest): Promise<ApiResponse<TResponse>>
  patch<TRequest, TResponse>(path: string, body: TRequest): Promise<ApiResponse<TResponse>>
  delete<TResponse>(path: string): Promise<ApiResponse<TResponse>>
}
```

**Пример:**
```typescript
const client = new ApiClient({
  baseUrl: 'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token'),
  onError: (error) => {
    if (error.error.code === 'UNAUTHORIZED') {
      window.location.href = '/login';
    }
  }
});

// Использование
const response = await client.post<LoginRequest, LoginResponse>(
  '/auth/login',
  { email: 'user@example.com', password: 'pass123' }
);
```

---

## Примеры использования

### Пример 1: Регистрация и вход

```typescript
import { ApiClient, isSuccessResponse } from '@/contracts/utils';
import type { RegisterRequest, LoginRequest } from '@/contracts';

const client = new ApiClient({
  baseUrl: '/api',
  getToken: () => localStorage.getItem('token')
});

// Регистрация
const registerData: RegisterRequest = {
  email: 'organizer@example.com',
  password: 'secure123',
  name: 'John Organizer',
  role: 'organizer',
  phone: '+357 99 123 456'
};

const registerResponse = await client.post('/auth/register', registerData);

if (isSuccessResponse(registerResponse)) {
  localStorage.setItem('token', registerResponse.data.accessToken);
  console.log('Registered:', registerResponse.data.user.name);
}

// Вход
const loginData: LoginRequest = {
  email: 'organizer@example.com',
  password: 'secure123'
};

const loginResponse = await client.post('/auth/login', loginData);

if (isSuccessResponse(loginResponse)) {
  localStorage.setItem('token', loginResponse.data.accessToken);
  console.log('Logged in:', loginResponse.data.user.name);
}
```

### Пример 2: Создание площадки с функциями

```typescript
import type { 
  CreateVenueRequest, 
  CreateCollectionPointRequest,
  CreateDistributionPointRequest 
} from '@/contracts';

// 1. Создаем площадку
const venueData: CreateVenueRequest = {
  title: 'Центральный пункт помощи',
  description: 'Основной пункт сбора и раздачи',
  type: 'distribution_hub',
  location: {
    lat: 34.6756,
    lng: 33.0431,
    address: 'ул. Ленина 123, Лимассол'
  },
  operatingHours: [
    { dayOfWeek: 'monday', openTime: '09:00', closeTime: '17:00', isClosed: false },
    { dayOfWeek: 'tuesday', openTime: '09:00', closeTime: '17:00', isClosed: false }
  ]
};

const venueResponse = await client.post('/venues', venueData);
const venue = unwrapResponse(venueResponse);

// 2. Добавляем функцию сбора
const collectionData: CreateCollectionPointRequest = {
  venueId: venue.id,
  type: 'collection_point',
  items: [
    {
      categoryId: 'medicine-uuid',
      categoryPath: ['Медицина', 'Обезболивающие'],
      quantity: 'a_lot'
    },
    {
      categoryId: 'food-uuid',
      categoryPath: ['Еда', 'Консервы'],
      quantity: 'some'
    }
  ],
  openingTimes: [
    { dayOfWeek: 'monday', openTime: '10:00', closeTime: '16:00', isClosed: false }
  ]
};

const collectionResponse = await client.post('/venue-functions', collectionData);
console.log('Collection point created:', collectionResponse.data);

// 3. Добавляем функцию раздачи
const distributionData: CreateDistributionPointRequest = {
  venueId: venue.id,
  type: 'distribution_point',
  items: [
    {
      categoryId: 'food-uuid',
      categoryPath: ['Еда', 'Консервы'],
      quantity: 'few'
    }
  ],
  openingTimes: [
    { dayOfWeek: 'wednesday', openTime: '14:00', closeTime: '18:00', isClosed: false }
  ]
};

const distributionResponse = await client.post('/venue-functions', distributionData);
console.log('Distribution point created:', distributionResponse.data);
```

### Пример 3: Волонтер откликается

```typescript
import type { CreateVolunteerResponseRequest } from '@/contracts';

// Отклик на потребность в предметах
const responseData: CreateVolunteerResponseRequest = {
  venueId: 'venue-123',
  functionId: 'collection-456',
  responseType: 'item',
  categoryId: 'medicine-uuid',
  quantityOffered: 50,
  message: 'У меня есть 50 упаковок',
  deliveryDate: new Date(Date.now() + 86400000).toISOString() // Tomorrow
};

const response = await client.post('/volunteer-responses', responseData);

if (isSuccessResponse(response)) {
  console.log('Response created:', response.data.response.id);
  console.log('Status:', response.data.response.status); // 'pending'
}
```

### Пример 4: Бенефициар записывается на раздачу

```typescript
import type { CreateBeneficiaryCommitmentRequest } from '@/contracts';

const commitmentData: CreateBeneficiaryCommitmentRequest = {
  venueId: 'venue-123',
  functionId: 'distribution-789',
  plannedVisitDate: new Date(Date.now() + 172800000).toISOString(), // 2 days
  numberOfPeople: 4,
  specialNeeds: ['wheelchair_access', 'baby_supplies'],
  notes: 'Придем около 14:00'
};

const response = await client.post('/beneficiary-commitments', commitmentData);

if (isSuccessResponse(response)) {
  console.log('Commitment created:', response.data.commitment.id);
}
```

### Пример 5: Организатор получает проекцию

```typescript
import type { GetVenueProjectionRequest } from '@/contracts';

// Получить полную картину по площадке
const projectionResponse = await client.get(
  '/projections/venue/venue-123',
  { functionId: 'collection-456' } // опционально
);

if (isSuccessResponse(projectionResponse)) {
  const projection = projectionResponse.data.projection;
  
  console.log(`Площадка: ${projection.venueName}`);
  
  // Предметы
  projection.items.forEach(item => {
    console.log(`\n${item.categoryPath.join(' > ')}`);
    console.log(`  Статус: ${item.currentStatus}`);
    console.log(`  Откликов: ${item.responseCount}`);
    console.log(`  Предложено: ${item.totalQuantityOffered}`);
    console.log(`  Ожидают: ${item.pendingResponses}`);
    console.log(`  Подтверждено: ${item.confirmedResponses}`);
  });
  
  // Услуги
  projection.services.forEach(service => {
    console.log(`\n${service.serviceType}`);
    console.log(`  Статус: ${service.currentStatus}`);
    console.log(`  Волонтеров: ${service.responseCount}`);
    service.respondingVolunteers.forEach(v => {
      console.log(`    - ${v.name}: ${v.message || 'без сообщения'}`);
    });
  });
  
  console.log(`\nБенефициаров записалось: ${projection.beneficiaryCommitments}`);
}
```

### Пример 6: Работа с категориями

```typescript
import type { 
  CreateItemCategoryRequest,
  GetCategoryHierarchyRequest 
} from '@/contracts';

// Создать категорию
const categoryData: CreateItemCategoryRequest = {
  name: 'Детское питание',
  description: 'Питание для детей до 3 лет',
  parentId: 'food-uuid'
};

const categoryResponse = await client.post('/item-categories', categoryData);
const category = unwrapResponse(categoryResponse);
console.log('Category path:', category.path); // ['Еда', 'Детское питание']

// Получить иерархию
const hierarchyResponse = await client.get('/item-categories/hierarchy', {
  rootId: null,  // все корневые
  maxDepth: 3
});

if (isSuccessResponse(hierarchyResponse)) {
  const hierarchy = hierarchyResponse.data.hierarchy;
  
  function printTree(nodes: CategoryHierarchy[], indent = '') {
    nodes.forEach(node => {
      console.log(`${indent}${node.category.name}`);
      if (node.children.length > 0) {
        printTree(node.children, indent + '  ');
      }
    });
  }
  
  printTree(hierarchy);
}

// Поиск категорий
const searchResponse = await client.get('/item-categories/search', {
  query: 'обезболивающ',
  limit: 10
});

if (isSuccessResponse(searchResponse)) {
  searchResponse.data.results.forEach(result => {
    console.log(
      `${result.category.name} (${result.path.join(' > ')})`,
      `- relevance: ${result.relevanceScore}`
    );
  });
}
```

### Пример 7: React Hook

```typescript
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
        : new ApiError('INTERNAL_ERROR', 'Unexpected error');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { loading, error, data, execute, reset };
}

// Использование в компоненте
import { useApi } from '@/hooks/useApi';
import type { GetVenuesRequest, GetVenuesResponse } from '@/contracts';

function VenuesList() {
  const { loading, error, data, execute } = useApi<never, GetVenuesResponse>();

  useEffect(() => {
    const params: GetVenuesRequest = {
      page: 1,
      limit: 10,
      type: 'distribution_hub'
    };
    
    const query = new URLSearchParams(params as any).toString();
    execute(`/api/venues?${query}`, 'GET');
  }, [execute]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      <h1>Площадки ({data.pagination.totalItems})</h1>
      {data.items.map(venue => (
        <div key={venue.id}>
          <h2>{venue.title}</h2>
          <p>{venue.description}</p>
          <p>{venue.location.address}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Лучшие практики

### 1. Всегда проверяйте success

```typescript
const response = await client.get('/venues');

if (isSuccessResponse(response)) {
  // Работаем с данными
  const venues = response.data.items;
} else {
  // Обрабатываем ошибку
  console.error(response.error.code, response.error.message);
}
```

### 2. Используйте unwrapResponse для простоты

```typescript
try {
  const venues = unwrapResponse(await client.get('/venues'));
  // Работаем с venues
} catch (error) {
  if (error instanceof ApiError) {
    // Обрабатываем API ошибку
  }
}
```

### 3. Типизируйте все вызовы

```typescript
// Хорошо
const response = await client.post<LoginRequest, LoginResponse>(
  '/auth/login',
  { email, password }
);

// Плохо
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### 4. Используйте ApiClient

```typescript
// Создайте один экземпляр и переиспользуйте
const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  getToken: () => localStorage.getItem('token'),
  onError: (error) => {
    if (error.error.code === 'UNAUTHORIZED') {
      // Redirect to login
      router.push('/login');
    }
  }
});

export { apiClient };
```

### 5. Обрабатывайте ошибки централизованно

```typescript
function handleApiError(error: ApiError) {
  switch (error.code) {
    case ErrorCode.UNAUTHORIZED:
      router.push('/login');
      break;
    case ErrorCode.FORBIDDEN:
      toast.error('У вас нет доступа к этому ресурсу');
      break;
    case ErrorCode.VALIDATION_ERROR:
      // Показать ошибки валидации
      if (error.details?.fields) {
        Object.entries(error.details.fields).forEach(([field, msg]) => {
          toast.error(`${field}: ${msg}`);
        });
      }
      break;
    default:
      toast.error(error.message);
  }
}
```

---

## Миграция с существующих типов

Если у вас уже есть типы в `/types`, мигрируйте постепенно:

1. **Импортируйте новые типы:**
```typescript
// Старое
import type { Venue } from '@/types/venue';

// Новое
import type { Venue } from '@/contracts';
```

2. **Обновите API вызовы:**
```typescript
// Старое
const response = await fetch('/api/venues');
const venues = await response.json();

// Новое
const response = await apiClient.get<GetVenuesResponse>('/venues');
if (isSuccessResponse(response)) {
  const venues = response.data.items;
}
```

3. **Удалите старые типы после миграции модуля**

---

## Заключение

Контракты обеспечивают:
- ✅ Типобезопасность между фронтом и бэком
- ✅ Единый формат всех API ответов
- ✅ Четкую документацию всех эндпоинтов
- ✅ Простоту использования с утилитами
- ✅ Легкую расширяемость

Используйте их последовательно во всем проекте для максимальной эффективности.


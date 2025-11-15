# Аутентификация и пользователи

API для регистрации, входа и управления профилем пользователя.

## Endpoints

- [POST /auth/register](#post-authregister) - Регистрация
- [POST /auth/login](#post-authlogin) - Вход
- [POST /auth/logout](#post-authlogout) - Выход
- [GET /auth/me](#get-authme) - Получить текущего пользователя
- [POST /auth/refresh](#post-authrefresh) - Обновить токен

---

## POST /auth/register

Регистрация нового пользователя в системе.

### Request

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "email": "organizer@example.com",
  "password": "securePassword123",
  "name": "Иван Петров",
  "role": "organizer",
  "phone": "+357 99 123 456"
}
```

**Поля:**

- `email` (string, required) - Email пользователя
- `password` (string, required) - Пароль (минимум 8 символов)
- `name` (string, required) - Полное имя пользователя
- `role` (string, required) - Роль: `organizer`, `volunteer`, `beneficiary`
- `phone` (string, optional) - Телефон в международном формате

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123e4567-e89b-12d3-a456-426614174000",
      "email": "organizer@example.com",
      "name": "Иван Петров",
      "role": "organizer",
      "phone": "+357 99 123 456",
      "isActive": true,
      "isEmailVerified": false,
      "createdAt": "2024-11-15T10:30:00.000Z",
      "updatedAt": "2024-11-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

**Error (409 - Already Exists):**

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_EXISTS",
    "message": "Пользователь с таким email уже существует",
    "details": {
      "field": "email",
      "value": "organizer@example.com"
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Примеры

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@example.com",
    "password": "securePassword123",
    "name": "Иван Петров",
    "role": "organizer",
    "phone": "+357 99 123 456"
  }'
```

**JavaScript:**

```javascript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "organizer@example.com",
    password: "securePassword123",
    name: "Иван Петров",
    role: "organizer",
    phone: "+357 99 123 456",
  }),
})

const data = await response.json()
if (data.success) {
  localStorage.setItem("accessToken", data.data.accessToken)
  console.log("Зарегистрирован:", data.data.user)
}
```

---

## POST /auth/login

Вход в систему с получением JWT токенов.

### Request

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "email": "volunteer@example.com",
  "password": "password123"
}
```

**Поля:**

- `email` (string, required) - Email пользователя
- `password` (string, required) - Пароль

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123e4567-e89b-12d3-a456-426614174000",
      "email": "volunteer@example.com",
      "name": "Мария Иванова",
      "role": "volunteer",
      "phone": "+357 99 234 567",
      "isActive": true,
      "isEmailVerified": true,
      "createdAt": "2024-10-01T08:00:00.000Z",
      "updatedAt": "2024-11-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

**Error (401 - Unauthorized):**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Неверный email или пароль"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Примеры

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "volunteer@example.com",
    "password": "password123"
  }'
```

**JavaScript:**

```javascript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "volunteer@example.com",
    password: "password123",
  }),
})

const data = await response.json()
if (data.success) {
  localStorage.setItem("accessToken", data.data.accessToken)
  localStorage.setItem("refreshToken", data.data.refreshToken)
}
```

---

## POST /auth/logout

Выход из системы. Делает refresh токен недействительным.

### Request

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**

```json
{}
```

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "message": "Вы успешно вышли из системы"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Примеры

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json"
```

**JavaScript:**

```javascript
await fetch("/api/auth/logout", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",
  },
})

localStorage.removeItem("accessToken")
localStorage.removeItem("refreshToken")
```

---

## GET /auth/me

Получить информацию о текущем авторизованном пользователе.

### Request

**Headers:**

```http
Authorization: Bearer <access_token>
```

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "id": "user-123e4567-e89b-12d3-a456-426614174000",
    "email": "organizer@example.com",
    "name": "Иван Петров",
    "role": "organizer",
    "phone": "+357 99 123 456",
    "organizerId": "org-123e4567-e89b-12d3-a456-426614174000",
    "isActive": true,
    "isEmailVerified": true,
    "createdAt": "2024-10-01T08:00:00.000Z",
    "updatedAt": "2024-11-15T10:30:00.000Z"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

**Error (401 - Unauthorized):**

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Токен не предоставлен или истек"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Примеры

**cURL:**

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

**JavaScript:**

```javascript
const response = await fetch("/api/auth/me", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
})

const data = await response.json()
if (data.success) {
  console.log("Текущий пользователь:", data.data)
}
```

---

## POST /auth/refresh

Обновить access токен используя refresh токен.

### Request

**Headers:**

```http
Content-Type: application/json
```

**Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Поля:**

- `refreshToken` (string, required) - Refresh токен

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

**Error (401 - Token Expired):**

```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Refresh токен истек, необходимо войти заново"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Примеры

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**JavaScript:**

```javascript
const response = await fetch("/api/auth/refresh", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    refreshToken: localStorage.getItem("refreshToken"),
  }),
})

const data = await response.json()
if (data.success) {
  localStorage.setItem("accessToken", data.data.accessToken)
  localStorage.setItem("refreshToken", data.data.refreshToken)
}
```

---

## Типы данных

### User

```typescript
{
  id: string;              // UUID
  email: string;
  name: string;
  role: 'organizer' | 'volunteer' | 'beneficiary' | 'admin';
  phone?: string;
  organizerId?: string;    // Только для организаторов
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}
```

### Роли пользователей

- **organizer** - Организатор, создает и управляет площадками
- **volunteer** - Волонтер, откликается на потребности
- **beneficiary** - Бенефициар, получает помощь
- **admin** - Администратор системы

---

## Ошибки

### Общие ошибки

- `VALIDATION_ERROR` (400) - Ошибка валидации данных
- `UNAUTHORIZED` (401) - Не авторизован или токен истек
- `ALREADY_EXISTS` (409) - Пользователь уже существует
- `INTERNAL_ERROR` (500) - Внутренняя ошибка сервера

### Примеры ошибок валидации

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Ошибка валидации данных",
    "details": {
      "email": "Неверный формат email",
      "password": "Пароль должен содержать минимум 8 символов"
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

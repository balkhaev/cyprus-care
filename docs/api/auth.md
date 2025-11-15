# Authentication and Users

API for user registration, login, and profile management.

## Endpoints

- [POST /auth/register](#post-authregister) - Register
- [POST /auth/login](#post-authlogin) - Login
- [POST /auth/logout](#post-authlogout) - Logout
- [GET /auth/me](#get-authme) - Get current user
- [POST /auth/refresh](#post-authrefresh) - Refresh token

---

## POST /auth/register

Register a new user in the system.

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
  "first_name": "John",
  "last_name": "Doe",
  "role": "organizer",
  "phone": "+357 99 123 456",
  "municipality": "Limassol",
  "is_organization": false,
  "organization_name": ""
}
```

**Fields:**

- `email` (string, required) - User email
- `password` (string, required) - Password (minimum 8 characters)
- `first_name` (string, required) - First name
- `last_name` (string, required) - Last name
- `role` (string, required) - Role: `organizer`, `volunteer`, `beneficiary`
- `phone` (string, required) - Phone number in international format
- `municipality` (string, required) - Municipality/city
- `is_organization` (boolean, optional) - Whether user represents an organization
- `organization_name` (string, optional) - Organization name if applicable
- `volunteer_areas_of_interest` (string, optional) - Areas of interest (for volunteers)
- `volunteer_services` (string, optional) - Services offered (for volunteers)
- `interested_in_donations` (boolean, optional) - Interest in donations (for beneficiaries)
- `association_name` (string, optional) - Association name (for beneficiaries)

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "organizer@example.com",
      "role": "organizer",
      "phone": "+357 99 123 456",
      "municipality": "Limassol",
      "is_organization": false,
      "organization_name": "",
      "volunteer_areas_of_interest": "",
      "volunteer_services": "",
      "interested_in_donations": false,
      "association_name": ""
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
    "message": "User with this email already exists",
    "details": {
      "field": "email",
      "value": "organizer@example.com"
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Examples

**cURL:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@example.com",
    "password": "securePassword123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "organizer",
    "phone": "+357 99 123 456",
    "municipality": "Limassol",
    "is_organization": false
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
    first_name: "John",
    last_name: "Doe",
    role: "organizer",
    phone: "+357 99 123 456",
    municipality: "Limassol",
    is_organization: false,
    organization_name: "",
  }),
})

const data = await response.json()
if (data.success) {
  localStorage.setItem("accessToken", data.data.accessToken)
  console.log("Registered:", data.data.user)
}
```

---

## POST /auth/login

Login to the system and receive JWT tokens.

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

**Fields:**

- `email` (string, required) - User email
- `password` (string, required) - Password

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "volunteer@example.com",
      "role": "volunteer",
      "phone": "+357 99 234 567",
      "municipality": "Nicosia",
      "is_organization": false,
      "organization_name": "",
      "volunteer_areas_of_interest": "Education,Healthcare",
      "volunteer_services": "Teaching,Medical assistance",
      "interested_in_donations": false,
      "association_name": ""
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
    "message": "Invalid email or password"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Examples

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

Logout from the system. Invalidates the refresh token.

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
    "message": "Successfully logged out"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Examples

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

Get information about the currently authenticated user.

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
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "organizer@example.com",
    "role": "organizer",
    "phone": "+357 99 123 456",
    "municipality": "Limassol",
    "is_organization": false,
    "organization_name": "",
    "volunteer_areas_of_interest": "",
    "volunteer_services": "",
    "interested_in_donations": false,
    "association_name": ""
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
    "message": "Token not provided or expired"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Examples

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
  console.log("Current user:", data.data)
}
```

---

## POST /auth/refresh

Refresh the access token using a refresh token.

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

**Fields:**

- `refreshToken` (string, required) - Refresh token

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
    "message": "Refresh token expired, please login again"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Examples

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

## Data Types

### User

```typescript
{
  id: number // Numeric ID
  first_name: string
  last_name: string
  email: string
  role: "organizer" | "volunteer" | "beneficiary" | "admin"
  phone: string
  municipality: string // City/municipality

  // Organization fields
  is_organization: boolean
  organization_name: string

  // Volunteer-specific fields
  volunteer_areas_of_interest: string // Comma-separated or JSON
  volunteer_services: string // Comma-separated or JSON

  // Beneficiary-specific fields
  interested_in_donations: boolean
  association_name: string
}
```

### User Roles

- **organizer** - Organizer, creates and manages venues
- **volunteer** - Volunteer, responds to needs
- **beneficiary** - Beneficiary, receives assistance
- **admin** - System administrator

---

## Errors

### Common Errors

- `VALIDATION_ERROR` (400) - Data validation error
- `UNAUTHORIZED` (401) - Not authorized or token expired
- `ALREADY_EXISTS` (409) - User already exists
- `INTERNAL_ERROR` (500) - Internal server error

### Validation Error Examples

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data validation error",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

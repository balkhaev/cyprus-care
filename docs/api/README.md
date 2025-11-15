# API Documentation

Complete documentation for all Care Hub API endpoints.

## 📚 Table of Contents

### Authentication

- [Authentication and Users](./auth.md) - Registration, login, profile management

### Venues

- [Venues](./venues.md) - CRUD operations for venues
- [Venue Functions](./venue-functions.md) - Venue function management

### Categories and Data

- [Item Categories](./item-categories.md) - Category hierarchy

### Responses and Commitments

- [Volunteer Responses](./volunteer-responses.md) - Volunteer response management
- [Beneficiary Commitments](./beneficiary-commitments.md) - Commitment management

### Analytics

- [Projections and Statuses](./projections.md) - Analytics and need statuses

## 🔑 General Information

### Base URL

```
Production: https://api.carehub.cy
Development: http://localhost:3000/api
```

### Authentication

All protected endpoints require a JWT token in the header:

```http
Authorization: Bearer <access_token>
```

### Response Format

All endpoints return JSON in a unified format:

**Success Response:**

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### HTTP Status Codes

| Code | Description                            |
| --- | -------------------------------------- |
| 200 | OK - Successful request                |
| 201 | Created - Resource created             |
| 400 | Bad Request - Validation error         |
| 401 | Unauthorized - Not authorized          |
| 403 | Forbidden - Access denied              |
| 404 | Not Found - Resource not found         |
| 409 | Conflict - Data conflict               |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error   |

### Error Codes

| Code                   | HTTP | Description           |
| --------------------- | ---- | ------------------------- |
| `INTERNAL_ERROR`      | 500  | Internal server error     |
| `VALIDATION_ERROR`    | 400  | Validation error          |
| `UNAUTHORIZED`        | 401  | Not authorized            |
| `FORBIDDEN`           | 403  | Access denied             |
| `NOT_FOUND`           | 404  | Resource not found        |
| `ALREADY_EXISTS`      | 409  | Resource already exists   |
| `RATE_LIMIT_EXCEEDED` | 429  | Rate limit exceeded       |

### Pagination

Lists use pagination:

**Query Parameters:**

- `page` - page number (starting from 1)
- `limit` - items per page

**Response:**

```json
{
  "items": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 47,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 🚀 Quick Start

### 1. Register

```bash
curl -X POST https://api.carehub.cy/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "organizer"
  }'
```

### 2. Login

```bash
curl -X POST https://api.carehub.cy/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 3. Use Token

```bash
curl -X GET https://api.carehub.cy/auth/me \
  -H "Authorization: Bearer <access_token>"
```

## 📝 Notes

- All dates in ISO 8601 format: `2024-11-15T10:30:00.000Z`
- All IDs in UUID format: `123e4567-e89b-12d3-a456-426614174000`
- Coordinates: `lat` (latitude -90 to 90), `lng` (longitude -180 to 180)

## 🔗 Additional Resources

- [TypeScript Contracts](../../contracts/) - Types for TypeScript
- [JSON Examples](../../contracts/api-responses.json) - Complete response examples
- [Postman Collection](#) - Import into Postman (TODO)

---

**API Version:** 1.0.0  
**Last Updated:** 2024-11-15

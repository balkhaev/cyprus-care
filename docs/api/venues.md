# Venues

API for managing collection and distribution venues.

## Endpoints

- [POST /venues](#post-venues) - Create venue
- [GET /venues](#get-venues) - Get venue list
- [GET /venues/:id](#get-venuesid) - Get venue by ID
- [PATCH /venues/:id](#patch-venuesid) - Update venue
- [DELETE /venues/:id](#delete-venuesid) - Delete venue

---

## POST /venues

Create a new venue.

**Authorization Required:** Yes (role: `organizer`)

### Request

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body:**

```json
{
  "title": "Central Aid Hub",
  "description": "Main collection and distribution point for humanitarian aid in Limassol",
  "type": "distribution_hub",
  "location": {
    "lat": 34.6756,
    "lng": 33.0431,
    "address": "123 Lenin Street, Limassol, Cyprus",
    "city": "Limassol",
    "country": "Cyprus",
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
  ]
}
```

**Fields:**

- `title` (string, required) - Venue name (3-100 characters)
- `description` (string, required) - Description (10-500 characters)
- `type` (string, required) - Type: `collection_point`, `distribution_hub`, `shelter`
- `location` (object, required) - Location
  - `lat` (number, required) - Latitude (-90 to 90)
  - `lng` (number, required) - Longitude (-180 to 180)
  - `address` (string, required) - Full address
  - `city` (string, optional) - City
  - `country` (string, optional) - Country
  - `postalCode` (string, optional) - Postal code
- `operatingHours` (array, required) - Operating hours
  - `dayOfWeek` (string) - Day of week: `monday`, `tuesday`, etc.
  - `openTime` (string) - Opening time (HH:MM)
  - `closeTime` (string) - Closing time (HH:MM)
  - `isClosed` (boolean) - Closed on this day
- `contactInfo` (object, optional) - Contact information
  - `phone` (string, optional) - Phone
  - `email` (string, optional) - Email
  - `website` (string, optional) - Website

### Response

**Success (201):**

```json
{
  "success": true,
  "data": {
    "venue": {
      "id": "venue-123e4567-e89b-12d3-a456-426614174000",
      "title": "Central Aid Hub",
      "description": "Main collection and distribution point for humanitarian aid in Limassol",
      "type": "distribution_hub",
      "location": {
        "lat": 34.6756,
        "lng": 33.0431,
        "address": "123 Lenin Street, Limassol, Cyprus",
        "city": "Limassol",
        "country": "Cyprus",
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
    "message": "Data validation error",
    "details": {
      "title": "Title must be at least 3 characters",
      "location.lat": "Latitude must be between -90 and 90"
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Examples

**cURL:**

```bash
curl -X POST http://localhost:3000/api/venues \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "title": "Central Aid Hub",
  "description": "Main collection and distribution point",
  "type": "distribution_hub",
  "location": {
    "lat": 34.6756,
    "lng": 33.0431,
    "address": "123 Lenin Street, Limassol, Cyprus"
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

Get a list of venues with pagination and filtering.

**Authorization Required:** No

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
&searchQuery=aid
&sortBy=createdAt
&sortOrder=desc
```

**Parameters:**

- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10, max: 100)
- `type` (string, optional) - Filter by type
- `status` (string, optional) - Filter by status: `active`, `inactive`, `archived`
- `searchQuery` (string, optional) - Search by title/description/address
- `sortBy` (string, optional) - Sort field: `createdAt`, `title`
- `sortOrder` (string, optional) - Sort direction: `asc`, `desc`

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "venue-123e4567-e89b-12d3-a456-426614174000",
        "title": "Central Aid Hub",
        "description": "Main collection and distribution point",
        "type": "distribution_hub",
        "location": {
          "lat": 34.6756,
          "lng": 33.0431,
          "address": "123 Lenin Street, Limassol, Cyprus",
          "city": "Limassol",
          "country": "Cyprus"
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

### Examples

**cURL:**

```bash
curl -X GET "http://localhost:3000/api/venues?page=1&limit=10&type=distribution_hub"
```

**JavaScript:**

```javascript
const params = new URLSearchParams({
  page: "1",
  limit: "10",
  type: "distribution_hub",
  status: "active",
})

const response = await fetch(`/api/venues?${params}`)
const data = await response.json()

if (data.success) {
  console.log("Venues:", data.data.items)
  console.log("Total:", data.data.pagination.totalItems)
}
```

---

## GET /venues/:id

Get detailed information about a venue.

**Authorization Required:** No

### Request

**Headers:**

```http
Content-Type: application/json
```

**Path Parameters:**

- `id` (string, required) - Venue UUID

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "venue": {
      "id": "venue-123e4567-e89b-12d3-a456-426614174000",
      "title": "Central Aid Hub",
      "description": "Main collection and distribution point for humanitarian aid in Limassol",
      "type": "distribution_hub",
      "location": {
        "lat": 34.6756,
        "lng": 33.0431,
        "address": "123 Lenin Street, Limassol, Cyprus"
      },
      "operatingHours": [],
      "organizerId": "user-123e4567-e89b-12d3-a456-426614174000",
      "status": "active",
      "functionsCount": 3,
      "imageUrls": ["https://cdn.example.com/venues/venue-123/image1.jpg"],
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
    "message": "Venue not found"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Examples

**cURL:**

```bash
curl -X GET http://localhost:3000/api/venues/venue-123e4567-e89b-12d3-a456-426614174000
```

---

## PATCH /venues/:id

Update venue information.

**Authorization Required:** Yes (role: `organizer`, venue owner)

### Request

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**

- `id` (string, required) - Venue UUID

**Body:**

```json
{
  "title": "Updated Venue Name",
  "description": "New description"
}
```

**Fields:** All fields are optional, send only those you want to update.

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "venue": {
      "id": "venue-123e4567-e89b-12d3-a456-426614174000",
      "title": "Updated Venue Name",
      "description": "New description",
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

Delete a venue.

**Authorization Required:** Yes (role: `organizer`, venue owner)

### Request

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**

- `id` (string, required) - Venue UUID

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "message": "Venue successfully deleted",
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
    "message": "Cannot delete venue with active functions"
  },
  "timestamp": "2024-11-15T11:00:00.000Z"
}
```

---

## Data Types

### VenueType

```typescript
type VenueType =
  | "collection_point" // Collection point
  | "distribution_hub" // Distribution hub
  | "shelter" // Shelter
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
  organizerId: string;           // Owner UUID
  status: 'active' | 'inactive' | 'archived';
  functionsCount: number;        // Number of functions
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

## Errors

- `VALIDATION_ERROR` (400) - Data validation error
- `UNAUTHORIZED` (401) - Not authorized
- `FORBIDDEN` (403) - No permission for this operation
- `NOT_FOUND` (404) - Venue not found
- `OPERATION_NOT_ALLOWED` (403) - Operation not allowed

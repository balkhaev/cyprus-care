# Venue Functions

API for managing venue functions (collection, distribution, services).

## Endpoints

- [POST /venue-functions](#post-venue-functions) - Create function
- [GET /venue-functions](#get-venue-functions) - Get function list
- [GET /venue-functions/:id](#get-venue-functionsid) - Get function by ID
- [PATCH /venue-functions/:id](#patch-venue-functionsid) - Update function
- [DELETE /venue-functions/:id](#delete-venue-functionsid) - Delete function
- [GET /venue-functions/:id/statistics](#get-venue-functionsidstatistics) - Get function statistics

---

## POST /venue-functions

Create a new function for a venue.

**Authorization Required:** Yes (role: `organizer`, venue owner)

### Request

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Body (Collection Point):**

```json
{
  "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
  "type": "collection_point",
  "items": [
    {
      "categoryId": "cat-food-canned",
      "categoryPath": ["Food", "Canned Food"],
      "quantity": "a_lot"
    },
    {
      "categoryId": "cat-clothes-winter",
      "categoryPath": ["Clothes", "Winter Clothes"],
      "quantity": "some"
    }
  ],
  "specialRequests": "Please bring items in clean condition"
}
```

**Body (Distribution Point):**

```json
{
  "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
  "type": "distribution_point",
  "items": [
    {
      "categoryId": "cat-food-canned",
      "categoryPath": ["Food", "Canned Food"],
      "quantity": "few"
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
  "specialRequests": "Priority for families with children"
}
```

**Body (Services Needed):**

```json
{
  "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
  "type": "services_needed",
  "services": [
    {
      "serviceName": "Medical Checkup",
      "numberOfVolunteers": 2,
      "description": "Need doctors for basic health checkups"
    },
    {
      "serviceName": "Russian Translation",
      "numberOfVolunteers": 1
    }
  ],
  "specialRequests": "Volunteers should have medical license"
}
```

**Body (Custom Function):**

```json
{
  "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
  "type": "custom",
  "customTypeId": "custom-123e4567-e89b-12d3-a456-426614174000",
  "items": [],
  "services": [],
  "specialRequests": "Custom function description"
}
```

**Common Fields:**

- `venueId` (UUID, required) - Venue ID
- `type` (string, required) - Function type: `collection_point`, `distribution_point`, `services_needed`, `custom`
- `specialRequests` (string, optional) - Special requirements/instructions

**For Collection Point / Distribution Point:**

- `items` (array, required) - List of item categories
  - `categoryId` (UUID) - Category ID
  - `categoryPath` (string[]) - Path in category tree
  - `quantity` (string) - Quantity level: `a_lot`, `some`, `few`

**For Services Needed:**

- `services` (array, required) - List of required services
  - `serviceName` (string) - Service name
  - `numberOfVolunteers` (number) - Number of volunteers needed
  - `description` (string, optional) - Description

**For Custom Function:**

- `customTypeId` (UUID, required) - Custom function type ID
- `items` (array, optional) - List of items
- `services` (array, optional) - List of services
- `openingTimes` (array, optional) - Operating hours

### Response

**Success (201):**

```json
{
  "success": true,
  "data": {
    "function": {
      "id": "func-123e4567-e89b-12d3-a456-426614174000",
      "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
      "type": "collection_point",
      "items": [
        {
          "categoryId": "cat-food-canned",
          "categoryPath": ["Food", "Canned Food"],
          "quantity": "a_lot"
        }
      ],
      "specialRequests": "Please bring items in clean condition",
      "status": "active",
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
      "items": "At least one item is required for collection point",
      "openingTimes": "Opening times are required"
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

**Error (403 - Forbidden):**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not the owner of this venue"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Examples

**cURL (Collection Point):**

```bash
curl -X POST http://localhost:3000/api/venue-functions \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
  "type": "collection_point",
  "items": [
    {
      "categoryId": "cat-food-canned",
      "categoryPath": ["Food", "Canned Food"],
      "quantity": "a_lot"
    }
  ],
  "openingTimes": [
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

**JavaScript:**

```javascript
const response = await fetch("/api/venue-functions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    venueId: "venue-123e4567-e89b-12d3-a456-426614174000",
    type: "collection_point",
    items: [
      {
        categoryId: "cat-food-canned",
        categoryPath: ["Food", "Canned Food"],
        quantity: "a_lot",
      },
    ],
    openingTimes: [
      {
        dayOfWeek: "monday",
        openTime: "09:00",
        closeTime: "17:00",
        isClosed: false,
      },
    ],
  }),
})

const data = await response.json()

if (data.success) {
  console.log("Function created:", data.data.function)
}
```

---

## GET /venue-functions

Get a list of venue functions with pagination and filtering.

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
&venueId=venue-123e4567-e89b-12d3-a456-426614174000
&type=collection_point
&status=active
```

**Parameters:**

- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10, max: 100)
- `venueId` (UUID, optional) - Filter by venue ID
- `type` (string, optional) - Filter by function type
- `status` (string, optional) - Filter by status: `active`, `inactive`, `archived`

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "func-123e4567-e89b-12d3-a456-426614174000",
        "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
        "type": "collection_point",
        "items": [
          {
            "categoryId": "cat-food-canned",
            "categoryPath": ["Food", "Canned Food"],
            "quantity": "a_lot"
          }
        ],
        "openingTimes": [
          {
            "dayOfWeek": "monday",
            "openTime": "09:00",
            "closeTime": "17:00",
            "isClosed": false
          }
        ],
        "status": "active",
        "createdAt": "2024-11-15T10:30:00.000Z",
        "updatedAt": "2024-11-15T10:30:00.000Z"
      },
      {
        "id": "func-223e4567-e89b-12d3-a456-426614174000",
        "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
        "type": "services_needed",
        "services": [
          {
            "serviceId": "srv-medical-general",
            "serviceName": "Medical Checkup",
            "category": "medical",
            "numberOfVolunteers": 2
          }
        ],
        "status": "active",
        "createdAt": "2024-11-15T11:00:00.000Z",
        "updatedAt": "2024-11-15T11:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
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
curl -X GET "http://localhost:3000/api/venue-functions?venueId=venue-123e4567-e89b-12d3-a456-426614174000&type=collection_point"
```

**JavaScript:**

```javascript
const params = new URLSearchParams({
  venueId: "venue-123e4567-e89b-12d3-a456-426614174000",
  type: "collection_point",
  status: "active",
})

const response = await fetch(`/api/venue-functions?${params}`)
const data = await response.json()

if (data.success) {
  console.log("Functions:", data.data.items)
  console.log("Total:", data.data.pagination.totalItems)
}
```

---

## GET /venue-functions/:id

Get detailed information about a function.

**Authorization Required:** No

### Request

**Headers:**

```http
Content-Type: application/json
```

**Path Parameters:**

- `id` (UUID, required) - Function ID

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "function": {
      "id": "func-123e4567-e89b-12d3-a456-426614174000",
      "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
      "type": "collection_point",
      "items": [
        {
          "categoryId": "cat-food-canned",
          "categoryPath": ["Food", "Canned Food"],
          "quantity": "a_lot"
        },
        {
          "categoryId": "cat-clothes-winter",
          "categoryPath": ["Clothes", "Winter Clothes"],
          "quantity": "some"
        }
      ],
      "openingTimes": [
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
      "specialRequests": "Please bring items in clean condition",
      "status": "active",
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
    "message": "Function not found"
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### Examples

**cURL:**

```bash
curl -X GET http://localhost:3000/api/venue-functions/func-123e4567-e89b-12d3-a456-426614174000
```

**JavaScript:**

```javascript
const response = await fetch(
  "/api/venue-functions/func-123e4567-e89b-12d3-a456-426614174000"
)
const data = await response.json()

if (data.success) {
  console.log("Function:", data.data.function)
}
```

---

## PATCH /venue-functions/:id

Update function information.

**Authorization Required:** Yes (role: `organizer`, venue owner)

### Request

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**

- `id` (UUID, required) - Function ID

**Body:**

```json
{
  "items": [
    {
      "categoryId": "cat-food-canned",
      "categoryPath": ["Food", "Canned Food"],
      "quantity": "few"
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
  "specialRequests": "Updated requirements",
  "status": "inactive"
}
```

**Fields:** All fields are optional, send only those you want to update.

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "function": {
      "id": "func-123e4567-e89b-12d3-a456-426614174000",
      "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
      "type": "collection_point",
      "items": [
        {
          "categoryId": "cat-food-canned",
          "categoryPath": ["Food", "Canned Food"],
          "quantity": "few"
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
      "specialRequests": "Updated requirements",
      "status": "inactive",
      "createdAt": "2024-11-15T10:30:00.000Z",
      "updatedAt": "2024-11-15T12:00:00.000Z"
    }
  },
  "timestamp": "2024-11-15T12:00:00.000Z"
}
```

**Error (403 - Forbidden):**

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not the owner of this venue"
  },
  "timestamp": "2024-11-15T12:00:00.000Z"
}
```

### Examples

**cURL:**

```bash
curl -X PATCH http://localhost:3000/api/venue-functions/func-123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "status": "inactive"
}
EOF
```

**JavaScript:**

```javascript
const response = await fetch(
  "/api/venue-functions/func-123e4567-e89b-12d3-a456-426614174000",
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "inactive",
    }),
  }
)

const data = await response.json()

if (data.success) {
  console.log("Function updated:", data.data.function)
}
```

---

## DELETE /venue-functions/:id

Delete a function.

**Authorization Required:** Yes (role: `organizer`, venue owner)

### Request

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Path Parameters:**

- `id` (UUID, required) - Function ID

**Query Parameters:**

- `hardDelete` (boolean, optional) - Permanently delete (default: false)

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "message": "Function successfully deleted",
    "deletedAt": "2024-11-15T12:00:00.000Z"
  },
  "timestamp": "2024-11-15T12:00:00.000Z"
}
```

**Error (403 - Operation Not Allowed):**

```json
{
  "success": false,
  "error": {
    "code": "OPERATION_NOT_ALLOWED",
    "message": "Cannot delete function with active responses"
  },
  "timestamp": "2024-11-15T12:00:00.000Z"
}
```

### Examples

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/venue-functions/func-123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer <access_token>"
```

**JavaScript:**

```javascript
const response = await fetch(
  "/api/venue-functions/func-123e4567-e89b-12d3-a456-426614174000",
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
)

const data = await response.json()

if (data.success) {
  console.log("Function deleted")
}
```

---

## GET /venue-functions/:id/statistics

Get function statistics (number of responses, volunteers, etc.).

**Authorization Required:** Yes (role: `organizer`, venue owner)

### Request

**Headers:**

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Path Parameters:**

- `id` (UUID, required) - Function ID

### Response

**Success (200):**

```json
{
  "success": true,
  "data": {
    "statistics": {
      "functionId": "func-123e4567-e89b-12d3-a456-426614174000",
      "venueId": "venue-123e4567-e89b-12d3-a456-426614174000",
      "type": "collection_point",
      "responsesCount": 15,
      "itemResponsesCount": 23,
      "serviceResponsesCount": 0,
      "beneficiaryCommitmentsCount": 8,
      "lastUpdated": "2024-11-15T12:00:00.000Z"
    }
  },
  "timestamp": "2024-11-15T12:00:00.000Z"
}
```

### Examples

**cURL:**

```bash
curl -X GET http://localhost:3000/api/venue-functions/func-123e4567-e89b-12d3-a456-426614174000/statistics \
  -H "Authorization: Bearer <access_token>"
```

**JavaScript:**

```javascript
const response = await fetch(
  "/api/venue-functions/func-123e4567-e89b-12d3-a456-426614174000/statistics",
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
)

const data = await response.json()

if (data.success) {
  console.log("Statistics:", data.data.statistics)
}
```

---

## Data Types

### VenueFunctionType

```typescript
type VenueFunctionType =
  | "collection_point" // Item collection point
  | "distribution_point" // Item distribution point
  | "services_needed" // Volunteer services needed
  | "custom" // Custom function
```

### QuantityLevel

```typescript
type QuantityLevel =
  | "a_lot" // Large quantity
  | "some" // Medium quantity
  | "few" // Small quantity
```

### ServiceCategory

```typescript
type ServiceCategory =
  | "medical" // Medical assistance
  | "legal" // Legal assistance
  | "psychological" // Psychological support
  | "translation" // Translation services
  | "transport" // Transportation
  | "education" // Education
  | "other" // Other
```

### ItemWithQuantity

```typescript
{
  categoryId: string;         // Category UUID
  categoryPath: string[];     // Path in category tree
  quantity: QuantityLevel;    // Quantity level
}
```

### ServiceRequest

```typescript
{
  serviceId: string;              // Service UUID
  serviceName: string;            // Service name
  category: ServiceCategory;      // Service category
  numberOfVolunteers: number;     // Number of volunteers needed
  description?: string;           // Description (optional)
}
```

### OperatingHours

```typescript
{
  dayOfWeek: string // Day of week: monday, tuesday, etc.
  openTime: string // Opening time (HH:MM)
  closeTime: string // Closing time (HH:MM)
  isClosed: boolean // Closed on this day
}
```

### VenueFunction (Collection Point)

```typescript
{
  id: string;                     // UUID
  venueId: string;                // Venue UUID
  type: "collection_point";
  items: ItemWithQuantity[];      // List of item categories to collect
  openingTimes: OperatingHours[]; // Operating hours
  specialRequests?: string;       // Special requirements
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;              // ISO 8601
  updatedAt: string;              // ISO 8601
}
```

### VenueFunction (Distribution Point)

```typescript
{
  id: string;                     // UUID
  venueId: string;                // Venue UUID
  type: "distribution_point";
  items: ItemWithQuantity[];      // List of item categories to distribute
  openingTimes: OperatingHours[]; // Operating hours
  specialRequests?: string;       // Special requirements
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;              // ISO 8601
  updatedAt: string;              // ISO 8601
}
```

### VenueFunction (Services Needed)

```typescript
{
  id: string;                     // UUID
  venueId: string;                // Venue UUID
  type: "services_needed";
  services: ServiceRequest[];     // List of required services
  specialRequests?: string;       // Special requirements
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;              // ISO 8601
  updatedAt: string;              // ISO 8601
}
```

### VenueFunction (Custom)

```typescript
{
  id: string;                     // UUID
  venueId: string;                // Venue UUID
  type: "custom";
  customTypeId: string;           // Custom type UUID
  customTypeName?: string;        // Custom type name
  items?: ItemWithQuantity[];     // List of items (optional)
  services?: ServiceRequest[];    // List of services (optional)
  openingTimes?: OperatingHours[];// Operating hours (optional)
  specialRequests?: string;       // Special requirements
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;              // ISO 8601
  updatedAt: string;              // ISO 8601
}
```

### FunctionStatistics

```typescript
{
  functionId: string // Function UUID
  venueId: string // Venue UUID
  type: VenueFunctionType // Function type
  responsesCount: number // Total number of responses
  itemResponsesCount: number // Number of item responses
  serviceResponsesCount: number // Number of service responses
  beneficiaryCommitmentsCount: number // Number of beneficiary commitments
  lastUpdated: string // ISO 8601
}
```

---

## Errors

- `VALIDATION_ERROR` (400) - Data validation error
- `UNAUTHORIZED` (401) - Not authorized
- `FORBIDDEN` (403) - No permission for this operation
- `NOT_FOUND` (404) - Function not found
- `OPERATION_NOT_ALLOWED` (403) - Operation not allowed (e.g., deleting function with active responses)

---

## Custom Function Types

API for managing custom function types (created by organizers for specific needs).

### POST /custom-function-types

Create a new custom function type.

**Authorization Required:** Yes (role: `organizer`)

**Request Body:**

```json
{
  "name": "Community Kitchen",
  "description": "Preparing and serving meals for refugees"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "customFunctionType": {
      "id": "custom-123e4567-e89b-12d3-a456-426614174000",
      "name": "Community Kitchen",
      "description": "Preparing and serving meals for refugees",
      "organizerId": "user-123e4567-e89b-12d3-a456-426614174000",
      "createdAt": "2024-11-15T10:30:00.000Z",
      "updatedAt": "2024-11-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### GET /custom-function-types

Get list of custom function types.

**Authorization Required:** No

**Query Parameters:**

- `organizerId` (UUID, optional) - Filter by organizer ID

**Response (200):**

```json
{
  "success": true,
  "data": {
    "customFunctionTypes": [
      {
        "id": "custom-123e4567-e89b-12d3-a456-426614174000",
        "name": "Community Kitchen",
        "description": "Preparing and serving meals for refugees",
        "organizerId": "user-123e4567-e89b-12d3-a456-426614174000",
        "createdAt": "2024-11-15T10:30:00.000Z",
        "updatedAt": "2024-11-15T10:30:00.000Z"
      }
    ]
  },
  "timestamp": "2024-11-15T10:30:00.000Z"
}
```

### PATCH /custom-function-types/:id

Update custom function type.

**Authorization Required:** Yes (role: `organizer`, type creator)

### DELETE /custom-function-types/:id

Delete custom function type.

**Authorization Required:** Yes (role: `organizer`, type creator)

---

## Notes

1. **Validation:**

   - For `collection_point` and `distribution_point`, at least one item in `items` and at least one day in `openingTimes` are required
   - For `services_needed`, at least one element in `services` is required
   - For `custom`, `customTypeId` is required

2. **Access Rights:**

   - Only organizers can create functions
   - Only venue owners can edit and delete functions
   - All users (including unauthenticated) can view functions

3. **Statuses:**

   - `active` - Function is active and displayed on the map
   - `inactive` - Function is temporarily inactive
   - `archived` - Function is archived

4. **Cascade Deletion:**
   - When a venue is deleted, all its functions are also deleted
   - Deleting a function with active responses may be blocked (depending on settings)

# Venue Functions and Responses

Managing venue functions (collection, distribution, services) and responses to them.

## 📋 Quick Navigation

### Venue Functions

- [Create Function](#create-function) - `POST /venue-functions`
- [List Functions](#list-functions) - `GET /venue-functions`
- [Update Function](#update-function) - `PATCH /venue-functions/:id`
- [Delete Function](#delete-function) - `DELETE /venue-functions/:id`

### Function Types

- [Collection Items](#collection-items-type) - `collection_point`
- [Distribution Items](#distribution-items-type) - `distribution_point`
- [Volunteer Services](#services-type) - `services_needed`
- [Custom Functions](#custom-functions) - `custom`

---

## Create Function

`POST /venue-functions`

🔐 **Authentication Required:** Organizer, venue owner

### Basic Example

```javascript
const response = await fetch("/api/venue-functions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    venueId: "venue-uuid",
    type: "collection_point",
    items: [{ categoryId: "cat-food", quantity: "a_lot" }],
    specialRequests: "Only clean items",
  }),
})
```

### Function Types

<details>
<summary><strong>Collection Items</strong> (collection_point)</summary>

```json
{
  "type": "collection_point",
  "items": [
    { "categoryId": "cat-food-canned", "quantity": "a_lot" },
    { "categoryId": "cat-clothes-winter", "quantity": "some" }
  ]
}
```

</details>

<details>
<summary><strong>Distribution Items</strong> (distribution_point)</summary>

```json
{
  "type": "distribution_point",
  "items": [{ "categoryId": "cat-food-canned", "quantity": "few" }],
  "openingTimes": [
    { "dayOfWeek": "monday", "openTime": "10:00", "closeTime": "16:00" }
  ]
}
```

</details>

<details>
<summary><strong>Volunteer Services</strong> (services_needed)</summary>

```json
{
  "type": "services_needed",
  "services": [
    { "serviceName": "Medical examination", "numberOfVolunteers": 2 },
    { "serviceName": "Translation", "numberOfVolunteers": 1 }
  ]
}
```

</details>

### Server Response

✅ **Success (201):**

```json
{
  "success": true,
  "data": {
    "function": {
      "id": "func-uuid",
      "type": "collection_point",
      "status": "active",
      "items": [...]
    }
  }
}
```

❌ **Errors:**

| Code | Description                          |
| ---- | ------------------------------------ |
| 400  | Validation error (insufficient data) |
| 403  | No access to venue                   |

---

## List Functions

`GET /venue-functions`

🌍 **Public Access** (authentication not required)

### Query Parameters

```
?venueId=venue-uuid     // Filter by venue
&type=collection_point  // Filter by type
&status=active          // Filter by status
&page=1&limit=10        // Pagination
```

### Example

```javascript
const params = new URLSearchParams({
  venueId: "venue-uuid",
  type: "collection_point",
  status: "active",
})

const response = await fetch(`/api/venue-functions?${params}`)
const { data } = await response.json()

console.log(data.items) // Array of functions
console.log(data.pagination) // Pagination info
```

### Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

---

## Update Function

`PATCH /venue-functions/:id`

🔐 **Authentication Required:** Venue owner

### Example

```javascript
const response = await fetch(`/api/venue-functions/${functionId}`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    status: "inactive",
    items: [{ categoryId: "cat-food", quantity: "few" }],
  }),
})
```

💡 **Only send the fields you want to change**

---

## Delete Function

`DELETE /venue-functions/:id`

🔐 **Authentication Required:** Venue owner

### Example

```javascript
await fetch(`/api/venue-functions/${functionId}`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}` },
})
```

⚠️ **Warning:** Deletion may be blocked if there are active responses

---

## 📘 Reference

### Function Types

| Type                 | Description             | Use Case                                    |
| -------------------- | ----------------------- | ------------------------------------------- |
| `collection_point`   | Item collection point   | Collecting food, clothes                    |
| `distribution_point` | Item distribution point | Distributing food, clothes to those in need |
| `services_needed`    | Volunteers needed       | Need doctors, translators                   |
| `custom`             | Custom function         | Any other help                              |

### Quantity Levels

| Value   | Description | Usage                               |
| ------- | ----------- | ----------------------------------- |
| `a_lot` | A lot       | Accepting/distributing large volume |
| `some`  | Medium      | Moderate amount                     |
| `few`   | Little      | Limited stock                       |

### Service Categories

| Category        | Examples                                 |
| --------------- | ---------------------------------------- |
| `medical`       | Medical examination, doctor consultation |
| `legal`         | Legal aid, consultation                  |
| `psychological` | Psychological support                    |
| `translation`   | Translation, oral/written                |
| `transport`     | Transport services                       |
| `education`     | Training, courses                        |
| `other`         | Other services                           |

### Function Statuses

| Status     | Description                             |
| ---------- | --------------------------------------- |
| `active`   | Function is active and displayed on map |
| `inactive` | Function temporarily inactive           |
| `archived` | Function is archived                    |

---

## Custom Functions

For specific needs, you can create your own function type.

### Create Type

`POST /custom-function-types`

```javascript
const response = await fetch("/api/custom-function-types", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Community Kitchen",
    description: "Cooking food for refugees",
  }),
})
```

### List Types

`GET /custom-function-types`

```javascript
const response = await fetch("/api/custom-function-types")
const { data } = await response.json()
console.log(data.customFunctionTypes)
```

---

## ⚡ Quick Start

### 1. Create a Venue

```javascript
// First, create a venue (see venues API)
const venue = await createVenue({ name: "Humanitarian warehouse", ... })
```

### 2. Add a Function

```javascript
// Add a function to the venue
const func = await fetch("/api/venue-functions", {
  method: "POST",
  body: JSON.stringify({
    venueId: venue.id,
    type: "collection_point",
    items: [{ categoryId: "cat-food", quantity: "a_lot" }],
  }),
})
```

### 3. Users Will See It on the Map

The function will automatically appear on the map, and users can respond to it.

---

## ⚠️ Important Rules

1. **Validation:**

   - For `collection_point` and `distribution_point`, at least 1 item in `items` is required
   - For `services_needed`, at least 1 item in `services` is required
   - For `custom`, `customTypeId` is mandatory

2. **Access Rights:**

   - Only organizers can create functions
   - Only venue owners can edit and delete
   - Everyone can view (including unauthenticated users)

3. **Cascading Deletion:**
   - When a venue is deleted, all its functions are deleted
   - Deletion of a function with active responses may be blocked

---

## 🔍 Useful Links

- [Venues API](./venues.md)
- [Authentication API](./auth.md)
- [Item Categories](./item-categories.md)

---

## 💬 FAQ

<details>
<summary><strong>How to add opening hours?</strong></summary>

Add the `openingTimes` array when creating/updating:

```json
{
  "openingTimes": [
    { "dayOfWeek": "monday", "openTime": "09:00", "closeTime": "17:00" },
    { "dayOfWeek": "sunday", "isClosed": true }
  ]
}
```

</details>

<details>
<summary><strong>Can I change the function type?</strong></summary>

No, the function type cannot be changed after creation. Create a new function with the desired type.

</details>

<details>
<summary><strong>How to know how many responses a function has?</strong></summary>

Use the statistics endpoint:

```javascript
GET /venue-functions/:id/statistics
```

</details>

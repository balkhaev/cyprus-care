# User Schema Update

## ✅ Updated to Match Real Backend API

The User contract has been updated to match the actual backend API response structure.

## 📋 Changes

### Before (Old Schema)

```typescript
interface User {
  id: UUID // String UUID
  email: string
  name: string // Single field
  role: UserRole
  phone?: string
  organizerId?: UUID
  isActive: boolean
  isEmailVerified: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### After (New Schema - Matches Real API)

```typescript
interface User {
  id: number // Numeric ID
  first_name: string // Separated names
  last_name: string
  email: string
  role: UserRole
  phone: string // Required
  municipality: string // New field

  // Organization fields
  is_organization: boolean
  organization_name: string

  // Volunteer-specific fields
  volunteer_areas_of_interest: string
  volunteer_services: string

  // Beneficiary-specific fields
  interested_in_donations: boolean
  association_name: string
}
```

## 🔄 Key Differences

| Old Field          | New Field(s)                           | Type Change                          |
| ------------------ | -------------------------------------- | ------------------------------------ |
| `id` (UUID string) | `id` (number)                          | ✅ String → Number                   |
| `name`             | `first_name`, `last_name`              | ✅ Split into two fields             |
| `phone?`           | `phone`                                | ✅ Optional → Required               |
| -                  | `municipality`                         | ✅ New required field                |
| `organizerId?`     | `is_organization`, `organization_name` | ✅ Replaced with organization fields |
| `isActive`         | -                                      | ❌ Removed                           |
| `isEmailVerified`  | -                                      | ❌ Removed                           |
| `createdAt`        | -                                      | ❌ Removed                           |
| `updatedAt`        | -                                      | ❌ Removed                           |
| -                  | `volunteer_areas_of_interest`          | ✅ New volunteer field               |
| -                  | `volunteer_services`                   | ✅ New volunteer field               |
| -                  | `interested_in_donations`              | ✅ New beneficiary field             |
| -                  | `association_name`                     | ✅ New beneficiary field             |

## 🆕 New Helper Functions

```typescript
// Convert to legacy format for backward compatibility
function userToLegacy(user: User): UserLegacy

// Get full name
function getUserFullName(user: User): string

// Parse volunteer fields
function parseVolunteerAreas(areasString: string): string[]
function parseVolunteerServices(servicesString: string): string[]
```

## 📝 Example Real API Response

```json
{
  "id": 1,
  "first_name": "Anna",
  "last_name": "Papadopoulou",
  "email": "anna@example.com",
  "role": "beneficiary",
  "phone": "+357000000",
  "municipality": "Limassol",
  "is_organization": false,
  "organization_name": "",
  "volunteer_areas_of_interest": "",
  "volunteer_services": "",
  "interested_in_donations": false,
  "association_name": ""
}
```

## 🔧 Migration Guide

### For Frontend Code

**Old way:**

```typescript
const userName = user.name
const userId = user.id // UUID string
```

**New way:**

```typescript
import { getUserFullName } from "@/contracts/auth"

const userName = getUserFullName(user) // "Anna Papadopoulou"
const userId = user.id.toString() // Convert number to string if needed
```

### For Components

**Old way:**

```tsx
<p>Welcome, {user.name}</p>
<p>Phone: {user.phone || 'Not provided'}</p>
```

**New way:**

```tsx
<p>Welcome, {user.first_name} {user.last_name}</p>
<p>Phone: {user.phone}</p>
<p>City: {user.municipality}</p>

{user.role === 'volunteer' && (
  <p>Services: {parseVolunteerServices(user.volunteer_services).join(', ')}</p>
)}
```

## 📦 Updated Files

- ✅ `contracts/auth.ts` - Updated User interface
- ✅ `docs/api/auth.md` - Updated API documentation
- ✅ Added helper functions for conversion
- ✅ Added `UserLegacy` interface for backward compatibility

## ⚠️ Breaking Changes

1. **User ID type changed** from `string` to `number`
2. **Name split** from single `name` field to `first_name` + `last_name`
3. **Phone is now required** (was optional)
4. **Municipality is required** (new field)
5. **Removed fields:** `isActive`, `isEmailVerified`, `createdAt`, `updatedAt`, `organizerId`

## 🎯 Action Items

- [ ] Update all components that display user.name
- [ ] Update all code that checks user.isActive or user.isEmailVerified
- [ ] Update forms to collect first_name and last_name separately
- [ ] Add municipality field to registration forms
- [ ] Update volunteer forms to collect areas_of_interest and services
- [ ] Update beneficiary forms for donations and association fields

## 📚 References

- [Auth Contracts](./auth.ts)
- [API Documentation](../docs/api/auth.md)
- [Example API Response](./api-responses.json)

# User Fields Reference

Complete reference for all User entity fields as returned by the backend API.

## 📋 All User Fields

| Field Name | Type | Required | Description | Used By Roles | Example Value |
|------------|------|----------|-------------|---------------|---------------|
| `id` | `number` | ✅ Yes | Unique user ID (numeric, not UUID) | All | `1` |
| `first_name` | `string` | ✅ Yes | User's first name | All | `"Anna"` |
| `last_name` | `string` | ✅ Yes | User's last name | All | `"Papadopoulou"` |
| `email` | `string` | ✅ Yes | User's email address (unique) | All | `"anna@example.com"` |
| `role` | `UserRole` | ✅ Yes | User role: `organizer`, `volunteer`, `beneficiary`, `admin` | All | `"beneficiary"` |
| `phone` | `string` | ✅ Yes | Phone number (international format) | All | `"+357000000"` |
| `municipality` | `string` | ✅ Yes | City/municipality where user is located | All | `"Limassol"` |
| `is_organization` | `boolean` | ✅ Yes | Whether user represents an organization | All (mainly organizers) | `false` |
| `organization_name` | `string` | ✅ Yes | Organization name (empty string if not an organization) | All (mainly organizers) | `""` or `"Red Cross Cyprus"` |
| `volunteer_areas_of_interest` | `string` | ✅ Yes | Comma-separated areas of interest (empty for non-volunteers) | Volunteers | `"Education,Healthcare"` or `""` |
| `volunteer_services` | `string` | ✅ Yes | Comma-separated services offered (empty for non-volunteers) | Volunteers | `"Teaching,Driving"` or `""` |
| `interested_in_donations` | `boolean` | ✅ Yes | Whether beneficiary is interested in donations | Beneficiaries | `false` |
| `association_name` | `string` | ✅ Yes | Association/community name (empty if none) | Beneficiaries | `""` or `"Paphos Community Center"` |

## 🎯 Field Usage by Role

### All Roles (Common Fields)

```typescript
{
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  phone: string;
  municipality: string;
}
```

### Organizer-Specific

```typescript
{
  is_organization: boolean;      // true if representing an org
  organization_name: string;      // "Red Cross Cyprus" or ""
}
```

**Example:**
```json
{
  "id": 3,
  "first_name": "Maria",
  "last_name": "Konstantinou",
  "email": "maria@redcross.cy",
  "role": "organizer",
  "phone": "+35799333444",
  "municipality": "Larnaca",
  "is_organization": true,
  "organization_name": "Red Cross Cyprus",
  "volunteer_areas_of_interest": "",
  "volunteer_services": "",
  "interested_in_donations": false,
  "association_name": ""
}
```

### Volunteer-Specific

```typescript
{
  volunteer_areas_of_interest: string;  // "Education,Healthcare,Food"
  volunteer_services: string;           // "Teaching,Medical,Driving"
}
```

**Example:**
```json
{
  "id": 2,
  "first_name": "Nikos",
  "last_name": "Georgiou",
  "email": "nikos@example.com",
  "role": "volunteer",
  "phone": "+35799111222",
  "municipality": "Nicosia",
  "is_organization": false,
  "organization_name": "",
  "volunteer_areas_of_interest": "Education,Healthcare,Food Distribution",
  "volunteer_services": "Teaching,Medical assistance,Driving",
  "interested_in_donations": false,
  "association_name": ""
}
```

### Beneficiary-Specific

```typescript
{
  interested_in_donations: boolean;  // true/false
  association_name: string;          // "Community Center" or ""
}
```

**Example:**
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
  "interested_in_donations": true,
  "association_name": "Limassol Community Center"
}
```

## 🔄 Field Parsing

### String Fields (Comma-separated)

Some fields contain comma-separated values that need to be parsed:

```typescript
// volunteer_areas_of_interest: "Education,Healthcare,Food Distribution"
const areas = user.volunteer_areas_of_interest
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
// Result: ["Education", "Healthcare", "Food Distribution"]

// Or use helper:
import { parseVolunteerAreas } from '@/contracts/auth';
const areas = parseVolunteerAreas(user.volunteer_areas_of_interest);
```

### Empty vs Populated Fields

All fields are **always present** in the response, but some may be empty:

```typescript
// Empty string fields
user.organization_name === ""
user.volunteer_areas_of_interest === ""
user.volunteer_services === ""
user.association_name === ""

// Boolean fields (always true or false)
user.is_organization === false
user.interested_in_donations === false
```

## 📝 Validation Rules

| Field | Min Length | Max Length | Pattern | Notes |
|-------|------------|------------|---------|-------|
| `first_name` | 1 | 100 | Letters, spaces | Required |
| `last_name` | 1 | 100 | Letters, spaces | Required |
| `email` | - | 255 | Valid email | Must be unique |
| `phone` | 8 | 20 | International format | Usually starts with + |
| `municipality` | 2 | 100 | Any string | City name |
| `organization_name` | 0 | 255 | Any string | Empty if not org |
| `volunteer_areas_of_interest` | 0 | 500 | Comma-separated | Empty if not volunteer |
| `volunteer_services` | 0 | 500 | Comma-separated | Empty if not volunteer |
| `association_name` | 0 | 255 | Any string | Empty if no association |

## 🛠️ Helper Functions

### Get Full Name

```typescript
import { getUserFullName } from '@/contracts/auth';

const fullName = getUserFullName(user);
// "Anna Papadopoulou"
```

### Parse Volunteer Fields

```typescript
import { parseVolunteerAreas, parseVolunteerServices } from '@/contracts/auth';

const areas = parseVolunteerAreas(user.volunteer_areas_of_interest);
// ["Education", "Healthcare", "Food Distribution"]

const services = parseVolunteerServices(user.volunteer_services);
// ["Teaching", "Medical assistance", "Driving"]
```

### Convert to Legacy Format

```typescript
import { userToLegacy } from '@/contracts/auth';

const legacyUser = userToLegacy(user);
// { id: "1", name: "Anna Papadopoulou", ... }
```

## 🔍 Type Guards

```typescript
import { 
  isOrganizer, 
  isVolunteer, 
  isBeneficiary,
  isOrganizationUser,
  hasVolunteerArea,
  offersService
} from '@/contracts/user-examples';

// Check role
if (isVolunteer(user)) {
  console.log("User is a volunteer");
}

// Check organization
if (isOrganizationUser(user)) {
  console.log(`Organization: ${user.organization_name}`);
}

// Check volunteer capabilities
if (hasVolunteerArea(user, "Education")) {
  console.log("User interested in Education");
}

if (offersService(user, "Teaching")) {
  console.log("User offers Teaching service");
}
```

## 📊 Display Examples

### User Card

```tsx
function UserCard({ user }: { user: User }) {
  const fullName = getUserFullName(user);
  const initials = getUserInitials(user);
  
  return (
    <div className="user-card">
      <div className="avatar">{initials}</div>
      <h3>{fullName}</h3>
      <p>{user.email}</p>
      <p>{user.phone}</p>
      <p>{user.municipality}</p>
      <span className={`badge badge-${user.role}`}>
        {user.role}
      </span>
    </div>
  );
}
```

### Conditional Fields

```tsx
function UserDetails({ user }: { user: User }) {
  return (
    <div>
      {/* Show organization info */}
      {user.is_organization && user.organization_name && (
        <div className="organization">
          <strong>Organization:</strong> {user.organization_name}
        </div>
      )}
      
      {/* Show volunteer info */}
      {user.role === 'volunteer' && (
        <>
          {user.volunteer_areas_of_interest && (
            <div className="areas">
              <strong>Areas:</strong>
              {parseVolunteerAreas(user.volunteer_areas_of_interest)
                .map(area => <span key={area}>{area}</span>)}
            </div>
          )}
          {user.volunteer_services && (
            <div className="services">
              <strong>Services:</strong>
              {parseVolunteerServices(user.volunteer_services)
                .map(service => <span key={service}>{service}</span>)}
            </div>
          )}
        </>
      )}
      
      {/* Show beneficiary info */}
      {user.role === 'beneficiary' && (
        <>
          {user.interested_in_donations && (
            <div className="donations">✓ Interested in donations</div>
          )}
          {user.association_name && (
            <div className="association">
              <strong>Association:</strong> {user.association_name}
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

## 🚨 Common Mistakes to Avoid

### ❌ Don't assume fields are optional

```typescript
// WRONG - These fields are always present
if (user.phone) { ... }           // phone is always present (required)
if (user.municipality) { ... }    // municipality is always present

// CORRECT - Check for empty strings if needed
if (user.organization_name !== "") { ... }
if (user.association_name !== "") { ... }
```

### ❌ Don't use old field names

```typescript
// WRONG
const name = user.name;          // Property doesn't exist
const userId = user.id;          // This is number, not string UUID

// CORRECT
const name = getUserFullName(user);
const userId = user.id.toString(); // Convert to string if needed
```

### ❌ Don't forget to parse comma-separated fields

```typescript
// WRONG
<p>{user.volunteer_areas_of_interest}</p>
// Output: "Education,Healthcare,Food Distribution"

// CORRECT
<ul>
  {parseVolunteerAreas(user.volunteer_areas_of_interest).map(area => (
    <li key={area}>{area}</li>
  ))}
</ul>
```

## 📚 See Also

- [auth.ts](./auth.ts) - Type definitions
- [user-examples.ts](./user-examples.ts) - Usage examples
- [API Documentation](../docs/api/auth.md) - API endpoints
- [Migration Guide](./USER_SCHEMA_UPDATE.md) - Upgrading from old schema


# User API Quick Reference

## ✅ Real User Structure (FROM BACKEND)

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

## 🚀 Quick Start

### Import Types & Helpers

```typescript
import { 
  User, 
  getUserFullName,
  parseVolunteerAreas,
  parseVolunteerServices 
} from '@/contracts/auth';
```

### Display User Name

```typescript
// ✅ CORRECT
const name = getUserFullName(user); // "Anna Papadopoulou"

// ❌ WRONG
const name = user.name; // Property doesn't exist!
```

### Check User Role

```typescript
if (user.role === 'volunteer') {
  // Volunteer-specific logic
}

if (user.role === 'organizer') {
  // Organizer-specific logic
}

if (user.role === 'beneficiary') {
  // Beneficiary-specific logic
}
```

### Check Organization

```typescript
if (user.is_organization && user.organization_name !== "") {
  console.log(`Organization: ${user.organization_name}`);
}
```

### Parse Volunteer Fields

```typescript
// For volunteers only
if (user.role === 'volunteer') {
  const areas = parseVolunteerAreas(user.volunteer_areas_of_interest);
  // ["Education", "Healthcare"]
  
  const services = parseVolunteerServices(user.volunteer_services);
  // ["Teaching", "Driving"]
}
```

### Check Beneficiary Fields

```typescript
// For beneficiaries only
if (user.role === 'beneficiary') {
  if (user.interested_in_donations) {
    console.log("Interested in donations");
  }
  
  if (user.association_name !== "") {
    console.log(`Association: ${user.association_name}`);
  }
}
```

## 📋 Field Checklist

### Always Present (All Users)

- ✅ `id` (number)
- ✅ `first_name` (string)
- ✅ `last_name` (string)
- ✅ `email` (string)
- ✅ `role` (UserRole)
- ✅ `phone` (string)
- ✅ `municipality` (string)

### Role-Specific (Check role first!)

**Organizers:**
- `is_organization` (boolean)
- `organization_name` (string, may be empty)

**Volunteers:**
- `volunteer_areas_of_interest` (string, may be empty)
- `volunteer_services` (string, may be empty)

**Beneficiaries:**
- `interested_in_donations` (boolean)
- `association_name` (string, may be empty)

## 🎨 React Component Examples

### User Avatar

```tsx
function UserAvatar({ user }: { user: User }) {
  const initials = user.first_name[0] + user.last_name[0];
  
  return (
    <div className="avatar">
      {initials.toUpperCase()}
    </div>
  );
}
```

### User Card

```tsx
function UserCard({ user }: { user: User }) {
  return (
    <div>
      <h3>{getUserFullName(user)}</h3>
      <p>{user.email}</p>
      <p>{user.phone}</p>
      <p>📍 {user.municipality}</p>
      <span className={`role-badge ${user.role}`}>
        {user.role}
      </span>
    </div>
  );
}
```

### Volunteer Profile

```tsx
function VolunteerProfile({ user }: { user: User }) {
  if (user.role !== 'volunteer') return null;
  
  const areas = parseVolunteerAreas(user.volunteer_areas_of_interest);
  const services = parseVolunteerServices(user.volunteer_services);
  
  return (
    <div>
      <h2>{getUserFullName(user)}</h2>
      
      {areas.length > 0 && (
        <div>
          <h3>Areas of Interest</h3>
          <div className="tags">
            {areas.map(area => (
              <span key={area} className="tag">{area}</span>
            ))}
          </div>
        </div>
      )}
      
      {services.length > 0 && (
        <div>
          <h3>Services Offered</h3>
          <div className="tags">
            {services.map(service => (
              <span key={service} className="tag">{service}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🔄 API Calls

### Get Current User

```typescript
const response = await fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
const user: User = data.data;
```

### Register User

```typescript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
    first_name: "John",
    last_name: "Doe",
    role: "volunteer",
    phone: "+35799123456",
    municipality: "Limassol",
    is_organization: false,
    organization_name: "",
    volunteer_areas_of_interest: "Education,Healthcare",
    volunteer_services: "Teaching"
  })
});

const data = await response.json();
const user: User = data.data.user;
const accessToken: string = data.data.accessToken;
```

### Update Profile

```typescript
const response = await fetch('/api/auth/profile', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    first_name: "NewFirstName",
    phone: "+35799999999"
  })
});
```

## ⚠️ Common Mistakes

### ❌ WRONG

```typescript
// Field doesn't exist
user.name

// ID is number, not string
const id: string = user.id;

// Optional check on required field
if (user.phone) { }

// Displaying comma-separated string
<p>{user.volunteer_areas_of_interest}</p>
```

### ✅ CORRECT

```typescript
// Use helper function
getUserFullName(user)

// Convert to string if needed
const id: string = user.id.toString();

// Required field, check for empty string
if (user.organization_name !== "") { }

// Parse and display array
{parseVolunteerAreas(user.volunteer_areas_of_interest).map(...)}
```

## 📚 Full Documentation

- [User Fields Reference](./USER_FIELDS_REFERENCE.md) - Complete field documentation
- [User Examples](./user-examples.ts) - Code examples
- [Migration Guide](./USER_SCHEMA_UPDATE.md) - Upgrading from old schema
- [API Docs](../docs/api/auth.md) - API endpoints
- [Type Definitions](./auth.ts) - TypeScript types


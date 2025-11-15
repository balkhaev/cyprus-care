# User Entity Structure

Visual representation of the User entity structure.

## 📊 Complete Structure

```
User
├── 🆔 Basic Identity
│   ├── id: number (1, 2, 3...)
│   ├── first_name: string ("Anna")
│   ├── last_name: string ("Papadopoulou")
│   └── email: string ("anna@example.com")
│
├── 🏷️ Role & Contact
│   ├── role: UserRole ("organizer" | "volunteer" | "beneficiary" | "admin")
│   ├── phone: string ("+357000000")
│   └── municipality: string ("Limassol")
│
├── 🏢 Organization (All Users)
│   ├── is_organization: boolean (false)
│   └── organization_name: string ("" or "Red Cross Cyprus")
│
├── 🤝 Volunteer-Specific
│   ├── volunteer_areas_of_interest: string ("Education,Healthcare")
│   └── volunteer_services: string ("Teaching,Medical assistance")
│
└── 🎁 Beneficiary-Specific
    ├── interested_in_donations: boolean (false)
    └── association_name: string ("" or "Community Center")
```

## 🎯 By Role

### 👔 Organizer

```
Organizer User
├── ✅ Common Fields (id, name, email, role, phone, municipality)
└── 🏢 Organization Fields
    ├── is_organization: true/false
    └── organization_name: "Red Cross Cyprus" or ""
```

**Example:**
```json
{
  "id": 3,
  "first_name": "Maria",
  "last_name": "Konstantinou",
  "role": "organizer",
  "is_organization": true,
  "organization_name": "Red Cross Cyprus"
}
```

### 🤝 Volunteer

```
Volunteer User
├── ✅ Common Fields (id, name, email, role, phone, municipality)
└── 🎯 Volunteer Fields
    ├── volunteer_areas_of_interest: "Education,Healthcare,Food"
    └── volunteer_services: "Teaching,Medical,Driving"
```

**Example:**
```json
{
  "id": 2,
  "first_name": "Nikos",
  "last_name": "Georgiou",
  "role": "volunteer",
  "volunteer_areas_of_interest": "Education,Healthcare",
  "volunteer_services": "Teaching,Medical assistance"
}
```

### 🎁 Beneficiary

```
Beneficiary User
├── ✅ Common Fields (id, name, email, role, phone, municipality)
└── 📦 Beneficiary Fields
    ├── interested_in_donations: true/false
    └── association_name: "Community Center" or ""
```

**Example:**
```json
{
  "id": 1,
  "first_name": "Anna",
  "last_name": "Papadopoulou",
  "role": "beneficiary",
  "interested_in_donations": true,
  "association_name": "Limassol Community Center"
}
```

## 🔄 Field States

### Always Present (Required)

```
✅ ALWAYS in response
├── id
├── first_name
├── last_name
├── email
├── role
├── phone
├── municipality
├── is_organization
├── organization_name
├── volunteer_areas_of_interest
├── volunteer_services
├── interested_in_donations
└── association_name
```

### Empty vs Populated

```
String Fields (may be empty "")
├── organization_name
│   ├── "" = Not an organization
│   └── "Red Cross" = Organization name
│
├── volunteer_areas_of_interest
│   ├── "" = No areas (non-volunteer)
│   └── "Education,Healthcare" = Has areas
│
├── volunteer_services
│   ├── "" = No services (non-volunteer)
│   └── "Teaching,Driving" = Has services
│
└── association_name
    ├── "" = No association
    └── "Community Center" = Has association

Boolean Fields (true/false)
├── is_organization
│   ├── false = Individual
│   └── true = Organization
│
└── interested_in_donations
    ├── false = Not interested
    └── true = Interested
```

## 📊 Data Flow

### Registration → Storage → Response

```
1. Frontend Form
   ↓
   {
     firstName: "Anna",
     lastName: "Papadopoulou",
     email: "anna@example.com",
     ...
   }

2. Convert to API Format
   ↓
   {
     first_name: "Anna",
     last_name: "Papadopoulou",
     email: "anna@example.com",
     ...
   }

3. Backend Storage
   ↓
   Database stores with ID

4. API Response
   ↓
   {
     id: 1,
     first_name: "Anna",
     last_name: "Papadopoulou",
     email: "anna@example.com",
     role: "beneficiary",
     phone: "+357000000",
     municipality: "Limassol",
     is_organization: false,
     organization_name: "",
     volunteer_areas_of_interest: "",
     volunteer_services: "",
     interested_in_donations: false,
     association_name: ""
   }

5. Frontend Display
   ↓
   const name = getUserFullName(user);
   // "Anna Papadopoulou"
```

## 🎨 Component Hierarchy

```
UserProfile Component
│
├── UserHeader
│   ├── UserAvatar (initials from first_name[0] + last_name[0])
│   ├── UserName (getUserFullName(user))
│   └── RoleBadge (user.role)
│
├── ContactInfo
│   ├── Email (user.email)
│   ├── Phone (user.phone)
│   └── Municipality (user.municipality)
│
├── OrganizationInfo (if is_organization)
│   └── OrganizationName (user.organization_name)
│
├── VolunteerInfo (if role === 'volunteer')
│   ├── AreasOfInterest (parseVolunteerAreas(...))
│   └── ServicesOffered (parseVolunteerServices(...))
│
└── BeneficiaryInfo (if role === 'beneficiary')
    ├── DonationInterest (interested_in_donations)
    └── Association (association_name)
```

## 🔍 Type Checking Flow

```typescript
User (from API)
  │
  ├── isOrganizer(user)
  │   └── if true → show organizer features
  │
  ├── isVolunteer(user)
  │   └── if true → parse & show volunteer fields
  │       ├── parseVolunteerAreas()
  │       └── parseVolunteerServices()
  │
  └── isBeneficiary(user)
      └── if true → show beneficiary fields
          ├── check interested_in_donations
          └── check association_name
```

## 📋 Validation Flow

```
Input Data
  ↓
Validate Required Fields
  ├── email (valid format, unique)
  ├── first_name (1-100 chars)
  ├── last_name (1-100 chars)
  ├── phone (8-20 chars, international)
  ├── municipality (2-100 chars)
  └── role (valid enum)
  ↓
Validate Conditional Fields
  ├── if is_organization → validate organization_name
  ├── if volunteer → validate areas & services
  └── if beneficiary → validate association_name
  ↓
Store in Database
  ↓
Return User Object (with id)
```

## 🎯 Common Patterns

### Pattern 1: Display Full Name

```typescript
// Always use helper
const name = getUserFullName(user);

// Never do:
const name = user.name; // ❌ Doesn't exist!
```

### Pattern 2: Check Organization

```typescript
// Check both fields
if (user.is_organization && user.organization_name) {
  // Show organization info
}

// Not just:
if (user.is_organization) { } // ❌ name might be empty
```

### Pattern 3: Parse Volunteers

```typescript
// Always parse before displaying
if (user.role === 'volunteer') {
  const areas = parseVolunteerAreas(user.volunteer_areas_of_interest);
  const services = parseVolunteerServices(user.volunteer_services);
  
  // Now use arrays
  areas.forEach(area => ...);
}

// Never display raw:
<p>{user.volunteer_areas_of_interest}</p> // ❌ Shows "A,B,C"
```

### Pattern 4: Conditional Rendering

```typescript
// ✅ Correct
{user.role === 'beneficiary' && user.association_name && (
  <p>Association: {user.association_name}</p>
)}

// ❌ Wrong (shows empty div for "")
{user.association_name && (
  <p>Association: {user.association_name}</p>
)}

// ✅ Better
{user.association_name !== "" && (
  <p>Association: {user.association_name}</p>
)}
```

## 📚 References

- [Type Definitions](./auth.ts)
- [Examples](./user-examples.ts)
- [Fields Reference](./USER_FIELDS_REFERENCE.md)
- [Quick Reference](./USER_QUICK_REF.md)
- [API Documentation](../docs/api/auth.md)


# Venue Ownership and Access Control

## Overview

This document describes the implementation of venue ownership and access control in the Cyprus Care application.

## Key Changes

### 1. Changed `organizerId` Type

**Before**: `UUID` (string)  
**After**: `number` (to match `User.id`)

This change ensures type consistency between venues and users.

**Files updated:**
- `contracts/venue.ts`
- `types/venue.ts`
- `lib/mock-data/venues-with-functions.ts`

### 2. Created Permission Utilities

Created `/lib/venue-permissions.ts` with the following functions:

```typescript
// Check if user owns the venue
isVenueOwner(venue, user): boolean

// Check if user can edit the venue
canEditVenue(venue, user): boolean

// Check if user can delete the venue
canDeleteVenue(venue, user): boolean

// Check if user can create venues
canCreateVenue(user): boolean

// Check if user can view venue details
canViewVenue(user): boolean

// Get permission error messages
getPermissionDeniedMessage(action): string

// Assertion functions (throw errors if not permitted)
assertCanEditVenue(venue, user): void
assertCanDeleteVenue(venue, user): void
assertCanCreateVenue(user): void
assertCanViewVenue(user): void
```

### 3. Permission Rules

#### View Venue
- **All authenticated users** can view venues

#### Create Venue
- **Organizers** can create venues
- **Admins** can create venues

#### Edit Venue
- **Venue owner** (organizer whose `id` matches `venue.organizerId`) can edit
- **Admins** can edit any venue

#### Delete Venue
- **Venue owner** (organizer whose `id` matches `venue.organizerId`) can delete
- **Admins** can delete any venue

### 4. UI Updates

#### Venue Detail Page (`app/venues/[id]/page.tsx`)
- Edit and Delete buttons only shown to owners
- Uses `canEditVenue()` and `canDeleteVenue()` utilities
- Non-owners see volunteer/beneficiary view only

#### Organizer Venue View (`components/venue-views/OrganizerVenueView.tsx`)
- Management interface only shown to venue owners
- Function edit/delete buttons only visible to owners

### 5. Updated Mock Data

**User Mock Data** (`lib/mock-data/user-roles.ts`):
- Users now have numeric IDs (1-7) matching the new schema
- Three organizers: John Smith (id: 1), Maria Garcia (id: 2), Anna Papadopoulou (id: 3)
- Two volunteers: Alex Johnson (id: 4), Sarah Williams (id: 5)
- Two beneficiaries: Mohammed Ali (id: 6), Elena Petrov (id: 7)

**Venue Mock Data** (`lib/mock-data/venues-with-functions.ts`):
- Venue 1 & 2: owned by organizer 1 (John Smith)
- Venue 3: owned by organizer 2 (Maria Garcia)
- Venue 4: owned by organizer 3 (Anna Papadopoulou)

### 6. API Comments

Updated API client comments (`lib/api-client.ts`) to clarify permission requirements:
- `createVenue`: Requires organizer or admin role
- `updateVenue`: Requires venue ownership or admin role
- `deleteVenue`: Requires venue ownership or admin role

## Testing

### Manual Testing

To test the ownership system:

1. **Switch to Organizer 1** (John Smith, owns venues 1 & 2):
   - Should see edit/delete buttons on venues 1 & 2
   - Should NOT see edit/delete buttons on venues 3 & 4

2. **Switch to Organizer 2** (Maria Garcia, owns venue 3):
   - Should see edit/delete buttons only on venue 3
   - Should NOT see edit/delete buttons on other venues

3. **Switch to Volunteer or Beneficiary**:
   - Should NOT see any edit/delete buttons
   - Should see volunteer/beneficiary views only

### Unit Tests

Unit tests are available in `lib/__tests__/venue-ownership.test.ts`:
- Tests for `isVenueOwner()`
- Tests for `canEditVenue()`
- Tests for `canDeleteVenue()`
- Tests for `canCreateVenue()`
- Tests for `canViewVenue()`
- Tests for permission assertions
- Edge case handling

## Security Considerations

### Frontend (Current Implementation)
- Permission checks in UI prevent unauthorized actions
- Buttons hidden for users without permissions

### Backend (Required for Production)
- **IMPORTANT**: Backend must validate all permissions
- Never trust frontend permissions alone
- Backend should verify:
  - User authentication
  - User role
  - Venue ownership (organizerId === userId)
  - Admin privileges

## Future Improvements

1. **Backend Integration**:
   - Implement permission checks in Django backend
   - Add API middleware for permission validation
   - Return 403 Forbidden for unauthorized actions

2. **Role-Based Access Control (RBAC)**:
   - Implement more granular permissions
   - Add permission groups (e.g., "venue_editors", "venue_viewers")
   - Support for multiple owners per venue

3. **Audit Log**:
   - Track all venue edits/deletes
   - Record who made changes and when
   - Provide audit trail for compliance

4. **Transfer Ownership**:
   - Allow organizers to transfer venue ownership
   - Require confirmation from new owner
   - Notify previous owner of transfer

## Migration Notes

If migrating existing venues:
1. Ensure all `organizerId` values are updated from UUID strings to numeric IDs
2. Map old organizer UUIDs to new user numeric IDs
3. Update database schema to change column type
4. Test ownership checks after migration

## Related Files

- `contracts/venue.ts` - Venue type definitions
- `contracts/auth.ts` - User type definitions
- `lib/venue-permissions.ts` - Permission utilities
- `lib/__tests__/venue-ownership.test.ts` - Unit tests
- `lib/mock-data/user-roles.ts` - Mock user data
- `lib/mock-data/venues-with-functions.ts` - Mock venue data
- `app/venues/[id]/page.tsx` - Venue detail page with ownership checks
- `components/venue-views/OrganizerVenueView.tsx` - Organizer management view


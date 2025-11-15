# User Authentication API

## Summary

Implemented a centralized backend mock API for user authentication that synchronizes user state across the entire application.

## Changes

### 1. Backend API - `/api/me/route.ts`

Created a new API endpoint for managing the current user:

- **GET `/api/me`** - Returns the current authenticated user
- **PATCH `/api/me`** - Updates the current user (for DebugPanel user switching)
  - Body: `{ userId: string }`

The API maintains the current user ID in memory on the server side.

### 2. Header Component

Updated to fetch user data from the API:

```typescript
// Before: used mock function
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Volunteer',
};

// After: fetch from API
useEffect(() => {
  fetch('/api/me')
    .then(res => res.json())
    .then(data => setUser(data))
}, []);
```

### 3. DebugPanel Component

Updated to work through the API:

- User switching now calls `PATCH /api/me` with the new user ID
- Added state tracking for `currentUserId`
- Fixed type issues with user ID (string keys in mockUsers)

### 4. Venues Pages

Updated both `/app/venues/page.tsx` and `/app/venues/[id]/page.tsx`:

- Changed from using `getCurrentUser()` directly to fetching from API
- Permissions checks now use the API-sourced user
- Edit buttons now correctly appear based on venue ownership

## User Permissions

The venue permissions system checks:

1. **Edit/Delete permissions**: 
   - Admin can edit/delete any venue
   - Organizer can only edit/delete their own venues (where `venue.organizerId === user.id`)

2. **Venue ownership**: Venues have numeric `organizerId` that matches `user.id`

## Mock Users

Default users available:

- `user-org-1`: John Smith (Organizer, ID: 1) - owns venues 1, 2, 5
- `user-org-2`: Maria Garcia (Organizer, ID: 2) - owns venues 3, 6
- `user-org-3`: Anna Papadopoulou (Organizer, ID: 3) - owns venue 4
- `user-vol-1`: Alex Johnson (Volunteer, ID: 4)
- `user-vol-2`: Sarah Williams (Volunteer, ID: 5)
- `user-ben-1`: Mohammed Ali (Beneficiary, ID: 6)
- `user-ben-2`: Elena Petrov (Beneficiary, ID: 7)

## Testing

1. Open DebugPanel (if `NEXT_PUBLIC_SHOW_DEBUG_PANEL=true`)
2. Switch to any organizer user
3. Observe:
   - Header updates with new user name
   - Edit buttons appear only on venues owned by that organizer
   - Page reloads to apply changes

## Technical Details

- **Server-side state**: Current user ID is stored in memory on the server (resets on server restart)
- **Client-side state**: All components fetch from the API endpoint
- **Type safety**: Uses TypeScript types from contracts
- **Synchronization**: All changes go through the API, ensuring consistency


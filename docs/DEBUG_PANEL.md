# Debug Panel

## Description

Debug panel for switching between users in development mode. Allows quickly testing different views and functionality for different user roles.

## Features

### Automatic Environment Detection
- Panel is shown **only in development mode** (`NODE_ENV === 'development'`)
- In production, panel is completely hidden

### Floating Button
- Located in bottom right corner of screen
- Bright design with "DEV" indicator
- Doesn't interfere with main interface

### Current User Information
- Name and email
- Role with color coding:
  - 🟣 **Organizer** (Purple) - Manages venues and responses
  - 🔵 **Volunteer** (Blue) - Can respond to needs
  - 🟢 **Beneficiary** (Green) - Can confirm attendance at distribution points

### User List
- 6 test users:
  - **John Smith** - Organizer (org-1)
  - **Maria Garcia** - Organizer (org-2)
  - **Alex Johnson** - Volunteer
  - **Sarah Williams** - Volunteer
  - **Mohammed Ali** - Beneficiary
  - **Elena Petrov** - Beneficiary
- Current user is highlighted
- One click to switch
- Automatic page reload after switch

## Usage

### Opening Panel
1. In development mode, a "Debug" button will appear in bottom right corner
2. Click it to open panel

### Switching User
1. Open debug panel
2. Select desired user from list
3. Page will automatically reload
4. All components will update to new role

### Closing Panel
- Click right arrow (→) in panel header

## Technical Details

### Location
Component added to `app/layout.tsx` and available on all application pages.

### z-index
Panel uses `z-[9999]` to display over all interface elements, including modals and popups.

### Responsiveness
Panel has fixed width of 320px and automatically adjusts height to user list.

### Role Icons
- **MapPin** - Organizer (venue management)
- **Hand** - Volunteer (help)
- **Package** - Beneficiary (receiving aid)

## Integration with Role System

Panel uses:
- `getCurrentUser()` - get current user
- `setCurrentUser(userId)` - set new user
- `mockUsers` - list of all test users

After changing user, full page reload occurs (`window.location.reload()`), so all components get current data.

## What Changes When Switching Role

### On Map (`/map`)
- **Volunteer**: Sees ETA to venues
- **Beneficiary**: Sees highlighted distribution points + ETA
- **Organizer**: Sees ETA, can manage their venues

### On Venue Page (`/venues/[id]`)
- **Volunteer**: Sees ability to respond to needs
- **Beneficiary**: Sees only distribution points with "I will be there" button
- **Organizer**: Sees response statistics and can manage need statuses (only for their venues)

### Editing
- Only **Organizer** can edit and delete their venues
- Other users see venues in read-only mode

## Security

⚠️ **Important**: This component is ONLY for development!

In production:
- Panel is not displayed
- User switching is unavailable
- Real authentication is used

## Usage Examples

### Testing Volunteer Functionality
1. Open debug panel
2. Select "Alex Johnson" (Volunteer)
3. Go to map `/map`
4. See ETA to all venues
5. Click on venue and click "Respond"

### Testing Organizer Functionality
1. Open debug panel
2. Select "John Smith" (Organizer)
3. Go to their venue (id: 1)
4. See volunteer response statistics
5. Can update need statuses

### Testing Beneficiary Functionality
1. Open debug panel
2. Select "Mohammed Ali" (Beneficiary)
3. Go to map `/map`
4. See green highlighted distribution points
5. Go to distribution point
6. Click "I will be there"

## Styling

Panel uses:
- Tailwind CSS classes
- Dark mode support
- Project color scheme
- Animations and transitions
- Shadows and gradients for highlighting

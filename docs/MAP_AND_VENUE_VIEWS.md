# Map View and Venue Views Implementation

## Overview

Full map and venue viewing functionality implemented for three types of users: volunteers, organizers, and beneficiaries.

## New Files

### Data Types
- `types/response.ts` - types for volunteer responses, beneficiary commitments and need statuses
- `lib/mock-data/responses.ts` - mock data for testing responses and commitments

### Venue View Components
- `components/venue-views/VolunteerVenueView.tsx` - view for volunteers
- `components/venue-views/OrganizerVenueView.tsx` - view for organizers
- `components/venue-views/BeneficiaryVenueView.tsx` - view for beneficiaries
- `components/UserRoleSwitcher.tsx` - user role switcher for testing

## Key Features

### Map View (general)

**Rich hover popups:**
- Venue name and description
- List of all venue functions (Collection Point, Distribution Point, Services Needed)
- Details for each function (quantity of items/services)

**Filtering:**
- Filter venues by item categories through CategoryTreeFilter
- Filter located on the left of the map

**ETA (Estimated Time of Arrival):**
- Automatically calculated and displayed for volunteers and beneficiaries
- Shows distance and approximate time to venue
- Uses user geolocation
- Average speed: 30 km/h

**Distribution point highlighting:**
- For beneficiaries, venues with Distribution Point are highlighted with green marker
- Special icon 📦 for visual distinction

### Venue View: Volunteer

**Displays:**
- All venue details
- Quantity of needed items with need level (a lot, some, few)
- List of needed services with descriptions
- Special requirements for each function

**Functionality:**
- "Respond" button for each item or service
- Modal window for entering:
  - Quantity of offered items
  - Message with additional information
- Send response to organizer

### Venue View: Organizer

**Displays:**
- All venue functions
- Predicted volunteer turnout for each item/service
- Number of responses
- Total quantity of offered items
- List of volunteers with their offers

**Functionality:**
- Three status buttons for each item/service:
  - "Need a lot" (red)
  - "Need few more" (orange)
  - "Don't need" (green)
- Ability to expand response details
- View messages from volunteers

**Note:** Organizer sees this interface only for their venues

### Venue View: Beneficiary

**Displays:**
- Only Distribution Points
- List of available items
- Distribution point hours
- Expected number of beneficiaries
- Important information (Special Requests)

**Functionality:**
- "I will be there" button to confirm attendance
- After confirmation, button changes to "Confirmed"
- Helps organizers plan distribution

**Note:** Other venue functions (Collection Point, Services Needed) are displayed for information only

## Role System

Current user role determines:
1. Which markers are highlighted on map
2. Whether ETA is shown
3. Which venue view is used
4. What actions are available

### Role Switching (for testing)

`UserRoleSwitcher` component allows switching between users:
- John Smith - Organizer (org-1)
- Maria Garcia - Organizer (org-2)
- Alex Johnson - Volunteer
- Sarah Williams - Volunteer
- Mohammed Ali - Beneficiary
- Elena Petrov - Beneficiary

## Technical Details

### Distance and ETA Calculation

Haversine formula is used to calculate distance over a sphere:
```typescript
function calculateDistance(lat1, lon1, lat2, lon2): number
```

ETA calculated based on average speed of 30 km/h:
```typescript
function calculateETA(distanceKm): string
```

### Custom Markers

Custom icon is used for distribution points:
- Green teardrop-shaped marker
- Emoji 📦 in center
- Glow for better visibility

### Integration with Existing Components

- `LeafletMap` updated to support:
  - Rich popups with function information
  - Custom markers for highlighting
  - ETA in popups
- All new views integrated into `/app/venues/[id]/page.tsx`
- Map on `/app/map/page.tsx` updated with new capabilities

## Usage

### View Map as Different Users

1. Open `/map`
2. Use UserRoleSwitcher to switch role
3. Observe changes in map display:
   - Volunteer: sees ETA, can respond to needs
   - Organizer: sees ETA, manages need statuses
   - Beneficiary: sees highlighted distribution points, can confirm attendance

### View Venue

1. Click on marker on map or go to `/venues/[id]`
2. View automatically adapts to user role
3. Use corresponding actions:
   - Volunteer: click "Respond" to respond
   - Organizer: update need statuses
   - Beneficiary: click "I will be there" to confirm

## Future Improvements

- Integration with real API for saving responses and commitments
- Notifications for organizers about new responses
- Response history for volunteers
- Statistics for organizers
- Filter by function type on map
- Routing to venue through external maps

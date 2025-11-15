import { User } from './auth';

// Mock mode switch - set to false when backend is ready
export const USE_MOCK_API = true;

// Mock role - change this to test different roles:
// 'beneficiary' - shows beneficiary profile with requests
// 'volunteer' - shows volunteer profile with responses to venues
// 'organizer' - shows organizer profile with managed venues
export const MOCK_ROLE: 'beneficiary' | 'volunteer' | 'organizer' = 'organizer';

// Mock user data based on role
export function getMockUser(role: 'beneficiary' | 'volunteer' | 'organizer'): User {
  const baseUser = {
    id: 1,
    first_name: '',
    last_name: '',
    email: '',
    phone: '+357000000',
    municipality: '',
    is_organization: false,
    organization_name: '',
    volunteer_areas_of_interest: '',
    volunteer_services: '',
    interested_in_donations: false,
    association_name: '',
  };

  if (role === 'beneficiary') {
    return {
      ...baseUser,
      role: 'beneficiary',
      first_name: 'Anna',
      last_name: 'Papadopoulou',
      email: 'anna@example.com',
      municipality: 'Limassol',
      is_organization: false,
      organization_name: '',
    };
  } else if (role === 'volunteer') {
    return {
      ...baseUser,
      role: 'volunteer',
      first_name: 'Nikos',
      last_name: 'Georgiou',
      email: 'nikos@example.com',
      municipality: 'Nicosia',
      volunteer_areas_of_interest: 'sorting, logistics, transport',
      volunteer_services: '',
      interested_in_donations: false,
    };
  } else {
    return {
      ...baseUser,
      role: 'organizer',
      first_name: 'Maria',
      last_name: 'Ioannou',
      email: 'maria@ngo.org',
      municipality: 'Limassol',
      association_name: 'Limassol Volunteers Association',
    };
  }
}

// Mock beneficiary requests
export function getMockBeneficiaryRequests() {
  return [
    {
      id: 101,
      title: 'Need help with house cleaning after fire',
      description: 'Smoke damage in the living room, need 2–3 volunteers to help clean up. Urgent assistance needed.',
      status: 'open',
      location: 'Limassol, Agios Nikolaos',
      municipality: 'Limassol',
      created_at: '2025-01-15T10:30:00Z',
    },
    {
      id: 102,
      title: 'Food supplies needed for family of 4',
      description: 'Temporary housing situation, need basic food supplies for the next week.',
      status: 'open',
      location: 'Limassol, City Center',
      municipality: 'Limassol',
      created_at: '2025-01-18T14:20:00Z',
    },
    {
      id: 103,
      title: 'Transportation assistance required',
      description: 'Need help moving essential belongings to temporary accommodation.',
      status: 'closed',
      location: 'Limassol, Tourist Area',
      municipality: 'Limassol',
      created_at: '2025-01-10T09:15:00Z',
    },
  ];
}

// Mock volunteer responses
export function getMockVolunteerResponses() {
  return [
    {
      id: 201,
      venue_id: 301,
      venue_name: 'Community Center Agios Nikolaos',
      venue_location: 'Nicosia, Agios Nikolaos',
      municipality: 'Nicosia',
      status: 'active',
      help_offered: 'Can help with sorting supplies on weekends. Available Saturday and Sunday mornings.',
      created_at: '2025-01-12T08:00:00Z',
      venue: {
        id: 301,
        name: 'Community Center Agios Nikolaos',
        location: 'Nicosia, Agios Nikolaos',
      },
    },
    {
      id: 202,
      venue_id: 302,
      venue_name: 'Limassol Evacuation Point',
      venue_location: 'Limassol, City Center',
      municipality: 'Limassol',
      status: 'cancelled',
      help_offered: 'Initially available for logistics support, now cancelled due to schedule conflict.',
      created_at: '2025-01-08T11:30:00Z',
      venue: {
        id: 302,
        name: 'Limassol Evacuation Point',
        location: 'Limassol, City Center',
      },
    },
    {
      id: 203,
      venue_id: 303,
      venue_name: 'Paphos Distribution Hub',
      venue_location: 'Paphos, Old Town',
      municipality: 'Paphos',
      status: 'active',
      help_offered: 'Transportation and delivery services. Available weekdays.',
      created_at: '2025-01-20T15:45:00Z',
      venue: {
        id: 303,
        name: 'Paphos Distribution Hub',
        location: 'Paphos, Old Town',
      },
    },
  ];
}

// Mock organizer venues
export function getMockOrganizerVenues() {
  return [
    {
      id: 301,
      name: 'Limassol Volunteers Warehouse',
      location: 'Limassol, Industrial Area',
      municipality: 'Limassol',
      capacity: 'Storage for up to 200 boxes',
      description: 'Main hub for incoming donations. Equipped with sorting areas and temporary storage.',
      type: 'warehouse',
      created_at: '2025-01-05T10:00:00Z',
    },
    {
      id: 302,
      name: 'Nicosia Support Point',
      location: 'Nicosia, City Center',
      municipality: 'Nicosia',
      capacity: 'Can host 30 people',
      description: 'Temporary shelter during evacuations. Has basic facilities and emergency supplies.',
      type: 'shelter',
      created_at: '2025-01-08T14:20:00Z',
    },
    {
      id: 303,
      name: 'Paphos Distribution Hub',
      location: 'Paphos, Old Town',
      municipality: 'Paphos',
      capacity: 'Medium capacity distribution center',
      description: 'Regional distribution point for food and supplies. Open daily 9am-5pm.',
      type: 'distribution',
      created_at: '2025-01-12T09:30:00Z',
    },
  ];
}


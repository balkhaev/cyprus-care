/**
 * Real User API Examples
 * Based on actual backend response structure
 */

import { User, getUserFullName, parseVolunteerAreas, parseVolunteerServices, userToLegacy } from './auth';

// ===== REAL API RESPONSE EXAMPLE =====

/**
 * Example 1: Beneficiary User
 * This is exactly what the API returns
 */
export const beneficiaryExample: User = {
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
};

/**
 * Example 2: Volunteer User with interests
 */
export const volunteerExample: User = {
  id: 2,
  first_name: "Nikos",
  last_name: "Georgiou",
  email: "nikos@example.com",
  role: "volunteer",
  phone: "+35799111222",
  municipality: "Nicosia",
  is_organization: false,
  organization_name: "",
  volunteer_areas_of_interest: "Education,Healthcare,Food Distribution",
  volunteer_services: "Teaching,Medical assistance,Driving",
  interested_in_donations: false,
  association_name: ""
};

/**
 * Example 3: Organizer representing an organization
 */
export const organizerExample: User = {
  id: 3,
  first_name: "Maria",
  last_name: "Konstantinou",
  email: "maria@redcross.cy",
  role: "organizer",
  phone: "+35799333444",
  municipality: "Larnaca",
  is_organization: true,
  organization_name: "Red Cross Cyprus",
  volunteer_areas_of_interest: "",
  volunteer_services: "",
  interested_in_donations: false,
  association_name: ""
};

/**
 * Example 4: Beneficiary from association
 */
export const beneficiaryWithAssociationExample: User = {
  id: 4,
  first_name: "Petros",
  last_name: "Ioannou",
  email: "petros@example.com",
  role: "beneficiary",
  phone: "+35799555666",
  municipality: "Paphos",
  is_organization: false,
  organization_name: "",
  volunteer_areas_of_interest: "",
  volunteer_services: "",
  interested_in_donations: true,
  association_name: "Paphos Community Center"
};

// ===== HELPER FUNCTIONS USAGE =====

/**
 * Get full name from user
 * Example usage:
 * 
 * const fullName = getUserFullName(beneficiaryExample);
 * // Output: "Anna Papadopoulou"
 */

/**
 * Parse volunteer areas
 * Example usage:
 * 
 * const volunteerAreas = parseVolunteerAreas(volunteerExample.volunteer_areas_of_interest);
 * // Output: ["Education", "Healthcare", "Food Distribution"]
 */

/**
 * Parse volunteer services
 * Example usage:
 * 
 * const volunteerServices = parseVolunteerServices(volunteerExample.volunteer_services);
 * // Output: ["Teaching", "Medical assistance", "Driving"]
 */

/**
 * Convert to legacy format for backward compatibility
 * Example usage:
 * 
 * const legacyUser = userToLegacy(beneficiaryExample);
 * // Output: {
 * //   id: "1",
 * //   email: "anna@example.com",
 * //   name: "Anna Papadopoulou",
 * //   role: "beneficiary",
 * //   phone: "+357000000",
 * //   isActive: true,
 * //   isEmailVerified: true,
 * //   createdAt: "2024-11-15T...",
 * //   updatedAt: "2024-11-15T..."
 * // }
 */

// ===== REACT COMPONENT EXAMPLES =====
// Note: These are commented out because this is a .ts file, not .tsx
// To use React components, create a .tsx file in your components folder

/**
 * Example: Display user profile in React
 * 
 * export function UserProfileCard({ user }: { user: User }) {
 *   return (
 *     <div className="user-profile">
 *       <h2>{getUserFullName(user)}</h2>
 *       <p>Email: {user.email}</p>
 *       <p>Phone: {user.phone}</p>
 *       <p>Municipality: {user.municipality}</p>
 *       <p>Role: {user.role}</p>
 *       
 *       {user.is_organization && (
 *         <p>Organization: {user.organization_name}</p>
 *       )}
 *       
 *       {user.role === 'volunteer' && (
 *         <>
 *           <div>
 *             <h3>Areas of Interest</h3>
 *             <ul>
 *               {parseVolunteerAreas(user.volunteer_areas_of_interest).map(area => (
 *                 <li key={area}>{area}</li>
 *               ))}
 *             </ul>
 *           </div>
 *           <div>
 *             <h3>Services</h3>
 *             <ul>
 *               {parseVolunteerServices(user.volunteer_services).map(service => (
 *                 <li key={service}>{service}</li>
 *               ))}
 *             </ul>
 *           </div>
 *         </>
 *       )}
 *       
 *       {user.role === 'beneficiary' && (
 *         <>
 *           {user.interested_in_donations && (
 *             <p>✓ Interested in donations</p>
 *           )}
 *           {user.association_name && (
 *             <p>Association: {user.association_name}</p>
 *           )}
 *         </>
 *       )}
 *     </div>
 *   );
 * }
 */

/**
 * Example: Registration form data
 */
export function createRegistrationPayload(formData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'organizer' | 'volunteer' | 'beneficiary';
  phone: string;
  municipality: string;
  isOrganization?: boolean;
  organizationName?: string;
  volunteerAreas?: string[];
  volunteerServices?: string[];
  interestedInDonations?: boolean;
  associationName?: string;
}) {
  return {
    email: formData.email,
    password: formData.password,
    first_name: formData.firstName,
    last_name: formData.lastName,
    role: formData.role,
    phone: formData.phone,
    municipality: formData.municipality,
    is_organization: formData.isOrganization || false,
    organization_name: formData.organizationName || "",
    volunteer_areas_of_interest: formData.volunteerAreas?.join(',') || "",
    volunteer_services: formData.volunteerServices?.join(',') || "",
    interested_in_donations: formData.interestedInDonations || false,
    association_name: formData.associationName || ""
  };
}

// ===== API CALL EXAMPLES =====

/**
 * Example: Fetch current user
 */
export async function getCurrentUser(): Promise<User> {
  const response = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    return data.data; // This is the User object
  }
  
  throw new Error(data.error.message);
}

/**
 * Example: Register new user
 */
export async function registerUser(formData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'organizer' | 'volunteer' | 'beneficiary';
  phone: string;
  municipality: string;
}) {
  const payload = createRegistrationPayload(formData);
  
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Save tokens
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    
    // Return user
    return data.data.user as User;
  }
  
  throw new Error(data.error.message);
}

/**
 * Example: Update user profile
 */
export async function updateUserProfile(updates: Partial<{
  first_name: string;
  last_name: string;
  phone: string;
  municipality: string;
  organization_name: string;
  volunteer_areas_of_interest: string;
  volunteer_services: string;
}>) {
  const response = await fetch('/api/auth/profile', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  const data = await response.json();
  
  if (data.success) {
    return data.data.user as User;
  }
  
  throw new Error(data.error.message);
}

// ===== TYPE GUARDS =====

/**
 * Check if user is an organizer
 */
export function isOrganizer(user: User): boolean {
  return user.role === 'organizer';
}

/**
 * Check if user is a volunteer
 */
export function isVolunteer(user: User): boolean {
  return user.role === 'volunteer';
}

/**
 * Check if user is a beneficiary
 */
export function isBeneficiary(user: User): boolean {
  return user.role === 'beneficiary';
}

/**
 * Check if user represents an organization
 */
export function isOrganizationUser(user: User): boolean {
  return user.is_organization && !!user.organization_name;
}

/**
 * Check if volunteer has specific area of interest
 */
export function hasVolunteerArea(user: User, area: string): boolean {
  if (!isVolunteer(user)) return false;
  const areas = parseVolunteerAreas(user.volunteer_areas_of_interest);
  return areas.includes(area);
}

/**
 * Check if volunteer offers specific service
 */
export function offersService(user: User, service: string): boolean {
  if (!isVolunteer(user)) return false;
  const services = parseVolunteerServices(user.volunteer_services);
  return services.includes(service);
}

// ===== DISPLAY HELPERS =====

/**
 * Get user display name with role
 */
export function getUserDisplayNameWithRole(user: User): string {
  const name = getUserFullName(user);
  const roleLabels = {
    organizer: 'Organizer',
    volunteer: 'Volunteer',
    beneficiary: 'Beneficiary',
    admin: 'Admin'
  };
  return `${name} (${roleLabels[user.role]})`;
}

/**
 * Get user initials
 */
export function getUserInitials(user: User): string {
  const firstInitial = user.first_name.charAt(0).toUpperCase();
  const lastInitial = user.last_name.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}

/**
 * Format user for display in list
 */
export function formatUserForList(user: User) {
  return {
    id: user.id,
    name: getUserFullName(user),
    initials: getUserInitials(user),
    email: user.email,
    phone: user.phone,
    municipality: user.municipality,
    role: user.role,
    isOrganization: user.is_organization,
    organizationName: user.organization_name || undefined
  };
}


// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://example.com';

// Import mock mode flag
import { USE_MOCK_API } from './mockData';

// API helper functions
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  if (USE_MOCK_API) {
    // Return a mock response for mock mode
    return new Response(JSON.stringify({}), { status: 200 });
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
  });
}

// Profile API helpers with mock support
export async function getBeneficiaryRequests(userId: number): Promise<any[]> {
  if (USE_MOCK_API) {
    const { getMockBeneficiaryRequests } = await import('./mockData');
    return Promise.resolve(getMockBeneficiaryRequests());
  }

  const token = localStorage.getItem('authToken');
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE_URL}/api/requests/my/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error('Error loading requests:', err);
  }
  return [];
}

export async function updateRequest(requestId: number, data: any): Promise<boolean> {
  if (USE_MOCK_API) {
    // Mock update - just return success
    return Promise.resolve(true);
  }

  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/api/requests/${requestId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error('Error updating request:', err);
    return false;
  }
}

export async function getVolunteerResponses(userId: number): Promise<any[]> {
  if (USE_MOCK_API) {
    const { getMockVolunteerResponses } = await import('./mockData');
    return Promise.resolve(getMockVolunteerResponses());
  }

  const token = localStorage.getItem('authToken');
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE_URL}/api/my/responses/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error('Error loading responses:', err);
  }
  return [];
}

export async function cancelResponse(responseId: number): Promise<boolean> {
  if (USE_MOCK_API) {
    // Mock cancel - just return success
    return Promise.resolve(true);
  }

  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/api/responses/${responseId}/cancel/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });
    return res.ok;
  } catch (err) {
    console.error('Error cancelling response:', err);
    return false;
  }
}

export async function getOrganizerVenues(userId: number): Promise<any[]> {
  if (USE_MOCK_API) {
    const { getMockOrganizerVenues } = await import('./mockData');
    return Promise.resolve(getMockOrganizerVenues());
  }

  const token = localStorage.getItem('authToken');
  if (!token) return [];

  try {
    const res = await fetch(`${API_BASE_URL}/api/my/venues/`, {
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || [];
    }
  } catch (err) {
    console.error('Error loading venues:', err);
  }
  return [];
}

export async function updateVenue(venueId: number, data: any): Promise<boolean> {
  if (USE_MOCK_API) {
    // Mock update - just return success
    return Promise.resolve(true);
  }

  const token = localStorage.getItem('authToken');
  if (!token) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/api/venues/${venueId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error('Error updating venue:', err);
    return false;
  }
}

export async function updateUserProfile(data: any): Promise<any | null> {
  if (USE_MOCK_API) {
    // Mock update - return updated user data
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const updatedUser = { ...user, ...data };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  }

  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/me/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return updatedUser;
    }
  } catch (err) {
    console.error('Error updating profile:', err);
  }
  return null;
}


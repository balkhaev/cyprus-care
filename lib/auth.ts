import { API_BASE_URL } from './api';
import { USE_MOCK_API, MOCK_ROLE, getMockUser } from './mockData';
import { User as ContractUser, UserRole } from '@/contracts/auth';

export type { UserRole };
export type User = ContractUser;

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined') return null;
  
  // Mock mode: return mock user based on MOCK_ROLE
  if (USE_MOCK_API) {
    // Set a mock token if not present
    if (!localStorage.getItem('authToken')) {
      localStorage.setItem('authToken', 'mock-token');
    }
    const mockUser = getMockUser(MOCK_ROLE);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    return mockUser;
  }
  
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/me/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (res.ok) {
      const user = await res.json();
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    } else {
      // Token invalid, clear it
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return null;
    }
  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
}


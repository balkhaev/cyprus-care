'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, User, UserRole } from '@/lib/auth';
import { USE_MOCK_API } from '@/lib/mockData';
import BeneficiaryProfile from '@/components/profiles/BeneficiaryProfile';
import VolunteerProfile from '@/components/profiles/VolunteerProfile';
import OrganizerProfile from '@/components/profiles/OrganizerProfile';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      // In mock mode, we can work without a token
      if (!USE_MOCK_API) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (!token) {
          router.push('/login');
          return;
        }
      }

      const userData = await getCurrentUser();
      if (!userData) {
        if (!USE_MOCK_API) {
          router.push('/login');
        }
        return;
      }

      setUser(userData);
      setLoading(false);
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bgsoft text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const roleLabels: Record<UserRole, string> = {
    beneficiary: 'Beneficiary',
    volunteer: 'Volunteer',
    organizer: 'Organizer',
    admin: 'Admin',
    guest: 'Guest'
  };

  return (
    <div className="min-h-screen bg-bgsoft text-slate-900 flex justify-center px-4 py-8">
      <div className="w-full max-w-5xl mx-auto">
        {USE_MOCK_API && (
          <div className="mb-4 p-2 bg-primary/10 border border-primary/30 rounded-lg text-xs text-primary text-center">
            Mock data mode
          </div>
        )}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-sm md:text-base text-slate-600">{roleLabels[user.role]}</p>
        </div>

        {user.role === 'beneficiary' && <BeneficiaryProfile user={user} onUserUpdate={setUser} />}
        {user.role === 'volunteer' && <VolunteerProfile user={user} onUserUpdate={setUser} />}
        {user.role === 'organizer' && <OrganizerProfile user={user} onUserUpdate={setUser} />}
      </div>
    </div>
  );
}


'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<'beneficiary' | 'volunteer' | 'organizer'>('beneficiary');
  const [userType, setUserType] = useState<'person' | 'organization'>('person');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    municipality: '',
    organizationName: '',
    areaOfInterest: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setLoading(true);
    
    try {
      let endpoint = '';
      let payload: any = {
        first_name: formData.name,
        last_name: formData.surname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      if (role === 'beneficiary') {
        endpoint = '/api/auth/register/beneficiary/';
        payload.municipality = formData.municipality;
        payload.is_organization = userType === 'organization';
        payload.organization_name = userType === 'organization' ? formData.organizationName : '';
      } else if (role === 'volunteer') {
        endpoint = '/api/auth/register/volunteer/';
        payload.volunteer_areas_of_interest = formData.areaOfInterest;
        payload.volunteer_services = '';
        payload.interested_in_donations = false;
      } else if (role === 'organizer') {
        endpoint = '/api/auth/register/organizer/';
        payload.association_name = formData.organizationName;
      }
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgsoft text-slate-900 w-full flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Join the Relief Network</h1>
        <p className="text-sm md:text-base text-slate-600 mb-6">Together we build stronger communities</p>
        
        {error && (
          <div className="mb-4 p-4 text-danger bg-danger/5 border border-danger/30 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-slate-700 mb-3">I am a:</label>
          <div className="grid grid-cols-3 gap-3">
            {['beneficiary', 'volunteer', 'organizer'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r as any)}
                className={`py-3 rounded-xl font-semibold transition-colors ${
                  role === r
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white border-2 border-gray-200 text-slate-700 hover:border-primary/30'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields */}
          <input
            type="text"
            placeholder="First Name"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Surname"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
            value={formData.surname}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />

          {/* Beneficiary Fields */}
          {role === 'beneficiary' && (
            <>
              <input
                type="text"
                placeholder="General Location / Municipality"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('person')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    userType === 'person' ? 'bg-secondary text-white shadow-md' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                  }`}
                >
                  Person
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('organization')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    userType === 'organization' ? 'bg-secondary text-white shadow-md' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                  }`}
                >
                  Organization
                </button>
              </div>
              {userType === 'organization' && (
                <input
                  type="text"
                  placeholder="Organisation Name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  required
                />
              )}
            </>
          )}

          {/* Volunteer Fields */}
          {role === 'volunteer' && (
            <input
              type="text"
              placeholder="Area of Interest"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
              value={formData.areaOfInterest}
              onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
              required
            />
          )}

          {/* Organizer Fields */}
          {role === 'organizer' && (
            <input
              type="text"
              placeholder="Association / Organisation Name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg font-semibold rounded-xl bg-primary text-white shadow-md hover:bg-primary/80 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm md:text-base text-slate-600">
          Already have an account?{' '}
          <a href="/login" className="text-secondary font-semibold hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
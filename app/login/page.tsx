'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('authToken', data.token);
        if (data.user) {
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        router.push('/map');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || data.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgsoft text-slate-900 w-full flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
        <p className="text-sm md:text-base text-slate-600 mb-6">Sign in to continue helping your community</p>

        {error && (
          <div className="mb-4 p-4 text-danger bg-danger/5 border border-danger/30 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:border-primary focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg font-semibold rounded-xl bg-primary text-white shadow-md hover:bg-primary/80 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm md:text-base text-slate-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-secondary font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

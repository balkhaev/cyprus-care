'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getCurrentUser } from '@/lib/mock-data/user-roles';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect authenticated users to venues
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.role !== 'guest') {
      router.replace('/venues');
    }
  }, [router]);

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
        
        // Django REST Framework returns token in response
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          
          // Fetch user profile after login
          try {
            const userRes = await fetch(`${API_BASE_URL}/api/me/`, {
              headers: {
                'Authorization': `Token ${data.token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (userRes.ok) {
              const user = await userRes.json();
              localStorage.setItem('currentUser', JSON.stringify(user));
            }
          } catch (userErr) {
            console.error('Error fetching user profile:', userErr);
            // Continue anyway - user can be fetched later
          }
          
          router.push('/map');
        } else {
          setError('Login successful but no token received. Please try again.');
        }
      } else {
        // Handle Django REST Framework error responses
        const errorData = await res.json().catch(() => ({}));
        
        // Django may return errors in different formats
        if (errorData.non_field_errors) {
          setError(Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors[0] 
            : errorData.non_field_errors);
        } else if (errorData.error) {
          setError(typeof errorData.error === 'string' 
            ? errorData.error 
            : errorData.error.message || 'Invalid email or password.');
        } else if (errorData.message) {
          setError(errorData.message);
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else {
          setError('Invalid email or password. Please check your credentials.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgsoft w-full flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to continue helping your community
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex-col">
          <p className="text-center text-base text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-secondary font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

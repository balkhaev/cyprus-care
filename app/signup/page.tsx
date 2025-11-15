'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Heart, Building, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Role = 'beneficiary' | 'volunteer' | 'organizer';
type Step = 1 | 2 | 3 | 4;

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') as Role | null;
  
  const [currentStep, setCurrentStep] = useState<Step>(initialRole ? 2 : 1);
  const [role, setRole] = useState<Role>(initialRole || 'volunteer');
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

  const roles = [
    {
      value: 'volunteer' as const,
      title: 'Volunteer',
      description: 'Offer your time and skills',
      icon: Heart,
    },
    {
      value: 'organizer' as const,
      title: 'Organizer',
      description: 'Coordinate relief efforts',
      icon: Building,
    },
    {
      value: 'beneficiary' as const,
      title: 'Get Help',
      description: 'Access support services',
      icon: Users,
    },
  ];

  const steps = [
    { number: 1, title: 'Choose Role' },
    { number: 2, title: 'Basic Info' },
    { number: 3, title: 'Details' },
    { number: 4, title: 'Complete' },
  ];

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
      let payload: Record<string, string | boolean> = {
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
        const data = await res.json();
        
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          
          if (data.user) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
          } else {
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
            }
          }
          
          setCurrentStep(4);
        } else {
          router.push('/login');
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMessages: string[] = [];
        
        if (errorData.non_field_errors) {
          const nonFieldErrors = Array.isArray(errorData.non_field_errors) 
            ? errorData.non_field_errors 
            : [errorData.non_field_errors];
          errorMessages.push(...nonFieldErrors);
        }
        
        Object.keys(errorData).forEach((field) => {
          if (field !== 'non_field_errors' && errorData[field]) {
            const fieldErrors = Array.isArray(errorData[field]) 
              ? errorData[field] 
              : [errorData[field]];
            fieldErrors.forEach((err: string) => {
              errorMessages.push(`${field.replace(/_/g, ' ')}: ${err}`);
            });
          }
        });
        
        if (errorMessages.length > 0) {
          setError(errorMessages.join('. '));
        } else if (errorData.error) {
          setError(typeof errorData.error === 'string' 
            ? errorData.error 
            : errorData.error.message || 'Registration failed. Please check your information.');
        } else if (errorData.message) {
          setError(errorData.message);
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else {
          setError('Registration failed. Please check your information and try again.');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep3 = formData.name && formData.surname && formData.email && formData.password && formData.confirmPassword && formData.phone;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Join the relief network and make a difference</CardDescription>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mt-6 relative">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    currentStep > step.number
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.number
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="text-xs mt-2 text-muted-foreground hidden sm:block">
                  {step.title}
                </span>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 left-[50%] w-full h-0.5 -z-10",
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    )}
                    style={{ width: 'calc(100% + 2rem)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Choose Role */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Label className="text-base font-medium">I am a:</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                        role === r.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <Icon className={cn("h-6 w-6", role === r.value ? "text-primary" : "text-muted-foreground")} />
                      <div className="text-center">
                        <div className="font-semibold text-sm">{r.title}</div>
                        <div className="text-xs text-muted-foreground">{r.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button onClick={() => setCurrentStep(2)} className="w-full" size="lg">
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {currentStep === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(3); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">First Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input
                    id="surname"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="w-full">
                  Back
                </Button>
                <Button type="submit" className="w-full" disabled={!canProceedToStep3}>
                  Continue
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Role-specific Details */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {role === 'beneficiary' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="municipality">Municipality / Location</Label>
                    <Input
                      id="municipality"
                      value={formData.municipality}
                      onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setUserType('person')}
                        className={cn(
                          "flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium",
                          userType === 'person'
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        Person
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserType('organization')}
                        className={cn(
                          "flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium",
                          userType === 'organization'
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        Organization
                      </button>
                    </div>
                  </div>
                  
                  {userType === 'organization' && (
                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name</Label>
                      <Input
                        id="organizationName"
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        required
                      />
                    </div>
                  )}
                </>
              )}

              {role === 'volunteer' && (
                <div className="space-y-2">
                  <Label htmlFor="areaOfInterest">Areas of Interest</Label>
                  <Input
                    id="areaOfInterest"
                    placeholder="e.g. logistics, sorting, transport"
                    value={formData.areaOfInterest}
                    onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                    required
                  />
                </div>
              )}

              {role === 'organizer' && (
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Association / Organization Name</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="w-full">
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="text-center space-y-6 py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent">
                <Check className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Welcome to ENOCYPRUS!</h3>
                <p className="text-muted-foreground">
                  Your account has been created successfully. You're now ready to make a difference.
                </p>
              </div>
              <Button onClick={() => router.push('/map')} size="lg" className="w-full">
                Get Started
              </Button>
            </div>
          )}

          {/* Sign In Link */}
          {currentStep < 4 && (
            <p className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
              Already have an account?{' '}
              <a href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted border-t-primary"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}

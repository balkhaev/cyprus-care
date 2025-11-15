'use client';
import { useState, useEffect } from 'react';
import { getVolunteerResponses, cancelResponse, updateUserProfile } from '@/lib/api';
import { USE_MOCK_API } from '@/lib/mockData';
import { User as AuthUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Edit2, 
  X, 
  Check, 
  Clock, 
  XCircle, 
  MapPin, 
  Calendar,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { statusColors } from '@/lib/theme-utils';

interface VolunteerProfileProps {
  user: AuthUser;
  onUserUpdate: (user: AuthUser) => void;
}

export default function VolunteerProfile({ user, onUserUpdate }: VolunteerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    volunteer_areas_of_interest: user.volunteer_areas_of_interest || '',
  });
  const [responses, setResponses] = useState<Record<string, string | number>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewingResponse, setViewingResponse] = useState<Record<string, string | number> | null>(null);

  useEffect(() => {
    loadResponses();
  }, [user.id]);

  const loadResponses = async () => {
    try {
      const data = await getVolunteerResponses(user.id);
      setResponses(data);
    } catch (err) {
      console.error('Error loading responses:', err);
    }
  };

  const handleSaveDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const updatedUser = await updateUserProfile(editData);
      if (updatedUser) {
        onUserUpdate(updatedUser);
        setIsEditing(false);
      } else {
        setError('Failed to update profile.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelResponse = async (responseId: number) => {
    if (!confirm('Are you sure you want to cancel this response?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await cancelResponse(responseId);
      if (success) {
        if (USE_MOCK_API) {
          setResponses(responses.map(r => r.id === responseId ? { ...r, status: 'cancelled' } : r));
        } else {
          await loadResponses();
        }
      } else {
        setError('Failed to cancel response.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Check className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <Check className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'outline';
      case 'completed':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* My Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Details</CardTitle>
              <CardDescription>Your profile information</CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={editData.first_name}
                    onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={editData.last_name}
                    onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="areas">Areas of Interest</Label>
                <Textarea
                  id="areas"
                  value={editData.volunteer_areas_of_interest}
                  onChange={(e) => setEditData({ ...editData, volunteer_areas_of_interest: e.target.value })}
                  placeholder="e.g. sorting, logistics, transport"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">First Name</Label>
                  <p className="text-base font-medium mt-1">{user.first_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Last Name</Label>
                  <p className="text-base font-medium mt-1">{user.last_name}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Email</Label>
                <p className="text-base font-medium mt-1">{user.email}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Phone</Label>
                <p className="text-base font-medium mt-1">{user.phone}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Areas of Interest</Label>
                <p className="text-base font-medium mt-1">
                  {user.volunteer_areas_of_interest || 'Not set'}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        {isEditing && (
          <CardFooter className="flex gap-3">
            <Button
              onClick={handleSaveDetails}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditData({
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  phone: user.phone,
                  volunteer_areas_of_interest: user.volunteer_areas_of_interest || '',
                });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* My Responses Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Responses</CardTitle>
          <CardDescription>Venues you've offered to help</CardDescription>
        </CardHeader>

        <CardContent>
          {responses.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Heart className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No responses yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start helping by responding to venues in need
              </p>
              <Button asChild>
                <a href="/map">Browse Venues</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {responses.map((response) => (
                <Card key={response.id as string} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-base truncate">
                            {(response.venue_name || response.venue?.name || 'Unnamed Venue') as string}
                          </h4>
                          <Badge 
                            variant={getStatusVariant(response.status as string)}
                            className="shrink-0"
                          >
                            <span className="flex items-center gap-1">
                              {getStatusIcon(response.status as string)}
                              {response.status as string}
                            </span>
                          </Badge>
                        </div>
                        
                        {(response.venue_location || response.venue?.location) && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="truncate">
                              {(response.venue_location || response.venue?.location) as string}
                            </span>
                          </div>
                        )}
                        
                        {response.help_offered && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {response.help_offered as string}
                          </p>
                        )}
                        
                        {response.created_at && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(response.created_at as string).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewingResponse(response)}
                        >
                          Details
                        </Button>
                        {response.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelResponse(response.id as number)}
                            disabled={loading}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Response Details Dialog */}
      {viewingResponse && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setViewingResponse(null)}
        >
          <Card 
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Response Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewingResponse(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm">Venue</Label>
                <p className="text-base font-medium mt-1">
                  {(viewingResponse.venue_name || viewingResponse.venue?.name || 'Unknown') as string}
                </p>
              </div>
              
              <div>
                <Label className="text-muted-foreground text-sm">Location</Label>
                <p className="text-base font-medium mt-1">
                  {(viewingResponse.venue_location || viewingResponse.venue?.location || 'No location') as string}
                </p>
              </div>
              
              {viewingResponse.help_offered && (
                <div>
                  <Label className="text-muted-foreground text-sm">Help Offered</Label>
                  <p className="text-base font-medium mt-1">{viewingResponse.help_offered as string}</p>
                </div>
              )}
              
              <div>
                <Label className="text-muted-foreground text-sm">Status</Label>
                <div className="mt-1">
                  <Badge variant={getStatusVariant(viewingResponse.status as string)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(viewingResponse.status as string)}
                      {viewingResponse.status as string}
                    </span>
                  </Badge>
                </div>
              </div>
              
              {viewingResponse.created_at && (
                <div>
                  <Label className="text-muted-foreground text-sm">Response Date</Label>
                  <p className="text-base font-medium mt-1">
                    {new Date(viewingResponse.created_at as string).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button onClick={() => setViewingResponse(null)} className="w-full">
                Close
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}


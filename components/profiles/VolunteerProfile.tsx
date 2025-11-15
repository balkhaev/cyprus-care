'use client';
import { useState, useEffect } from 'react';
import { getVolunteerResponses, cancelResponse, updateUserProfile } from '@/lib/api';
import { USE_MOCK_API } from '@/lib/mockData';
import { User as AuthUser } from '@/lib/auth';

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
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewingResponse, setViewingResponse] = useState<any | null>(null);

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
          // Update local state for mock mode
          setResponses(responses.map(r => r.id === responseId ? { ...r, status: 'cancelled' } : r));
        } else {
          // Reload responses from API
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

  return (
    <div className="space-y-6">
      {/* My Details */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold mb-3">My Details</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm md:text-base font-semibold rounded-xl bg-primary text-white shadow-md hover:bg-primary/80"
            >
              Edit Details
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-danger bg-danger/5 border border-danger/30 rounded-lg">
            {error}
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                value={editData.first_name}
                onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                value={editData.last_name}
                onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Areas of Interest</label>
              <textarea
                value={editData.volunteer_areas_of_interest}
                onChange={(e) => setEditData({ ...editData, volunteer_areas_of_interest: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                placeholder="e.g. sorting, logistics, transport"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveDetails}
                disabled={loading}
                className="px-4 py-2 text-sm md:text-base font-semibold rounded-xl bg-primary text-white shadow-md hover:bg-primary/80 disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
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
                className="px-4 py-2 text-sm md:text-base font-semibold rounded-xl bg-white text-slate-800 border border-secondary/40 hover:bg-secondary/5"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <span className="text-sm text-slate-600">First Name:</span>
              <p className="text-base font-medium text-slate-900">{user.first_name}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Last Name:</span>
              <p className="text-base font-medium text-slate-900">{user.last_name}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Email:</span>
              <p className="text-base font-medium text-slate-900">{user.email}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Phone:</span>
              <p className="text-base font-medium text-slate-900">{user.phone}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Areas of Interest:</span>
              <p className="text-base font-medium text-slate-900">
                {user.volunteer_areas_of_interest || 'Not set'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* My Responses to Venues */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">My Responses to Venues</h2>
        {responses.length === 0 ? (
          <p className="text-slate-600">No responses yet.</p>
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <div key={response.id} className="p-4 border border-primary/10 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {response.venue_name || response.venue?.name || 'Unnamed Venue'}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {response.venue_location || response.venue?.location || 'No location'}
                    </p>
                    {response.help_offered && (
                      <p className="text-sm text-slate-700 mt-2">
                        Help offered: {response.help_offered}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    response.status === 'active' ? 'bg-accent/20 text-accent' :
                    response.status === 'cancelled' ? 'bg-slate-200 text-slate-700' :
                    response.status === 'completed' ? 'bg-primary/20 text-primary' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {response.status || 'unknown'}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setViewingResponse(response)}
                    className="px-3 py-2 text-sm font-semibold rounded-full bg-white text-slate-800 border border-secondary/40 hover:bg-secondary/5"
                  >
                    View Details
                  </button>
                  {response.status === 'active' && (
                    <button
                      onClick={() => handleCancelResponse(response.id)}
                      disabled={loading}
                      className="px-3 py-2 text-sm font-semibold rounded-full bg-white text-slate-800 border border-danger/40 hover:bg-danger/5 text-danger"
                    >
                      Cancel Response
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Response Details Modal */}
      {viewingResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-semibold">Response Details</h3>
              <button
                onClick={() => setViewingResponse(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-600">Venue:</span>
                <p className="text-base font-medium text-slate-900">
                  {viewingResponse.venue_name || viewingResponse.venue?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-600">Location:</span>
                <p className="text-base font-medium text-slate-900">
                  {viewingResponse.venue_location || viewingResponse.venue?.location || 'No location'}
                </p>
              </div>
              {viewingResponse.help_offered && (
                <div>
                  <span className="text-sm text-slate-600">Help Offered:</span>
                  <p className="text-base font-medium text-slate-900">{viewingResponse.help_offered}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-slate-600">Status:</span>
                <p className="text-base font-medium text-slate-900 capitalize">
                  {viewingResponse.status || 'unknown'}
                </p>
              </div>
              {viewingResponse.created_at && (
                <div>
                  <span className="text-sm text-slate-600">Response Date:</span>
                  <p className="text-base font-medium text-slate-900">
                    {new Date(viewingResponse.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setViewingResponse(null)}
              className="mt-6 px-4 py-2 text-sm md:text-base font-semibold rounded-xl bg-primary text-white shadow-md hover:bg-primary/80"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


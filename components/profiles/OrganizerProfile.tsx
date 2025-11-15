'use client';
import { useState, useEffect } from 'react';
import { getOrganizerVenues, updateVenue, updateUserProfile } from '@/lib/api';
import { USE_MOCK_API } from '@/lib/mockData';
import { User as AuthUser } from '@/lib/auth';

interface OrganizerProfileProps {
  user: AuthUser;
  onUserUpdate: (user: AuthUser) => void;
}

export default function OrganizerProfile({ user, onUserUpdate }: OrganizerProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    association_name: user.association_name || '',
  });
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingVenue, setEditingVenue] = useState<any | null>(null);

  useEffect(() => {
    loadVenues();
  }, [user.id]);

  const loadVenues = async () => {
    try {
      const data = await getOrganizerVenues(user.id);
      setVenues(data);
    } catch (err) {
      console.error('Error loading venues:', err);
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

  const handleSaveVenue = async (venueData: any) => {
    setLoading(true);
    setError('');

    try {
      const success = await updateVenue(editingVenue.id, venueData);
      if (success) {
        if (USE_MOCK_API) {
          // Update local state for mock mode
          setVenues(venues.map(v => v.id === editingVenue.id ? { ...v, ...venueData } : v));
        } else {
          // Reload venues from API
          await loadVenues();
        }
        setEditingVenue(null);
      } else {
        setError('Failed to update venue.');
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Association Name</label>
              <input
                type="text"
                value={editData.association_name}
                onChange={(e) => setEditData({ ...editData, association_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
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
                    association_name: user.association_name || '',
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
              <span className="text-sm text-slate-600">Association Name:</span>
              <p className="text-base font-medium text-slate-900">
                {user.association_name || 'Not set'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* My Venues */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">My Venues</h2>
        {venues.length === 0 ? (
          <p className="text-slate-600">No venues yet.</p>
        ) : (
          <div className="space-y-4">
            {venues.map((venue) => (
              <div key={venue.id} className="p-4 border border-primary/10 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{venue.name || 'Unnamed Venue'}</h3>
                    <p className="text-sm text-slate-600 mt-1">{venue.location || 'No location'}</p>
                    {venue.description && (
                      <p className="text-sm text-slate-700 mt-2">{venue.description}</p>
                    )}
                    {venue.capacity && (
                      <p className="text-xs text-slate-500 mt-1">Capacity: {venue.capacity}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setEditingVenue(venue)}
                  className="mt-3 px-3 py-2 text-sm font-semibold rounded-full bg-white text-slate-800 border border-secondary/40 hover:bg-secondary/5"
                >
                  Edit Venue
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Venue Modal */}
      {editingVenue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Edit Venue</h3>
            <VenueEditForm
              venue={editingVenue}
              onSave={handleSaveVenue}
              onCancel={() => setEditingVenue(null)}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function VenueEditForm({ venue, onSave, onCancel, loading }: any) {
  const [formData, setFormData] = useState({
    name: venue.name || '',
    description: venue.description || '',
    location: venue.location || '',
    capacity: venue.capacity || '',
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Venue Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
        />
      </div>
      {formData.capacity && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
          />
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => onSave(formData)}
          disabled={loading}
          className="px-4 py-2 text-sm md:text-base font-semibold rounded-xl bg-primary text-white shadow-md hover:bg-primary/80 disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm md:text-base font-semibold rounded-xl bg-white text-slate-800 border border-secondary/40 hover:bg-secondary/5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}


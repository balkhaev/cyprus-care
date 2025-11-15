'use client';
import { useState, useEffect } from 'react';
import { getBeneficiaryRequests, updateRequest, updateUserProfile } from '@/lib/api';
import { USE_MOCK_API } from '@/lib/mockData';
import { User as AuthUser } from '@/lib/auth';

interface BeneficiaryProfileProps {
  user: AuthUser;
  onUserUpdate: (user: AuthUser) => void;
}

export default function BeneficiaryProfile({ user, onUserUpdate }: BeneficiaryProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    municipality: user.municipality,
    is_organization: user.is_organization,
    organization_name: user.organization_name || '',
  });
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingRequest, setEditingRequest] = useState<any | null>(null);

  useEffect(() => {
    loadRequests();
  }, [user.id]);

  const loadRequests = async () => {
    try {
      const data = await getBeneficiaryRequests(user.id);
      setRequests(data);
    } catch (err) {
      console.error('Error loading requests:', err);
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

  const handleSaveRequest = async (requestData: any) => {
    setLoading(true);
    setError('');

    try {
      const success = await updateRequest(editingRequest.id, requestData);
      if (success) {
        if (USE_MOCK_API) {
          // Update local state for mock mode
          setRequests(requests.map(r => 
            r.id === editingRequest.id ? { ...r, ...requestData } : r
          ));
        } else {
          // Reload requests from API
          await loadRequests();
        }
        setEditingRequest(null);
      } else {
        setError('Failed to update request.');
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Municipality</label>
              <input
                type="text"
                value={editData.municipality}
                onChange={(e) => setEditData({ ...editData, municipality: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={editData.is_organization}
                  onChange={(e) => setEditData({ ...editData, is_organization: e.target.checked })}
                  className="w-5 h-5 accent-primary"
                />
                <span className="text-sm font-medium text-slate-700">Organization</span>
              </label>
            </div>
            {editData.is_organization && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  value={editData.organization_name}
                  onChange={(e) => setEditData({ ...editData, organization_name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                />
              </div>
            )}
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
                    municipality: user.municipality,
                    is_organization: user.is_organization,
                    organization_name: user.organization_name || '',
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
              <span className="text-sm text-slate-600">Municipality:</span>
              <p className="text-base font-medium text-slate-900">{user.municipality || 'Not set'}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Type:</span>
              <p className="text-base font-medium text-slate-900">
                {user.is_organization ? 'Organization' : 'Person'}
              </p>
            </div>
            {user.is_organization && user.organization_name && (
              <div>
                <span className="text-sm text-slate-600">Organization Name:</span>
                <p className="text-base font-medium text-slate-900">{user.organization_name}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* My Requests */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">My Requests</h2>
        {requests.length === 0 ? (
          <p className="text-slate-600">No requests yet.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="p-4 border border-primary/10 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{request.title || 'Untitled Request'}</h3>
                    <p className="text-sm text-slate-600 mt-1">{request.description || 'No description'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    request.status === 'open' ? 'bg-accent/20 text-accent' :
                    request.status === 'closed' ? 'bg-slate-200 text-slate-700' :
                    'bg-primary/20 text-primary'
                  }`}>
                    {request.status || 'unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-slate-500">{request.location || 'No location'}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">
                    {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'No date'}
                  </span>
                </div>
                <button
                  onClick={() => setEditingRequest(request)}
                  className="mt-3 px-3 py-2 text-sm font-semibold rounded-full bg-white text-slate-800 border border-secondary/40 hover:bg-secondary/5"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Request Modal */}
      {editingRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-primary/10 p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Edit Request</h3>
            <RequestEditForm
              request={editingRequest}
              onSave={handleSaveRequest}
              onCancel={() => setEditingRequest(null)}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function RequestEditForm({ request, onSave, onCancel, loading }: any) {
  const [formData, setFormData] = useState({
    title: request.title || '',
    description: request.description || '',
    location: request.location || '',
    status: request.status || 'open',
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
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


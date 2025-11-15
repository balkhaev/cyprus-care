'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Plus, Building2, Warehouse, Home } from 'lucide-react';
import type { Venue, VenueType } from '@/types/venue';

// Temporary test data
const mockVenues: Venue[] = [
  {
    id: '1',
    title: 'Central Collection Point',
    description: 'Main collection point for humanitarian aid in the city center',
    type: 'collection_point',
    location: {
      lat: 55.7558,
      lng: 37.6173,
      address: 'Red Square, 1, Moscow',
    },
    operatingHours: [
      { dayOfWeek: 'Monday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Tuesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Wednesday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Thursday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Friday', openTime: '09:00', closeTime: '18:00', isClosed: false },
      { dayOfWeek: 'Saturday', openTime: '10:00', closeTime: '16:00', isClosed: false },
      { dayOfWeek: 'Sunday', openTime: '00:00', closeTime: '00:00', isClosed: true },
    ],
    organizerId: 'org-1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

const venueTypeIcons: Record<VenueType, React.ReactNode> = {
  collection_point: <Building2 className="h-5 w-5" />,
  distribution_hub: <Warehouse className="h-5 w-5" />,
  shelter: <Home className="h-5 w-5" />,
};

const venueTypeLabels: Record<VenueType, string> = {
  collection_point: 'Collection Point',
  distribution_hub: 'Distribution Hub',
  shelter: 'Shelter',
};

export default function VenuesPage() {
  const [venues] = useState<Venue[]>(mockVenues);

  const getTodayHours = (venue: Venue) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const hours = venue.operatingHours.find(h => h.dayOfWeek === today);
    
    if (!hours || hours.isClosed) {
      return 'Closed';
    }
    
    return `${hours.openTime} - ${hours.closeTime}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Venues
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Manage collection points, distribution hubs and shelters
              </p>
            </div>
            <Link
              href="/venues/new"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Venue
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {venues.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
              <MapPin className="h-8 w-8 text-zinc-400" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              No Venues
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Create your first venue to get started
            </p>
            <Link
              href="/venues/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Venue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300">
                        {venueTypeIcons[venue.type]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                          {venue.title}
                        </h3>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {venueTypeLabels[venue.type]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                    {venue.description}
                  </p>

                  {/* Location */}
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {venue.location.address}
                    </span>
                  </div>

                  {/* Operating hours */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      Today: {getTodayHours(venue)}
                    </span>
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                  <Link
                    href={`/venues/${venue.id}`}
                    className="flex-1 text-center px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/venues/${venue.id}/edit`}
                    className="flex-1 text-center px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

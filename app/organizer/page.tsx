'use client';

import Link from 'next/link';
import { User, Mail, Phone, MapPin, Calendar, Plus, Settings, LogOut, Building2 } from 'lucide-react';

export default function OrganizerPage() {
  // Temporary organizer data
  const organizer = {
    id: 'org-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+357 99 123 456',
    organization: 'Cyprus Relief Foundation',
    role: 'Organizer',
    joinedDate: 'January 15, 2024',
    venuesCount: 3,
    avatar: null,
  };

  const stats = [
    {
      label: 'Active Venues',
      value: '3',
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      label: 'Total Events',
      value: '12',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: 'Volunteers',
      value: '45',
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Organizer Profile
            </h1>
            <div className="flex items-center gap-3">
              <Link
                href="/organizer/settings"
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </Link>
              <button
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Profile card */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900"></div>

            {/* Information */}
            <div className="px-6 pb-6">
              <div className="flex items-start gap-6 -mt-16 mb-6">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-zinc-900 dark:bg-zinc-100 border-4 border-white dark:border-zinc-900 flex items-center justify-center shadow-lg">
                  <User className="h-16 w-16 text-white dark:text-zinc-900" />
                </div>

                {/* Main info */}
                <div className="flex-1 pt-16">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    {organizer.name}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                    {organizer.role} • {organizer.organization}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <Mail className="h-4 w-4" />
                      <span>{organizer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <Phone className="h-4 w-4" />
                      <span>{organizer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {organizer.joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Add venue button */}
                <div className="pt-16">
                  <Link
                    href="/venues/new"
                    className="flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    Add Venue
                  </Link>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 mb-2">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/venues"
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              >
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <MapPin className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Manage Venues
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    View and edit venues
                  </p>
                </div>
              </Link>

              <Link
                href="/venues/new"
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              >
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <Plus className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Create Venue
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Add new collection point or shelter
                  </p>
                </div>
              </Link>

              <Link
                href="/map"
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              >
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <MapPin className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Venue Map
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    View all venues on map
                  </p>
                </div>
              </Link>

              <Link
                href="/organizer/settings"
                className="flex items-start gap-4 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
              >
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                  <Settings className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Profile Settings
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Change profile information
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

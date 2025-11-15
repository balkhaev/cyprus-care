'use client';

import { useState } from 'react';
import { Users, ChevronDown } from 'lucide-react';
import { getCurrentUser, setCurrentUser, mockUsers, type User } from '@/lib/mock-data/user-roles';
import { getUserFullName } from '@/contracts/auth';

export default function UserRoleSwitcher() {
  const [currentUser, setCurrentUserState] = useState<User>(getCurrentUser());
  const [isOpen, setIsOpen] = useState(false);

  const handleUserChange = (userId: number) => {
    const userKey = Object.keys(mockUsers).find(key => mockUsers[key].id === userId);
    if (userKey) {
      setCurrentUser(userKey);
      setCurrentUserState(mockUsers[userKey]);
      setIsOpen(false);
      // Reload the page to update all components
      window.location.reload();
    }
  };

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'organizer':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'volunteer':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'beneficiary':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'guest':
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
      >
        <Users className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {getUserFullName(currentUser)}
          </span>
          <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getRoleBadgeColor(currentUser.role)}`}>
            {currentUser.role}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-zinc-200 dark:border-zinc-700">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide px-2 py-1">
                Switch User (Testing)
              </p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {Object.values(mockUsers).map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserChange(user.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors ${
                    user.id === currentUser.id ? 'bg-zinc-50 dark:bg-zinc-700' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {getUserFullName(user)}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {user.email}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


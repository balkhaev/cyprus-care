'use client';

import Link from 'next/link';
import { Building2, User } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface HeaderProps {
  actions?: React.ReactNode;
}

export default function Header({ actions }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
              <span className="font-bold text-xl text-zinc-900 dark:text-zinc-100">
                Care Hub
              </span>
            </Link>
            <Navigation />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* User menu */}
            <Link
              href="/organizer"
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="User profile"
            >
              <User className="h-5 w-5" />
            </Link>
            
            {/* Custom actions passed as prop */}
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}


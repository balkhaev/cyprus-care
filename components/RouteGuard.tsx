'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser } from '@/lib/mock-data/user-roles';

interface RouteGuardProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/', '/login', '/signup'];

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    
    // If user is a guest and trying to access protected route
    if (currentUser?.role === 'guest' && !isPublicRoute) {
      router.replace('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}


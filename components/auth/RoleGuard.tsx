'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface RoleGuardProps {
  children: React.ReactNode;
  companyUserId: string;
  companyName: string;
}

export function RoleGuard({ children, companyUserId, companyName }: RoleGuardProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  // Still loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return null; // Will redirect
  }

  // Check if user owns this company
  const isOwner = user.id === companyUserId;

  // Check if user is admin (via Clerk metadata)
  const isAdmin = user.publicMetadata?.role === 'admin';

  // If not owner and not admin, deny access
  if (!isOwner && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Access Denied
            </h1>
            <p className="text-slate-600 mb-6">
              You don&apos;t have permission to edit <strong>{companyName}</strong>&apos;s careers page.
              Only the company owner can make changes.
            </p>
            <div className="space-y-3">
              <Link href="/dashboard" className="block">
                <Button className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href={`/${companyUserId}/careers`} className="block">
                <Button variant="outline" className="w-full">
                  View Public Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
}

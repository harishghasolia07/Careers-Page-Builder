'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Briefcase, Shield, Loader2 } from 'lucide-react';
import { UserRole } from '@/lib/roles';

export default function SelectRolePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already signed in, redirect to appropriate page
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userRole = user.unsafeMetadata?.role as string;
      
      // Redirect based on existing role
      if (userRole === 'recruiter' || userRole === 'admin') {
        router.push('/dashboard');
      } else if (userRole === 'candidate') {
        router.push('/jobs');
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  // Don't render if already signed in (redirecting)
  if (isSignedIn) {
    return null;
  }

  const roles = [
    {
      value: UserRole.RECRUITER,
      title: 'Recruiter',
      description: 'Create and manage your company careers page',
      icon: Building2,
      features: [
        'Customize company branding',
        'Add and edit content sections',
        'Manage job listings',
        'Preview before publishing',
      ],
    },
    {
      value: UserRole.CANDIDATE,
      title: 'Candidate',
      description: 'Browse jobs and explore company cultures',
      icon: Briefcase,
      features: [
        'Browse open positions',
        'Filter by location and job type',
        'Search for jobs',
        'View company details',
      ],
    },
    {
      value: UserRole.ADMIN,
      title: 'Admin',
      description: 'Platform administrator with full access',
      icon: Shield,
      features: [
        'Manage all companies',
        'Access all features',
        'Platform-wide controls',
        'User management',
      ],
    },
  ];

  const handleContinue = () => {
    if (isLoading) return; // prevent double clicks

    if (selectedRole) {
      setIsLoading(true);
      // Store the selected role in session storage to use after sign-up
      try {
        sessionStorage.setItem('selectedRole', String(selectedRole));
      } catch (error) {
        console.error(error);
      }
      router.push('/sign-up');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">Welcome to Careers Page Builder</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Choose your role to get started</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;

            return (
              <button
                key={role.value}
                type="button"
                onClick={() => {
                  setSelectedRole(role.value);
                }}
                className="text-left w-full"
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg h-full ${
                    isSelected
                      ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50 dark:bg-blue-950'
                      : 'hover:border-slate-300'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            aria-busy={isLoading}
            className={`min-w-[200px] flex items-center justify-center gap-2 ${!selectedRole || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Continuing...</span>
              </>
            ) : (
              `Continue as ${selectedRole ? roles.find(r => r.value === selectedRole)?.title : '...'}`
            )}
          </Button>
        </div>

        {selectedRole && (
          <div className="text-center mt-4">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ {roles.find(r => r.value === selectedRole)?.title} role selected
            </p>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

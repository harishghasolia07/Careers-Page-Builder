'use client';

import { SignUp, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    // If already signed in, redirect to appropriate page
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
      return;
    }

    // Check if user came from role selection page
    const role = sessionStorage.getItem('selectedRole');
    
    if (!role) {
      // Redirect to role selection if no role selected
      router.push('/select-role');
    } else {
      setSelectedRole(role);
    }
    
    setIsCheckingRole(false);
  }, [router, isLoaded, isSignedIn]);

  // Show loading while checking auth status or role
  if (!isLoaded || isCheckingRole || !selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-slate-600">
            {isSignedIn ? 'Redirecting...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    recruiter: 'Recruiter',
    candidate: 'Candidate',
    admin: 'Admin',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Sign Up as {roleLabels[selectedRole]}
          </h1>
          <p className="text-slate-600">
            {selectedRole === 'recruiter' && 'Create your account to build careers pages'}
            {selectedRole === 'candidate' && 'Create your account to browse jobs'}
            {selectedRole === 'admin' && 'Create your admin account'}
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-lg',
            },
          }}
          unsafeMetadata={{
            role: selectedRole,
          }}
          forceRedirectUrl={
            selectedRole === 'recruiter' 
              ? '/create-company' 
              : selectedRole === 'candidate'
                ? '/jobs'
                : '/dashboard'
          }
        />
      </div>
    </div>
  );
}

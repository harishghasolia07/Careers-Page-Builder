'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building2, Palette, Eye, Zap } from 'lucide-react';

export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const userRole = user.unsafeMetadata?.role as string;
      
      // Redirect based on role
      if (userRole === 'recruiter' || userRole === 'admin') {
        router.push('/dashboard');
      } else if (userRole === 'candidate') {
        router.push('/jobs');
      }
    }
  }, [isSignedIn, isLoaded, user, router]);

  // Only show loading state while checking auth
  if (!isLoaded) {
    return null;
  }

  // If signed in, show nothing (redirecting)
  if (isSignedIn && user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">Careers Page Builder</span>
          </div>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Build Beautiful Careers Pages
            <br />
            <span className="text-blue-600">In Minutes</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Create stunning, branded careers pages that attract top talent.
            Customize everything with an intuitive drag-and-drop editor.
          </p>
          <Link href="/select-role">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Palette className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Full Customization</h3>
            <p className="text-slate-600">
              Brand colors, logos, banners, and custom content sections tailored to your company
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drag & Drop Editor</h3>
            <p className="text-slate-600">
              Easily reorder sections, add content, and see changes in real-time with live preview
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-4">
              <Eye className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Publishing</h3>
            <p className="text-slate-600">
              Publish your careers page with one click and share it with candidates immediately
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <div className="text-center">
              <Building2 className="h-24 w-24 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">Preview Demo Coming Soon</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600">
          <p>&copy; {new Date().getFullYear()} Careers Page Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

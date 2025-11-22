'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, ExternalLink, Pencil, Plus, Briefcase, Loader2 } from 'lucide-react';
import { Company } from '@/lib/types';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const userRole = user?.unsafeMetadata?.role as string;
  const isRecruiter = userRole === 'recruiter';
  const isAdmin = userRole === 'admin';
  const isCandidate = userRole === 'candidate';

  // Redirect candidates to homepage
  useEffect(() => {
    if (isLoaded && isCandidate) {
      router.replace('/');
    }
  }, [isLoaded, isCandidate, router]);

  useEffect(() => {
    async function fetchCompanies() {
      // Don't fetch if candidate (they're being redirected)
      if (isCandidate || !user?.id) return;

      try {
        // For recruiters, fetch only their companies
        // For admins, fetch all companies
        const url = isRecruiter 
          ? `/api/companies?userId=${user.id}` 
          : '/api/companies';
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && !isCandidate) {
      fetchCompanies();
    }
  }, [user?.id, isLoaded, isRecruiter, isCandidate]);

  // Don't render anything for candidates (they're being redirected)
  if (isLoaded && isCandidate) {
    return null;
  }

  // Navigation buttons now act instantly without temporary loading UI

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-slate-900">Careers Page Builder</h1>
              <p className="text-sm text-slate-600">Manage your careers pages</p>
            </div>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {isAdmin ? 'All Companies' : 'Your Companies'}
            </h2>
            <p className="text-slate-600">
              {isAdmin 
                ? 'Manage all companies in the platform' 
                : 'Select a company to edit its careers page'}
            </p>
          </div>
          {isRecruiter && (
            <Link href="/create-company">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Company
              </Button>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-12 w-12 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <Building2 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No companies yet</h3>
              <p className="text-slate-600 mb-6">
                {isRecruiter 
                  ? "You haven&apos;t created any companies yet. Create your first company to start building your careers page."
                  : "No companies found in the system."}
              </p>
              {isRecruiter && (
                <Link href="/create-company">
                  <Button size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Company
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="h-12 w-12 rounded-full bg-cover bg-center border-2 border-slate-200"
                      style={{ backgroundImage: `url(${company.logoUrl})` }}
                    />
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: company.primaryColor }}
                    />
                  </div>
                  <CardTitle className="text-xl">{company.name}</CardTitle>
                  <CardDescription>/{company.slug}/careers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href={`/${company.slug}/edit`} className="block">
                    <Button 
                      className="w-full h-11 text-sm font-medium" 
                      variant="default"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Careers Page
                    </Button>
                  </Link>
                  <Link href={`/create-job?companyId=${company.id}`} className="block">
                    <Button 
                      className="w-full h-11 text-sm font-medium bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-slate-300"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Create Job Post
                    </Button>
                  </Link>
                  <Link href={`/${company.slug}/careers`} target="_blank" className="block">
                    <Button 
                      className="w-full h-11 text-sm font-medium" 
                      variant="outline"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Public Page
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

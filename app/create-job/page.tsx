'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Company, JobType } from '@/lib/types';

const JOB_TYPES: JobType[] = ['Full-time', 'Part-time', 'Contract', 'Internship'];

function CreateJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyId: searchParams.get('companyId') || '',
    title: '',
    department: '',
    location: '',
    jobType: '' as JobType | '',
    description: '',
  });

  const userRole = user?.unsafeMetadata?.role as string;
  const isRecruiter = userRole === 'recruiter';

  useEffect(() => {
    // Redirect if not recruiter or admin
    if (isLoaded && !isRecruiter && userRole !== 'admin') {
      router.replace('/');
    }
  }, [isLoaded, isRecruiter, userRole, router]);

  useEffect(() => {
    async function fetchCompanies() {
      if (!user?.id) return;

      try {
        const url = isRecruiter 
          ? `/api/companies?userId=${user.id}` 
          : '/api/companies';
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
          
          // If companyId is in URL but not in formData, set it
          const urlCompanyId = searchParams.get('companyId');
          if (urlCompanyId && !formData.companyId) {
            setFormData(prev => ({ ...prev, companyId: urlCompanyId }));
          }
        }
      } catch (error) {
        // Error fetching companies
      }
    }

    if (isLoaded && (isRecruiter || userRole === 'admin')) {
      fetchCompanies();
    }
  }, [user?.id, isLoaded, isRecruiter, userRole, searchParams, formData.companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.companyId || !formData.title || !formData.department || 
          !formData.location || !formData.jobType || !formData.description) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const job = await response.json();
        router.push('/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create job');
      }
    } catch (error) {
      setError('An error occurred while creating the job');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || (!isRecruiter && userRole !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create New Job Post</CardTitle>
                <CardDescription>
                  Add a new job opening to your company&apos;s careers page
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="companyId">Company *</Label>
                <Select
                  value={formData.companyId}
                  onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                >
                  <SelectTrigger id="companyId">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500">
                  Select the company this job belongs to
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g., Engineering"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) => setFormData({ ...formData, jobType: value as JobType })}
                >
                  <SelectTrigger id="jobType">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a detailed description of the role, responsibilities, requirements, and benefits..."
                  rows={10}
                  required
                />
                <p className="text-sm text-slate-500">
                  Include responsibilities, requirements, and any other relevant information
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Creating...' : 'Create Job Post'}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function CreateJobPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    }>
      <CreateJobForm />
    </Suspense>
  );
}

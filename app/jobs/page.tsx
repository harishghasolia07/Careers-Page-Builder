'use client';

import { useEffect, useState } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Building2, MapPin, Briefcase, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job, Company } from '@/lib/types';

export default function JobsPage() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedJobType, setSelectedJobType] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all jobs
        const jobsResponse = await fetch('/api/jobs');
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setJobs(jobsData);
        }

        // Fetch all companies
        const companiesResponse = await fetch('/api/companies');
        if (companiesResponse.ok) {
          const companiesData = await companiesResponse.json();
          setCompanies(companiesData);
        }
      } catch (error) {
        // Error fetching data
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  const getCompanySlug = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.slug || '';
  };

  const filteredJobs = jobs.filter(job => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const companyName = getCompanyName(job.companyId).toLowerCase();
      const matchesSearch = (
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        companyName.includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Location filter
    if (selectedLocation !== 'all' && job.location !== selectedLocation) {
      return false;
    }

    // Job type filter
    if (selectedJobType !== 'all' && job.jobType !== selectedJobType) {
      return false;
    }

    // Department filter
    if (selectedDepartment !== 'all' && job.department !== selectedDepartment) {
      return false;
    }

    return true;
  });

  // Get unique values for filters
  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location))).sort();
  const uniqueJobTypes = Array.from(new Set(jobs.map(job => job.jobType))).sort();
  const uniqueDepartments = Array.from(new Set(jobs.map(job => job.department))).sort();

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
    setSelectedJobType('all');
    setSelectedDepartment('all');
  };

  const hasActiveFilters = searchQuery || selectedLocation !== 'all' || 
                          selectedJobType !== 'all' || selectedDepartment !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">Careers Page Builder</span>
            </div>
          </Link>
          {isLoaded && user && <UserButton afterSignOutUrl="/" />}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Browse All Jobs</h1>
          <p className="text-lg text-slate-600 mb-6">
            Explore opportunities from companies using our platform
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search jobs by title, company, department, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-5 w-5 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Filters</h3>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="ml-auto text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Location
                </label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Job Type
                </label>
                <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Job Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Types</SelectItem>
                    {uniqueJobTypes.map((jobType) => (
                      <SelectItem key={jobType} value={jobType}>
                        {jobType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Department
                </label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepartments.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchQuery ? 'No jobs found' : 'No jobs available yet'}
            </h3>
            <p className="text-slate-600">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Check back later for new opportunities'}
            </p>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-slate-600">
              Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription className="text-base font-medium text-blue-600">
                      {getCompanyName(job.companyId)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-sm">{job.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {job.jobType}
                      </span>
                    </div>
                    <Link href={`/${getCompanySlug(job.companyId)}/careers`}>
                      <Button className="w-full mt-4">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

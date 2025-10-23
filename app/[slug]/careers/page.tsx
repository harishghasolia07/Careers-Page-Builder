'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { Company, Job } from '@/lib/types';
import { JobCard } from '@/components/careers/JobCard';
import { JobFilters } from '@/components/careers/JobFilters';
import { VideoEmbed } from '@/components/careers/VideoEmbed';
import { Skeleton } from '@/components/ui/skeleton';

export default function CareersPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const companyRes = await fetch(`/api/companies/${slug}`);
        if (!companyRes.ok) {
          notFound();
          return;
        }
        const companyData = await companyRes.json();

        const jobsRes = await fetch(`/api/jobs?companyId=${companyData.id}`);
        const jobsData = await jobsRes.json();

        setCompany(companyData);
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        // Error fetching data
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  useEffect(() => {
    let filtered = [...jobs];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.department.toLowerCase().includes(searchLower)
      );
    }

    if (locationFilter && locationFilter !== 'all') {
      filtered = filtered.filter((job) => job.location === locationFilter);
    }

    if (jobTypeFilter && jobTypeFilter !== 'all') {
      filtered = filtered.filter((job) => job.jobType === jobTypeFilter);
    }

    setFilteredJobs(filtered);
  }, [search, locationFilter, jobTypeFilter, jobs]);

  const locations = Array.from(new Set(jobs.map((j) => j.location)));
  const jobTypes = Array.from(new Set(jobs.map((j) => j.jobType)));

  if (loading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="w-full h-96" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!company) {
    notFound();
  }

  return (
    <div
      className="min-h-screen"
      style={
        {
          '--primary-color': company.primaryColor,
          '--secondary-color': company.secondaryColor,
        } as React.CSSProperties
      }
    >
      <div
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${company.bannerUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
          <div className="flex items-end gap-6">
            <div
              className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${company.logoUrl})` }}
            />
            <div className="pb-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {company.name}
              </h1>
              <p className="text-xl text-white/90">Join Our Team</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {company.sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <section
              key={section.id}
              className={`${index % 2 === 1 ? 'bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-xl' : ''}`}
            >
              <div className="max-w-4xl">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: company.primaryColor }}
                >
                  {section.title}
                </h2>
                <div className="text-lg text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {section.content}
                </div>
              </div>
            </section>
          ))}

        {company.videoUrl && (
          <section>
            <div className="max-w-4xl">
              <h2
                className="text-3xl font-bold mb-6"
                style={{ color: company.primaryColor }}
              >
                See Us in Action
              </h2>
              <VideoEmbed videoUrl={company.videoUrl} />
            </div>
          </section>
        )}

        <section>
          <div className="mb-12">
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: company.primaryColor }}
            >
              Open Positions
            </h2>
            <p className="text-xl text-slate-600">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'}{' '}
              available
            </p>
          </div>

          <JobFilters
            search={search}
            location={locationFilter}
            jobType={jobTypeFilter}
            locations={locations}
            jobTypes={jobTypes}
            onSearchChange={setSearch}
            onLocationChange={setLocationFilter}
            onJobTypeChange={setJobTypeFilter}
          />

          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-lg">
              <p className="text-xl text-slate-600 mb-2">No positions found</p>
              <p className="text-slate-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} primaryColor={company.primaryColor} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t bg-slate-50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600">
          <p>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

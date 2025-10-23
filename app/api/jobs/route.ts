import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { mongoDataService } from '@/lib/data/mongodb-service';
import { Job, JobType } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId') || undefined;
    const location = searchParams.get('location') || undefined;
    const jobType = searchParams.get('jobType') || undefined;
    const search = searchParams.get('search') || undefined;

    const jobs = await mongoDataService.getJobs({
      companyId,
      location,
      jobType,
      search,
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is a recruiter or admin
    const role = user.unsafeMetadata?.role as string;
    if (role !== 'recruiter' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only recruiters and admins can create jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { companyId, title, department, location, jobType, description } = body;

    // Validate required fields
    if (!companyId || !title || !department || !location || !jobType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the company belongs to the user (for recruiters)
    if (role === 'recruiter') {
      const companies = await mongoDataService.getCompanies(user.id);
      const ownsCompany = companies.some(c => c.id === companyId);
      
      if (!ownsCompany) {
        return NextResponse.json(
          { error: 'Forbidden: You can only create jobs for your own companies' },
          { status: 403 }
        );
      }
    }

    const newJob: Omit<Job, 'id'> = {
      companyId,
      title,
      department,
      location,
      jobType: jobType as JobType,
      description,
      createdAt: new Date().toISOString(),
    };

    const createdJob = await mongoDataService.createJob(newJob);

    return NextResponse.json(createdJob, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { mongoDataService } from '@/lib/data/mongodb-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;

    const companies = await mongoDataService.getCompanies(userId);

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
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

    const role = user.unsafeMetadata?.role as string;
    
    // Only recruiters and admins can create companies
    if (role !== 'recruiter' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Only recruiters can create companies' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await mongoDataService.getCompanyBySlug(slug);
    if (existing) {
      return NextResponse.json(
        { error: 'A company with this URL slug already exists' },
        { status: 409 }
      );
    }

    // Create new company with default settings
    const newCompany = {
      userId: user.id,
      name,
      slug,
      logoUrl: '',
      bannerUrl: '',
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      videoUrl: '',
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await mongoDataService.createCompany(newCompany);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}

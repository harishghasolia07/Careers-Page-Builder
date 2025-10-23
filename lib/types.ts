export type SectionType = 'about' | 'life' | 'values' | 'benefits';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export interface Section {
  id: string;
  companyId: string;
  type: SectionType;
  title: string;
  content: string;
  order: number;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  bannerUrl: string;
  primaryColor: string;
  secondaryColor: string;
  videoUrl?: string;
  userId: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  description: string;
  createdAt: string;
}

export interface CompanyFormData {
  name: string;
  logoUrl: string;
  bannerUrl: string;
  primaryColor: string;
  secondaryColor: string;
  videoUrl?: string;
  sections: Section[];
}

import { ObjectId } from 'mongodb';
import clientPromise from '../mongodb';
import { Company, Job } from '../types';

const DB_NAME = 'careers_builder';

export const mongoDataService = {
  async getCompanies(userId?: string): Promise<Company[]> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection<Company>('companies');

      const query = userId ? { userId } : {};
      const companies = await collection.find(query).toArray();

      return companies.map(doc => ({
        ...doc,
        id: doc._id?.toString() || doc.id,
      })) as Company[];
    } catch (error) {
      console.error('MongoDB getCompanies error:', error);
      throw new Error('Failed to fetch companies');
    }
  },

  async getCompanyBySlug(slug: string): Promise<Company | null> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection<Company>('companies');

      const company = await collection.findOne({ slug });
      if (!company) return null;

      return {
        ...company,
        id: company._id?.toString() || company.id,
      } as Company;
    } catch (error) {
      console.error('MongoDB getCompanyBySlug error:', error);
      return null;
    }
  },

  async updateCompany(slug: string, data: Partial<Company>): Promise<Company> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection<Company>('companies');

      // Remove id from update data to prevent conflicts
      const { id, ...updateData } = data as any;

      const result = await collection.findOneAndUpdate(
        { slug },
        {
          $set: {
            ...updateData,
            updatedAt: new Date().toISOString(),
          },
        },
        { returnDocument: 'after' }
      );

      if (!result) {
        throw new Error('Company not found');
      }

      return {
        ...result,
        id: result._id?.toString() || result.id,
      } as Company;
    } catch (error) {
      console.error('MongoDB updateCompany error:', error);
      throw new Error('Failed to update company');
    }
  },

  async createCompany(company: Omit<Company, 'id'>): Promise<Company> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection<Company>('companies');

      const result = await collection.insertOne({
        ...company,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any);

      return {
        ...company,
        id: result.insertedId.toString(),
      } as Company;
    } catch (error) {
      console.error('MongoDB createCompany error:', error);
      throw new Error('Failed to create company');
    }
  },

  async getJobs(filters: {
    companyId?: string;
    location?: string;
    jobType?: string;
    search?: string;
  }): Promise<Job[]> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection<Job>('jobs');

      const query: any = {};

      if (filters.companyId) {
        query.companyId = filters.companyId;
      }

      if (filters.location && filters.location !== 'all') {
        query.location = filters.location;
      }

      if (filters.jobType && filters.jobType !== 'all') {
        query.jobType = filters.jobType;
      }

      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { department: { $regex: filters.search, $options: 'i' } },
        ];
      }

      const jobs = await collection.find(query).toArray();

      return jobs.map(doc => ({
        ...doc,
        id: doc._id?.toString() || doc.id,
      })) as Job[];
    } catch (error) {
      console.error('MongoDB getJobs error:', error);
      throw new Error('Failed to fetch jobs');
    }
  },

  async createJob(job: Omit<Job, 'id'>): Promise<Job> {
    try {
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection<Job>('jobs');

      const result = await collection.insertOne({
        ...job,
        createdAt: new Date().toISOString(),
      } as any);

      return {
        ...job,
        id: result.insertedId.toString(),
      } as Job;
    } catch (error) {
      console.error('MongoDB createJob error:', error);
      throw new Error('Failed to create job');
    }
  },
};

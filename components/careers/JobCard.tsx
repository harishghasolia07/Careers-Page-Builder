import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase } from 'lucide-react';
import { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
  primaryColor?: string;
}

export function JobCard({ job, primaryColor }: JobCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl font-semibold leading-tight">{job.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {job.jobType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p
          className="font-medium"
          style={{ color: primaryColor || '#3b82f6' }}
        >
          {job.department}
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            <span>{job.jobType}</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">{job.description}</p>
      </CardContent>
    </Card>
  );
}

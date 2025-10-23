'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface JobFiltersProps {
  search: string;
  location: string;
  jobType: string;
  locations: string[];
  jobTypes: string[];
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onJobTypeChange: (value: string) => void;
}

export function JobFilters({
  search,
  location,
  jobType,
  locations,
  jobTypes,
  onSearchChange,
  onLocationChange,
  onJobTypeChange,
}: JobFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search by job title or department..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={location} onValueChange={onLocationChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {locations.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={jobType} onValueChange={onJobTypeChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="All Job Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Job Types</SelectItem>
          {jobTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

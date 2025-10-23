'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateCompanyPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  // Redirect if not recruiter
  if (isLoaded && user?.unsafeMetadata?.role !== 'recruiter') {
    router.push('/dashboard');
    return null;
  }

  const generateSlug = (name: string) => {
    // Remove any URLs (http://, https://, www.)
    let cleaned = name.replace(/^(https?:\/\/)?(www\.)?/gi, '');
    
    // Remove domain extensions and everything after
    cleaned = cleaned.replace(/\.(com|net|org|io|co|dev|app|tech|ai|in).*$/gi, '');
    
    // Convert to slug format
    return cleaned
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50); // Limit length
  };

  const handleNameChange = (name: string) => {
    setFormData({
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Please enter a URL slug');
      return;
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      toast.error('Slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create company');
      }

      toast.success('Company created successfully!');
      
      // Redirect to the new company's edit page
      router.push(`/${data.slug}/edit`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setSkipping(true);
    router.push('/dashboard');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Building2 className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Your Company</CardTitle>
          <CardDescription>
            Set up your company careers page to start attracting talent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Acme Corporation"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug 
                <span className="text-xs text-slate-500 ml-2">
                  (Auto-generated)
                </span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">yoursite.com/</span>
                <Input
                  id="slug"
                  placeholder="acme-corporation"
                  value={formData.slug}
                  onChange={(e) => {
                    // Only allow lowercase letters, numbers, and hyphens
                    const sanitized = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, '')
                      .replace(/^-+|-+$/g, '');
                    setFormData({ ...formData, slug: sanitized });
                  }}
                  required
                  disabled={loading}
                  className="flex-1"
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens allowed"
                />
              </div>
              <p className="text-xs text-slate-500">
                This will be your public careers page URL (only letters, numbers, and hyphens)
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                disabled={loading || skipping}
                className="flex-1"
              >
                {skipping ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Skip for Now'
                )}
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Company'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

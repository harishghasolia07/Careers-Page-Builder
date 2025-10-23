'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionEditor } from '@/components/editor/SectionEditor';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ArrowLeft, Save, Eye, Copy, Check, Loader2 } from 'lucide-react';
import { Company, Section, SectionType } from '@/lib/types';
import { toast } from 'sonner';
import Link from 'next/link';

function SortableSection({ section, onUpdate, onDelete }: { section: Section; onUpdate: (s: Section) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionEditor
        section={section}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function EditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [navigating, setNavigating] = useState<'dashboard' | 'preview' | null>(null);

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('#3b82f6');
  const [videoUrl, setVideoUrl] = useState('');
  const [sections, setSections] = useState<Section[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    async function fetchCompany() {
      try {
        const response = await fetch(`/api/companies/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setCompany(data);
          setName(data.name);
          setLogoUrl(data.logoUrl);
          setBannerUrl(data.bannerUrl);
          setPrimaryColor(data.primaryColor);
          setSecondaryColor(data.secondaryColor);
          setVideoUrl(data.videoUrl || '');
          setSections(data.sections.sort((a: Section, b: Section) => a.order - b.order));
        }
      } catch (error) {
        toast.error('Failed to load company data');
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [slug]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        return reordered.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const handleSectionUpdate = (updatedSection: Section) => {
    setSections((prev) => prev.map((s) => (s.id === updatedSection.id ? updatedSection : s)));
  };

  const handleSectionDelete = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id).map((s, index) => ({ ...s, order: index })));
    toast.success('Section deleted');
  };

  const handleAddSection = (type: SectionType) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      companyId: company?.id || '',
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      content: '',
      order: sections.length,
    };
    setSections((prev) => [...prev, newSection]);
    toast.success('Section added');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/companies/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          logoUrl,
          bannerUrl,
          primaryColor,
          secondaryColor,
          videoUrl,
          sections,
        }),
      });

      if (response.ok) {
        toast.success('Changes saved successfully!');
      } else {
        toast.error('Failed to save changes');
      }
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/${slug}/careers`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!company) {
    return <div>Company not found</div>;
  }

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${slug}/careers`;

  return (
    <RoleGuard companyUserId={company.userId} companyName={company.name}>
      <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" onClick={() => setNavigating('dashboard')}>
              <Button variant="ghost" size="sm" disabled={navigating === 'dashboard'}>
                {navigating === 'dashboard' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Dashboard
                  </>
                )}
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Edit Careers Page</h1>
              <p className="text-sm text-slate-600">{company.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/${slug}/preview`} onClick={() => setNavigating('preview')}>
              <Button variant="outline" size="sm" disabled={navigating === 'preview'}>
                {navigating === 'preview' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </>
                )}
              </Button>
            </Link>
            <Button onClick={handleSave} disabled={saving} size="sm">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <UserButton />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Company Branding</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
                  {logoUrl && (
                    <div className="mt-2">
                      <img src={logoUrl} alt="Logo preview" className="h-16 w-16 rounded-full object-cover border" />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="bannerUrl">Banner URL</Label>
                  <Input id="bannerUrl" value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://..." />
                  {bannerUrl && (
                    <div className="mt-2">
                      <img src={bannerUrl} alt="Banner preview" className="w-full h-24 rounded object-cover border" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        id="primaryColor"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input
                        type="color"
                        id="secondaryColor"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="h-10 w-16 rounded border cursor-pointer"
                      />
                      <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="videoUrl">Culture Video URL (Optional)</Label>
                  <Input id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="YouTube or Vimeo URL" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Content Sections</h2>
                <Select onValueChange={(value) => handleAddSection(value as SectionType)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Add Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="about">About Us</SelectItem>
                    <SelectItem value="life">Life at Company</SelectItem>
                    <SelectItem value="values">Our Values</SelectItem>
                    <SelectItem value="benefits">Benefits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-4">
                    {sections.length === 0 ? (
                      <p className="text-center text-slate-500 py-8">No sections yet. Add one to get started!</p>
                    ) : (
                      sections.map((section) => (
                        <SortableSection
                          key={section.id}
                          section={section}
                          onUpdate={handleSectionUpdate}
                          onDelete={handleSectionDelete}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Shareable Link</h2>
              <div className="flex gap-2">
                <Input value={publicUrl} readOnly className="flex-1 bg-slate-50" />
                <Button onClick={handleCopyLink} variant="outline" size="icon">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Live Preview</h2>
                <div className="border rounded-lg overflow-hidden bg-white" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                  <div
                    className="relative h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bannerUrl})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                    <div className="relative h-full flex flex-col justify-end p-6">
                      <div className="flex items-end gap-4">
                        <div
                          className="h-16 w-16 rounded-full bg-white border-2 border-white shadow-xl bg-cover bg-center"
                          style={{ backgroundImage: `url(${logoUrl})` }}
                        />
                        <div className="pb-1">
                          <h1 className="text-2xl font-bold text-white">{name}</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-8">
                    {sections.map((section) => (
                      <div key={section.id}>
                        <h3 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
                          {section.title}
                        </h3>
                        <p className="text-slate-700 whitespace-pre-wrap">{section.content || 'No content yet...'}</p>
                      </div>
                    ))}
                    {sections.length === 0 && (
                      <p className="text-center text-slate-400 py-8">Add sections to see preview</p>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </div>
    </RoleGuard>
  );
}

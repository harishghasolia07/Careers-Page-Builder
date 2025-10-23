'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';
import { Section } from '@/lib/types';

interface SectionEditorProps {
  section: Section;
  onUpdate: (section: Section) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
}

export function SectionEditor({ section, onUpdate, onDelete, dragHandleProps }: SectionEditorProps) {
  return (
    <div className="border rounded-lg p-4 bg-white space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-5 w-5 text-slate-400" />
          </div>
          <span className="font-medium text-sm text-slate-600 uppercase tracking-wide">
            {section.type}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(section.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`title-${section.id}`}>Section Title</Label>
        <Input
          id={`title-${section.id}`}
          value={section.title}
          onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          placeholder="Enter section title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`content-${section.id}`}>Content</Label>
        <Textarea
          id={`content-${section.id}`}
          value={section.content}
          onChange={(e) => onUpdate({ ...section, content: e.target.value })}
          placeholder="Enter section content"
          rows={6}
          className="resize-none"
        />
      </div>
    </div>
  );
}

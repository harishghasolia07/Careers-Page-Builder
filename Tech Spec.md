# Tech Spec - Careers Page Builder

## Initial Assumptions

When I started this project, I made a few key assumptions:

1. **Users would want customization** - Not just job listings, but full brand control (colors, logos, videos etc)
2. **Three distinct user types** - Based on the requirements, I figured we'd need admins (platform owners), recruiters (company reps), and candidates (job seekers)
3. **MongoDB would be fast enough** - For a small-to-medium scale app, MongoDB Atlas free tier should handle it fine
4. **Clerk for auth** - I didn't want to build auth from scratch, and Clerk has great Next.js integration
5. **No application system initially** - Just focus on the careers page builder and job browsing. Applications can come later

## Architecture

### High-Level Overview

```
Frontend (Next.js 15 App Router)
    ↓
Middleware (Clerk Auth)
    ↓
API Routes (/app/api)
    ↓
MongoDB Service Layer (/lib/data/mongodb-service.ts)
    ↓
MongoDB Atlas (Cloud Database)
```

### Why Next.js App Router?

Honestly, I wanted to use the new app router because Server components are pretty nice for reducing client bundle size, and the file-based routing makes sense for this kind of app.

### Database Design

#### Companies Collection
```javascript
{
  _id: ObjectId,
  slug: string (indexed, unique),
  name: string,
  logoUrl: string,
  bannerUrl: string,
  primaryColor: string,
  secondaryColor: string,
  videoUrl: string (optional),
  userId: string (indexed - for filtering by owner),
  sections: [
    {
      id: string,
      companyId: string,
      type: 'about' | 'life' | 'values' | 'benefits',
      title: string,
      content: string,
      order: number
    }
  ],
  createdAt: ISO8601 string,
  updatedAt: ISO8601 string
}
```

**Why embed sections?** - I thought about making sections a separate collection, but for a careers page, you're almost always loading the company + sections together. Embedding reduces query complexity and is faster.

#### Jobs Collection
```javascript
{
  _id: ObjectId,
  companyId: string (indexed),
  title: string,
  department: string,
  location: string (indexed for filtering),
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' (indexed),
  description: string,
  createdAt: ISO8601 string
}
```

**Indexes:**
- `companyId` - Most queries filter by company
- `location` - Common filter on jobs page
- `jobType` - Common filter on jobs page
- Text index on `title` and `department` - For search functionality

### Role-Based Access Control

Used Clerk's user metadata to store roles:
```javascript
user.unsafeMetadata.role = 'admin' | 'recruiter' | 'candidate'
```

Access rules:
- **Admin**: Can edit any company, view everything
- **Recruiter**: Can only edit companies they own (userId matches)
- **Candidate**: Can only view public pages, no edit access

The role guard logic is in `/lib/roles.ts` - pretty straightforward checks.

### Component Structure

I went with shadcn/ui because:
1. Copy-paste components instead of npm packages (more control)
2. Built on Radix UI (accessibility out of the box)
3. Tailwind styling (easy to customize)

Main component categories:
- `/components/ui` - All shadcn components
- `/components/careers` - Public-facing components (JobCard, JobFilters, VideoEmbed)
- `/components/editor` - Editor-specific stuff (SectionEditor with drag-drop)
- `/components/auth` - Role guard component

### Drag and Drop

Used `@dnd-kit` for section reordering because:
- Lightweight compared to react-beautiful-dnd
- Better accessibility
- Works well with React 18+

The implementation in `/app/[slug]/edit/page.tsx` handles reordering sections and updating the order field.

## Test Plan

### Manual Testing Checklist

#### Auth Flow
- [ ] Sign up as Admin → Should see dashboard
- [ ] Sign up as Recruiter → Should see dashboard
- [ ] Sign up as Candidate → Should redirect to /jobs
- [ ] Sign out → Redirect to homepage
- [ ] Try accessing /dashboard without login → Redirect to sign-in

#### Company Creation (Recruiter)
- [ ] Create new company with valid data → Success
- [ ] Create company with duplicate slug → Should fail
- [ ] Upload logo URL → Should display in preview
- [ ] Change brand colors → Should update preview in real-time
- [ ] Add video URL (YouTube) → Should embed properly

#### Editor Functionality
- [ ] Add section (About Us) → Should appear in preview
- [ ] Drag section to reorder → Order should update
- [ ] Edit section content → Changes should reflect
- [ ] Delete section → Should remove from preview
- [ ] Save changes → Should persist to database
- [ ] Refresh page → Changes should still be there

#### Permissions
- [ ] Recruiter tries to edit another company → Should see "unauthorized"
- [ ] Admin edits any company → Should work
- [ ] Candidate accesses /dashboard → Redirect or error
- [ ] Unauthenticated user visits /{slug}/careers → Should work (public)

#### Job Listings
- [ ] Create job for company → Should appear on careers page
- [ ] Filter by location → Should show only matching jobs
- [ ] Filter by job type → Should show only matching types
- [ ] Search by title → Should find relevant jobs
- [ ] Combine filters → Should apply all filters

#### Public Careers Page
- [ ] Visit /{slug}/careers → Should load with branding
- [ ] Sections appear in correct order
- [ ] Video plays (if added)
- [ ] Job listings show with filters working
- [ ] Mobile responsive → Test on small screen
- [ ] Invalid slug → 404 or error page

### Edge Cases to Test

1. **Empty states**
   - Company with no sections → Should still render
   - Company with no jobs → Should show "no jobs" message
   - No companies in database → Dashboard should be empty

2. **Validation**
   - Empty company name → Should show error
   - Invalid color format → Should validate
   - Malformed video URL → Should handle gracefully

3. **Performance**
   - Load page with 50+ jobs → Should filter quickly
   - Drag sections rapidly → No lag or bugs

### Known Issues

- [ ] No image upload yet - using URLs only
- [ ] Can't delete companies from UI (only through DB)
- [ ] No job application system
- [ ] No email notifications
- [ ] Preview mode doesn't have a distinct URL (just opens in new tab)
- [ ] Error handling could be better in some places
- [ ] Need loading states for API calls

## Security Considerations

1. **Authentication**: Clerk handles this, so we're good
2. **Authorization**: Role checks in middleware + server-side API routes
3. **Input validation**: Should add Zod schemas for API inputs (TODO)
4. **XSS prevention**: React escapes by default, but need to be careful with video embeds
5. **MongoDB injection**: Using MongoDB driver's built-in sanitization

## Scalability Thoughts

Current setup should handle:
- ~100 companies
- ~1000 jobs
- ~1000 concurrent users browsing

If we need to scale beyond that:
- Add Redis caching for companies/jobs
- Use CDN for static assets
- Implement pagination for job listings
- Consider read replicas for MongoDB
- Add proper monitoring (Sentry, etc)

## Deployment

Planning to deploy on Vercel because:
- Next.js is built by Vercel (obvious choice)
- Free tier is generous
- Auto-deploys from GitHub
- Edge functions for fast responses
- Easy environment variable management

MongoDB is already on Atlas, so that's sorted.


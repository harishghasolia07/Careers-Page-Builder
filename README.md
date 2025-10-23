# Careers Page Builder

A platform for companies to build beautiful, branded careers pages without writing code. Think of it like a mini Squarespace but specifically for job listings.

## What I Built

This is a full-stack web app that lets companies create custom careers pages with:

- **Brand customization** - Upload logos, banners, choose colors, add culture videos
- **Drag-and-drop content editor** - Reorder sections like "About Us", "Life at Company", "Values", etc
- **Job listings** - Post jobs and let candidates filter by location, type, department
- **Role-based access** - Different experiences for admins, recruiters, and job seekers
- **Live preview** - See changes in real-time before publishing

The public careers pages are shareable via a simple URL like `/acme-corp/careers`.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Auth**: Clerk
- **Database**: MongoDB Atlas
- **Hosting**: Ready for Vercel deployment

## How to Run Locally

### Prerequisites

You'll need:
- Node.js 18 or higher
- A MongoDB Atlas account (free tier works fine)
- A Clerk account (also free tier)

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd Careers
npm install
```

### Step 2: Set Up MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (choose the free tier)
3. Create a database user with a password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string - it looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```

### Step 3: Set Up Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Choose "Email" as the authentication method (or add Google/GitHub if you want)
4. Copy your publishable key (starts with `pk_test_...`)
5. Copy your secret key (starts with `sk_test_...`)

### Step 4: Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/

# Clerk URLs (optional, for custom sign-in pages)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Important**: Don't commit this file to git! It's already in `.gitignore`.

### Step 5: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.## Step-by-Step User Guide

### For First-Time Users

#### 1. Choose Your Role

When you first visit the app and click "Get Started", you'll need to pick a role:

- **Admin** - If you're managing the platform (full access to everything)
- **Recruiter** - If you're creating a careers page for your company
- **Candidate** - If you're just browsing jobs

For testing, I'd recommend creating a Recruiter account first.

#### 2. Create an Account

Fill in your email and create a password. Clerk will send you a verification email (check spam if you don't see it).

### For Recruiters

#### 3. Create Your Company

After signing in, you'll land on the dashboard. Click **"Create Company"**.

Fill in:
- Company name (e.g., "Acme Corp")
- Logo URL (for testing, use: `https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=200`)
- Banner URL (for testing, use: `https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600&h=400`)
- Primary color (e.g., `#2563eb`)
- Secondary color (e.g., `#3b82f6`)

Click **Create** and you'll be redirected to the dashboard.

#### 4. Customize Your Careers Page

Click **"Edit Careers Page"** next to your company.

You'll see a split screen:
- **Left side**: Editor with all your settings
- **Right side**: Live preview of how it looks

**Adding Content Sections:**
1. Use the "Add Section" dropdown to choose a section type
2. Edit the title and content
3. Drag the handle (≡) to reorder sections
4. Click the trash icon to delete sections

**Adding a Culture Video:**
1. Go to YouTube, find a video
2. Copy the URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
3. Paste it in the "Culture Video URL" field

**Changing Brand Colors:**
1. Click the color pickers
2. Choose your brand colors
3. Watch the preview update in real-time

When you're happy, click **"Save Changes"** at the bottom.

#### 5. Add Job Listings

From the dashboard, click **"Create Job"**.

Fill in:
- Job title (e.g., "Senior Software Engineer")
- Department (e.g., "Engineering")
- Location (e.g., "Remote" or "San Francisco")
- Job type (Full-time, Part-time, Contract, or Internship)
- Description (what the job is about)

Click **Create** and the job will appear on your careers page.

#### 6. Share Your Careers Page

From the dashboard, click **"View Careers Page"** to see your public page.

The URL will be something like: `http://localhost:3000/acme-corp/careers`

Share this URL with candidates!

### For Candidates

#### 7. Browse Jobs

Visit the **/jobs** page to see all available positions across all companies.

Use the filters:
- **Search**: Type keywords to find specific roles
- **Location**: Filter by city or "Remote"
- **Department**: Filter by team (Engineering, Design, etc)
- **Job Type**: Filter by employment type

Click on any job card to see more details.

#### 8. View Company Careers Pages

When you see a job you like, click the company name to visit their full careers page.

You'll see:
- Company branding and culture video
- All their content sections (about, values, benefits, etc)
- Complete list of open positions

### For Admins

Admins can do everything recruiters can, plus:
- Edit ANY company's careers page (not just their own)
- Access to all companies in the dashboard
- Platform-wide controls



## What Works Well
✅ Drag-and-drop is smooth and intuitive  
✅ Real-time preview is really helpful  
✅ Role-based access works as expected  
✅ MongoDB queries are fast (even with filters)  
✅ The UI looks clean on mobile  
✅ Clerk auth integration was painless  

## Known Limitations

❌ Image uploads don't work yet - you have to use URLs  
❌ Can't delete companies from the UI  
❌ No job application system (just displays jobs)  
❌ No analytics or tracking  
❌ Error messages could be more helpful in some places  



## Project Structure

```
/app
  /api              - API routes for companies and jobs
  /[slug]           - Dynamic routes for company pages
    /careers        - Public careers page
    /edit           - Editor for customization
    /preview        - Preview mode
  /dashboard        - Company management dashboard
  /create-company   - Company creation form
  /create-job       - Job creation form
  /jobs             - Browse all jobs
  /select-role      - Role selection page
  /sign-in          - Authentication
  /sign-up          - Registration
  page.tsx          - Landing page
  layout.tsx        - Root layout with Clerk
  
/components
  /auth             - Auth-related components
  /careers          - Public page components
  /editor           - Editor components
  /ui               - shadcn/ui components
  
/lib
  /data             - Database service layer
  auth.ts           - Auth utilities
  mongodb.ts        - MongoDB connection
  roles.ts          - Role-based access control
  types.ts          - TypeScript type definitions
  utils.ts          - Helper functions
```

## Troubleshooting

**MongoDB connection fails:**
- Make sure your IP is whitelisted in MongoDB Atlas
- Check that your username/password are correct (no special chars issues)
- The database name in the URI should be blank or match your DB name

**Clerk auth not working:**
- Double-check your API keys in `.env.local`
- Make sure you're using `NEXT_PUBLIC_` prefix for the publishable key
- Restart the dev server after changing env vars

**Images not showing:**
- Check that the URL is publicly accessible
- Make sure the URL ends with an image extension or use a direct link
- Try using the example URLs I provided above

**Can't see companies/jobs:**
- Check the MongoDB connection is working
- Look at the browser console for errors
- Make sure you're signed in with the right role

## Deployment

To deploy to Vercel:

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repo
3. Add the same environment variables from `.env.local`
4. Deploy!

Vercel will automatically detect Next.js and configure everything.

---

Built with ☕ and a lot of trial and error. Questions? Check the Tech Spec.md for more details.

*Last updated: October 23, 2025*

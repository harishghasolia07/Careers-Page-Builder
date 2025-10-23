# AI Agent Log

This is a quick rundown of how I used AI tools (mostly Cursor/Copilot) while building this project. Not going to lie, AI helped a LOT, but I also spent a good amount of time fixing what it generated.

## Initial Setup

**Prompt**: "Create a Next.js 15 app with TypeScript, Tailwind, and shadcn/ui setup"

**What worked:**
- Got the basic Next.js scaffolding instantly
- Tailwind config was set up correctly
- shadcn/ui initialization was perfect

**What didn't:**
- Had to manually configure the app router structure (AI kept suggesting pages router)
- The TypeScript config needed tweaking for path aliases

**Learning**: AI is great at boilerplate but you need to be specific about versions and architecture choices.

## Authentication Setup

**Prompt**: "Integrate Clerk authentication with role-based access control. Need admin, recruiter, and candidate roles"

**What worked:**
- Clerk integration code was spot-on
- Middleware setup worked first try

**What didn't:**
- AI suggested storing roles in a separate DB table initially
- I had to ask it to use Clerk's metadata instead
- Role guard component had a bug where it didn't handle loading states

**Refinement**: "Store roles in Clerk user metadata, not a separate database"

**Learning**: AI sometimes over-engineers things. Had to simplify the approach.

## Database Schema Design 

**Prompt**: "Design MongoDB schema for companies with customizable careers pages. Include sections, branding, and job listings"

**What worked:**
- The basic schema structure made sense
- Suggested embedding sections in company docs (good choice)

**What didn't:**
- Initial schema had too many fields (like socialMedia, teamMembers, etc)
- Didn't include proper indexes
- Job schema was missing some fields

**Refinement**: "Simplify the schema. Remove social media and team features. Add indexes for companyId, location, and jobType"

**Learning**: AI tends to add features you didn't ask for. Be explicit about keeping it minimal.

## Building the Editor

**Prompt**: "Create a drag-and-drop editor for content sections using dnd-kit with live preview"

**What worked:**
- Got me started with dnd-kit setup quickly
- Basic drag functionality worked

**What didn't:**
- The preview wasn't actually "live" - had to refresh
- Drag handles weren't styled well
- Section ordering logic had bugs

**Multiple iterations:**
1. "Make the preview update in real-time without manual refresh"
2. "Fix the section ordering - it's not persisting correctly"
3. "Add better visual feedback when dragging"

**Learning**: Complex UI features need multiple refinement rounds. Don't expect it perfect first time.

## API Routes

**Prompt**: "Create API routes for CRUD operations on companies and jobs. Use MongoDB service layer"

**What worked:**
- File structure was correct
- Basic GET/POST endpoints generated quickly

**What didn't:**
- Error handling was non-existent initially
- Forgot to add role checks in API routes
- Job filtering logic was wrong (didn't handle "all" option)

**Refinement**: "Add proper error handling with try-catch. Verify user role before allowing edits"

**Learning**: AI forgets about auth/validation unless you explicitly mention it.


## Job Filtering

**Prompt**: "Implement search and filters for jobs by location, department, and type"

**What worked:**
- Filter UI components generated quickly
- MongoDB query building was mostly right

**What didn't:**
- Search wasn't case-insensitive
- Filters didn't work together (only one at a time)
- "All" option in dropdowns didn't reset the filter

**Refinement**: "Make search case-insensitive. Allow multiple filters to work simultaneously. Handle 'all' option properly"

**Learning**: Filter logic is tricky - AI gets 80% right but you need to test edge cases.

## Role Guard and Permissions

**Prompt**: "Implement role-based access control. Recruiters can only edit their own companies, admins can edit any"

**What worked:**
- Basic role checking logic was fine
- Redirect logic worked

**What didn't:**
- Guard component showed unauthorized message before checking auth state
- Admin override logic was buggy
- Didn't show loading state while checking permissions

**Refinement**: "Add proper loading states. Check if user is loaded before showing unauthorized message"


### My Workflow:
1. Start with broad prompt to get structure
2. Review what AI generated
3. Refine with specific prompts
4. Test manually
5. Fix bugs myself (faster than asking AI sometimes)
6. Use AI for repetitive tasks (like creating similar components)
 

## Time Saved:

Rough estimate:
- Without AI: ~3-4 days of work
- With AI: ~2 days of work + 1 day of refinement/debugging
- **Net savings**: About 30-40% faster

But quality-wise, I still had to review everything carefully. AI-generated code isn't production-ready out of the box.

## Key Takeaway:

AI is like a junior developer who codes fast but needs supervision. Use it for:
- Getting started quickly
- Generating repetitive code
- Learning new APIs/libraries
- Brainstorming approaches

Don't rely on it for:
- Final implementation
- Security decisions
- Performance optimization
- Complex business logic

Always review, test, and refine what AI generates. It's a tool, not a replacement for thinking.

---

*Written by a human who used AI as a tool, not a crutch* 😅

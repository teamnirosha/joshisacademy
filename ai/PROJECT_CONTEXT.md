# Project Context — Joshis Academy Website

## Project Name

**Joshi's Academy — Gyan Ki Varsha** (website / repository name internally: `tanstack_start_ts`; repo: `teamnirosha/joshisacademy`)

## Purpose

A production-quality public marketing website for **Joshi's Academy**, a premium specialist **Science coaching institute** located in **Kharadi, Pune, Maharashtra, India**. The site represents the institute online, builds trust with parents and students, communicates the teaching methodology, presents programmes and verified outcomes, and converts visitors into **enquiries** (free counselling sessions).

- Tagline: **Gyan Ki Varsha**
- Positioning: *Specialist Science coaching for CBSE & ICSE Classes IX–X*
- Live URL: `https://joshisacademy.com`

## Business / Domain Purpose

Generate qualified leads (parent enquiries) for the academy's classroom programmes:

- CBSE Class IX Science
- CBSE Class X Science
- ICSE Class IX Science
- ICSE Class X Science

Subjects taught: Physics, Chemistry, Biology — concept-first, small batches, structured notes, regular testing, doubt solving, board-exam preparation.

## Target Users

- **Parents** of Class IX / X students researching science coaching in Kharadi / East Pune (primary decision-makers, primary conversion target).
- **Students** in Classes IX–X (CBSE & ICSE) seeking science coaching.
- **Search engines / local SEO** — the site is heavily optimised for queries like "science classes in Kharadi", "CBSE/ICSE science coaching Pune".

## Application Goals

1. Present a premium, trustworthy, human brand (deliberately not "AI-generated-looking").
2. Explain the pedagogy (concept-based learning, small batches, testing, doubt solving).
3. Publish **verified only** claims (results stats, faculty standards); never fabricated marks/credentials.
4. Convert visitors via a multi-step **Enquiry** experience (primary CTA: *Book a Free Counselling Session*).
5. Persist leads to **Supabase** and forward them in real time to an **n8n webhook**.
6. Rank well locally (SEO: meta, canonical, Open Graph, sitemap.xml, robots.txt, JSON-LD structured data).
7. Be fast, responsive, accessible (reduced-motion support, keyboard-friendly lightbox/form, semantic HTML).

## Major Modules / Pages (routes)

| Route | Purpose | Implementation |
|-------|---------|----------------|
| `/` | Homepage — editorial sections (hero, trust strip, approach, why, sciences, method, results, testimonials, faculty standards, courses, classroom, gallery preview, journal preview, location, final CTA) | `src/routes/index.tsx` |
| `/courses` | Course directory (4 programmes) | `src/routes/courses.index.tsx` |
| `/courses/$slug` | Course detail page (curriculum, testing, timeline, FAQs, related articles) | `src/routes/courses.$slug.tsx` |
| `/journal` | "The Joshi's Journal" article listing w/ category filter | `src/routes/journal.index.tsx` |
| `/journal/$slug` | Article page (TOC, sections, CTA) | `src/routes/journal.$slug.tsx` |
| `/gallery` | Editorial masonry gallery + lightbox | `src/routes/gallery.tsx` |
| `/results` | Verified results statistics + methodology | `src/routes/results.tsx` |
| `/faculty` | Faculty standards / verification policy page | `src/routes/faculty.tsx` |
| `/about` | About / Our Story | `src/routes/about.tsx` |
| `/contact` | Contact info, map, hours | `src/routes/contact.tsx` |
| `/faq` | FAQ accordion | `src/routes/faq.tsx` |
| `/privacy`, `/terms` | Legal pages | `src/routes/privacy.tsx`, `src/routes/terms.tsx` |
| `/sitemap.xml` | XML sitemap (server-rendered route) | `src/routes/sitemap[.]xml.tsx` |
| 404 | Custom not-found | `src/routes/__root.tsx` (`NotFoundComponent`) |

## Frontend Technology

- **React 19** + **TypeScript 5.8** (strict mode, `noEmit`)
- **Vite 8** build tool; **TanStack Start** (SSR-capable framework) with **TanStack Router** (file-based routing, `src/routes/`) and auto-generated `src/routeTree.gen.ts`
- **TanStack Query** — client is wired in (`src/router.tsx`), but **no page currently uses it**
- **Tailwind CSS v4** (via `@tailwindcss/vite`), design tokens in `src/styles.css`
- **shadcn/ui "new-york"** style primitives in `src/components/ui/` (Radix-based) — only `Button` is actually imported by application code; the rest are scaffold boilerplate
- **@radix-ui/react-dialog** used directly by the Enquiry dialog
- **lucide-react** icons
- **Fonts:** Manrope (body/UI), DM Serif Display (display headlines) via Google Fonts
- **Design system** (styles.css): Ink `#111111`, Ivory `#faf9f5`, Violet `#35208f`, Royal `#3538a8`, Lavender `#eeecfa`, Border `#e8e5dc`; low border-radius, thin borders, editorial typography
- Content is **static data** in `src/content/site.ts` (single source for courses/articles/FAQs/stats/testimonials/announcement/contact)

## Backend Technology

There is **no conventional standalone API backend**. The "backend" is:

- **TanStack Start SSR** (server entry wrapper `src/server.ts`, middleware in `src/start.ts`) rendering routes and serving `/sitemap.xml` through a server route handler
- **Supabase** (hosted Postgres + REST) as the persistence layer, called **directly from the browser** using the publishable key with RLS-restricted inserts
- **n8n webhook** (`https://automate.nirosha.org/webhook/joshisacademy`) — called from the browser for real-time lead forwarding
- Supabase **server-side scaffolding** exists but is unused by application code: `client.server.ts` (service-role admin client), `auth-middleware.ts` (`requireSupabaseAuth`), `cron-auth.ts`, `auth-attacher.ts` (registered globally in `start.ts`)

## Database

- **Supabase Postgres** (project id referenced in `supabase/config.toml`; ref `hfuxydqczbxjpjwxmufr`)
- One table: `public.enquiries` (lead submissions). Migration: `supabase/migrations/20260904045430_*.sql`
- Client types: `src/integrations/supabase/types.ts` (generated-style database types)

## Authentication

- **None user-facing.** The public site does not log users in. Enquiry submissions use the anonymous `anon` role + Row-Level Security (RLS allows INSERT where `status = 'new'`).
- Supabase auth *infrastructure* (session attach middleware, bearer-token verification, preview-auth storage broker, cron auth guard) is present from the Lovable template but **not exercised by any page or server function**.

## Authorization

- RLS policy: `Anyone can submit an enquiry` (INSERT for `anon` + `authenticated`, constrained to `status = 'new'`).
- No admin/read endpoints in the application. Reviewing enquiries happens outside the app (Supabase dashboard / n8n).

## Deployment

- Live at `https://joshisacademy.com` (canonical URLs, sitemap, and robots.txt all reference this domain).
- The Vite configuration is provided by `@lovable.dev/vite-tanstack-config`; its comment notes nitro is used at build time **with Cloudflare as a default target**. `.wrangler/` and `.dev.vars` are gitignored (Cloudflare/Wrangler artifacts).
- Environment variables are injected by the **Lovable Cloud** platform (client error messages say "Connect Supabase in Lovable Cloud").
- **No CI/CD configuration exists inside the repository** (no `.github/`, no Netlify/Vercel config). Pushing to `main` syncs to Lovable (see `AGENTS.md`).

## External Services

| Service | Purpose |
|---------|---------|
| Supabase | Enquiry persistence (`enquiries` table) |
| n8n (automate.nirosha.org) | Real-time lead forwarding webhook |
| Google Maps (embed + directions) | Location display (`site.mapsEmbed`, `site.mapsUrl`) |
| WhatsApp (wa.me) | Contact / enquiry channel |
| Google Fonts | Manrope + DM Serif Display |
| schema.org JSON-LD | Structured data (EducationalOrganization, Course, FAQPage, Article) |

## Important Entry Points

- `src/server.ts` — SSR fetch entry (error wrapping); configured via `vite.config.ts` (`tanstackStart.server.entry = "server"`)
- `src/start.ts` — `createStart` wiring: global function middleware (Supabase auth attach) + request middleware (error, CSRF for server functions)
- `src/router.tsx` — router + QueryClient creation
- `src/routes/__root.tsx` — root layout (head/meta/SEO shell, SiteShell, error & not-found components)
- `src/components/site-shell.tsx` — global shell: announcement bar, sticky header, mobile menu, footer, mobile action bar, enquiry dialog
- `src/components/enquiry-dialog.tsx` — the conversion funnel (multi-step form → Supabase + n8n)
- `src/content/site.ts` — all editable marketing content

## Repository Structure (top level)

```
.
├── AGENTS.md                  # Lovable platform note (do not rewrite git history)
├── README.md                  # Full product/design brief + local run instructions
├── package.json               # Scripts & dependencies (npm ecosystem primary)
├── bun.lock / bunfig.toml     # bun artifacts also present
├── package-lock.json
├── vite.config.ts             # Lovable tanstack config wrapper (recharts noExternal)
├── tsconfig.json              # Strict TS; "@/*" -> "./src/*"
├── eslint.config.js           # flat config, prettier plugin
├── components.json            # shadcn/ui config (style: new-york)
├── .prettierrc / .prettierignore
├── public/                    # favicons, robots.txt, brand/logo.png
├── supabase/
│   ├── config.toml            # Supabase local config (project_id only)
│   └── migrations/            # enquiries table migration
└── src/
    ├── assets/                # 3 JPG photographs + logo.png
    ├── components/            # site-shell, enquiry-dialog, page-hero, brand-loader, dead page-transition, ui/ (shadcn)
    ├── content/site.ts        # ALL marketing content (courses, articles, FAQs...)
    ├── hooks/use-mobile.tsx   # used only by ui/sidebar
    ├── integrations/supabase/ # client, client.server, auth-*, cron-auth, types
    ├── lib/                   # utils (cn), error-capture/error-page, lovable-error-reporting
    ├── routes/                # file-based routes (TanStack)
    ├── routeTree.gen.ts       # AUTO-GENERATED — do not edit
    ├── router.tsx / start.ts / server.ts / styles.css
```

## Important Files (quick map)

| File | Why it matters |
|------|----------------|
| `src/content/site.ts` | Courses, approach, disciplines, methodology, results, testimonials, FAQs, gallery, articles, site contact config, announcement |
| `src/routes/index.tsx` | Largest page; all homepage sections |
| `src/components/enquiry-dialog.tsx` | Lead capture; posts to n8n + Supabase |
| `src/components/site-shell.tsx` | Header/nav/announcement/footer/mobile bar/dialog orchestration |
| `src/styles.css` | Tailwind v4 theme tokens + custom components/animations |
| `supabase/migrations/*.sql` | Actual DB schema |
| `src/integrations/supabase/client.ts` | Browser Supabase client (env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) |
| `vite.config.ts` | Build config; recharts SSR noExternal |
| `public/robots.txt` + `src/routes/sitemap[.]xml.tsx` | Search engine artifacts |

## How the Application Works (end-to-end)

1. A visitor requests `https://joshisacademy.com/...`. TanStack Start SSR renders the matched route (`src/routes/...`), reading content from `src/content/site.ts`; `src/routes/__root.tsx` supplies the document head (SEO meta, fonts, favicons, JSON-LD) and the `SiteShell` chrome.
2. Client-side navigation (TanStack Router) swaps pages without full reloads; `SiteShell` persists and keeps the header/announcement/footer consistent.
3. Every page funnels the visitor to the **Enquiry dialog** (CTAs dispatch a `window` `open-enquiry` event; the dialog also **auto-opens ~3 seconds** after page load; a configurable announcement bar offers "Enquire Now").
4. The visitor completes the 6-step dialog: Class (IX/X) → Board (CBSE/ICSE) → Parent name → Mobile → Email (optional) → Preferred contact (Call/WhatsApp); a hidden **honeypot** field silently traps bots.
5. On submit the browser:
   - fire-and-forget `POST`s the payload to the **n8n webhook** (`automate.nirosha.org/webhook/joshisacademy`) for real-time lead forwarding, and
   - `INSERT`s into Supabase `public.enquiries` using the publishable key (RLS: insert-only). Email is **not** stored in Supabase (no column) — it travels to the webhook only.
6. Success state is shown to the user even when persistence fails (deliberate graceful degradation), with call-back / WhatsApp follow-up actions.
7. `/sitemap.xml` is generated server-side from the static content; crawlers also get per-page canonicals, meta, and JSON-LD.
8. Separately, background plumbing (`src/server.ts`, `src/start.ts`) wraps SSR errors and protects server functions with CSRF; none of the Supabase *auth* scaffolding is reached by these flows.

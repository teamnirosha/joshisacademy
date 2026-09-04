# Requirements — Joshis Academy Website

Requirements below are derived from the **product brief in `README.md`** and **actual implementation evidence** in `src/`. The brief is treated as the requirements document; code is the source of truth for status. Anything not verifiable is marked:

> UNKNOWN — Requires confirmation

## Functional Requirements

| # | Requirement (from brief) | Status (from code) |
|---|--------------------------|--------------------|
| F1 | Premium editorial homepage (hero, trust strip, introduction, why-academy list, sciences, teaching philosophy, method journey, results, testimonials, faculty, courses, classroom, gallery preview, journal preview, location, final CTA) | **Implemented** (`src/routes/index.tsx`) |
| F2 | Sticky header that is transparent over the hero, then solid + blurred + hairline border on scroll | **Implemented** (`site-shell.tsx`) |
| F3 | Mobile navigation as a full-screen menu | **Implemented** (dark editorial full-screen drawer) |
| F4 | Hero: `Science, Understood.` editorial composition with classroom photo, CTAs, institutional metadata | **Implemented** |
| F5 | Trust strip (100+ students, 25+ scored 90%+, CBSE+ICSE focus, small batches) | **Implemented** |
| F6 | "Why Joshi's Academy" interactive editorial list (6 items) with hover-expanding desktop and accordion-style mobile | **Implemented** (desktop list + expanding descriptions; mobile uses same expanding rows) |
| F7 | Sciences section: Physics/Chemistry/Biology editorial areas | **Implemented** |
| F8 | Teaching philosophy full-width section ("We don't teach students what to remember...") | **Implemented** |
| F9 | Method journey 01–06 (Understand → Perform) | **Implemented** (6-step desktop stepper + mobile vertical timeline) |
| F10 | Results section with verified stats only; never invent marks | **Implemented** (stats + integrity note); individual result *gallery/photos* from brief not implemented |
| F11 | Testimonials — one large at a time, verified only | **Implemented** (2 testimonials with rotating display) |
| F12 | Faculty section — brief asks for individual faculty profiles (name, role, qualifications, experience, philosophy, photography, verified only) | **Partial** — implemented as *faculty standards* pillars + a "verified disclosure policy" (no individual named profiles/photos exist) |
| F13 | Course directory with 4 editorial rows (CBSE/ICSE × IX/X) | **Implemented** |
| F14 | Individual course pages (hero, overview, who-for, curriculum P/C/B, methodology, testing, doubts, board timeline, FAQs, related articles, breadcrumbs, enquiry CTA) | **Implemented** (`courses.$slug.tsx`) |
| F15 | Gallery — editorial masonry, hover captions, fullscreen lightbox, lazy/alt images | **Implemented** (`gallery.tsx`; reuses 3 photographs) |
| F16 | Journal (blog) with category filter, listing, article pages w/ TOC & reading time | **Implemented** (6 articles in `site.ts`) |
| F17 | SEO per page: title, meta description, canonical, Open Graph, semantic HTML, breadcrumbs, sitemap.xml, robots.txt, JSON-LD (EducationalOrganization, Course, FAQPage, Article) | **Implemented** |
| F18 | Local SEO / location section: map, directions, phone, WhatsApp | **Implemented** (`/contact`, footer, homepage location) |
| F19 | Multi-step enquiry experience: Class → Board → Parent name → Mobile → Preferred contact (brief step 5) | **Implemented** (6 steps: adds optional Email between mobile & contact-mode) |
| F20 | Enquiry validation, loading, error, success states | **Partial** — validation + loading + success exist; dedicated visible *error* state was removed in favour of graceful success-on-failure (code comment "notice") |
| F21 | Spam protection | **Implemented** (hidden honeypot `website` field; no CAPTCHA) |
| F22 | Mobile fixed bottom action bar: Call \| WhatsApp \| Enquire | **Implemented** |
| F23 | FAQ accordion (SEO-friendly) | **Implemented** (`/faq` + JSON-LD FAQPage) |
| F24 | About page (Our Story, philosophy) | **Implemented** |
| F25 | Footer: brand, links (incl. FAQ/Privacy/Terms), map, contacts | **Implemented** |
| F26 | Persist enquiries (backend storage) | **Implemented** — Supabase `public.enquiries` via anon RLS insert |
| F27 | Real-time lead forwarding | **Implemented** — n8n webhook (commit `5fe8ba5`) |
| F28 | Auto enquiry popup | **Implemented** — opens ~3 s after page load (commits `bca6e77`, `f6bbb72`) |
| F29 | Announcement bar (configurable, expiring) | **Implemented** (`announcement` in `site.ts`; expiry-aware) |
| F30 | Brand loading intro | **Implemented** (session-once loader, reduced-motion aware) |
| F31 | Course/result/testimonial/faculty/gallery/blog/FAQ/contact content "easy to update", no duplication | **Partial** — central `site.ts` exists, but some copy is duplicated inline in pages (see `KNOWN_ISSUES`/`TECHNICAL_DEBT`); no CMS/admin UI |
| F32 | Privacy Policy & Terms pages | **Implemented** (basic) |
| F33 | 404 page | **Implemented** (custom not-found in `__root.tsx`) |
| F34 | Enquiry data management view (list/status workflow `new → contacted → closed`) | **Not implemented in app** — `status` column exists in DB (schema-only). Managing leads happens outside the app |
| F35 | Analytics | **Not implemented** — no analytics snippet found in code |

## Non-Functional Requirements

| # | Requirement | Status |
|---|-------------|--------|
| N1 | React + TypeScript + Tailwind (brief architecture) | Met — React 19, TS 5.8 strict, Tailwind v4 |
| N2 | Design: premium editorial, not template-like; palette Ink Navy/Ivory/Gold note: actual site palette differs from brief (see note below) | Met as *implemented design system*: Ink `#111111`, Ivory `#faf9f5`, Violet `#35208f`, Royal `#3538a8`, Lavender `#eeecfa` |
| N3 | Performance target Lighthouse 90+ | **UNKNOWN — Requires confirmation** (no audit artifacts in repo; some optimisations present: `loading="lazy"`, `fetchPriority`, no heavy runtime libs) |
| N4 | Responsive: desktop/tablet/mobile recomposition | Met (several distinct mobile layouts) |
| N5 | Accessibility: semantic HTML, keyboard nav, focus states, alt text, `prefers-reduced-motion` | Mostly met in code; no automated audit — **UNKNOWN** for WCAG compliance level |
| N6 | Image loading: lazy, explicit dimensions, AVIF/WebP where feasible | **Partial** — lazy + width/height + alt everywhere; images are JPG (no AVIF/WebP pipeline) |
| N7 | Content authenticity: never invent results/faculty/awards/phone/address | Met in practice — site claims flagged "verified"; verification of real-world facts is outside the repo's control |
| N8 | Keep code clean & production-ready; avoid unnecessary libraries | **Partial** — app code clean; however many unused dependencies/ui primitives exist (see `TECHNICAL_DEBT.md`) |
| N9 | Local SEO targeting (Kharadi/Pune queries) | Met (content/meta/JSON-LD; rankings UNKNOWN) |

> **Design inconsistency note:** the README brief prescribes a navy/ivory/gold palette (Deep Ink Navy `#0B1220`, Warm Ivory `#F5F2EA`, Muted Academic Gold `#B99A5B`) and Manrope + DM Serif/Cormorant. The **implemented** palette is Ink `#111111` / Ivory `#faf9f5` / Violet `#35208f` / Royal `#3538a8` / Lavender `#eeecfa` (styles.css header comment documents these). Fonts match the brief (Manrope + DM Serif Display). Implementation wins; documented here so future work doesn't "correct" colours to the brief by mistake.

## Business Rules

- Enquiry `student_class` ∈ {IX, X}; `board` ∈ {CBSE, ICSE}; `preferred_contact` ∈ {Call, WhatsApp} (DB CHECK + client validation).
- `parent_name` length 2–100; `mobile_number` matches `^[0-9+ ()-]{10,20}$` in DB (client allows 10–15 chars — slightly narrower).
- New enquiries always start `status = 'new'` (DB default + RLS insert check).
- Website content claims (statistics, testimonials, faculty credentials) must be verified by the academy; the code enforces this only by editorial convention.
- Announcement bar obeys `enabled` + `expiry` config in `site.ts`.
- Enquiry UX intentionally reports success even if persistence fails (lead-capture resilience) — engineering decision, not a documented requirement.

## User Roles

| Role | In the code |
|------|-------------|
| Visitor / parent / student (anonymous) | Only real role. Can browse pages and submit an enquiry (anon RLS insert) |
| Academy admin | **Not in application** — reviews leads via Supabase dashboard/n8n. `service_role` key exists server-side but unused |
| Authenticated user | **Not implemented** (scaffolding only) |

## Constraints

- Single-table Supabase schema; no user accounts; no server-side application API.
- Enquiry email field has **no DB column** — email reaches only the n8n webhook.
- Content is code (`site.ts`) — no CMS/admin.
- Repo branch `main` is Lovable-connected: do not rewrite history (AGENTS.md).
- Deployment environment variables are supplied by Lovable Cloud — no `.env` file is committed or expected.
- Client-side env vars must be prefixed `VITE_` (Vite) or fall back to `process.env` names on the server.

## Requirements Already Implemented

F1–F10 (except result gallery), F11, F13–F19 (see F19 notes), F21–F30, F32, F33; N1, N2, N4, N6 (partial), N7, N8 (partial), N9 (content level).

## Requirements Partially Implemented

- F12 Faculty — standards page only; no named profiles/photos.
- F20 Enquiry states — no visible error state (deliberate).
- F31 CMS-readiness — central data module, but duplicated inline copy in places and no admin UI.
- N6 — no AVIF/WebP generation.

## Requirements Not Yet Implemented

- F10 result gallery/photos below results (brief: "Create a result gallery below").
- F34 lead-management UI / enquiry status workflow.
- F35 analytics.
- Any CMS/admin backend (not in brief as a hard deliverable, but implied by "CMS-ready content" phrasing — treat as **UNKNOWN** intent).

## UNKNOWN — Requires Confirmation

- Actual hosting provider/dashboard for `joshisacademy.com` (deployment target not declared in repo).
- Lighthouse scores / Core Web Vitals measurements.
- Whether Google Search Console / analytics accounts exist.
- n8n workflow internals (what the webhook does after receipt; where leads land).
- Whether the `email` field submitted to n8n is actually stored there.
- Real-world verification of business claims (results, testimonials, faculty, phone, address, hours).

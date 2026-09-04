# Feature Inventory — Joshis Academy Website

Status legend: **COMPLETE** · **IN PROGRESS** · **PARTIAL** · **PLANNED** · **BLOCKED** · **UNKNOWN**.

Status is determined from actual code and git history. A feature is COMPLETE only when the implementing code demonstrably exists and is reachable.

---

### Feature: Homepage (full editorial composition)
- **Status:** COMPLETE
- **Implemented:** Yes — `src/routes/index.tsx` (~900 lines), route `/`
- **Relevant frontend files:** `src/routes/index.tsx`, `src/components/site-shell.tsx`, `src/components/page-hero.tsx` (Crumbs), `src/content/site.ts`
- **Relevant backend files:** none (SSR rendering only)
- **Relevant APIs:** none
- **Relevant database entities:** none
- **Dependencies:** lucide-react icons, `ui/button`, 3 JPG assets, content module
- **Notes:** Sections: hero → trust strip → approach → why (interactive list) → sciences → philosophy → method (6-step) → results → testimonials (rotating) → faculty standards → course rows → classroom photo → gallery preview → journal preview → location → final CTA. Route meta + JSON-LD EducationalOrganization.

### Feature: Inner-page hero + shared page chrome
- **Status:** COMPLETE
- **Implemented:** Yes — `PageHero`, `Crumbs`, `seoMeta` in `src/components/page-hero.tsx`
- **Relevant frontend files:** `src/components/page-hero.tsx` (used by ~12 route files)
- **Notes:** Consistent editorial hero header across /courses, /journal, /about, /contact, /results, /faculty, /faq, /gallery, /privacy, /terms.

### Feature: Sticky header / navigation / announcement bar / footer / mobile menu / mobile action bar
- **Status:** COMPLETE
- **Implemented:** Yes — `src/components/site-shell.tsx`
- **Relevant frontend files:** `site-shell.tsx`, `src/content/site.ts` (`site`, `announcement`)
- **Notes:** Transparent-over-hero header that gains blur + border on scroll; announcement bar (expiry-aware) pushes header down via measured height + ResizeObserver; full-screen mobile menu; fixed bottom bar on mobile (`Call | WhatsApp | Enquire`); footer with map embed, links, tel/wa.me links. Uses `open-enquiry` window event.

### Feature: Enquiry dialog (multi-step lead form)
- **Status:** COMPLETE
- **Implemented:** Yes — `src/components/enquiry-dialog.tsx`
- **Relevant frontend files:** `src/components/enquiry-dialog.tsx`
- **Relevant backend files:** none (client-side submission)
- **Relevant APIs:** Supabase insert; n8n webhook POST
- **Relevant database entities:** `public.enquiries`
- **Dependencies:** `@radix-ui/react-dialog`, lucide-react, `supabase` client, `site.ts`
- **Notes:** 6 steps (Class → Board → Parent name → Mobile → Email optional → Contact mode), client-side validation per step, honeypot spam trap, loading + success states; auto-opens 3 s after page load (see `site-shell.tsx`); fire-and-forget n8n POST then Supabase INSERT; success UI shown even when persistence fails (deliberate).

### Feature: Enquiry persistence (Supabase)
- **Status:** COMPLETE
- **Implemented:** Yes — `supabase/migrations/*.sql`, `src/integrations/supabase/client.ts`, insert in `enquiry-dialog.tsx`
- **Relevant frontend files:** `enquiry-dialog.tsx`
- **Relevant database entities:** `public.enquiries` (id, student_class, board, parent_name, mobile_number, preferred_contact, status, submission_fingerprint, created_at, updated_at)
- **Notes:** Insert-only via anon key; RLS `WITH CHECK (status = 'new')`. `email`, `submitted_at`, `page_url` are sent to the webhook only (no columns).

### Feature: Real-time lead forwarding via n8n webhook
- **Status:** COMPLETE
- **Implemented:** Yes — commit `5fe8ba5` "integrate n8n webhook for real-time lead forwarding"; `enquiry-dialog.tsx` `fetch("https://automate.nirosha.org/webhook/joshisacademy", ...)` with `.catch(console.warn)`
- **Relevant frontend files:** `enquiry-dialog.tsx`
- **Relevant APIs:** external webhook (POST JSON)
- **Notes:** Fire-and-forget; failures never block the user. Webhook internals UNKNOWN.

### Feature: Auto enquiry popup on visit
- **Status:** COMPLETE
- **Implemented:** Yes — commits `bca6e77`, `f6bbb72`; `setTimeout(..., 3000)` in `site-shell.tsx`
- **Notes:** Opens dialog on every full page load after 3 s; no per-visit suppression (brand loader uses separate `ja_seen_loader` session flag). Could be seen as aggressive UX.

### Feature: Brand loading intro
- **Status:** COMPLETE
- **Implemented:** Yes — `src/components/brand-loader.tsx`
- **Notes:** Ivory overlay with logo + animated bar, once per session (`sessionStorage "ja_seen_loader"`), disabled under `prefers-reduced-motion`.

### Feature: Courses directory + course detail pages
- **Status:** COMPLETE
- **Implemented:** Yes — `courses.index.tsx`, `courses.$slug.tsx`, `courses.tsx` (layout), data in `site.ts`
- **Relevant frontend files:** above + `content/site.ts` (`CourseItem`, 4 courses with aliases for IX/X slugs)
- **Relevant database entities:** none (static content)
- **Notes:** Loaders throw `notFound()` for unknown slugs; JSON-LD `Course`; canonical URLs; related journal articles by slug reference.

### Feature: Journal (The Joshi's Journal)
- **Status:** COMPLETE
- **Implemented:** Yes — `journal.index.tsx` (category filter client-side), `journal.$slug.tsx` (TOC anchors, sections), `content/site.ts` (`articles`, 6 items)
- **Notes:** JSON-LD `Article`; per-article meta; reading time + date from content.

### Feature: Gallery with lightbox
- **Status:** COMPLETE
- **Implemented:** Yes — `gallery.tsx` (masonry grid, hover overlays, keyboard-navigable lightbox)
- **Relevant database entities:** none (items defined locally in the route; gallery captions also exist in `site.ts` `galleryItems` — the route uses its own richer local list)
- **Notes:** Reuses the same 3 photographs for 6 tiles. Duplicate gallery metadata between route-local list and `site.ts` galleryItems (see `TECHNICAL_DEBT.md`).

### Feature: Results page
- **Status:** COMPLETE (as built); result *gallery* portion of the brief NOT implemented
- **Implemented:** Yes — `results.tsx` using `site.ts` `results`
- **Notes:** Stats: 25+ scored 90%+; 50% of 2024–25 batch >90%; remaining 85%+; integrity/verification copy; no individual mark sheets or photos.

### Feature: Faculty page
- **Status:** PARTIAL (relative to brief) — see notes
- **Implemented:** Yes, as "Faculty Standards" — `faculty.tsx` + `site.ts` `facultyStandards`
- **Notes:** Brief asked for individual verified faculty profiles (name, role, qualifications, experience, philosophy, photos). Implemented page deliberately publishes *standards* + verification policy and no named individuals — likely because no verified profiles were available. Individual profiles: NOT implemented.

### Feature: About page
- **Status:** COMPLETE
- **Implemented:** Yes — `about.tsx`

### Feature: Contact page (location, map, hours, phone/WhatsApp)
- **Status:** COMPLETE
- **Implemented:** Yes — `contact.tsx` + `site.ts` (`site.phone`, `site.whatsapp`, `mapsUrl`, `mapsEmbed`)
- **Notes:** Hours text (Mon–Sat 10:00–19:30; Sun by appointment) is hard-coded in the page.

### Feature: FAQ page (SEO accordion)
- **Status:** COMPLETE
- **Implemented:** Yes — `faq.tsx` + `faqs` in `site.ts`; JSON-LD `FAQPage`
- **Notes:** First item open by default.

### Feature: Legal pages (Privacy, Terms)
- **Status:** COMPLETE
- **Implemented:** Yes — `privacy.tsx`, `terms.tsx` (basic text)

### Feature: SEO & structured data
- **Status:** COMPLETE
- **Implemented:** Yes — per-route `head()` meta (title/description/canonical/OG/twitter), root JSON-LD EducationalOrganization, Course JSON-LD per course, FAQPage JSON-LD, Article JSON-LD, `robots.txt`, server-generated `/sitemap.xml`
- **Notes:** Sitemap omits `/gallery` even though the page exists and is linked. Article JSON-LD `datePublished` hard-coded `2026-08-01` for all articles (see `KNOWN_ISSUES.md`).

### Feature: Supabase auth infrastructure (scaffolding)
- **Status:** PARTIAL / scaffolding only — **not user-facing**
- **Implemented:** Files exist: `auth-attacher.ts` (registered in `start.ts`), `auth-middleware.ts` (`requireSupabaseAuth`), `client.server.ts` (service-role), `cron-auth.ts`, `previewAuthStorage.ts`
- **Relevant APIs:** none exercised
- **Notes:** Generated by the Lovable template. No page, loader, or server function uses `requireSupabaseAuth`, `supabaseAdmin`, or `authenticateCronRequest`. Do not assume auth works for users.

### Feature: Enquiry lead status workflow (new → contacted → closed)
- **Status:** PLANNED (schema-only)
- **Implemented:** DB column `status` + CHECK constraint; default `'new'`
- **Notes:** No UI, API, or automation in the app consumes the field. Managing status happens externally (e.g., Supabase dashboard). NOT user-visible.

### Feature: Page transition loading overlay
- **Status:** REMOVED (code remains)
- **Implemented:** Removed in commit `0290926` "remove page transition loading overlay"
- **Relevant frontend files:** `src/components/page-transition.tsx`, `dual-ring-spinner.tsx` — now **dead code** (0 importers)
- **Notes:** Styles for spinner/overlay remain in `styles.css`.

### Feature: Analytics / tracking
- **Status:** NOT STARTED
- **Notes:** No analytics script found anywhere in the repo.

### Feature: Automated tests
- **Status:** NOT STARTED
- **Notes:** No test framework, test files, or test scripts. See `TESTING_STRATEGY.md`.

### Feature: Content management (CMS/admin)
- **Status:** PARTIAL
- **Implemented:** Content centralized in `src/content/site.ts` (typed, easy to edit)
- **Notes:** No CMS backend or admin UI. Content edits = code commits to `main` → redeploy via Lovable.

### Feature: Contact phone/WhatsApp/maps/email actions
- **Status:** COMPLETE
- **Implemented:** `tel:`, `https://wa.me/`, Google Maps embed + directions, footer/contact/homepage surfaces
- **Notes:** No email address is published anywhere in code (email submission exists but no mailto).

---

## Summary Count

- **COMPLETE:** homepage, page chrome, header/nav/footer/announcement/mobile bar, enquiry dialog, enquiry persistence, n8n forwarding, auto popup, brand loader, courses (dir + detail), journal, gallery, results (as built), about, contact, FAQ, legal, SEO/structured data, contact actions
- **PARTIAL:** faculty page (standards only), enquiry error state (intentional), CMS-readiness/duplication, auth scaffolding (unused), status workflow (schema only)
- **REMOVED:** page-transition overlay (dead files remain)
- **NOT STARTED:** analytics, automated tests, individual faculty profiles, result gallery, lead-management UI

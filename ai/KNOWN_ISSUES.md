# Known Issues — Joshis Academy Website

Documented for awareness. **Nothing here has been fixed** as part of context creation. Severity is relative to a live marketing site with an enquiry pipeline.

---

### Issue: `/gallery` missing from sitemap.xml
- **Severity:** Low
- **Status:** OPEN
- **Affected Area:** SEO / `src/routes/sitemap[.]xml.tsx`
- **Evidence:** `sitemap[.]xml.tsx` `paths` array lists `""`, `courses`, `results`, `faculty`, `about`, `journal`, `contact`, `faq`, `privacy`, `terms` + dynamic slugs — no `gallery`. The `/gallery` route exists and is linked in nav (`site-shell.tsx` navItems includes Gallery).
- **Potential Impact:** Gallery page excluded from crawl discovery via sitemap.
- **Suggested Investigation:** Confirm whether omission is deliberate; if not, add `gallery` to the paths array.

### Issue: Article JSON-LD `datePublished` hard-coded for all articles
- **Severity:** Low
- **Status:** OPEN
- **Affected Area:** SEO / `src/routes/journal.$slug.tsx`
- **Evidence:** Script emits `datePublished: "2026-08-01"` unconditionally, while `site.ts` articles carry per-article `date` values (June–September 2026) and different dates exist across articles.
- **Potential Impact:** Structured data can contradict visible dates → rich-result trust issues.
- **Suggested Investigation:** Derive `datePublished` from each article's `date`.

### Issue: Duplicate gallery metadata (route-local vs content module)
- **Severity:** Low
- **Status:** OPEN
- **Affected Area:** `src/routes/gallery.tsx` vs `src/content/site.ts` `galleryItems`
- **Evidence:** `gallery.tsx` defines its own 6-item `GalleryItem[]` (richer layout spans) while `site.ts` exports a different 6-item `galleryItems` (used only on the homepage preview). Two sources of truth; homepage and gallery pages can drift.
- **Potential Impact:** Inconsistent captions/counts; maintenance confusion for AI agents.
- **Suggested Investigation:** Unify to one structure or document the intentional split.

### Issue: Duplicated faculty copy on the homepage
- **Severity:** Low
- **Status:** OPEN
- **Affected Area:** `src/routes/index.tsx` (faculty-standards section) vs `site.ts` `facultyStandards`
- **Evidence:** Homepage renders 4 inline pillar cards ("Subject Specialisation", "Pedagogical Patience", "Marking Rubric Insight", "Individual Mentorship") written differently from `facultyStandards.pillars` used on `/faculty`; the shared intro text also differs. README explicitly says "Do not duplicate content throughout the application."
- **Potential Impact:** Copy drift between home and faculty pages.
- **Suggested Investigation:** Reuse `facultyStandards` on the homepage.

### Issue: Enquiry email is sent to webhook only — not stored in Supabase
- **Severity:** Medium (data/expectation gap)
- **Status:** OPEN
- **Affected Area:** `enquiry-dialog.tsx`, `supabase/migrations`, `DATA_MODEL`
- **Evidence:** Dialog collects optional email and shows copy promising schedules/brochures; payload includes `email`, but the Supabase `insert` omits it and the `enquiries` table has no email column. Email only reaches n8n (whose storage is outside this repo).
- **Potential Impact:** If n8n fails or does not persist email, leads lose the email permanently — silent data loss on the UX promise.
- **Suggested Investigation:** Confirm n8n persists email; or add an `email` column (nullable, validated) + include it in the insert.

### Issue: Enquiry "success" displayed even when persistence fails
- **Severity:** Medium (data-accuracy/UX)
- **Status:** OPEN (deliberate per DECISIONS.md, still worth tracking)
- **Affected Area:** `enquiry-dialog.tsx` `submit()`
- **Evidence:** Supabase insert error → `console.warn` → still `setState("success")`; thrown errors likewise caught → success. No retry, no visible failure, no queue.
- **Potential Impact:** Parents believe an enquiry was recorded when it may not be; no in-app signal for the academy that capture degraded.
- **Suggested Investigation:** Add soft telemetry/flagging while preserving the graceful UX; or implement retry.

### Issue: Auto enquiry popup fires on every full page load with no dismissal memory
- **Severity:** Low (UX)
- **Status:** OPEN
- **Affected Area:** `src/components/site-shell.tsx`
- **Evidence:** `setTimeout(() => setEnquireOpen(true), 3000)` unconditionally on mount; no sessionStorage/flag for the dialog (brand loader uses its own `ja_seen_loader` key, unrelated).
- **Potential Impact:** Returning visitors get interrupted repeatedly; SPA route changes do not re-fire (shell persists), but full reloads do.
- **Suggested Investigation:** Consider once-per-session gate or interaction-based trigger (product decision).

### Issue: n8n webhook is fire-and-forget with no retry and hard-coded URL
- **Severity:** Medium (reliability)
- **Status:** OPEN
- **Affected Area:** `enquiry-dialog.tsx`
- **Evidence:** `fetch(...).catch(console.warn)`; URL `https://automate.nirosha.org/webhook/joshisacademy` literal; fallback `page_url` literal `https://joshisacademy.com`.
- **Potential Impact:** Transient network/n8n outages silently drop the real-time forwarding path; changing endpoint requires code redeploy.
- **Suggested Investigation:** Retry-with-backoff, env-configurable URL, or server-side forwarding.

### Issue: Dead code from overlay removal
- **Severity:** Low
- **Status:** OPEN
- **Affected Area:** `src/components/page-transition.tsx`, `src/components/dual-ring-spinner.tsx`, CSS in `styles.css` (`ring-*`, `spinner-overlay-*`, `overlay-*` keyframes)
- **Evidence:** Commit `0290926` removed usage; code search shows zero importers of `PageTransition`/`DualRingSpinner`.
- **Potential Impact:** Confuses agents reading the codebase; small dead bundle surface if ever imported accidentally.
- **Suggested Investigation:** Delete files + CSS (after confirming nothing references them), or mark clearly.

### Issue: Unused Supabase auth/server scaffolding is globally registered or importable
- **Severity:** Medium (foot-gun)
- **Status:** OPEN
- **Affected Area:** `src/integrations/supabase/*` (`client.server.ts`, `auth-middleware.ts`, `cron-auth.ts`, `auth-attacher.ts` registered in `src/start.ts`)
- **Evidence:** `attachSupabaseAuth` runs as global function middleware on every serverFn-capable client call (no-op without sessions). `requireSupabaseAuth`, `supabaseAdmin`, `authenticateCronRequest` are referenced nowhere outside their own folder.
- **Potential Impact:** Future agent/developer may assume auth exists, or accidentally import the service-role client into browser code (secret exposure).
- **Suggested Investigation:** Wire into a real admin feature or remove; add lint guard against importing `client.server.ts` from client code.

### Issue: sitemap/robots reference only `joshisacademy.com` — no `www` handling
- **Severity:** Low
- **Status:** OPEN
- **Affected Area:** SEO artifacts; canonical links
- **Evidence:** All canonicals/OG/sitemap/robots use the bare apex `https://joshisacademy.com`; no redirect/`www` evidence in repo (host-level, unverifiable here).
- **Potential Impact:** Duplicate-host indexing risk if `www` resolves.
- **Suggested Investigation:** Verify apex vs www at DNS/host level (outside repo).

### Issue: `found_images.txt` is an empty tracked artifact
- **Severity:** Trivial
- **Status:** OPEN
- **Affected Area:** repo root
- **Evidence:** File exists, 0 bytes, added in initial commit, never used.
- **Potential Impact:** None functionally; mild confusion.
- **Suggested Investigation:** Confirm purpose or remove.

### Issue: Client mobile validation is narrower than DB validation
- **Severity:** Low
- **Status:** OPEN
- **Affected Area:** `enquiry-dialog.tsx` (`{10,15}`) vs migration (`{10,20}`)
- **Evidence:** Client regex `/^[0-9+ ()-]{10,15}$/`; DB CHECK `~ '^[0-9+ ()-]{10,20}$'`.
- **Potential Impact:** Valid-per-DB values (e.g., 16-char formatted numbers) are rejected client-side; not a correctness bug in practice for Indian mobiles.
- **Suggested Investigation:** Align lengths deliberately.

### Issue: `page_url` may include tracking/query noise in stored leads (webhook only)
- **Severity:** Low
- **Status:** OPEN
- **Affected Area:** `enquiry-dialog.tsx` (`window.location.href` as `page_url`)
- **Evidence:** Full href captured including query strings; no sanitization.
- **Potential Impact:** Messy downstream data; possible leakage of UTM params (benign) — informational.
- **Suggested Investigation:** Decide desired URL granularity.

### Issue: No automated tests or CI guard the enquiry pipeline
- **Severity:** High (process risk, not current breakage)
- **Status:** OPEN
- **Affected Area:** whole repo
- **Evidence:** No test framework/files/scripts; no `.github` workflows; last 10 commits all landed the same day directly to `main`.
- **Potential Impact:** Regression in the live lead path goes undetected until a lead is lost.
- **Suggested Investigation:** See `TESTING_STRATEGY.md` + `ROADMAP.md`.

### Issue: Unused-dependency surface (incl. recharts SSR workaround)
- **Severity:** Low
- **Status:** OPEN
- **Affected Area:** `package.json`, `vite.config.ts`, `src/components/ui/*`
- **Evidence:** ~40 unused `ui/*` components; runtime deps used only by them (recharts, react-hook-form, sonner, embla-carousel-react, vaul, cmdk, input-otp, react-day-picker, react-resizable-panels, date-fns, zod...); `vite.config.ts` carries an `ssr.noExternal: ["recharts"]` workaround for the unused chart.
- **Potential Impact:** Bundle weight, dependency-audit surface, config complexity.
- **Suggested Investigation:** Verified removal campaign (see TECHNICAL_DEBT.md for the precise list).

# Current State — Joshis Academy Website

Snapshot date: 2026-09-04 (repository state at `main`, HEAD `45a7e57`).

Statuses used: COMPLETE · IN PROGRESS · PARTIAL · BLOCKED · NOT STARTED · UNKNOWN. Every claim below has code or git evidence.

## Overall Status

**DEPLOYED & LIVE** — the site is a production marketing website at `https://joshisacademy.com`. The application code is complete for its current scope (public pages + enquiry capture). No code work is mid-flight on the default branch; the last 10 commits (2026-09-04) are finished, deployed features. The largest remaining gaps are **no automated tests**, **no in-app lead management**, and several **scaffolding/dead-code** leftovers.

## Frontend Status

**COMPLETE** (current scope)

- All public pages implemented and routed (see `FEATURES.md`): `/`, `/courses`, `/courses/:slug`, `/journal`, `/journal/:slug`, `/gallery`, `/results`, `/faculty`, `/about`, `/contact`, `/faq`, `/privacy`, `/terms`, `/sitemap.xml`, custom 404.
- Global chrome (header, announcement bar, footer, mobile menu, mobile action bar, enquiry dialog) in `site-shell.tsx`.
- Static content architecture (`src/content/site.ts`); no CMS.
- Interactive client state only; **no data fetching anywhere** (TanStack Query provisioned but unused).
- Frontend build: Vite 8 + TanStack Start SSR. Recent commits show polish cycles (typography, header, popup, webhook) and a deliberate removal (page-transition overlay — files remain as dead code).
- Dead/unused code present: `page-transition.tsx`, `dual-ring-spinner.tsx`, ~40 unused `ui/*` components, unused deps. (See `TECHNICAL_DEBT.md`.)

## Backend Status

**PARTIAL by design** — there is no application-owned backend API.

- SSR layer (TanStack Start entry `server.ts`, `start.ts` middleware, error resilience in `lib/`) is COMPLETE for its role.
- `/sitemap.xml` server route COMPLETE.
- Persistence + lead forwarding happen client-side to Supabase and n8n — COMPLETE for the enquiry feature.
- Supabase server-side modules (`client.server.ts`, `auth-middleware.ts`, `cron-auth.ts`) exist but are **unused** — PARTIAL/SCAFFOLDING.
- No admin, dashboard, auth, or read APIs exist in the application.

## Database Status

**COMPLETE** (for current requirements) — Supabase Postgres.

- Single table `public.enquiries` created by `supabase/migrations/20260904045430_*.sql`, with CHECK constraints, insert grants to `anon`/`authenticated`, full grants to `service_role`, RLS enabled + insert policy, `updated_at` trigger, and index on `created_at DESC`.
- Client TypeScript types in `src/integrations/supabase/types.ts` (matches migration).
- Local config `supabase/config.toml` contains only `project_id`; no local stack/auth config committed.
- The table is written but **never read by the application** (no read path in code).

## Authentication Status

**NOT IMPLEMENTED (user-facing)** / **SCAFFOLDING ONLY**

- No login, registration, sessions, roles UI, or protected pages anywhere.
- Supabase auth template plumbing exists (auth attach middleware registered globally in `start.ts`, bearer-verification middleware, preview-session storage broker, cron secret guard) but no application flow uses a session.
- Enquiries are submitted **anonymously** under the `anon` role with an insert-only RLS policy.

## Authorization Status

**PARTIAL**

- RLS on `public.enquiries`: anonymous insert allowed only with `status = 'new'`; no reads by anon/authenticated; `service_role` has full access (server-only, unused).
- No application-level authorization model exists (not needed by current scope).

## Feature Status

See `ai/FEATURES.md` for the full per-feature inventory. Highlights:

- COMPLETE: all marketing pages, SEO/structured data, enquiry flow, Supabase persistence, n8n forwarding, auto-popup, announcement bar, brand loader, mobile conversion bar, maps/WhatsApp/tel actions.
- PARTIAL: faculty page (standards, not individual profiles); enquiry "error state" (deliberately suppressed); CMS-readiness (central module but some duplicated copy); lead status workflow (schema only).
- NOT STARTED: analytics, automated tests, individual faculty profiles, result gallery, lead-management UI.
- REMOVED: page-transition overlay (dead files remain).

## Testing Status

**NOT STARTED**

- No unit/integration/e2e tests, no test framework, no `test` script, no test types in tsconfig.
- Available validation only: `npm run lint` (eslint + prettier), `tsc --noEmit`, `npm run build` (manual).
- See `ai/TESTING_STRATEGY.md`.

## Deployment Status

**LIVE** at `https://joshisacademy.com`.

- Canonical/OG/JSON-LD/sitemap/robots all reference `https://joshisacademy.com`.
- Deployment pipeline is external to the repo (Lovable Cloud; nitro build with Cloudflare default target per `@lovable.dev/vite-tanstack-config` comments; `.wrangler`/`.dev.vars` gitignored). Exact hosting account/dashboard: **UNKNOWN — Requires confirmation**.
- Env vars injected by Lovable Cloud ("Connect Supabase in Lovable Cloud" error strings in client code).
- Repo itself contains no deploy config, Dockerfile, or CI.

## CI/CD Status

**NOT STARTED (no in-repo CI/CD)**

- No `.github/`, no pipeline files. Git pushes to `main` sync to Lovable (AGENTS.md); that is the de-facto release path. Branch protection/review process: **UNKNOWN** (single developer committer in history: "Pune Mumbai Cab Deployer" for c975704…45a7e57; "teamnirosha" for the initial commit).

## Known Problems

- Dead code: `page-transition.tsx` + `dual-ring-spinner.tsx` (+ spinner CSS) unused after overlay removal.
- ~40 unused `ui/*` components and several unused dependencies.
- Sitemap omits `/gallery`; Article JSON-LD `datePublished` hard-coded; duplicated gallery data (route-local vs `site.ts`); duplicated faculty copy (homepage inline vs `facultyStandards`).
- Email field sent only to webhook (no DB column) — UX copy implies brochure delivery.
- Enquiry success shown even when Supabase insert fails (intentional but worth noting).
- Auto-popup has no dismissal memory; opens 3 s after every full page load.
- Full list with evidence: `ai/KNOWN_ISSUES.md`.

## Technical Debt

- No tests at all.
- Large unused dependency surface (see `TECHNICAL_DEBT.md` for the list) incl. recharts (SSR noExternal workaround for an unused chart), zod/react-hook-form (unused), date-fns, embla, sonner, vaul, cmdk, etc.
- Duplicated marketing copy in places (README's explicit "do not duplicate content" guidance is partially violated).
- Two package-manager artifacts (package-lock.json + bun.lock/bunfig) with npm-first scripts/README.
- Layered SSR error-handling workarounds (h3 swallow) add complexity.
- Hard-coded business values in `site.ts` (fee ₹1500/-, academic-year text) and hard-coded webhook/fallback URLs in `enquiry-dialog.tsx`.
- Detail in `ai/TECHNICAL_DEBT.md`.

## Current Limitations

- No backend read/management surface for enquiries; triage happens outside the app.
- No CMS/admin; content changes require code deploys.
- No analytics; no A/B or funnel measurement (UNKNOWN if external tools exist outside repo).
- No tests, no CI.
- Mobile/desktop images are the same 3 JPGs reused across sections (photography library is thin).
- `email` not persisted in the database.
- Auth scaffolding can confuse future work (unused middleware registered globally).

## Recently Completed Work

(Commit history, 2026-09-04, all on `main`; author label "Pune Mumbai Cab Deployer" unless noted)

- `45a7e57` remove `.lovable` directory and branding references (README/robots/sitemap tidy)
- `5fe8ba5` integrate n8n webhook for real-time lead forwarding
- `cb01860` crisp multi-resolution favicons + apple touch icon
- `f6bbb72` ensure auto enquiry popup triggers on website visit
- `bca6e77` upgrade enquiry modal UI, remove scrollbars, 3-second auto popup
- `d304c49` harmonize hero headline typography/layout across pages
- `bb4a9a8` compact header width, larger clean logo, unify data bindings
- `0290926` remove page transition loading overlay
- `8d32cb0` fix: recharts ssr.noExternal (useContext null error)
- `c975704` initial project setup — all source files (by "Pune Mumbai Cab Deployer")
- `d6447b0` initial commit (by "teamnirosha")

## Work In Progress

None registered. No local branches beyond `main`. `ACTIVE_WORK.md` has no entries.

## Pending Work

- (Recommendations only — see `ROADMAP.md`) tests, dead-code cleanup, sitemap/JSON-LD fixes, lead management, analytics.
- Nothing in the repository marks unfinished in-code work (no TODOs/FIXMEs in app code; `found_images.txt` is an empty scaffold artifact).

## Blocked Work

None identified. (Faculty individual profiles appear intentionally deferred pending verified data — likely content-blocked, not code-blocked.)

## Important Notes

- `main` is the only branch; it is the Lovable-connected branch — **never rewrite pushed history**.
- Do not treat the presence of Supabase auth modules as a working auth system.
- The README brief and the implemented design differ on palette (brief: navy/ivory/gold; code: ink/ivory/violet/royal/lavender) — implemented design wins.
- App code contains zero TODO/FIXME markers; cleanliness of active code is high; the debt is in unused scaffold + missing engineering hygiene (tests/CI).

# Decisions — Joshis Academy Website

Architecture Decision Record (ADR) style. **Only decisions with evidence are recorded** (code comments, commit messages, observable implementation). Historical rationale that is not documented is marked:

> Reason: UNKNOWN — Requires confirmation

---

## Decision: Build the site on TanStack Start (React) instead of plain Vite/SPA or Next.js

- **Date:** 2026-09-04 (initial setup commit `c975704`)
- **Status:** ACCEPTED — implemented
- **Context:** Project scaffolded with `@lovable.dev/vite-tanstack-config`; needs SSR (SEO for a marketing site), file-based routing, and Lovable platform compatibility.
- **Decision:** React 19 + TypeScript + Vite 8 + TanStack Start/TanStack Router (SSR-capable), TanStack Query wired for future data needs, Tailwind CSS v4.
- **Reason:** Template/platform default; SSR + SEO fit (per code structure). Exact reasoning: UNKNOWN — Requires confirmation.
- **Consequences:** Routes live in `src/routes/` (never `pages/`); route tree auto-generated; Nitro-based server target; `*.server.ts` convention; CSRF + error middleware needed manually (`start.ts`); no Next-style `app/` layouts.
- **Alternatives:** Next.js/Remix/plain Vite — no evidence these were evaluated.

## Decision: Persist enquiries directly from the browser to Supabase (no owned backend API)

- **Date:** evidenced at initial setup `c975704` (schema + insert) and refined in `bca6e77`
- **Status:** ACCEPTED
- **Context:** Lead form needs storage; team has no dedicated API service; Supabase provides Postgres + REST + RLS.
- **Decision:** Browser calls `supabase.from("enquiries").insert(...)` with the publishable key; RLS insert-only policy `"Anyone can submit an enquiry"` (`status = 'new'`).
- **Reason:** Minimal infra; RLS constrains anonymous writes to exactly one safe operation. UNKNOWN for deeper rationale.
- **Consequences:** No read path in-app; database rules (CHECK constraints) are the authoritative validation; data review happens outside the app.
- **Alternatives:** Server-side API/function (scaffolding for auth middleware exists but unused).

## Decision: Forward leads to an n8n webhook in real time (dual write path)

- **Date:** 2026-09-04 (commit `5fe8ba5`)
- **Status:** ACCEPTED
- **Context:** Academy wants leads delivered to its workflow/CRM instantly, beyond the Supabase table.
- **Decision:** On submit, `POST` JSON to `https://automate.nirosha.org/webhook/joshisacademy` (fire-and-forget) *and* insert into Supabase.
- **Reason:** "real-time lead forwarding" per commit message. Failure non-fatal by design.
- **Consequences:** Webhook payload includes fields Supabase doesn't store (`email`, `submitted_at`, `page_url`); n8n failures are only console-warned; endpoint hard-coded client-side.
- **Alternatives:** Server-side forwarding with retry — not implemented.

## Decision: Enquiry UI always ends in "success" even when persistence fails

- **Date:** observed current code (`enquiry-dialog.tsx`, error path logs "... notice" then success)
- **Status:** ACCEPTED
- **Context:** Lead capture prioritizes not losing the user; form reliability over truthful error surfacing.
- **Decision:** `try { ... } catch { console.error(...); setState("success"); }` and Supabase insert errors only `console.warn`.
- **Reason:** Presumed conversion-optimization intent. UNKNOWN — Requires confirmation.
- **Consequences:** Potential false confidence for the parent; no retry queue; no visible failure path (README's requested "error state" effectively absent).
- **Alternatives:** Visible error + retry — not chosen.

## Decision: Honeypot (not CAPTCHA) for spam protection

- **Date:** initial implementation; retained through UI upgrades
- **Status:** ACCEPTED
- **Context:** Public form, no user auth, desire to keep friction low.
- **Decision:** Hidden `website` text field; bots that fill it get a fake success and nothing is sent. `submission_fingerprint` column exists but is unused.
- **Reason:** Zero-friction UX; CAPTCHA would conflict with premium minimal design. UNKNOWN for full rationale.
- **Consequences:** Limited protection against sophisticated spam; no rate limiting.

## Decision: Auto-open the enquiry dialog ~3 seconds after page load

- **Date:** 2026-09-04 (commits `bca6e77`, `f6bbb72`)
- **Status:** ACCEPTED
- **Context:** Conversion is "extremely important" (README); visitors may not click CTAs.
- **Decision:** `SiteShell` sets a 3 s timer → `setEnquireOpen(true)` on every full page load.
- **Reason:** Commit message "ensure auto enquiry popup triggers on website visit". UX trade-off accepted.
- **Consequences:** Possible annoyance on repeat visits (no dismissal memory); re-verified in `f6bbb72` after refactors.
- **Alternatives:** Once-per-session/scroll-triggered popup — not implemented.

## Decision: Remove the route-transition loading overlay

- **Date:** 2026-09-04 (commit `0290926`)
- **Status:** ACCEPTED — code removed from the shell; components left behind
- **Context:** Page changes between client routes were interrupted by a full-screen spinner overlay.
- **Decision:** Stop rendering `PageTransition` in `SiteShell`.
- **Reason:** Commit message "remove page transition loading overlay". Perceived snappier navigation. UNKNOWN for deeper rationale.
- **Consequences:** Dead code remains: `page-transition.tsx`, `dual-ring-spinner.tsx`, spinner CSS in `styles.css` (see TECHNICAL_DEBT/KNOWN_ISSUES).

## Decision: Configure SSR entry + bespoke error handling to counter h3 error swallowing

- **Date:** initial setup + later hardening (`server.ts`, `start.ts`, `lib/error-capture.ts`, `lib/error-page.ts`)
- **Status:** ACCEPTED
- **Context:** h3 (Nitro server) turns in-handler throws into `{"unhandled":true,"message":"HTTPError"}` 500s with no stack; plain try/catch never fires for those.
- **Decision:** Custom `server.ts` entry (lazy server-entry import + response normalization), console.error wrapper capturing original errors (5 s TTL), request error middleware, styled HTML error page, root error component with Lovable telemetry.
- **Reason:** Preserve error context across the h3 boundary; friendly UX on SSR failure. Detailed in code comments.
- **Consequences:** Layered complexity (see TECHNICAL_DEBT) but working production error visibility.

## Decision: Recharts must be SSR-bundled (`ssr.noExternal`)

- **Date:** 2026-09-04 (commit `8d32cb0`)
- **Status:** ACCEPTED
- **Context:** Recharts uses React hooks and breaks SSR ("Cannot read properties of null (reading 'useContext')").
- **Decision:** `ssr: { noExternal: ["recharts"] }` in `vite.config.ts`.
- **Reason:** Commit message documents the fix.
- **Consequences:** Recharts is currently only used by the *unused* `ui/chart.tsx`; the workaround can be removed with that file. Bundle weight consideration.

## Decision: Central, typed content module (`src/content/site.ts`) instead of scattered literals

- **Date:** initial setup, maintained since
- **Status:** ACCEPTED
- **Context:** README demands CMS-ready content, no duplication, single source for courses/results/testimonials/FAQs/contact.
- **Decision:** Export typed data structures from `site.ts`; routes import from it. Announcement + site contact + all editorial content centralized.
- **Reason:** Aligns with README "CMS-ready" and "do not duplicate content". UNKNOWN for explicit rationale.
- **Consequences:** Content edits = code edits + redeploy. Some duplication still exists in practice (faculty copy on homepage, gallery items, hours in `contact.tsx`) — see TECHNICAL_DEBT.

## Decision: Enquiry email field is webhook-only (no DB column)

- **Date:** observed current code
- **Status:** ACCEPTED (possibly unintentional)
- **Context:** Dialog collects an optional email; UX copy says it is for test schedules/syllabus brochures.
- **Decision:** `email` appears only in the n8n payload; the Supabase insert omits it (no column in schema/types).
- **Reason:** UNKNOWN — Requires confirmation (may be an oversight rather than a decision).
- **Consequences:** Email is not queryable in Supabase; relies on n8n storage.

# Technical Debt — Joshis Academy Website

Recorded for awareness and future repayment planning. **None of this is fixed here.** Cross-refs: `KNOWN_ISSUES.md` (user-visible/behavioural problems), `ROADMAP.md` (remediation ordering).

---

## 1. No automated tests
- **Type:** missing tests
- **Evidence:** no test framework/files/scripts; `package.json` has no `test` script; tsconfig types exclude test frameworks.
- **Impact:** Enquiry pipeline (Supabase + n8n + SSR) ships unguarded.
- **Repayment:** see `TESTING_STRATEGY.md`.

## 2. Large unused dependency & component surface
- **Type:** dead weight / inconsistent architecture
- **Evidence:** application imports only `ui/button` + `@radix-ui/react-dialog` (+ lucide, clsx/tailwind-merge via `cn`, Radix in unused ui files). Installed-but-unused-in-app-code packages include (verify each before removal — a few may be pulled in transitively or reserved for near-term use):
  - `recharts` (used only by unused `ui/chart.tsx`; also forces the `ssr.noExternal` workaround)
  - `react-hook-form`, `@hookform/resolvers`, `zod` (only in unused `ui/form.tsx` / none)
  - `date-fns` (unused `ui/calendar.tsx`)
  - `embla-carousel-react` (unused `ui/carousel.tsx`)
  - `sonner` (unused `ui/sonner.tsx`)
  - `vaul` (unused `ui/drawer.tsx`)
  - `cmdk` (unused `ui/command.tsx`)
  - `input-otp` (unused `ui/input-otp.tsx`)
  - `react-day-picker` (unused `ui/calendar.tsx`)
  - `react-resizable-panels` (unused `ui/resizable.tsx`)
  - ~40 `src/components/ui/*` primitive files with no importers
- **Impact:** dependency audit surface, bundle cost if ever tree-shaken wrongly, agent confusion, config complexity.
- **Repayment:** verified deletion campaign; keep `button`, `utils`, and whatever future features need.

## 3. Dead code after page-transition removal
- **Type:** dead code
- **Evidence:** `page-transition.tsx`, `dual-ring-spinner.tsx` (0 importers), spinner/overlay CSS + keyframes remain in `styles.css`; commit `0290926` removed usage only.
- **Repayment:** delete files + CSS.

## 4. Duplicated content / multiple sources of truth
- **Type:** duplicated code/data
- **Evidence:**
  - Faculty pillars duplicated: homepage inline 4-card block vs `site.ts` `facultyStandards.pillars`.
  - Gallery metadata duplicated: `gallery.tsx` local 6-item array vs `site.ts` `galleryItems`.
  - Contact hours only in `contact.tsx` (not centralized); location text repeated across pages; site facts partially in `site.ts` but with inline repeats.
  - README itself states "Do not duplicate content throughout the application."
- **Impact:** copy drift; agents editing one source can desync pages.
- **Repayment:** route all through `site.ts` content structures.

## 5. Mixed package-manager artifacts
- **Type:** configuration inconsistency
- **Evidence:** `package-lock.json` (npm) **and** `bun.lock` + `bunfig.toml` (bun) both committed; README instructs `npm i`; lockfiles can drift out of sync.
- **Impact:** CI/devs may install with different tools and get different trees.
- **Repayment:** pick one (README says npm) and delete the other after confirming with the team.

## 6. Hard-coded operational values
- **Type:** hardcoded configuration
- **Evidence:**
  - n8n URL `https://automate.nirosha.org/webhook/joshisacademy` + fallback `page_url` `https://joshisacademy.com` inside `enquiry-dialog.tsx` (client bundle).
  - Fee copy `₹1500/-` and AY text inside `announcement` in `site.ts` (content, but business-critical).
  - Enquiry-hours copy in `contact.tsx`.
- **Impact:** changes require code deploy; cannot vary by environment.
- **Repayment:** env vars (Lovable Cloud) for URLs; content module for hours.

## 7. Layered SSR error-handling workarounds
- **Type:** temporary workaround (becoming permanent)
- **Evidence:** `server.ts` h3-swallow normalization + `error-capture.ts` console.error wrapper with 5 s TTL + `start.ts` error middleware + `error-page.ts` + root error component — several layers solve one framework quirk; TTL-based capture is inherently racy.
- **Impact:** maintenance complexity; subtle ordering bugs possible.
- **Repayment:** revisit when TanStack Start/Nitro error semantics change; document in one place.

## 8. Enquiry pipeline reliability semantics
- **Type:** weak error handling / silent degradation
- **Evidence:** success shown on any failure; webhook fire-and-forget; `submission_fingerprint` never populated; no dedupe/rate limit.
- **Impact:** possible silent lead loss or duplicates; no observability.
- **Repayment:** see KNOWN_ISSUES items (retry/queue, telemetry, fingerprint population).

## 9. No content admin (CMS gap)
- **Type:** architectural limitation (intentional for scope)
- **Evidence:** all content in TS; README asks for "CMS-ready" ease-of-update only.
- **Impact:** marketing content changes require engineering + deploy.
- **Repayment:** only if the academy requests a CMS; `site.ts` design makes extraction feasible.

## 10. Supabase auth/server scaffolding unused but present
- **Type:** inconsistent architecture
- **Evidence:** `auth-attacher.ts` registered globally in `start.ts`; `client.server.ts`/`auth-middleware.ts`/`cron-auth.ts` unreferenced; new-format key handling logic duplicated across four files (`client.ts`, `client.server.ts`, `auth-middleware.ts`) — copy-paste rather than shared helper.
- **Impact:** duplicated key-handling logic to maintain; foot-gun for client import of server client.
- **Repayment:** extract shared `createSupabaseFetch`, remove unused modules or wire them into real features.

## 11. Missing engineering hygiene
- **Type:** process debt
- **Evidence:** no CI, no branch strategy in practice (all commits direct to `main`), no PR history, no lint/test gate in repo tooling.
- **Impact:** regressions and merge conflicts as the team grows (this repo is about to have multiple AI agents).
- **Repayment:** see ROADMAP/GIT_WORKFLOW recommendations.

## 12. SEO/data nitpicks
- **Type:** small inconsistencies
- **Evidence:** sitemap omits `/gallery`; Article JSON-LD `datePublished` hard-coded `2026-08-01`; empty tracked `found_images.txt`; client vs DB mobile-length regexes differ ({10,15} vs {10,20}).
- **Impact:** low; listed for completeness — full write-ups in `KNOWN_ISSUES.md`.

## 13. Photography scarcity & asset reuse
- **Type:** content limitation
- **Evidence:** 3 JPGs reused across hero/approach/gallery/journal/CTA imagery; gallery tiles reuse the same 3 photos 6 ways; no WebP/AVIF pipeline, no srcset variants.
- **Impact:** design variety and image performance (Lighthouse image audits) constrained.
- **Repayment:** authentic photo shoots + image optimization (owner-supplied content — blocked on the academy).

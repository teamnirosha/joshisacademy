# Roadmap — Joshis Academy Website

Roadmap entries are derived **only** from evidence in the repository: README brief gaps, code observations, git history, and technical debt. Sections labelled *Recommendation* are not existing requirements — they are suggested engineering work.

## Completed

- All public marketing pages and routing (home, courses ×5, journal ×7, gallery, results, faculty, about, contact, faq, legal ×2).
- Enquiry funnel: multi-step dialog, honeypot spam protection, Supabase persistence, n8n real-time lead forwarding, 3-second auto popup, mobile conversion bar.
- Announcement bar (configurable/expiring), brand loader, custom favicons.
- SEO foundations: per-page meta/canonical/OG, robots.txt, sitemap.xml, JSON-LD (EducationalOrganization, Course, FAQPage, Article).
- SSR hardening: custom server entry, h3-swallow error normalization, CSRF for server functions, friendly error pages.
- Supabase `enquiries` schema with RLS + constraints (commit history shows steady polish through `45a7e57`).

## In Progress

- **None registered.** No open work in the repository or `ACTIVE_WORK.md`.

## Next Recommended Work

All items below are labelled **RECOMMENDATION — Not an existing requirement** unless noted. Order roughly by value/risk.

1. **RECOMMENDATION — Automated tests.** Zero tests exist while a live lead-capture pipeline (Supabase + n8n + SSR) runs in production. Add unit tests for: enquiry payload building/validation, `site.ts` data integrity (course aliases/related-article slugs exist, unique IDs/slugs), sitemap path generation, and dialog step validation. See `TESTING_STRATEGY.md`.
2. **RECOMMENDATION — Dead-code & unused-surface cleanup.** Remove or quarantine: `page-transition.tsx`, `dual-ring-spinner.tsx`, unused `ui/*` components (~40 files), and unused dependencies (verify each before removal — see `TECHNICAL_DEBT.md`). Risk: low; benefit: smaller bundle, less confusion for agents.
3. **RECOMMENDATION — Data-integrity fixes (small, evidence-backed):**
   - Add `/gallery` to `sitemap.xml` (page exists + is linked in nav; currently omitted).
   - Derive Article JSON-LD `datePublished` from each article's actual date field (currently hard-coded `2026-08-01` for all).
   - De-duplicate gallery items between `gallery.tsx` and `site.ts` `galleryItems`; de-duplicate faculty copy between `index.tsx` and `facultyStandards`.
4. **RECOMMENDATION — Enquiry reliability hardening.** n8n POST is fire-and-forget with no retry; Supabase insert failure still shows success. Options: queue-and-retry the webhook, record `submission_fingerprint` (column exists but is never populated), surface soft-error telemetry while keeping UX graceful.
5. **RECOMMENDATION — Lead management.** The `status` column (`new → contacted → closed`) and `updated_at` trigger exist but nothing consumes them. A minimal authenticated admin view (or n8n/Supabase workflow outside the app) would close the loop. Requires an auth decision (see 6) and a deliberate RLS/read design.
6. **RECOMMENDATION — Decide on auth scaffolding.** Either wire the unused Supabase auth middleware into a real admin flow, or remove it to reduce confusion. Do not leave it half-integrated (it is registered globally in `start.ts`).
7. **RECOMMENDATION — Env/config hygiene.** Move hard-coded `automate.nirosha.org` webhook URL and `joshisacademy.com` fallback into env vars (Lovable Cloud supports env injection); centralize contact hours (currently only in `contact.tsx`).
8. **RECOMMENDATION — CI/CD + preview checks.** Add a minimal CI (typecheck + lint + build) so the Lovable-synced `main` stays green. Confirm whether Lovable offers branch previews (repo currently has only `main`).

## Future Work

- **RECOMMENDATION — Analytics & conversion measurement.** No analytics snippet exists. A privacy-light measurement plan (respecting India + marketing consent norms) would let the academy judge enquiry conversion. Confirm with the site owner first — the README emphasizes trust and minimalism.
- **RECOMMENDATION — Real photography / content pipeline.** The site reuses 3 photographs; the brief asks for authentic classroom photography, result gallery, and faculty portraits once **verified** materials exist. Content-blocked, not code-blocked.
- **RECOMMENDATION — Performance budget.** Target Lighthouse 90+ (brief N3): audit Core Web Vitals; consider AVIF/WebP transforms and font subsetting; remove unused `ui/*` bundle weight; recharts noExternal workaround can be dropped once `chart.tsx` is removed.
- **RECOMMENDATION — CMS/headless content.** `site.ts` centralization is a good foundation; a lightweight content source (e.g., Supabase-backed content tables or a Markdown folder) would let non-developers update announcements/pricing/articles. Do not build until the academy confirms a need.
- **RECOMMENDATION — Local business follow-ups (external to code):** Google Business Profile consistency, structured-data validation (Rich Results test), and crawl/coverage checks — none verifiable from this repository.

## Evidence Notes for Future Roadmap Writers

- Any new business feature (new courses, ICSE-only pages, pricing pages, results dashboard) must come from the academy, not be inferred here.
- The README brief (1250 lines of design requirements) is the best source for *design-intent* backlog items still unimplemented: result gallery, individual faculty profiles, per-page FAQ expansion, image pipeline.
- `found_images.txt` is empty and tracked — an artifact, possibly intended as a photography inventory; confirm before deleting.

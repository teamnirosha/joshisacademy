# Integrations — Joshis Academy Website

All external integrations discovered in the code. **No secrets documented** — only usage facts and env-var names.

---

## Supabase (Postgres + Auth + REST)

- **Purpose:** Persistence of enquiry leads (`public.enquiries`) and, via its templates, auth scaffolding.
- **Configuration:** Client env `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` (browser); server fallbacks `SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY`; unused server admin `SUPABASE_SERVICE_ROLE_KEY`. Project id in `supabase/config.toml`. Schema in `supabase/migrations/`.
- **Used By:** `src/components/enquiry-dialog.tsx` (insert), `src/integrations/supabase/*` (clients/middleware).
- **Dependencies:** `@supabase/supabase-js` ^2.114.0.
- **Failure behavior:** Insert error → `console.warn`; UI still shows success (graceful degradation). Missing env vars → thrown error with descriptive message at client construction.
- **Notes:** New-format opaque keys (`sb_publishable_*`/`sb_secret_*`) handled by custom fetch wrapper; RLS restricts anon to insert-only. No reads in-app.

## n8n Webhook (lead forwarding)

- **Purpose:** Real-time forwarding of enquiry leads to the academy's automation pipeline (commit `5fe8ba5`: "integrate n8n webhook for real-time lead forwarding").
- **Configuration:** Hard-coded URL in `enquiry-dialog.tsx`: `https://automate.nirosha.org/webhook/joshisacademy`. No app-side auth header.
- **Used By:** `enquiry-dialog.tsx` — fire-and-forget `fetch` (POST JSON: `student_class`, `board`, `parent_name`, `mobile_number`, `email`, `preferred_contact`, `submitted_at`, `page_url`).
- **Dependencies:** none (native fetch).
- **Failure behavior:** `.catch((err) => console.warn("n8n webhook notice:", err))` — non-blocking, no retry/queue.
- **Notes:** Webhook receives `email`, `submitted_at`, and `page_url` which are **not** stored in Supabase. n8n-side workflow/storage/auth is outside this repo — UNKNOWN.

## Google Maps (embed + directions)

- **Purpose:** Local SEO + "Come learn with us" location blocks (homepage, contact page, footer).
- **Configuration:** `site.mapsEmbed` (iframe `src`, `loading="lazy"`, `referrerPolicy="no-referrer-when-downgrade"`) and `site.mapsUrl` (directions link) in `src/content/site.ts`.
- **Used By:** `src/routes/contact.tsx`, `src/components/site-shell.tsx` (footer), homepage location section.
- **Dependencies:** none (plain iframes/links).
- **Failure behavior:** iframe fails silently (broken map area) — no fallback message; links unaffected.

## WhatsApp (contact channel)

- **Purpose:** "WhatsApp Us" CTAs and mobile action bar item; contact page.
- **Configuration:** `site.whatsapp` (`"07030554317"`) in `site.ts`; link built as `https://wa.me/${digits}` (non-digits stripped). If `site.whatsapp` is empty, CTAs degrade to opening the enquiry dialog instead.
- **Used By:** `site-shell.tsx` (footer + mobile bar), `contact.tsx`, homepage final CTA.
- **Failure behavior:** graceful — empty value routes user to enquiry dialog.
- **Notes:** The number is public marketing info published across the site.

## Phone (tel:)

- **Purpose:** "Call" CTAs (header-area/footer/mobile bar/contact page/success screen).
- **Configuration:** `site.phone` (`"07030554317"`) in `site.ts`; `href="tel:..."`. Empty value → buttons fall back to enquiry dialog.
- **Used By:** same surfaces as WhatsApp.
- **Failure behavior:** graceful fallback as above.

## Google Fonts

- **Purpose:** Typography — Manrope (body/UI) + DM Serif Display (display).
- **Configuration:** `<link rel="preconnect">` + stylesheet URL in `src/routes/__root.tsx` head; font-family tokens in `src/styles.css` (`--font-sans`, `--font-display`).
- **Used By:** everything (global).
- **Failure behavior:** falls back to `system-ui` / `Georgia, serif` stacks declared in CSS.
- **Notes:** External network dependency for rendering brand typography.

## schema.org JSON-LD (search engines)

- **Purpose:** Structured data for rich results: `EducationalOrganization` (root + homepage), `Course` (course pages), `FAQPage` (`/faq`), `Article` (journal articles).
- **Configuration:** inline `application/ld+json` scripts in route `head()`/meta.
- **Used By:** crawlers; no runtime behaviour.
- **Failure/notes:** Article `datePublished` hard-coded `2026-08-01` for all articles (KNOWN_ISSUES). Root JSON-LD uses `https://joshisacademy.com` absolute URLs.

## Lovable Platform (build/env/telemetry/preview)

- **Purpose:** Project origin/host — provides the Vite config (`@lovable.dev/vite-tanstack-config`), env injection ("Lovable Cloud"), error telemetry hooks in previews, and the preview auth-session broker.
- **Configuration:** devDependency + `vite.config.ts` wrapper; `previewAuthStorage.ts` zones list; `lib/lovable-error-reporting.ts` window hooks; `AGENTS.md` history-rewrite warning.
- **Used By:** build toolchain; `__root.tsx` error reporting; Supabase client storage adapter (Lovable preview zones only).
- **Failure behavior:** telemetry no-ops outside Lovable previews (`window.__lovableEvents` absent); config is load-bearing for builds (do not bypass).
- **Notes:** `.lovable/` directory and branding were removed from the repo (commit `45a7e57`) while integration remains in tooling.

## Search engines (robots.txt / sitemap)

- **Purpose:** Crawl directives + URL discovery.
- **Configuration:** `public/robots.txt` (allow all major bots + sitemap URL), server-rendered `/sitemap.xml`.
- **Used By:** crawlers.
- **Notes:** sitemap omits `/gallery` (KNOWN_ISSUES). robots.txt allows all paths.

## Not present (verified absent — do not assume)

- Email service (no SMTP/email API; no mailto published)
- Payment processors (no fees collected online; fee text is informational)
- Analytics/measurement scripts (none found)
- Maps API keys (plain embed only)
- Social media APIs
- Auth providers (OAuth etc.)
- Image CDN/optimization services (images bundled in `src/assets/` as JPG)
- Sentry/observability SaaS (server-side error capture is bespoke `lib/` code; Lovable telemetry only in previews)

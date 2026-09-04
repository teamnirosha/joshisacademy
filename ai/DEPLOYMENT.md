# Deployment — Joshis Academy Website

> The user states the site is already deployed. This file records what the **repository proves** about deployment, and flags the rest as UNKNOWN. Nothing here is a configuration change.

## Live Production

- **Public URL:** `https://joshisacademy.com` — confirmed by hard-coded canonicals, OG tags, JSON-LD `url`/`logo`, sitemap base, robots.txt sitemap line, and the enquiry `page_url` fallback.
- The site is a **server-rendered web app** (SSR via TanStack Start), not a static-only site.

## Frontend Hosting

**UNKNOWN — Requires confirmation of the exact platform/dashboard**, but strong in-repo evidence points to **Lovable Cloud** with a **Cloudflare** SSR target:

- `vite.config.ts` delegates to `@lovable.dev/vite-tanstack-config`; its comment states the config adds "nitro (build-only using cloudflare as a default target)".
- Client/Server Supabase error messages instruct connecting services **"in Lovable Cloud"** — i.e., env vars are injected by Lovable Cloud at deploy time.
- `.gitignore` contains Wrangler/Cloudflare entries (`.wrangler/`, `.dev.vars`) — Cloudflare tooling artifacts expected.
- `AGENTS.md` says the project is connected to Lovable and that commits pushed to the connected branch sync back into Lovable (the deploy/editor side).
- `README.md` instructs `npm i && npm run dev` for local dev; no other deploy instructions exist in-repo.

## Backend Hosting

- There is **no self-hosted application backend** (no Node/Express service, no containers). Backend-ish responsibilities:
  - SSR rendering happens wherever the site runs (same host as above).
  - Persistence: **Supabase** (hosted Postgres). Project reference in `supabase/config.toml`: `project_id = "hfuxydqczbxjpjwxmufr"` (this is the project id, not a secret; the actual `SUPABASE_URL` value is env-provided).
  - Lead forwarding: **n8n** at `https://automate.nirosha.org` (external host).

## Database Hosting

- **Supabase** managed Postgres. Schema migration committed under `supabase/migrations/`. The repo's `supabase/` contains only `config.toml` (project_id) + one migration — no CLI-generated stack config, auth config, or seed data.

## Production Environment Variables

Names only (values are secrets / not in the repo; see `SECURITY.md`):

| Variable | Consumed by |
|----------|-------------|
| `SUPABASE_URL` (or client `VITE_SUPABASE_URL`) | `src/integrations/supabase/client.ts`, `client.server.ts`, `auth-middleware.ts` |
| `SUPABASE_PUBLISHABLE_KEY` (or client `VITE_SUPABASE_PUBLISHABLE_KEY`) | same |
| `SUPABASE_SERVICE_ROLE_KEY` | `client.server.ts` (unused by app code) |
| `LOVABLE_CRON_SECRET`, `LOVABLE_CRON_SECRET_PREVIOUS` | `cron-auth.ts` (unused by app code) |

Client reads `import.meta.env["VITE_*"]` with fallback to `process.env["*"]` for SSR. If any required var is missing, the Supabase client throws at first use with a descriptive error (browser console / SSR error page).

## Build Process

```bash
npm i            # README uses npm (bun artifacts also present)
npm run build    # vite build — production build incl. SSR server entry + route tree + CSS
npm run build:dev
npm run preview  # vite preview of built output
```

- The build uses `@lovable.dev/vite-tanstack-config` — do **not** add TanStack/Vite/Tailwind plugins manually to `vite.config.ts` (duplicate-plugin breakage; comment in file).
- Only custom Vite knob: `ssr.noExternal: ["recharts"]` (SSR `useContext` fix).
- `rolldown` pinned via `package.json` `overrides` (`rolldown: 1.2.1`); Windows-native bindings in optionalDependencies.
- Public assets (`public/`) and generated route tree (`src/routeTree.gen.ts`, regenerated on dev/build by the router plugin) participate in the build.

## Deployment Process

- **In-repo CI/CD: none** (no `.github/`, no pipeline files, no deploy scripts).
- De-facto process inferred: developer pushes to `main` → Lovable syncs/builds/deploys to the connected environment → site updates at `joshisacademy.com`. Exact trigger/rollout (auto vs manual, preview URLs) is **UNKNOWN — Requires confirmation**.
- History supports this: 10 rapid commits by a deployer-labelled account on 2026-09-04 with visible site-behaviour changes (popup timing, webhook, favicons) and no other branch.

## Domains / URLs (safe to document)

- `https://joshisacademy.com` — production.
- `https://maps.google.com/maps?ftid=0xda91b9aaa8e08e7:0xa2245a5b43016f88` — Google Maps directions target (from `site.mapsUrl`; the ftid is a public maps place identifier).
- `https://maps.google.com/maps?q=joshi%27s+academy+kharadi+pune&output=embed` — map embed (from `site.mapsEmbed`).
- `https://wa.me/917030554317` (digits derived from `site.whatsapp`) — WhatsApp link.
- `tel:+917030554317` (`site.phone` `07030554317`) — call link.
- `https://automate.nirosha.org/webhook/joshisacademy` — n8n lead webhook.
- Repository: `https://github.com/teamnirosha/joshisacademy`.

> Note: phone/WhatsApp numbers are public marketing contact details already published across the site (header CTA, footer, contact page, robots-independent pages); they are documented here only as *what the site exposes*, not as secrets.

## CI/CD Status

- **NOT STARTED in-repo.** Recommended: add a pipeline running `tsc --noEmit` + `npm run lint` + `npm run build` on every push/PR (see `ROADMAP.md`). No changes to Lovable-managed deployment without owner confirmation.

## UNKNOWN — Requires Confirmation

- Exact hosting provider/dashboard (Lovable Cloud vs Cloudflare Pages/Workers direct) and where to see deploy logs.
- Deploy trigger (push-to-main auto-deploy vs manual), rollback procedure, preview branches.
- Whether env vars include values beyond the names above (e.g., analytics keys, n8n auth) injected at deploy time.
- Supabase project region, plan, and dashboard access details.
- Custom-domain DNS/CDN configuration details.

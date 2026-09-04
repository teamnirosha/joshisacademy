# Security — Joshis Academy Website

> ⚠️ **No secrets appear in this document.** Actual values (keys, tokens, credentials) are replaced with `[REDACTED — SECRET NOT DOCUMENTED]`. This file intentionally documents *practices and environment variable names only*.

## Authentication

- **None user-facing.** No login system, so no credential storage, password hashing, or session fixation concerns in app code.
- Supabase auth scaffolding exists but is unused (see `AUTHENTICATION.md`). The registered `attachSupabaseAuth` function middleware would attach a Bearer token to serverFn RPCs **only if a session exists** — none can exist without a login flow.

## Authorization

- Enquiry inserts are limited by **Row-Level Security**: policy `"Anyone can submit an enquiry"` = `INSERT` for `anon`/`authenticated` **with `status = 'new'`**.
- `anon`/`authenticated` have **no SELECT/UPDATE/DELETE** on `enquiries` — data cannot be read through the public API.
- `service_role` has full access and is only available in the unused server client — it must never be exposed client-side.

## Token Handling

- Supabase publishable key lives in env (`VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY`) and is bundled client-side by design — it is a *publishable* (anon) key, safe for browsers.
- Service-role key (`SUPABASE_SERVICE_ROLE_KEY`) is server-only, read from `process.env`, and only used by the unused `client.server.ts`. **Never import `client.server` from client code** (its own comment warns about this).
- New-format Supabase keys (`sb_publishable_*`/`sb_secret_*`) are opaque strings, not JWTs — the custom fetch wrapper strips an invalid `Authorization: Bearer <opaque>` header and sends `apikey` instead. Do not "fix" this behaviour.
- Cron secret (`LOVABLE_CRON_SECRET`, plus `_PREVIOUS` rotation support) is compared with SHA-256 + `timingSafeEqual` in `cron-auth.ts` — unused but already rotation-aware.
- Lovable preview auth broker (`previewAuthStorage.ts`) only posts session data to validated Lovable editor origins (`postMessage` with explicit `targetOrigin`) — session tokens never go to arbitrary embedders.

## Password Handling

**N/A** — passwords are never collected, transmitted, hashed, or stored. (Enquiry data is parent name + mobile + optional email — treat that as personal data, see below.)

## Environment Variables & Secrets

Declared env vars (names only — see `DEPLOYMENT.md` for where they come from):

| Variable | Scope | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` / `SUPABASE_URL` | client build / server | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY` | client build / server | anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | admin key (unused app code) |
| `LOVABLE_CRON_SECRET` / `LOVABLE_CRON_SECRET_PREVIOUS` | server only | cron guard (unused app code) |

Practices:
- `.env` is gitignored; **no `.env` file is committed** (verified: none exists in the repo).
- `.dev.vars`, `.wrangler/`, `*.local` are gitignored (Wrangler/Cloudflare artifacts).
- Error messages mention variable *names* only, never values.
- In this documentation and in code review: **never paste real values**. Use `[REDACTED — SECRET NOT DOCUMENTED]`.

## CORS

- No CORS configuration exists in the repo (nothing to configure app-side: the Supabase REST endpoint handles its own CORS; the SSR app serves same-origin pages).
- Lovable preview storage restricts `postMessage` targets to editor origins and only trusts project IDs parsed from non-user-controlled host positions (anti-smuggling guard in `previewAuthStorage.ts`).

## Validation

- **Client:** per-step validation in the enquiry dialog (required class/board/contact-mode; parent name ≥ 2 chars; mobile `/^[0-9+ ()-]{10,15}$/`; email optional + basic format).
- **Server/DB (authoritative):** CHECK constraints — `student_class IN ('IX','X')`, `board IN ('CBSE','ICSE')`, `preferred_contact IN ('Call','WhatsApp')`, parent name length 2–100, mobile `/^[0-9+ ()-]{10,20}$/`, status workflow values.
- **Spam:** hidden honeypot field (`website`, tabIndex -1, aria-hidden) — bots that fill it are silently dropped (submit "succeeds" without sending).
- **Gaps:** no rate limiting, no CAPTCHA, no per-IP throttling, no fingerprinting (the `submission_fingerprint` column is never populated). Public form → spam/abuse risk is real; currently mitigated only by the honeypot + RLS shape checks.

## API Security

- No owned API → no API-key handling beyond Supabase/n8n above.
- TanStack Start server functions (none exist yet) are already protected by CSRF middleware (`start.ts`) — keep that wired when adding server functions.
- The n8n webhook receives enquiry data over HTTPS without app-side auth headers; n8n-side protection is **UNKNOWN — Requires confirmation**.

## Sensitive Data

- The app collects: parent full name, mobile number, optional email, plus student class/board — **personal data** under Indian law (DPDP Act 2023 context; legal review out of scope here).
- Privacy page promises: data used only to respond about programmes; not sold; restricted access; correction/deletion via the academy's verified contact channel.
- `email` + `page_url` + `submitted_at` are transmitted to the n8n webhook (not stored in Supabase). Data-retention/flow to n8n is **UNKNOWN — Requires confirmation**.
- The enquiry dialog sends data over HTTPS to Supabase and automate.nirosha.org. Page URLs may contain query strings (page_url captures `window.location.href`).

## SSR / Client Hardening Present

- CSRF protection for server functions (`createCsrfMiddleware`, `handlerType === "serverFn"`).
- Server entry + middleware turn unhandled SSR errors into safe HTML error pages (no stack traces leaked to users; stacks logged server-side by `error-capture.ts`).
- Lovable editor telemetry (`reportLovableError`) fires only when the editor's hooks exist (preview environments).

## Known Security-Relevant Observations

1. Enquiry "success" is shown even when Supabase insert fails — a human might believe a lead was captured when it only reached n8n or nowhere. (Not a vulnerability; a UX/accuracy note.)
2. Hard-coded n8n endpoint + fallback domain in the client bundle; if the n8n endpoint is ever changed/compromised, a redeploy is required.
3. The unused auth middleware and service-role client add future foot-gun surface: an AI agent could accidentally use `supabaseAdmin` in a route and ship a secret-bearing bundle. Rules in `AI_RULES.md` address this; code comments already warn.
4. No CSP/security headers are configured (no config in repo; platform may inject defaults — UNKNOWN).
5. Public directory assets are served as-is (fine — favicons/robots/logo only).

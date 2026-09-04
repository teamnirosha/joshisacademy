# API Contracts — Joshis Academy Website

The application exposes **no custom REST/HTTP API** of its own. The only HTTP endpoint the app *serves* besides pages is `/sitemap.xml`. Two external interfaces are *consumed*: Supabase PostgREST (insert) and an n8n webhook. All are documented below from the actual call sites.

---

## A. Supabase — `public.enquiries` INSERT (browser → Supabase)

- **Method:** POST (PostgREST semantics via `supabase.from("enquiries").insert(...)`)
- **Endpoint:** `{SUPABASE_URL}/rest/v1/enquiries` (URL from env; not literal in code)
- **Purpose:** Persist a counselling enquiry submitted through the dialog
- **Authentication:** `apikey` header = publishable key (`VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY`). No user token. Client wrapper (`src/integrations/supabase/client.ts`) sets `apikey` and (for legacy JWT keys) `Authorization: Bearer`; for new-format `sb_publishable_`/`sb_secret_` keys it drops the Authorization header (opaque keys are not bearer JWTs).
- **Authorization:** RLS insert policy `"Anyone can submit an enquiry"` — `WITH CHECK (status = 'new')` for `anon` + `authenticated`. Reads/updates/deletes are **not** granted to anon/authenticated.
- **Request body (actual payload in `enquiry-dialog.tsx`):**

| Field | Source | Notes |
|-------|--------|-------|
| `student_class` | step 1 | `"IX" \| "X"` (DB CHECK) |
| `board` | step 2 | `"CBSE" \| "ICSE"` (DB CHECK) |
| `parent_name` | step 3 | trimmed; 2–100 chars (DB CHECK) |
| `mobile_number` | step 4 | trimmed; regex `^[0-9+ ()-]{10,20}$` (DB); client validates 10–15 |
| `preferred_contact` | step 6 | `"Call" \| "WhatsApp"` (DB CHECK) |

  `email`, `submitted_at`, `page_url` are collected in the dialog payload but are **NOT included in the insert** (no such columns).
- **Response:** On success, inserted row data; on failure `{ error }`. Caller only `console.warn`s and proceeds to the success state regardless.
- **Error responses:** Supabase/PostgREST standard (RLS violation, constraint violation, network). Not surfaced to the user by design.
- **Frontend consumers:** `src/components/enquiry-dialog.tsx`
- **Backend implementation:** Supabase (project via `supabase/config.toml`); schema in `supabase/migrations/20260904045430_*.sql`
- **Related entities:** `public.enquiries`

## B. n8n lead-forwarding webhook (browser → external)

- **Method:** POST
- **Endpoint:** `https://automate.nirosha.org/webhook/joshisacademy` (hard-coded in `enquiry-dialog.tsx`)
- **Purpose:** Real-time forwarding of enquiry leads to the academy's automation (n8n). Added in commit `5fe8ba5`.
- **Authentication:** None visible in the request (plain JSON POST). n8n-side authentication: **UNKNOWN — Requires confirmation**.
- **Authorization:** n/a
- **Request headers:** `Content-Type: application/json`
- **Request body (JSON):**

```json
{
  "student_class": "X",
  "board": "CBSE",
  "parent_name": "Ravi Sharma",
  "mobile_number": "98230 12345",
  "email": "parent@example.com",
  "preferred_contact": "WhatsApp",
  "submitted_at": "<ISO-8601 timestamp>",
  "page_url": "https://joshisacademy.com/..."
}
```

- **Response:** Ignored. `fetch(...).catch((err) => console.warn("n8n webhook notice:", err))` — fire-and-forget, no retry.
- **Error responses:** Not handled beyond the console warning; never blocks the enquiry UX.
- **Frontend consumers:** `src/components/enquiry-dialog.tsx`
- **Backend implementation:** External n8n instance (`automate.nirosha.org`) — internals NOT in this repo
- **Related entities:** none in this app (mirrors `enquiries` fields + `email`/`submitted_at`/`page_url`)

## C. Server-rendered route — `/sitemap.xml` (server → client/bots)

- **Method:** GET
- **Endpoint:** `https://joshisacademy.com/sitemap.xml`
- **Purpose:** XML sitemap for search engines
- **Authentication:** None
- **Request parameters:** none
- **Response:** `Content-Type: application/xml`; `<urlset>` containing: `""` (home), `courses`, `results`, `faculty`, `about`, `journal`, `contact`, `faq`, `privacy`, `terms`, `courses/<slug>` × 4, `journal/<slug>` × 6.
- **Implementation:** `src/routes/sitemap[.]xml.tsx` `server.handlers.GET`, base URL hard-coded `https://joshisacademy.com`
- **Notes:** `/gallery` is not included (see `KNOWN_ISSUES.md`).

## D. Server functions / RPC layer

- **Status:** None exist. TanStack Start server functions are protected by CSRF middleware (`start.ts`) and an auth-attach function middleware (`auth-attacher.ts`) is registered, but no `createServerFn` call exists in application code.

---

## API Conventions

- No application-owned API naming conventions exist.
- Supabase client usage follows the supabase-js convention (`supabase.from("enquiries").insert(...)`).
- External webhook uses a flat snake_case JSON body mirroring DB column names (plus extra webhook-only fields).

## Authentication Headers

- Supabase calls: `apikey: <publishable key>` (client adds it). Legacy JWT keys additionally send `Authorization: Bearer <key>`; new opaque `sb_publishable_*` keys omit Authorization.
- n8n webhook: none sent by this app.
- No other headers/conventions.

## Common Error Format

- **No app-level JSON error format exists.** Errors in app code surface as:
  - `console.warn`/`console.error` messages ("... notice: <message>") for the enquiry pipeline,
  - custom HTML error pages for SSR failures (`src/lib/error-page.ts`), and
  - React error-boundary UI with `reportLovableError` telemetry (`src/lib/lovable-error-reporting.ts`).

## Deprecated / Unused Endpoint Machinery

- `authenticateCronRequest` (`src/integrations/supabase/cron-auth.ts`) — would guard hypothetical cron endpoints with `LOVABLE_CRON_SECRET`; unused.
- `requireSupabaseAuth` middleware (`auth-middleware.ts`) — Bearer JWT verification for hypothetical server functions; unused.

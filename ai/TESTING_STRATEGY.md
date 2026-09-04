# Testing Strategy — Joshis Academy Website

## Current Reality (evidence-based)

- **Testing framework:** none installed (no Vitest/Jest/Playwright/Cypress in `package.json`).
- **Unit tests:** none — no `*.test.ts(x)` / `*.spec.ts(x)` files exist.
- **Integration tests:** none.
- **Frontend tests:** none.
- **Backend/SSR tests:** none.
- **API tests:** none (no owned API to test; Supabase/n8n are external).
- **Build verification:** `npm run build` (production build) exists and is the only full compile check; `npx tsc --noEmit` typechecks.
- **Linting:** `npm run lint` (ESLint flat config + prettier integration).
- **Test commands:** there is **no `test` script** in `package.json`.
- **Known missing coverage:** everything — the entire application is untested while handling live enquiry data.

`tsconfig.json` has no test types (`types: ["vite/client"]` only), and `.prettierignore`/eslint ignore lists don't reference test dirs (nothing to ignore).

## What CAN Be Verified Today (manual commands)

| Command | What it checks |
|---------|----------------|
| `npx tsc --noEmit` | Type safety across `src/` (strict mode) |
| `npm run lint` | ESLint rules + Prettier formatting |
| `npm run build` | Full production build incl. SSR entry (`server`), CSS, route tree |
| `npm run dev` | Local dev server for manual/visual checks |
| `git diff` review | Manual code review |

## Recommended Strategy

**RECOMMENDATION — Not an existing requirement.** Until tests exist, no change to this site is regression-protected. A pragmatic first layer for this codebase:

1. **Unit tests (highest value first)**
   - `src/content/site.ts` integrity: every `course` has a unique `slug`/`id`; every `relatedArticles` slug exists in `articles`; every route-local slug link resolves; FAQ/articles/FAQs non-empty; announcement expiry parseable.
   - Enquiry payload builder: extract the payload-shaping logic from `enquiry-dialog.tsx` into a pure function and test field mapping, trim, validation, honeypot behaviour, and the DB-vs-webhook field split.
   - `sitemap[.]xml.tsx` path generation: expected URLs incl. course/article slugs (and, after the known-issue fix, `/gallery`).
   - `error-capture.ts` `describeError` helpers (h3 error-body normalization).
   - Client validation matrix in the dialog steps (class/board/parent/mobile/email/contact).
2. **Framework suggestion:** Vitest (natural fit with Vite 8, TS, no SSR setup needed). Add `"test": "vitest run"` (and optionally `@testing-library/react` + jsdom for component tests of the dialog's step logic).
3. **Integration test (targeted):** one Playwright-style smoke test is disproportionate today; prefer a scripted build + link crawl (all internal `<Link to>` targets resolve, sitemap URLs return 200 on the deployed site).
4. **CI wiring:** run `tsc --noEmit && lint && vitest run && build` on every push/PR once a repo-side pipeline exists (currently none — see `DEPLOYMENT.md` / `ROADMAP.md`).

## Rules While Untested

- For any change, personally run `npx tsc --noEmit`, `npm run lint`, and (for behavioural/UI changes) `npm run build`; visually verify with `npm run dev` when layout/UX is involved.
- Treat the enquiry flow as critical infrastructure: any edit touching `enquiry-dialog.tsx`, `site-shell.tsx`, Supabase calls, or the n8n payload deserves extra manual verification (submit a real test lead and confirm it lands in Supabase/n8n during development — then delete the test row).
- Document new tests + commands in this file and `ai/CHANGELOG.md` as they are added.

## UNKNOWN — Requires Confirmation

- Whether manual QA checklists or external QA happen outside the repo.
- Whether the team plans a specific test stack (the choice above is a recommendation, not a decision).

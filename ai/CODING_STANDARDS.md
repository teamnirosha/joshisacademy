# Coding Standards — Joshis Academy Website

Discovered conventions from actual code. Where no convention is established the entry says **"Not currently standardized."**

## Naming

- **Files/components:** PascalCase for React components (`SiteShell`, `EnquiryDialog`, `PageHero`, `BrandLoader`, `DualRingSpinner`); kebab-case for file names of UI primitives (`button.tsx`, `accordion.tsx` — shadcn convention); route files match their URL (`courses.$slug.tsx`, `journal.index.tsx`, `sitemap[.]xml.tsx`).
- **Server-only modules:** `*.server.ts` suffix (TanStack Start convention) — `client.server.ts`, plus comment guidance to mark modules server-only.
- **Hooks:** `use-*.ts(x)` files (e.g., `use-mobile.tsx`) but exported as `useIsMobile` (camelCase function).
- **Types/interfaces:** PascalCase (`CourseItem`, `FormData` in dialog, `GalleryItem` in gallery route). Route export is always `Route` (`createFileRoute(...)`).
- **DB columns:** snake_case (`student_class`, `preferred_contact`). Client-side state: camelCase (`studentClass`, `parentName`) mapped manually to snake_case payloads.
- **Env vars:** `VITE_` prefix for client-exposed (Vite convention); bare names (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `LOVABLE_CRON_SECRET`, `LOVABLE_CRON_SECRET_PREVIOUS`) for server `process.env` reads.
- **CSS classes:** Tailwind utilities inline; semantic custom classes `.eyebrow`, `.section-shell`, `.reveal`, `.image-reveal`, `.editorial-input`, `.border-hairline*` defined in `styles.css`. Shadcn variable system (`--color-*` / `--background` etc.).

## Folder Structure

- Routes → `src/routes/` (file-based; **never** `src/pages/` — see `src/routes/README.md`).
- Reusable components → `src/components/`; shadcn primitives → `src/components/ui/`.
- Content → `src/content/site.ts`.
- Integrations → `src/integrations/supabase/`.
- Hooks → `src/hooks/`; utilities → `src/lib/`.
- Assets → `src/assets/`; static public files → `public/`.
- Imports use the `@/*` alias (`@/components/ui/button`, `@/content/site`, `@/integrations/supabase/client`).

## Component Structure

- Function components only (no class components). Hooks at top; early returns; fragment `<>` usage common.
- Components exported as named functions, e.g., `export function EnquiryDialog(...)`.
- Inline sub-components in the same file when tightly coupled (e.g., `Footer` defined inside `site-shell.tsx`; `NotFoundComponent`/`ErrorComponent`/`RootShell` in `__root.tsx`).
- Radix + shadcn wrapping pattern for UI primitives (forwardRef, `cn()` merge, cva variants — see `ui/button.tsx`).
- UI kit (`button.tsx`) uses `cva` variants named semantically (`hero`, `heroOutline`, `choice`, `mobileBar`...).

## Service / Integration Structure

- Single browser Supabase client: lazy singleton via `Proxy` getter (`client.ts`) — import `{ supabase }`.
- Server admin client: lazy singleton `{ supabaseAdmin }` in `client.server.ts` — must only be imported server-side.
- No service classes/abstractions — components call `supabase` directly (only `enquiry-dialog.tsx` does).

## Route Conventions

- `createFileRoute("/path")` + `head()` for SEO + `component:`; optional `loader` returning content (throws `notFound()` for unknown slugs); `server.handlers` for server routes (sitemap).
- SEO helper `seoMeta(title, description)` from `page-hero.tsx` used on static pages; dynamic pages build meta arrays inline.
- Layout routes (`courses.tsx`, `journal.tsx`) render `<Outlet />`.
- Enquiry trigger convention: `const openEnquiry = () => window.dispatchEvent(new Event("open-enquiry"));` — global custom event consumed by `SiteShell`.

## Controller / Repository Conventions

- **Not applicable** — no backend controllers or repositories exist (client → Supabase/n8n only).

## DTO Conventions

- **Not currently standardized.** No formal DTO layer. The enquiry dialog defines a local `FormData` interface and builds an ad-hoc snake_case payload object at submit time. Supabase types come from generated-style `types.ts`.

## Error Handling

- Server/SSR: layered — `error-capture.ts` wraps `console.error` to record + expand Error objects (h3 strips details); `server.ts` normalizes swallowed h3 500s into a styled HTML page; `start.ts` request error middleware does the same; route/root error component (`__root.tsx` `ErrorComponent`) with retry UI + `reportLovableError` telemetry hook.
- Enquiry pipeline: failures logged via `console.warn("... notice:", ...)`; UI intentionally degrades to success (lead-capture resilience). Comment convention labels user-facing fallbacks as "notices".
- 404s: `throw notFound()` in loaders; custom NotFound component.
- No try/catch in page components beyond the dialog submit.

## Validation

- Client: inline per-step validation in `EnquiryDialog` (`isValidStep` array): class/board required; parent name ≥2 chars; mobile regex `/^[0-9+ ()-]{10,15}$/`; email empty-or-basic-regex; contact mode required.
- Honeypot: hidden `website` input; if filled, submit silently "succeeds" without sending (bot trap).
- Server/DB: CHECK constraints (authoritative) — name 2–100, mobile `/^[0-9+ ()-]{10,20}$/`, enum-like fields.
- **No zod / react-hook-form usage** despite those being installed.

## Logging

- `console.error` for real errors (wrapped/expanded by `error-capture.ts` on the server).
- `console.warn` for non-fatal notices (n8n/Supabase failures).
- Browser telemetry hooks to Lovable editor (`reportLovableError`) only active inside Lovable previews.
- No structured logging library; no log levels config.

## Formatting & Linting

- Prettier config: `printWidth: 100`, `semi: true`, `singleQuote: false`, `trailingComma: "all"`. Prettier wired into ESLint (`eslint-plugin-prettier/recommended`).
- ESLint flat config: TS recommended + react-hooks + react-refresh (warn, allow constant exports); `@typescript-eslint/no-unused-vars` **off**; `no-restricted-imports` blocks `server-only` package (use `*.server.ts` instead); ignores `dist`, `.output`, `.vinxi`.
- TypeScript strict: `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noFallthroughCasesInSwitch`; `noUnusedLocals/Parameters` false.
- Commands: `npm run lint`, `npm run format` (prettier --write .), `npx tsc --noEmit`.
- Generated files: `routeTree.gen.ts` — `/* eslint-disable */`, prettier-ignored.

## Reusable Components (the real shared surface)

- `src/components/ui/button.tsx` — the only shadcn component actually imported by app code (16 import sites).
- `src/components/page-hero.tsx` — `PageHero`, `Crumbs`, `seoMeta` (≈12 import sites).
- `src/components/site-shell.tsx` — layout shell (header/announcement/footer/mobile bar/dialog host).
- `src/components/enquiry-dialog.tsx` — shared global enquiry dialog.
- `src/components/brand-loader.tsx` — intro loader.
- `src/content/site.ts` — shared content/data.
- **Unused leftovers** (do not extend): `page-transition.tsx`, `dual-ring-spinner.tsx`, and ~40 `ui/*` primitives (dialog/input/label/sheet/etc. exist but are not used by app code).

## API Naming

- **Not currently standardized** (no owned API). Where relevant: DB payloads use snake_case matching columns; webhook body reuses those names.

## Database Naming

- Table: plural lower-case (`enquiries`). Columns: snake_case, descriptive (`student_class`, `mobile_number`, `preferred_contact`, `submission_fingerprint`). Timestamps: `created_at`/`updated_at`. Index: `enquiries_created_at_idx`. Constraint values: enum-like domain values in single quotes (`'IX'`, `'CBSE'`, `'Call'`, `'new'`). Status values lowercase (`new/contacted/closed`); display values title-case (`Call`, `WhatsApp`).

## Design / Visual Conventions

- Editorial premium style: ink/ivory/violet tokens; thin borders; small radius; generous whitespace; large display headlines (font-display = DM Serif Display); uppercase tracking eyebrow labels; `section-shell` max-width containers; animations respect `prefers-reduced-motion` (styles.css collapses durations).
- Buttons uppercase small with letterspacing; hairlines used as dividers; avoid gradients/neon (README art-direction rules).

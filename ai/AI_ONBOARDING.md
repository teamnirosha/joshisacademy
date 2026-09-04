# Joshis Academy — AI Onboarding

> This is the **first file** an AI agent (or human developer) should read before doing anything in this repository.

## Before You Do Anything

An AI agent working on this repository **MUST** follow this reading sequence:

1. Read `ai/AI_ONBOARDING.md` (this file)
2. Read `ai/AI_RULES.md` — non-negotiable working rules
3. Read `ai/PROJECT_CONTEXT.md` — what this project is
4. Read `ai/ARCHITECTURE.md` — how the system is built
5. Read `ai/CURRENT_STATE.md` — what is actually implemented today
6. Read `ai/ACTIVE_WORK.md` — what other developers/agents are doing right now
7. Read the relevant parts of `ai/REQUIREMENTS.md` / `ai/FEATURES.md`
8. Read the relevant `ai/API_CONTRACTS.md` entries and `ai/DATA_MODEL.md` information
9. **Inspect the actual source code** (the `src/` tree is the source of truth)
10. Check the impact of the requested change across routes, components, content, and integrations
11. Create a plan (use `write_todos` / todo lists)
12. Implement only the requested change
13. Run appropriate validation (typecheck via `tsc`, `npm run lint`, build)
14. Update the relevant AI context documentation if the change alters architecture, contracts, features, or state

## Source of Truth Hierarchy

When facts disagree, trust in this order:

1. Actual source code (`src/`)
2. Configuration files (`package.json`, `vite.config.ts`, `tsconfig.json`, `supabase/config.toml`, migrations)
3. Database / entity definitions (`supabase/migrations/*.sql`, `src/integrations/supabase/types.ts`)
4. Existing API implementations
5. Existing tests (none currently exist)
6. Existing project documentation (`README.md`, `AGENTS.md`, `src/routes/README.md`)
7. Git history (useful context, never overrides code)

**Never invent information.** If something cannot be determined, write `UNKNOWN — Requires confirmation`. If documentation conflicts with implementation, document the implementation and note the conflict.

## Repository Summary (30-second version)

| Aspect | Reality |
|--------|---------|
| What | Public marketing website for **Joshi's Academy – Gyan Ki Varsha**, a Science coaching institute in Kharadi, Pune (CBSE & ICSE, Classes IX–X) |
| Live domain | `https://joshisacademy.com` |
| Stack | React 19 + TypeScript (strict) + Vite 8 + **TanStack Start** (SSR, file-based routing) + TanStack Router + TanStack Query + Tailwind CSS v4 + shadcn/ui-style primitives |
| Content | Static TypeScript content module: `src/content/site.ts` (no CMS / admin UI) |
| Data | Supabase (Postgres) — single table `public.enquiries` for lead capture |
| Integrations | Supabase, n8n webhook (lead forwarding), Google Maps, WhatsApp deep links, Google Fonts, schema.org JSON-LD |
| Auth | None user-facing. Supabase auth *scaffolding* exists but is unused by application pages. Enquiries insert via anonymous RLS-limited client |
| Build origin | Generated on the Lovable platform (`@lovable.dev/vite-tanstack-config`) — see `AGENTS.md` Lovable warning |
| Tests | None |
| CI/CD | None inside the repository |

## The Context System and Future Tooling

This `ai/` directory is the **shared engineering knowledge base**. It is deliberately structured so it can later be combined with other tooling:

- **GitHub** = source of truth for version-controlled code
- **AI Context** (`ai/`) = shared engineering knowledge: what the project is, why it works this way, the rules, what is complete, what is being worked on, and what decisions were made
- **Graphify** = future code/dependency knowledge graph (will answer *"How is this code connected?"*) — **not installed, do not configure it**
- **MCP** = future AI access layer over this knowledge
- **Coordination system** = future real-time developer/agent work synchronization (the `ACTIVE_WORK.md` table is the manual precursor — do not build the automation now)

Division of labour to keep in mind:

| Tool | Will answer |
|------|-------------|
| AI Context | *What is this project? Why does it work this way? What are the rules? What is complete? What is being worked on? What decisions were made?* |
| Graphify (future) | *How is this code connected?* |

## Golden Rules (also in `ai/AI_RULES.md`)

- Inspect before modifying; understand the architecture first.
- Never invent requirements, APIs, or database relationships.
- Preserve existing architecture unless explicitly asked to change it; make minimal changes.
- Check `ACTIVE_WORK.md` before starting; avoid conflicts with other developers.
- Test after changes; verify claims against code.
- **If a feature is listed as planned, do NOT assume it is implemented.**
- Only modify files under `ai/` unless explicitly asked otherwise — do not refactor, do not fix bugs, do not change UI/API/database/deployment without an explicit request.
- Never commit or document secrets.

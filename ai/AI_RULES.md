# AI Rules

Strict rules for every AI coding agent working in this repository. These complement the reading sequence in `ai/AI_ONBOARDING.md`.

## Inspection & Understanding

1. **Inspect before modifying.** Read the relevant source before changing anything.
2. **Understand the architecture first.** Read `ai/ARCHITECTURE.md` and the actual code before forming a plan.
3. **Follow imports and references.** Understand how modules interact before touching them.
4. **The code is the source of truth.** Configuration, migrations, tests, and documentation follow it in priority order. If documentation conflicts with code, the code wins — document the discrepancy, do not "fix" the doc silently.
5. **Check `ai/CURRENT_STATE.md` and `ai/FEATURES.md` before claiming something exists or is missing.**

## Never Invent

6. **Never invent requirements.**
7. **Never invent APIs** (endpoints, methods, payloads, contracts).
8. **Never invent database relationships, tables, or columns.**
9. **Never invent business claims.** The website content (results, testimonials, faculty, contact details) must only ever reflect verified information the academy supplied. Do not fabricate stats, marks, credentials, reviews, or addresses.
10. **If information is unknown, explicitly say `UNKNOWN — Requires confirmation`.** Do not guess and do not write placeholders that read like facts.
11. **If a feature is listed as PLANNED, do NOT assume it is implemented.** Verify against code before relying on it.

## Change Discipline

12. **Preserve the existing architecture** unless an explicit request says otherwise.
13. **Make minimal changes.** Only touch what the request requires.
14. **Do not modify unrelated files.** Especially never "fix" bugs, refactor, restyle UI, or change APIs/database/deployment configuration as a side effect of another task.
15. **Do not introduce dependencies unnecessarily.** Check `package.json` and existing code before adding a library. Many shadcn-style primitives already exist in `src/components/ui/` — reuse them.
16. **Reuse existing utilities/components/services.** Check `src/components/`, `src/lib/`, `src/content/site.ts`, and `src/integrations/` before creating new ones.
17. **Prefer editing existing files over creating new ones.**

## Coordination & Safety

18. **Check `ai/ACTIVE_WORK.md` before starting significant work.** Register your work there (add a row to the table) if you will touch shared areas. Avoid conflicts with other developers.
19. **Protect existing functionality.** Do not break pages, links, routes, or the enquiry flow. Verify with a build/typecheck after changes.
20. **Never expose secrets.**
    - Never commit credentials, API keys, tokens, private keys, passwords, or real secrets.
    - Never modify `.env` secrets or secret configuration.
    - Never copy secret *values* into `ai/` documentation. Use `[REDACTED — SECRET NOT DOCUMENTED]`.
    - Document only environment variable *names* and where they are used.
21. **Be careful with anything already deployed.** `https://joshisacademy.com` is live. Changes to shared code can reach production via the Lovable-synced branch (`main`). Keep `main` in a working state.

## Verification

22. **Test after changes.** Run at least the typecheck (`npx tsc --noEmit`) and lint (`npm run lint`); run a production build (`npm run build`) when behavior is affected. (There are currently no automated tests — see `ai/TESTING_STRATEGY.md`.)
23. **Verify claims against code.** Never assert a feature status without evidence.
24. **Check impact before merging/committing:** routes, components, content module, Supabase, n8n webhook, SEO artifacts (sitemap, meta, JSON-LD), fonts/images.

## Documentation

25. **Update AI context documentation when architecture or contracts change** (routes, data model, APIs, integrations, feature status). Keep `CURRENT_STATE.md`, `FEATURES.md`, `API_CONTRACTS.md`, `DATA_MODEL.md`, and `CHANGELOG.md` accurate.
26. **Do not fake current state.** Nothing is "COMPLETE" merely because a file exists or a feature was planned — verify implementation evidence first.
27. **Keep documentation consistent.** If one file says a system is COMPLETE and another says NOT IMPLEMENTED, that difference must be explicitly explained.

## Git

28. **Do not rewrite published history** (no force push, rebase, amend, or squash of pushed commits) — the branch is connected to Lovable and history rewrites break the project there. See `AGENTS.md`.
29. **Keep commits small, meaningful, and scoped**; pull latest changes before starting; do not commit secrets; resolve conflicts carefully.
30. **Do not commit, push, or open PRs unless explicitly asked.**

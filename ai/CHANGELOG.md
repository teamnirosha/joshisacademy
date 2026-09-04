# AI Engineering Context Changelog

> **Scope note:** This changelog tracks changes to the **AI engineering context system** (`ai/` directory) — NOT normal application commits. For application history see `git log` and `CURRENT_STATE.md → Recently Completed Work`.

## 2026-09-04

### Added

- Initial AI engineering context system created from the current repository state (`main` @ `45a7e57`):
  - `AI_ONBOARDING.md` — mandatory reading sequence + knowledge hierarchy
  - `AI_RULES.md` — strict agent rules (inspect-first, no invention, no secrets, scope discipline)
  - `PROJECT_CONTEXT.md` — what the project is and how it works
  - `ARCHITECTURE.md` — actual architecture + Mermaid diagrams + boundaries
  - `REQUIREMENTS.md` — functional/non-functional requirements with implementation status
  - `FEATURES.md` — full feature inventory with evidence-based statuses
  - `CURRENT_STATE.md` — snapshot of implemented state (2026-09-04)
  - `ROADMAP.md` — completed/in-progress/recommended/future work (recommendations labelled)
  - `API_CONTRACTS.md` — Supabase insert, n8n webhook, sitemap route contracts
  - `DATA_MODEL.md` — `public.enquiries` schema, ER diagram, RLS
  - `AUTHENTICATION.md` — no user auth; scaffolding-only documentation
  - `CODING_STANDARDS.md` — discovered conventions
  - `DEVELOPMENT_WORKFLOW.md` — AI-assisted workflow
  - `GIT_WORKFLOW.md` — current git state + recommended rules (Lovable history constraints)
  - `TESTING_STRATEGY.md` — no tests exist; recommended Vitest-first approach
  - `SECURITY.md` — practices documented, no secrets (values redacted)
  - `DEPLOYMENT.md` — deployed at joshisacademy.com; platform details flagged UNKNOWN
  - `INTEGRATIONS.md` — Supabase, n8n, Google Maps, WhatsApp, fonts, JSON-LD, Lovable
  - `DECISIONS.md` — evidence-based ADR entries
  - `KNOWN_ISSUES.md` — issue register (open, unmodified)
  - `TECHNICAL_DEBT.md` — debt register (unmodified)
  - `ACTIVE_WORK.md` — developer/agent synchronization table (empty)
  - This `CHANGELOG.md`

### Notes

- No application source code, configuration, dependencies, or deployment settings were modified during context creation.
- Unknowns are explicitly marked `UNKNOWN — Requires confirmation` in the relevant files.

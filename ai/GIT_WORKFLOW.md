# Git Workflow — Joshis Academy Website

## Current State (observed in repository)

- **Single branch:** `main` (also `origin/main`; `origin/HEAD -> origin/main`). No feature branches exist locally or remotely.
- **Remote:** `origin` = `https://github.com/teamnirosha/joshisacademy.git`
- **History:** 11 commits, all dated 2026-09-04. Initial commit by `teamnirosha`; 10 subsequent commits authored by a single developer label ("Pune Mumbai Cab Deployer"). No merge commits, no PR evidence in history — work has been committed directly to `main`.
- **Commit style:** short imperative summaries with occasional prefixes: `fix: add recharts to ssr.noExternal...`, `feat`-style phrasing ("integrate n8n webhook...", "generate crisp...", "ensure auto enquiry popup..."). No body/scope convention beyond the imperative line. Conventional-commit prefix usage is inconsistent (`fix:` once only).
- **Lovable connection (critical):** `AGENTS.md` declares this project is connected to Lovable. Commits pushed to the connected branch sync back into Lovable. **Rewriting published history (force push, rebase, amend, squash of pushed commits) is forbidden** — it breaks Lovable's project history.
- **No branch protection / PR process verifiable** from the repo (no `.github` config, no CONTRIBUTING). How the team reviews is UNKNOWN — treat `main` as production.
- **Untracked local files at snapshot:** `.freebuff/` (local tooling — not part of the app; ignore it).

## Recommended Team Rules

Adopt these going forward (recommendation — current repo practice is direct-to-main):

1. **`main` remains stable.** Anything pushed to `main` can reach Lovable and, from there, the live site. Test locally (tsc/lint/build) before pushing.
2. **Use feature branches** for anything non-trivial: `feat/<short-name>`, `fix/<short-name>`. Keep `main` green.
3. **Meaningful commits** — small, atomic, imperative summaries (e.g., `add n8n lead forwarding to enquiry dialog`). Prefix with `fix:`/`feat:`/`chore:`/`docs:` when it adds clarity.
4. **Pull latest before starting** work (`git pull --ff-only`); rebase your feature branch onto `main` before merging (do not rewrite *published* history).
5. **Avoid unrelated changes** in the same commit — no drive-by refactors or style edits mixed into feature work (matches AI_RULES change discipline).
6. **Review PRs** before merging to `main` (code review by a second developer or a careful AI review pass).
7. **Never commit secrets** — no `.env`, keys, or tokens. `package.json` `*.local`, `.env`, `.dev.vars`, `.wrangler` are gitignored. Keep it that way.
8. **Resolve conflicts carefully** — this repo is small and single-authored so far; with multiple AI agents touching shared files (`site-shell.tsx`, `enquiry-dialog.tsx`, `content/site.ts`, `styles.css`), conflicts will happen. Read both sides; check `ACTIVE_WORK.md`; never discard another developer's changes.
9. **Do not rewrite history** (AGENTS.md / Lovable). No `git push --force`, no rebase of already-pushed commits, no amend/squash of pushed work.
10. **Register active work** in `ai/ACTIVE_WORK.md` for anything touching shared areas, so parallel agents/humans can see collisions.

## Practical Commands

```bash
# start of a task
git checkout main && git pull --ff-only
git checkout -b feat/my-change

# work, verify
npx tsc --noEmit && npm run lint

# commit (never include .env/secrets)
git add <specific files>
git commit -m "feat: concise description"

# push + PR (do NOT push unless the user asks)
git push -u origin feat/my-change
```

> ⚠️ **Do not push/commit automatically.** AI agents should commit only when the user explicitly asks, and must never force-push or rewrite history.

## UNKNOWN — Requires Confirmation

- Team review process / branch protection settings on GitHub (not visible in the repo).
- Whether pushes to `main` trigger immediate Lovable re-deploy or a manual step.
- Intended use of the current bot-labelled author account ("Pune Mumbai Cab Deployer") — likely the deployment integration account; confirm before attributing humans to it.

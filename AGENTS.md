# AGENTS.md — Rules for AI Agents in dfl-iterate

> Read this before touching anything. Non-negotiable.

## Operating Principles

1. **Explore before you act** — Read CLAUDE.md and repo-contract.yaml first
2. **Small atomic commits** — One logical change per commit. `feat:`, `fix:`, `refactor:`, `docs:`
3. **Test your changes** — `npm run build` + `npm run lint` + `npx tsc --noEmit` must pass
4. **Update docs** — Changed API/contract? Update CLAUDE.md and repo-contract.yaml
5. **Leave breadcrumbs** — Non-obvious decisions get code comments explaining WHY
6. **Validate boundaries** — Check repo-contract.yaml before adding cross-repo deps
7. **Progressive disclosure** — Simplest solution that works. Readable > clever.

## DFL-Specific Rules

- **ALL schema changes go through `dfl-schema`** — never write migrations here
- Every env var documented in repo-contract.yaml + .env.example
- Origin tracking: `// Origin: agent` for AI-generated code
- Check `dfl-hq` for ecosystem ADRs before proposing changes

## Forbidden Actions

1. No production environment variable changes
2. No self-merge without review *(exception: transformation weekend if authorized)*
3. No seed data deletion without migration
4. No undocumented cross-repo dependencies
5. No direct database writes — use Supabase client
6. No secrets in code

## When Stuck

1. Re-read CLAUDE.md
2. Check dfl-hq for ADRs
3. Look at similar DFL repos
4. If still stuck, say so clearly — don't guess and ship

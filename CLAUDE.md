# CLAUDE.md — dfl-iterate

## Quick Context
Gamified coding exercise platform — Duolingo-style lessons with code editing, AI feedback, and progress pills.
React SPA (Vite + TypeScript), Monaco Editor, Framer Motion, shadcn/ui, Tailwind.

## Architecture
```
src/
├── pages/           # HomePage, LessonPage, Index, NotFound
├── components/
│   ├── activity/    # FixTheCode, BreakAndFix, ConstrainedEdit, DecisionFork, FixWithChoices,
│   │                # QualityReview, VideoChallenge, VisualImplementation, ReadAndChoose
│   ├── ai/          # AIResponse (streaming AI feedback)
│   ├── editor/      # CodeEditor (Monaco), FileTree
│   ├── game/        # GameHeader, ProgressPills, ResultModal, CelebrationOverlay,
│   │                # LessonCompleteScreen, AIHistoryDrawer
│   ├── preview/     # DynamicPreview, ProjectPreview (live code preview)
│   ├── project/     # GitLog
│   ├── layout/      # AppShell, Header
│   ├── observability/ # OTel tracing
│   └── ui/          # shadcn/ui primitives
├── hooks/           # useFixTheCode, useAIStreaming, useAIHistory, useSoundEffects, usePreviewState
├── types/           # Activity types, Project types (index.ts, global.d.ts)
├── consts/          # ai-responses.ts (mock AI responses)
├── enums/           # Activity type enums
└── test/            # Vitest tests + test-utils (dummy data)
```

## How to Work Here
- `npm run dev` — local dev server
- `npm run test` — Vitest tests
- Activity types are the core abstraction: each type (FixTheCode, BreakAndFix, etc.) has its own component + hook
- Monaco Editor for code editing, Framer Motion for animations
- AI streaming via useAIStreaming hook (supports mock + real API)
- Sound effects via useSoundEffects (gamification UX)

## Contracts
- **Activities**: Each has a type enum, component, and dedicated hook
- **AI**: useAIStreaming → backend AI endpoint for code review/hints
- **Progress**: ProgressPills track lesson completion, CelebrationOverlay on success
- **Preview**: DynamicPreview renders user code in sandboxed iframe

## Ecosystem Context
- Part of **dfl-learn** LMS ecosystem (gamified layer)
- Related: **dfl-tracks** (learning paths), **dfl-skill-evals** (assessments)
- Standalone: no Supabase dependency yet — uses mock data/consts

## Rules
- Don't touch `src/components/ui/` — shadcn/ui managed
- New activity types need: component + hook + enum entry + dummy data
- Tests required for activity logic (see test/components/)
- Keep animations performant — Framer Motion for transitions only

## Post-Sprint Updates

> Added by dev-dfl agent — reflects post-sprint reality (CI, contracts, Infisical, agent context).

### Testing
- Test framework: **Vitest** is configured in this repo
- Run tests with `npm test` or `npx vitest` (or `npx jest` for Jest repos)
- Write tests alongside source files or in `__tests__/` directories

### CI / Continuous Integration
- CI runs **build + test + verify-docs** via the `dfl-ci` reusable workflow
- Workflow file: `.github/workflows/ci.yml` — uses `devfellowship/dfl-ci/.github/workflows/ci.yml@main`
- PRs must pass CI before merge

### Contracts
- `repo-contract.yaml` exists at repo root — defines the repo's role, ownership, and integration points
- Keep this file in sync when changing the repo's scope or dependencies

### Agent Context
- `AGENTS.md` — instructions for AI agents working in this repo
- `AGENT-PROGRESS.md` — tracks agent task progress and status
- Update these files when making significant architectural changes

### Secrets & Configuration (Infisical)
- Secrets are managed via **Infisical** at `infisical.devfellowship.com`
- Shared secrets path: `/shared/`
- Do NOT commit secrets to the repo — use Infisical for environment variables
- Check `repo-contract.yaml` for required environment variables

# Managed merge scaffold for dfl-iterate/CLAUDE.md
# Human edits belong only inside MANUAL blocks.

<!-- BEGIN GENERATED:claude/base -->
<!-- render-meta: repo=dfl-iterate; mode=merge; hash=640d418553259ac721dbaf5d2213a49e0ff32d652f7eb48c80c5e337470bdc84 -->
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
<!-- END GENERATED:claude/base -->

<!-- BEGIN MANUAL:repo/local-notes -->
<!-- repo-specific notes live here -->
<!-- END MANUAL:repo/local-notes -->

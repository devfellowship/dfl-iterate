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

## Padrões ouro do projeto (leitura obrigatória antes de PR)

O iterate tem **dois eixos de padrão** que toda nova feature deve seguir. Antes de criar arquivo novo, abra a referência e copie a estrutura.

### 1. Padrão de atividade (vertical — `activity → page`)

> Como uma activity comunica sucesso/erro para a `LessonPage`.

**Referência:** `src/components/activity/FixTheCode.tsx` + `src/hooks/useFixTheCode.ts`

Regras:

1. **Hook** com assinatura `useFoo(activity, callbacks)`:
   - `callbacks` é objeto (`{ onSubmit, onApprove, ... }`), nunca prop solta.
   - `useEffect` em `[activity.id]` resetando estado interno ao trocar de atividade.
   - Toda regra de negócio (cálculo de `isCorrect`, derivações) vive aqui.
2. **Componente** fino, dentro de `<ActivityGameCard>`:
   - Só consome o hook e renderiza UI.
   - Sem `useState` de regra de negócio.
3. **Callback `onSubmit`** dispara em sucesso **E** em erro (a página decide o modal).
4. **Aluno pode tentar de novo** em qualquer activity — não há "game over" na 1ª tentativa.
5. **`LessonPage` case** segue o template:
   ```tsx
   <Foo
     activity={currentActivity}
     onSubmit={(payload, isCorrect) => {
       handleActivityComplete(
         currentActivity.id,
         isCorrect ? "act-foo-success" : "act-foo-failure",
         isCorrect,
       );
     }}
   />
   ```
6. **Acerto vem do dado** (`activity.choices[i].isCorrect`, `activity.steps[i].correctAnswer`, etc.), nunca de string mágica na page.

### 2. Padrão de dados (horizontal — `componente → service`)

> Como dado externo entra na aplicação.

**Referência:** `src/pages/HomePage.tsx` + `src/hooks/useLessons.ts` + `src/services/lessons.service.ts`

Fluxo obrigatório:

```
componente → hook de query (useQuery) → service (async) → dummy/fetch
```

Regras:

1. **Service** em `src/services/<recurso>.service.ts`:
   - Funções `async`, sempre retornam `Promise`.
   - Sem React (nada de hooks, JSX, useState).
   - "Recurso não existe" = `throw new Error(...)` (React Query vira `isError`).
2. **Query key** em `src/lib/queryKeys.ts` — factory pattern. Nunca chave string solta.
3. **Hook de query** em `src/hooks/use<Recurso>.ts`:
   - Só `useQuery({ queryKey, queryFn })`. Sem UI.
   - Devolve o objeto cru do React Query (`data`, `isPending`, `isError`, `refetch`).
4. **Componente** trata estados:
   - `isPending` → texto/skeleton de carregamento.
   - `isError` → mensagem + botão "Tentar de novo" (`refetch()`).
   - Sucesso → render normal com `data`.

### Convenções gerais

- Imports absolutos (`@/components`, `@/hooks`, etc.) — relativos só dentro da mesma feature.
- Não criar tipo novo de `ActivityType` sem: enum + componente + hook + dummy + case em `LessonPage`.
- Não mexer em `src/components/ui/` (shadcn/ui gerenciado).

<!-- END MANUAL:repo/local-notes -->## Edge Functions

Edge functions are owned by `dfl-schema`. Do NOT add or modify files under `supabase/functions/` in this repo.
Open your PR in [dfl-schema](https://github.com/devfellowship/dfl-schema) instead.
The `push-functions.yml` workflow auto-deploys on merge to main.

# DFL Dev Journey — Winter 2025

> **Full-Stack Dev Journey** — sequência teórico → prática do zero ao fim da trilha.
>
> Alinhado ao programa **Winter 2025** (7 estágios, ~15 meses) e à prática no ecossistema DevFellowship (`dfl-iterate`, cursos, wiki).

---

## Como usar esta lista

Para cada item:

1. **Teoria** — conceito que precisa estar claro na cabeça
2. **Sinal de que entendeu** — pergunta que o fellow deve saber responder
3. **Prática** — onde colocar a mão (curso, projeto, iterate)

**Regra geral:** teoria curta + prática imediata. Não acumular 3 estágios só em vídeo.

---

## Visão geral dos estágios

```txt
Estágio 1 — Versionamento & Colaboração     (Git/GitHub)           M1–M2
Estágio 2 — Fundamentos de React            (Vite, hooks, Tailwind) M1–M3
Estágio 3 — React Aplicado + AI-Assisted    (E-commerce, iterate)   M2–M5
        ↓   (pausa M6–M7: consolidação)
Estágio 4 — Backend com Supabase                                    M8–M10
Estágio 5 — Modelagem de Dados & Arquitetura                        M9–M12
Estágio 6 — Gestão de Projetos na Prática                           M12–M15
Estágio 7 — Liderança na Prática para Devs                          M13–M15
```

### Duas trilhas no iterate

| Perfil | Onde começa | Foco |
|---|---|---|
| **Fellow novo** | [Onboarding — Fellows novos](./wiki/onboarding-fellows-novos.md) | Ambiente, cursos, prática inicial |
| **Fellow no batch** | [Instruções — Tasks T1–T11](./wiki/instrucoes-tasks-camada-de-dados.md) | Camada de dados: `type → dummy → service → queryKey → useGet*` |

---

# Estágio 1 — Versionamento & Colaboração (M1–M2)

### 1.1 O que é software versionado

| Teoria | Aplicar |
|---|---|
| Repositório, commit, histórico, diff | `git init`, `git log`, `git diff` num projeto pessoal |
| Working tree vs staging vs commit | Commits pequenos e legíveis num mini-repo |
| `.gitignore` | Ignorar `node_modules`, `.env` |

**Entendeu quando:** explica por que commitar `node_modules` é erro.

### 1.2 Branching e fluxo de trabalho

| Teoria | Aplicar |
|---|---|
| Branch como linha de trabalho isolada | `git checkout -b feat/minha-feature` |
| Feature branch vs trunk | No DevFellowship: sempre branch por task |
| Merge vs rebase (conceito) | Ver histórico após merge na `main` |

**Prática:** fork do `dfl-iterate`, clone, primeira branch, primeiro commit.

### 1.3 Colaboração remota

| Teoria | Aplicar |
|---|---|
| Remote (`origin`, `upstream`) | Configurar fork + `upstream` |
| Push / pull / fetch | Sync fork antes de cada task |
| Pull Request como proposta de mudança | PR no próprio repo ou no iterate |

### 1.4 Conflitos e recuperação

| Teoria | Aplicar |
|---|---|
| Por que conflito acontece (mesma linha, duas mudanças) | Resolver conflito guiado |
| `merge --abort`, `reset --hard upstream/main` | Recuperar `main` bagunçada |
| `--force-with-lease` só no **seu fork** | Reset da main do fork |

**Comandos de recuperação (fork):**

```bash
git checkout main
git fetch upstream
git reset --hard upstream/main
git push origin main --force-with-lease
```

### 1.5 Convenções de time

| Teoria | Aplicar |
|---|---|
| Conventional Commits (`feat:`, `fix:`) | Commits no padrão do batch |
| Branch `<nome>/feat/T{N}-descricao` | Antes de cada task |
| Code review como aprendizado | Revisar PR de colega (mesmo só leitura) |

**Marco do estágio:** abre PR sozinho, recebe review, corrige e mergeia sem quebrar a `main`.

**Curso alinhado:** Git e GitHub para Iniciantes.

---

# Estágio 2 — Fundamentos de React (M1–M3)

### 2.1 Ambiente e modelo mental

| Teoria | Aplicar |
|---|---|
| Node, npm, bundler (Vite) | `npm create vite`, `npm run dev` |
| SPA vs MPA | Navegar no iterate sem reload full |
| Estrutura `src/`: components, pages, hooks, types | Copiar estrutura num mini-projeto |

### 2.2 JavaScript/TypeScript essencial para React

| Teoria | Aplicar |
|---|---|
| `const`/`let`, arrow functions, destructuring | Refatorar código do curso |
| Arrays: `.map()`, `.filter()`, `.find()` | Listas na UI |
| Interfaces/types para props e dados | `interface Todo { id; title }` |
| `async`/`await` (noção) | Preparar terreno para services |

### 2.3 Componentes e composição

| Teoria | Aplicar |
|---|---|
| Componente = função que retorna UI | Extrair `Button`, `Card` |
| Props (dados de fora → dentro) | `UserAvatar name={...}` |
| Children e composição | Layout com `<Header>{children}</Header>` |
| Componente controlado vs apresentacional | UI fina + lógica no pai ou hook |

**Prática:** landing page ou card de perfil (mini-projeto pessoal).

### 2.4 Estado local (UI state)

| Teoria | Aplicar |
|---|---|
| `useState` — estado que some ao desmontar | Todo list, formulário, filtro |
| Estado derivado (calcular, não duplicar) | `const total = items.length` |
| `useEffect` — sincronizar com algo externo | Reset ao trocar `id`; cuidado com deps |
| Lifting state up | Estado no pai, props pros filhos |

**Entendeu quando:** explica diferença entre “modal aberto” (UI) e “lista de lições” (dado remoto).

### 2.5 Listas, forms e eventos

| Teoria | Aplicar |
|---|---|
| Keys em listas | `.map(item => <Row key={item.id} />)` |
| Inputs controlados | `value` + `onChange` |
| Validação básica | Desabilitar submit se campo vazio |
| Event handlers | `onClick`, `onSubmit` |

### 2.6 Estilo e UI

| Teoria | Aplicar |
|---|---|
| Utility-first (Tailwind) | Layout responsivo no mini-projeto |
| Design system / shadcn (consumo) | Usar `Button`, `Card` sem mexer em `ui/` |
| Estados visuais: default, hover, disabled | Botões e inputs consistentes |

### 2.7 Roteamento (noção)

| Teoria | Aplicar |
|---|---|
| Rotas = URLs = telas | `react-router`: `/`, `/lesson/:id` |
| Params e navegação | Link da Home → Lesson no iterate |

### 2.8 CRUD e dados mock (pré–React Query)

| Teoria | Aplicar |
|---|---|
| Create / Read / Update / Delete como operações | Array em memória no Todo |
| Dummy data como contrato futuro | `src/test-utils/*.dummy.ts` no iterate |
| Separação: dado vs apresentação | Componente só recebe props |

**Marco do estágio:** mini-app React com 2–3 telas, props tipadas, `useState`, lista com `.map()`, Tailwind.

**Curso alinhado:** React: Da Instalação ao Projeto Profissional (com React Query e Storybook no final).

---

# Estágio 3 — React Aplicado + AI-Assisted Dev (M2–M5)

Aqui entram **projeto maior (E-commerce)**, **iterate em PRs** e **camada de dados (batch T1–T11)**.

### 3.1 Arquitetura de front-end

| Teoria | Aplicar |
|---|---|
| Pastas por feature vs por tipo | `components/`, `hooks/`, `services/`, `pages/` |
| Componente fino vs hook com lógica | Padrão `FixTheCode` + `useFixTheCode` |
| Enums e constantes | `ActivityType`, `queryKeys` |
| Barrel exports (`index.ts`) | `data-layer/index.ts` |

**Prática iterate (fases anteriores ao batch):**

- **Criar** activity: componente + hook + enum + dummy + `LessonPage`
- **Refatorar** activity legada para o padrão ouro vertical

### 3.2 Estado global vs local vs servidor

| Teoria | Aplicar |
|---|---|
| UI state → `useState` no componente | Modal, aba ativa |
| Estado compartilhado leve → Context | Auth provider (curso), tema |
| Server state → **não** duplicar em `useState` | Batch camada de dados |
| `useMemo` / `useCallback` (quando e por quê) | Listas pesadas, callbacks estáveis |

### 3.3 React Query (server state)

| Teoria | Aplicar |
|---|---|
| `useQuery`: loading, success, error, cache | `useGet*` em cada task |
| `queryKey` como identidade do dado | `queryKeys.ts` factory |
| `isPending`, `isError`, `refetch` | UI explícita: skeleton, erro + “Tentar de novo” |
| Stale time / invalidation (noção) | Depois das T1–T11 |

**Fluxo do batch (decorar):**

```txt
type → dummy → service → queryKey → useGet* → integração no *DataSlots*
```

**Prática iterate:** tasks **T1–T11** (uma por fellow).

### 3.4 Camada de serviços

| Teoria | Aplicar |
|---|---|
| Service = função `async` pura, sem React | `src/services/*.service.ts` |
| Contrato de retorno e `throw new Error` | Falha vira `isError` no hook |
| Dummy hoje, API amanhã | Trocar implementação sem mudar hook |
| Tipos compartilhados | `src/types/index.ts` |

### 3.5 Integração em produto real

| Teoria | Aplicar |
|---|---|
| Página compõe blocos (slots) | `HomePageDataSlots`, `HomePageHeaderDataSlots` |
| Dados fluem top-down | Page/slot chama hook, passa props pro visual |
| Conflitos de merge em arquivos compartilhados | Coordenar T1/T2/… no mesmo slot |
| Feature flag / mock vs real (noção) | Preview mock → `useGet*` |

**Onde cada task integra:**

| Tasks | Arquivo |
|---|---|
| T1, T2, T4, T6, T10 | `src/components/data-layer/HomePageHeaderDataSlots.tsx` |
| T3, T7, T8, T9, T11 | `src/components/data-layer/HomePageDataSlots.tsx` |
| T5 | `src/pages/HomePage.tsx` (`LessonCard`) |

### 3.6 Produto ponta a ponta (lesson inteira)

| Teoria | Aplicar |
|---|---|
| Rota → página → lista de activities → activity atual | `LessonPage` + `useActivityPage` |
| Dados filtrados por contexto (`lessonId`) | Lesson-2 jogável |
| Callbacks de sucesso/erro para a página | `onSubmit(payload, isCorrect)` |

### 3.7 Ferramentas e qualidade de dev

| Teoria | Aplicar |
|---|---|
| ESLint + Prettier | `npm run lint` antes da PR |
| TypeScript strict (`tsc --noEmit`) | Gate obrigatório no batch |
| Devtools (React, Network) | Debugar loading/erro |
| Storybook (noção) | Componente isolado (curso React Profissional) |

### 3.8 AI-assisted development (vibe coding)

| Teoria | Aplicar |
|---|---|
| IA como acelerador, não substituto do raciocínio | Cursor para boilerplate, fellow revisa diff |
| Prompt com contexto (arquivo, padrão, contrato) | “Siga `useLessons.ts` e `queryKeys.ts`” |
| Revisar código gerado (segurança, padrão) | Nunca mergear sem ler o diff |

**Prática:** E-commerce (curso 3) + iterate PRs.

**Marco do estágio:** PR no iterate com service + `useGet*` + estados loading/erro/sucesso; explica o fluxo de dados sem abrir o código.

**Cursos alinhados:**

1. Construindo um Website de E-Commerce com React JS, Vite e TailwindCSS
2. Vibe Coding: Wiki Gamer com Lovable e Cursor (quando mentor liberar)

### Pausa M6–M7 (consolidação)

Refazer mini-projeto do zero, revisar PRs antigas, sync fork, 1 task extra ou refatoração — **não** pular para Supabase sem dominar React Query + services.

### Ordem de dificuldade no batch (T1–T11)

| Nível | Tasks |
|---|---|
| **Entrada** | T1, T4, T2, T9 |
| **Intermediário** | T3, T6, T7, T10, T11 |
| **Saída** | T5, T8 |

T5 é mais difícil porque mexe em `HomePage.tsx` direto; T8 compartilha slot com várias outras.

### Trilha pedagógica do iterate (rodadas)

| Fase | Aprendizado | Exemplo no iterate |
|---|---|---|
| **1 — Criar** | Componente + hook + enum + dummy + `LessonPage` + PR | Activity nova ponta a ponta |
| **2 — Refatorar** | Extrair lógica pro hook, padrão ouro vertical | Alinhar activities ao modelo `FixTheCode` |
| **3 — Integrar** | Lição inteira jogável, dados por `lessonId` | Lesson-2 completa |
| **4 — Camada de dados** | Service + React Query + loading/erro explícito | Tasks T1–T11 |
| **5+** (futuro) | Qualidade, observabilidade, ecossistema DFL | UX, tracing, cross-repo, review de PR |

---

# Estágio 4 — Backend com Supabase (M8–M10)

### 4.1 Modelo cliente–servidor

| Teoria | Aplicar |
|---|---|
| Front consome API; back persiste e regra de negócio | Trocar dummy por `fetch` / Supabase client |
| REST: GET/POST/PATCH/DELETE, status HTTP | Services chamando endpoints reais |
| JSON como contrato de troca | Alinhar com contratos JSON do batch |

### 4.2 Supabase fundamentals

| Teoria | Aplicar |
|---|---|
| Projeto, URL, anon key, env vars | `.env.example`, nunca commitar secrets |
| Client SDK no front | `supabase.from('lessons').select()` |
| Auth: session, JWT (noção) | Login simples num app de estudo |

### 4.3 Banco e segurança

| Teoria | Aplicar |
|---|---|
| Tabelas, colunas, tipos, PK/FK (noção) | Schema no Supabase dashboard |
| RLS (Row Level Security) | “Usuário só vê suas linhas” |
| Roles: anon vs authenticated | Policies por operação |
| Migrations no ecossistema DFL | PR em **dfl-schema**, não no iterate |

### 4.4 Backend avançado (intro)

| Teoria | Aplicar |
|---|---|
| Realtime (subscriptions) | Notificações (liga com T10 no iterate) |
| Edge Functions (noção) | Lógica server-side sem expor secrets |
| Webhooks / eventos (noção) | Integração entre sistemas |

**Prática:** curso **Dominando Supabase: Do Zero ao Deploy** + conectar 1 service do iterate ao Supabase (mentor define escopo).

**Marco:** app com auth + leitura protegida por RLS + deploy.

---

# Estágio 5 — Modelagem de Dados & Arquitetura (M9–M12)

*(Overlap intencional com backend — modelagem enquanto usa Supabase.)*

### 5.1 Domínio e linguagem ubíqua

| Teoria | Aplicar |
|---|---|
| Entidades do negócio (Lesson, User, Activity…) | Glossário no Miro/wiki |
| DDD leve: bounded context (noção) | iterate vs tracks vs skill-evals |
| User flows e casos de uso | Diagrama “aluno completa lição” |

### 5.2 Relacionamentos

| Teoria | Aplicar |
|---|---|
| 1:1, 1:N, N:N | User → Progress → Lesson |
| Tabelas associativas | `lesson_activities` |
| Cardinalidade e integridade | FK, `ON DELETE` |

### 5.3 Normalização

| Teoria | Aplicar |
|---|---|
| 1FN, 2FN, 3FN (intuição) | Evitar duplicar `lesson_title` em 5 tabelas |
| Quando desnormalizar (noção) | Performance vs simplicidade |

### 5.4 Contratos e documentação

| Teoria | Aplicar |
|---|---|
| OpenAPI / JSON Schema (noção) | Mesmo espírito dos contratos T1–T11 |
| UML / diagramas ER | Documentar schema antes de codar |
| ADRs (Architecture Decision Records) | Ler ADRs no `dfl-hq` antes de propor mudança |

### 5.5 IA na modelagem

| Teoria | Aplicar |
|---|---|
| IA para rascunho de schema e fluxos | Lovable/ChatGPT → **validar** com mentor |
| Human-in-the-loop | Fellow desenha, IA sugere, humano decide |

**Prática:** modelar domínio de um módulo DFL (ex.: progresso do aluno) + migration via dfl-schema.

**Curso alinhado:** Modelagem de Dados na prática…

**Marco:** ER diagram + schema SQL + explicação oral dos relacionamentos.

---

# Estágio 6 — Gestão de Projetos na Prática (M12–M15)

### 6.1 Escopo e entrega

| Teoria | Aplicar |
|---|---|
| MVP vs nice-to-have | Quebrar “fazer HomePage inteira” em T1…T11 |
| Definition of Done | Checklist da PR (tsc, lint, estados de erro) |
| Teoria das restrições (gargalo) | 1 slot = 1 merge por vez |

### 6.2 Tarefas bem escritas

| Teoria | Aplicar |
|---|---|
| Task = verbo + resultado + critério de aceite | Issues do batch na plataforma |
| Decomposição vertical (fininha) | Uma task = um `useGet*` + slot |
| Estimativa relativa (t-shirt, pontos) | Points nas tasks T1–T11 |

### 6.3 Planejamento iterativo

| Teoria | Aplicar |
|---|---|
| Sprint / batch / milestone | Winter 2025 por estágios |
| Retrospectiva | “O que travou nas PRs?” |
| Dependências entre tasks | Ordem T1, T4, T2… vs T5, T8 |

**Prática:** fellow escreve 1 issue completa (como as do batch) para feature pequena; estima e lista dependências.

**Marco:** planeja 2 semanas de trabalho seu com tasks claras o suficiente para outro fellow executar.

---

# Estágio 7 — Liderança na Prática para Devs (M13–M15)

### 7.1 Mentoria e feedback

| Teoria | Aplicar |
|---|---|
| Feedback específico, acionável, gentil | Review de PR de colega (rubrica do batch) |
| Perguntas em vez de só “faz assim” | Pair review no Discord |
| Autonomia progressiva | Menos hand-holding após T3–T4 |

### 7.2 Ensinar programação

| Teoria | Aplicar |
|---|---|
| Zona de desenvolvimento proximal | Onboarding fellows novos |
| Mostrar o padrão, depois soltar | `FixTheCode` como referência |

### 7.3 Comunicação e ritual

| Teoria | Aplicar |
|---|---|
| Daily / sync: bloqueio, próximo passo | Standup do batch |
| Escrita clara (PR, wiki, Discord) | Summary + Issue + What was done |
| Async-first em remoto | Wiki em vez de doc só no repo |

### 7.4 Transição dev → tech lead (intro)

| Teoria | Aplicar |
|---|---|
| Técnico + desbloqueador de time | Ajudar fellow com conflito Git |
| Priorizar qualidade do time sobre velocidade individual | Padrão ouro antes de feature nova |

**Prática:** fellow “buddy” de um novo por 2 semanas; conduz 1 review guiado.

**Marco:** consegue onboardar alguém no fork + primeira branch sem mentor na call.

---

## Mapa rápido: trilha × onde praticar

| Estágio | Teoria central | Prática principal |
|---|---|---|
| 1 Git | versionamento, PR, conflito | fork iterate, PR de treino |
| 2 React base | componentes, estado UI, TS | mini-projeto + explorar iterate |
| 3 React aplicado | hooks, services, React Query, arquitetura | E-commerce + batch T1–T11 + activities |
| 4 Supabase | API, auth, RLS | conectar services ao backend real |
| 5 Modelagem | ER, DDD leve, normalização | schema DFL + dfl-schema |
| 6 Gestão | tasks, escopo, estimativa | escrever issues, planejar batch |
| 7 Liderança | feedback, mentoria, comunicação | buddy + review de PR |

---

## Sequência de marcos (checkpoints)

```txt
M1–M2   → 1ª PR (qualquer repo) + fork iterate rodando
M2–M3   → mini-app React completo
M3–M4   → 1ª activity ou refatoração no iterate (padrão vertical)
M4–M5   → 1ª task T{N} mergeada (camada de dados)
M6–M7   → consolidar: 2ª task ou refatoração + E-commerce em andamento
M8–M10  → Supabase: auth + 1 tabela real + RLS
M9–M12  → diagrama ER + migration em dfl-schema
M12–M15 → escrever tasks + revisar PRs de outros
M13–M15 → mentorar 1 fellow novo
```

---

## Ordem de cursos (fellows novos)

| Ordem | Curso | Etapa |
|---|---|---|
| **1** | Git e GitHub para Iniciantes | Estágio 1 |
| **2** | React: Da Instalação ao Projeto Profissional | Estágio 2 |
| **3** | Construindo um Website de E-Commerce com React, Vite e Tailwind | Estágio 3 |
| Depois | Vibe Coding (Lovable/Cursor) | Estágio 3 |
| Depois | Dominando Supabase | Estágio 4 |
| Depois | Modelagem de Dados na prática | Estágio 5 |

---

## Checklist — “estou pronto para o batch T1–T11?”

- [ ] Git: sei criar branch, commit, push e abrir PR (do **meu fork**)
- [ ] React: componente funcional + props + `useState` + `useEffect`
- [ ] TypeScript: interface simples para props/dados
- [ ] Estrutura: sei onde colocar componente vs hook vs página
- [ ] iterate roda local (`npm run dev`) a partir do meu fork
- [ ] Sei sincronizar meu fork com a `main` oficial antes de trabalhar
- [ ] Li os documentos na Wiki direcionados para o batch
- [ ] Curso Git concluído (ou quase)
- [ ] Curso React Profissional em andamento avançado ou concluído

---

## Documentação relacionada

| Documento | Conteúdo |
|---|---|
| [wiki/onboarding-fellows-novos.md](./wiki/onboarding-fellows-novos.md) | Onboarding fellows novos |
| [wiki/instrucoes-tasks-camada-de-dados.md](./wiki/instrucoes-tasks-camada-de-dados.md) | Tasks T1–T11 |
| [wiki/comece-por-aqui.md](./wiki/comece-por-aqui.md) | Entrada do batch |
| [wiki/padrao-git-branches-commits-pr.md](./wiki/padrao-git-branches-commits-pr.md) | Git, branch, PR |
| [wiki/o-que-esperamos-ate-a-reuniao.md](./wiki/o-que-esperamos-ate-a-reuniao.md) | React Query fundamentos |

---

*Mentores: fellows novos → estágios 1–2; fellows em tasks → estágio 3 (React Query + services). Publicar conteúdo equivalente na Wiki DevFellowship para fellows que não têm acesso à pasta `docs/` no clone.*

# DFL React Starter — Especificação para bootstrap do repositório

> **Para quem lê este arquivo (humano ou IA):** este documento é a **fonte única de verdade** para criar o repositório `dfl-react-starter` (nome sugerido) do zero. O repo resultante **não é um app pronto** — é um **esqueleto limpo** no padrão DevFellowship para fellows clonarem/forkarem e implementarem o projeto de sua escolha (Todo, galeria, CRUD de livros, landing page, etc.).

---

## 1. Propósito e contexto

### O que é este repo

Um **template de projeto React** usado no programa **Winter 2025 — DFL Dev Journey** (DevFellowship). Fellows **iniciantes** clonam ou fazem fork deste repo e, com mentoria, constroem um mini-projeto pessoal **em cima da mesma estrutura** que usamos no `dfl-iterate`.

### O que este repo DEVE ser

- Ambiente **100% configurado** e rodando (`npm run dev` sem erros).
- **Estrutura de pastas** espelhando o padrão DFL (components, hooks, pages, services, types, test-utils, lib).
- **Providers** já montados (React Query, React Router) — prontos para uso, sem feature implementada.
- **Alias `@/`** configurado (Vite + TypeScript).
- **Tailwind CSS** configurado.
- **Página inicial mínima** (placeholder) — só para provar que o setup funciona.
- **Arquivos stub/comentados** em services, hooks e test-utils — documentando o padrão `dummy → service → useGet* → página`.
- **README** claro para o fellow saber o que fazer depois do clone.

### O que este repo NÃO DEVE ser

- **Não** implementar Todo, galeria, CRUD de livros ou qualquer domínio de negócio.
- **Não** copiar o `dfl-iterate` inteiro (sem Monaco, activities, shadcn completo, observability, etc.).
- **Não** incluir dados dummy de exemplo além de comentários/README nos stubs.
- **Não** incluir testes de feature — apenas setup de Vitest opcional e vazio ou 1 smoke test do App.
- **Não** incluir `@devfellowship/*` packages (starter é independente).

### Quem usa e como

```txt
Mentor cria repo vazio → cola esta spec → IA (ou humano) gera o starter
        ↓
Fellow faz fork/clone → escolhe projeto (Todo, galeria, livros…) → mentor auxilia no clone de cada um
        ↓
Evolução natural: types → dummy → service → queryKey → useGet* → componentes → pages
        (mesmo fluxo do batch T1–T11 no dfl-iterate)
```

---

## 2. Stack técnica (versões alinhadas ao ecossistema DFL)

| Tecnologia | Uso |
|---|---|
| **Vite** | Bundler e dev server |
| **React 18** | UI |
| **TypeScript** | Tipos |
| **Tailwind CSS 3** | Estilos utility-first |
| **react-router-dom 6** | Rotas |
| **@tanstack/react-query 5** | Server state (hooks `useGet*`) |
| **ESLint** | Lint básico |
| **Vitest** (opcional) | Testes — smoke test apenas |

**Não instalar neste starter:** shadcn/ui completo, Framer Motion, Monaco, Supabase, Sentry, OpenTelemetry.

---

## 3. Comandos para criar o repo do zero

Execute na ordem (repo vazio ou pasta nova):

```bash
# 1. Scaffold Vite
npm create vite@latest . -- --template react-ts

# 2. Dependências de produção
npm install react-router-dom @tanstack/react-query

# 3. Dependências de desenvolvimento
npm install -D tailwindcss postcss autoprefixer @types/node

# 4. Tailwind init
npx tailwindcss init -p
```

Depois, **substituir/criar** os arquivos listados na seção 5.

---

## 4. Estrutura de pastas final (obrigatória)

```txt
dfl-react-starter/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── .gitkeep
│   ├── hooks/
│   │   └── .gitkeep
│   ├── pages/
│   │   ├── HomePage.tsx          # placeholder mínimo
│   │   └── NotFound.tsx          # 404 simples
│   ├── services/
│   │   ├── index.ts              # barrel export
│   │   └── README.md             # explica padrão do service (sem código de domínio)
│   ├── test-utils/
│   │   └── README.md             # explica padrão dummy (sem dados de exemplo)
│   ├── types/
│   │   └── index.ts              # vazio ou comentário — fellow adiciona interfaces
│   ├── lib/
│   │   ├── queryKeys.ts          # factory vazia comentada
│   │   └── utils.ts              # cn() opcional (clsx + tailwind-merge) OU arquivo vazio comentado
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css                 # diretivas Tailwind
│   └── vite-env.d.ts
├── .gitignore                    # padrão Vite + .env
├── .env.example                  # vazio ou VITE_API_URL=
├── eslint.config.js              # padrão Vite ou mínimo
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md                     # instruções para o fellow
```

---

## 5. Conteúdo dos arquivos principais

### 5.1 `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

> Se o template Vite usar `@vitejs/plugin-react` em vez de `react-swc`, manter o que o scaffold gerar — o essencial é o alias `@`.

### 5.2 `tsconfig.app.json` — adicionar paths

Garantir:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 5.3 `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 5.4 `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Fellows: estilos globais mínimos aqui. Prefira classes Tailwind nos componentes. */
```

### 5.5 `src/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### 5.6 `src/App.tsx`

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

### 5.7 `src/pages/HomePage.tsx` — placeholder (sem domínio)

```tsx
/**
 * Página inicial — placeholder do starter.
 * Substitua este conteúdo pelo seu projeto (Todo, galeria, CRUD de livros, etc.).
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold">DFL React Starter</h1>
      <p className="text-gray-600">
        Setup pronto. Comece criando seus <code className="rounded bg-gray-100 px-1">types</code>,{" "}
        <code className="rounded bg-gray-100 px-1">components</code> e{" "}
        <code className="rounded bg-gray-100 px-1">hooks</code>.
      </p>
      <p className="text-sm text-gray-500">
        Fluxo de dados: dummy → service → queryKey → useGet* → página
      </p>
    </main>
  );
}
```

### 5.8 `src/pages/NotFound.tsx`

```tsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="text-gray-600">Página não encontrada.</p>
      <Link to="/" className="text-blue-600 underline">
        Voltar ao início
      </Link>
    </main>
  );
}
```

### 5.9 `src/lib/queryKeys.ts`

```ts
/**
 * Factory central de query keys do React Query.
 *
 * Padrão DevFellowship (igual dfl-iterate):
 * - Nunca use string solta no useQuery — sempre queryKeys.recurso.*
 * - `all` = chave raiz do recurso
 * - Funções com parâmetro retornam tupla `as const`
 *
 * Exemplo quando criar seu primeiro recurso (ex.: books):
 *
 * export const queryKeys = {
 *   books: {
 *     all: ['books'] as const,
 *     byId: (id: string) => ['books', id] as const,
 *   },
 * } as const;
 */
export const queryKeys = {} as const;
```

> **Nota para IA:** o objeto vazio `as const` pode gerar aviso de unused. Alternativa aceitável: exportar objeto com comentário e uma chave `_placeholder` removível, ou deixar só comentários + `export {}`. Preferir objeto comentado com exemplo em comentário de bloco — fellow substitui ao criar primeiro recurso.

**Versão que compila sem warnings:**

```ts
// Fellow: descomente e adapte ao criar seu primeiro useGet*
export const queryKeys = {
  // books: {
  //   all: ['books'] as const,
  //   byId: (id: string) => ['books', id] as const,
  // },
} as const;
```

### 5.10 `src/types/index.ts`

```ts
/**
 * Tipos compartilhados do seu projeto.
 *
 * Exemplo (CRUD de livros):
 *
 * export interface Book {
 *   id: string;
 *   title: string;
 *   author: string;
 *   read: boolean;
 * }
 */
```

### 5.11 `src/services/index.ts`

```ts
/**
 * Barrel export dos services.
 * Exemplo: export { getBooks } from './books.service';
 */
```

### 5.12 `src/services/README.md`

```markdown
# Services

Funções **async puras** — sem React, sem hooks, sem JSX.

## Regras

1. Sempre retornam `Promise<T>`.
2. Recurso inexistente → `throw new Error('...')` (React Query vira `isError`).
3. Hoje leem de `src/test-utils/*.dummy.ts`; amanhã podem chamar API.

## Exemplo (quando implementar)

\`\`\`ts
// books.service.ts
import { booksData } from '@/test-utils/books.dummy';
import type { Book } from '@/types';

const DELAY_MS = 300;
const delay = () => new Promise((r) => setTimeout(r, DELAY_MS));

export async function getBooks(): Promise<Book[]> {
  await delay();
  return booksData;
}
\`\`\`

Referência no ecossistema: `dfl-iterate/src/services/lessons.service.ts`
```

### 5.13 `src/test-utils/README.md`

```markdown
# Test utils / Dummy data

Dados **fake** que simulam o backend. Usados pelos services até existir API real.

## Regras

1. Exportar constantes nomeadas (`booksData`, `todosData`, etc.).
2. Tipar com interfaces de `src/types/`.
3. **Não** importar dummy direto em páginas ou componentes — só via service.

## Exemplo

\`\`\`ts
// books.dummy.ts
import type { Book } from '@/types';

export const booksData: Book[] = [
  { id: '1', title: 'Exemplo', author: 'Autor', read: false },
];
\`\`\`
```

### 5.14 `src/hooks/.gitkeep`

Pasta vazia. Fellow cria `useGetBooks.ts`, `useTodos.ts`, etc.

**README opcional** `src/hooks/README.md`:

```markdown
# Hooks

## Dados (React Query)

Padrão: `useGet*` — um arquivo por recurso.

\`\`\`ts
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '@/services/books.service';
import { queryKeys } from '@/lib/queryKeys';

export function useGetBooks() {
  return useQuery({
    queryKey: queryKeys.books.all,
    queryFn: getBooks,
  });
}
\`\`\`

A página trata `isPending`, `isError`, `data`, `refetch`.

## UI / lógica local

Hooks com `useState` para lógica de componente (ex.: `useTodos` antes de migrar para React Query).

Referência: `dfl-iterate/src/hooks/useLessons.ts`
```

### 5.15 `.env.example`

```env
# VITE_API_URL=https://api.exemplo.com
```

### 5.16 `package.json` — scripts mínimos

Garantir:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

---

## 6. README.md do repo (para o fellow)

O README do starter deve conter:

### Título

`DFL React Starter`

### Seção: O que é

Esqueleto React no padrão DevFellowship. Não é um app — é a base para você criar o **seu** projeto.

### Seção: Começar

```bash
git clone https://github.com/SEU-USUARIO/dfl-react-starter.git meu-projeto
cd meu-projeto
npm install
npm run dev
```

### Seção: Estrutura de pastas

Tabela explicando cada pasta (copiar da seção 4).

### Seção: Ideias de projeto

| Projeto | O que pratica |
|---|---|
| Todo list | `useState`, lista, hook, componentes |
| Galeria | array mock, filtro, `.map()` |
| CRUD de livros | types, dummy, service, `useGet*` |
| Landing pessoal | componentes, Tailwind, composição |

### Seção: Ordem de implementação (padrão DFL)

```txt
1. Definir types em src/types/
2. Criar dummy em src/test-utils/
3. Criar service em src/services/
4. Registrar queryKey em src/lib/queryKeys.ts
5. Criar hook useGet* em src/hooks/
6. Criar componentes em src/components/
7. Montar página em src/pages/
8. Git: branch feat/... → commits → PR no seu repo
```

### Seção: Comandos úteis

```bash
npm run dev
npm run lint
npx tsc --noEmit
```

### Seção: Links

- Wiki onboarding DevFellowship (mentor fornece URL)
- `dfl-iterate` como referência de padrão (somente leitura)

---

## 7. Critérios de aceite (checklist para IA validar)

Antes de considerar o starter **pronto**, verificar:

- [ ] `npm install` sem erros
- [ ] `npm run dev` abre página placeholder em `http://localhost:5173`
- [ ] `npm run build` passa
- [ ] `npx tsc --noEmit` passa
- [ ] Import `@/pages/HomePage` funciona
- [ ] `QueryClientProvider` e `BrowserRouter` em `App.tsx`
- [ ] Pastas `components`, `hooks`, `services`, `test-utils`, `types`, `lib` existem
- [ ] **Nenhum** domínio implementado (sem Todo, sem livros, sem galeria)
- [ ] README explica próximos passos para o fellow
- [ ] `.env` no `.gitignore`; `.env.example` presente

---

## 8. Instruções explícitas para a IA que vai executar

```txt
CONTEXTO:
Você está em um repositório Git NOVO e VAZIO (ou com apenas este arquivo .md).
Seu objetivo é criar o "DFL React Starter" conforme esta especificação.

REGRAS:
1. Crie APENAS o esqueleto — zero feature de negócio.
2. A HomePage é um placeholder textual, não um app funcional.
3. Espelhe a estrutura do dfl-iterate (pastas e fluxo de dados), mas sem copiar código do iterate.
4. Use Vite + React + TypeScript + Tailwind + React Router + React Query.
5. Configure alias @/ no Vite e tsconfig.
6. services/ e test-utils/ têm README explicando o padrão, sem arquivos .dummy.ts preenchidos.
7. queryKeys.ts exporta objeto vazio comentado com exemplo.
8. types/index.ts só com comentário de exemplo.
9. Escreva README.md completo para o fellow.
10. Ao final, rode: npm install && npm run build && npx tsc --noEmit

NÃO FAÇA:
- shadcn init completo
- Componentes de UI além do placeholder
- Dados dummy reais
- Testes extensos
- Copiar package.json do dfl-iterate

ENTREGÁVEL:
Repo clonável onde o fellow escolhe Todo/galeria/livros e implementa do zero com mentoria.
```

---

## 9. Fluxo pós-clone (para o mentor — aula de 1h)

Este starter foi pensado para a aula **“setup + primeiro código”**:

| Tempo | Atividade |
|---|---|
| 0–10 min | Clone, `npm install`, `npm run dev`, tour das pastas |
| 10–20 min | Fellow escolhe projeto (Todo / galeria / livros) |
| 20–45 min | Mentor auxilia: criar `types` + primeiro componente + hook com `useState` |
| 45–55 min | Mostrar onde entrarão dummy → service → `useGet*` (ler READMEs das pastas) |
| 55–60 min | Primeiro commit + branch `nome/feat/setup-inicial` |

**Próximas aulas:** migrar de `useState` para fluxo completo com dummy + service + React Query.

---

## 10. Mapa mental: starter → iterate

```txt
dfl-react-starter              dfl-iterate (referência futura)
─────────────────────────────────────────────────────────────
src/pages/HomePage.tsx    →    src/pages/HomePage.tsx
src/components/           →    src/components/data-layer/ (visual)
src/hooks/useGet*.ts      →    src/hooks/useLessons.ts
src/services/*.service.ts →    src/services/lessons.service.ts
src/test-utils/*.dummy.ts →    src/test-utils/lessons.dummy.ts
src/lib/queryKeys.ts      →    src/lib/queryKeys.ts
src/types/                →    src/types/index.ts
```

O fellow que domina o starter está preparado para o batch **T1–T11 (camada de dados)** no iterate.

---

## 11. Nome e metadados sugeridos do repo

| Campo | Valor sugerido |
|---|---|
| Nome do repo | `dfl-react-starter` |
| Descrição GitHub | Starter React (Vite + TS + Tailwind + React Query) — padrão DevFellowship para projetos de aprendizado |
| Template repo | Marcar como **Template repository** no GitHub |
| Licença | Mesma da org ou MIT |
| Branch default | `main` |

---

*Documento gerado para o programa DFL Dev Journey. Publicar na Wiki DevFellowship se fellows não tiverem acesso à pasta `docs/`.*

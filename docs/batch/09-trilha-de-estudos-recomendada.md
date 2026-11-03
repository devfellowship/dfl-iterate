# Trilha de Estudos Recomendada

## Quando usar este documento

Use este material como guia de estudo paralelo ao bloco de tasks.

Objetivo: garantir que cada fellow entenda a teoria por trás da implementação, e não apenas copie estrutura de código.

---

## Resumo rápido

Para executar bem as tasks deste bloco, você precisa dominar:

1. Fundamentos de JavaScript assíncrono
2. Tipagem com TypeScript
3. Hooks e renderização condicional no React
4. Fluxo em camadas (`componente -> hook -> service`)
5. React Query (`useQuery`, `queryKey`, `refetch`, estados)
6. Tratamento de loading/erro/empty
7. Fluxo de PR e revisão técnica

---

## 1) Fundamentos de JavaScript (base obrigatória)

### O que estudar

- Tipos primitivos, objetos e arrays
- Funções e arrow functions
- Métodos de array: `map`, `filter`, `find`, `reduce`
- Desestruturação
- Optional chaining (`?.`) e nullish coalescing (`??`)

### Por que isso importa neste bloco

Esses recursos aparecem o tempo todo em:

- services que filtram/ordenam dados;
- componentes que iteram listas;
- tratamento de valores opcionais retornados pelas queries.

---

## 2) JavaScript assíncrono

### O que estudar

- `Promise`
- `async/await`
- `try/catch`
- `throw new Error(...)`

### Por que isso importa neste bloco

Services do projeto são assíncronos e podem falhar.
React Query depende desse contrato para converter falha em `isError`.

Sem entender isso, o fellow tende a retornar `null` em vez de `throw`, e perde o fluxo correto de erro.

---

## 3) TypeScript aplicado ao frontend

### O que estudar

- `interface` e `type`
- Tipagem de função e retorno (`Promise<T>`)
- Tipos opcionais
- Narrowing com guards (`if (!data) return ...`)
- Diferença entre `undefined`, `null` e erro

### Por que isso importa neste bloco

Sem tipagem clara, o fluxo de dados fica ambíguo e os bugs aumentam (principalmente em loading/erro).

---

## 4) React essencial (foco em leitura de estado)

### O que estudar

- Componentes funcionais
- Props
- `useState` e `useEffect`
- Regras dos hooks
- Renderização condicional

### Por que isso importa neste bloco

O componente precisa tomar decisões de UI com base no estado da query:

- carregando;
- erro;
- vazio;
- sucesso.

---

## 5) React Router (nível necessário para as tasks)

### O que estudar

- `useNavigate`
- `useParams`
- Rotas com parâmetros

### Por que isso importa neste bloco

Tasks como `useLesson(lessonId)` e navegação da Home dependem de leitura de parâmetro e redirecionamento.

---

## 6) Arquitetura em camadas no frontend

### O que estudar

- Separação de responsabilidades
- Camadas e contratos
- Acoplamento vs desacoplamento

### Mapa oficial deste projeto

- **Componente/Página**: renderiza e decide UX
- **Hook de query**: conecta UI com service
- **Service**: busca/prepara dados
- **Dummy/API**: fonte de dados

### Por que isso importa neste bloco

Esse é o padrão que prepara para times reais.
Quando a API mudar, você troca service, não a aplicação inteira.

---

## 7) React Query (núcleo deste bloco)

### O que estudar

- Conceito de server state
- `useQuery`
- `queryKey` e `queryFn`
- `isPending`, `isError`, `data`, `isFetching`
- `refetch`
- cache e invalidação (conceito)

### Por que isso importa neste bloco

React Query é a peça central do novo fluxo de dados.
Ele elimina grande parte da lógica manual de loading/caching e padroniza comportamento.

---

## 8) Camada de services (Data Access Layer)

### O que estudar

- Funções puras de dados
- Services assíncronos
- Erro semântico com `throw`
- Simulação de latência

### Por que isso importa neste bloco

Service é o ponto de troca entre dummy e API real.
Se essa camada estiver bem feita, migração futura fica muito simples.

---

## 9) Estados de UX para dados assíncronos

### O que estudar

- Loading state
- Error state
- Empty state
- Mensagens de feedback claras

### Por que isso importa neste bloco

Mesmo com backend e query corretos, UX ruim gera percepção de bug.
Qualidade visual de estado é parte da entrega técnica.

---

## 10) Padrões de naming e organização

### O que estudar

- Convenções de nomes de hook (`useXxx`)
- Convenções de service (`xxx.service.ts`)
- Estrutura de pastas
- `queryKeys` centralizado

### Por que isso importa neste bloco

Naming padronizado reduz dúvidas, facilita review e aumenta velocidade do time.

---

## 11) Git/GitHub para execução de task

### O que estudar

- Branch por task
- Commits pequenos e claros
- Pull Request com contexto
- Responder review e atualizar PR

### Por que isso importa neste bloco

Não basta implementar: precisa entregar no fluxo colaborativo do time.

---

## 12) Leitura e escrita de PR técnica

### O que estudar

- Como descrever “o que” e “por que”
- Como registrar validação (`tsc`, `lint`, passos manuais)
- Como explicitar risco e trade-off

### Por que isso importa neste bloco

PR boa reduz ida e volta de review e acelera merge.

---

## 13) Debugging aplicado ao contexto do bloco

### O que estudar

- Diagnóstico por camada (componente, hook, service)
- Problemas comuns de query key
- Erros de tipagem e estado

### Por que isso importa neste bloco

A maior parte dos travamentos em React Query é resolvida com diagnóstico básico disciplinado.

---

## Ordem sugerida de estudo (sequência)

1. JavaScript assíncrono (`Promise`, `async/await`, `throw`)
2. TypeScript (interfaces, função tipada, retorno)
3. React (hooks e render condicional)
4. Arquitetura em camadas
5. React Query (foco principal)
6. Loading/erro/empty
7. Naming e organização
8. Git/PR/review
9. Debugging

---

## Como saber se você está pronto para implementar as tasks

Você está pronto quando consegue explicar com suas palavras:

- por que `queryKey` não deve ser string solta;
- por que service deve ser `async` e sem React;
- por que “não encontrado” deve usar `throw new Error`;
- como renderizar `loading -> error -> success/empty`;
- como montar um novo `useXxx` copiando o padrão do `useLessons`.

Se você ainda travar em algum desses itens, volte para os docs do batch e revise pela ordem sugerida.

---

## Referências internas do projeto (abrir em paralelo)

- `src/services/lessons.service.ts`
- `src/lib/queryKeys.ts`
- `src/hooks/useLessons.ts`
- `src/pages/HomePage.tsx`
- `docs/batch/02-guia-do-padrao-ouro-react-query.md`
- `docs/batch/03-receita-passo-a-passo-criar-novo-fluxo-de-dados.md`
- `docs/batch/08-faq-e-troubleshooting-react-query.md`

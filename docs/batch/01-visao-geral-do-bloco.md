# Visão Geral da Trilha de Dados

## Quando usar este documento

Leia este arquivo no início do bloco para entender:

- por que estamos entrando em camada de dados agora;
- o que muda no jeito de programar;
- o que você precisa entregar nas tasks.

## Resumo em 5 pontos

- Até aqui, você aprendeu bem o padrão "componente visual + hook de lógica".
- Agora vamos aprender o padrão "de onde vem o dado e como ele chega na tela".
- O fluxo oficial do projeto é: `componente -> hook de query -> service -> dummy/api`.
- React Query entra para resolver cache, loading, erro e refetch de forma padronizada.
- O objetivo final é você conseguir criar esse fluxo sozinho em qualquer feature.

---

## O que já foi aprendido (blocos anteriores)

Você já praticou:

- separação de responsabilidades em componentes de activity;
- hooks customizados para lógica de interação;
- tipagem básica com TypeScript;
- fluxo de PR e revisão.

Isso foi o **padrão vertical**:

- cada activity tem seu próprio componente;
- cada activity tem seu próprio hook de comportamento.

Exemplo mental:

- `FillTheBlanks.tsx` cuida da interface;
- `useFillTheBlanks.ts` cuida da regra da activity.

---

## O que entra agora (bloco atual)

Agora vamos aprender o **padrão horizontal de dados**:

- como buscar dados;
- como organizar cache;
- como tratar loading e erro sem gambiarra;
- como manter o código pronto para trocar dummy por API real.

Fluxo oficial:

1. **Componente** pede dados.
2. **Hook de query** (`useQuery`) conecta UI com a camada de dados.
3. **Service** executa a leitura (hoje no dummy, amanhã via fetch).
4. **Componente** renderiza estados (`isPending`, `isError`, `data`).

---

## Por que isso importa na vida real

Sem esse padrão, times sofrem com:

- import direto de dummy em várias telas;
- lógica de loading/erro duplicada e inconsistente;
- bugs de cache por chave solta;
- refactors caros quando backend muda.

Com esse padrão:

- fica fácil trocar fonte de dados;
- o código fica previsível para qualquer dev do time;
- review fica mais rápido;
- onboarding de novos fellows acelera.

---

## O que você vai construir nas tasks

Cada task deste bloco, em geral, segue este "combo":

1. tipo (quando necessário) em `src/types/`;
2. dummy em `src/test-utils/` (se for feature nova);
3. service em `src/services/`;
4. query key em `src/lib/queryKeys.ts`;
5. hook `useXxx` em `src/hooks/`;
6. consumo no componente/página com estados de query.

---

## Referência oficial para copiar padrão

Arquivos que você deve abrir lado a lado antes de codar:

- `src/services/lessons.service.ts`
- `src/lib/queryKeys.ts`
- `src/hooks/useLessons.ts`
- `src/pages/HomePage.tsx`

Se o seu código ficar estruturalmente parecido com essa cadeia, você está no caminho certo.

---

## Definition of Done (DoD) do bloco

Uma entrega só está pronta quando:

- segue o fluxo `component -> query hook -> service`;
- não importa dummy direto no componente;
- trata `isPending` e `isError`;
- usa `queryKeys` centralizado;
- passa em `npx tsc --noEmit` e `npm run lint`;
- PR tem descrição clara com o "por que" da mudança.

---

## Mapa da trilha (o que vem depois)

Depois que este bloco consolidar:

- você estará pronto para tasks mais próximas de projeto real;
- será mais fácil conectar com backend externo;
- conseguirá participar de demandas internas e externas com menos suporte do mentor.

Esse é o objetivo principal: **autonomia com padrão de time**.

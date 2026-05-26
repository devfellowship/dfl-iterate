/**
 * Fonte única de feedback exibido ao aluno durante uma lição.
 *
 * Cada chave representa um momento do fluxo (ex: aluno acertou a atividade,
 * aluno pediu uma dica, AI está gerando código). Os campos OPCIONAIS abaixo
 * indicam em quais canais a mensagem aparece:
 *
 * - `streamText`    → texto longo, streamado na sidebar de AI (markdown OK)
 * - `modalMessage`  → texto curto exibido no ResultModal quando o aluno
 *                     conclui uma atividade (sem markdown)
 * - `isSuccess`     → indica se este feedback representa sucesso ou falha
 *                     (usado apenas pelo ResultModal hoje)
 * - `streamDelayMs` → velocidade do stream em ms (default ~1500)
 *
 * Convenções no projeto:
 * - Chaves de CONCLUSÃO de atividade têm `isSuccess` + `modalMessage`
 *   (e, geralmente, `streamText` também).
 * - Chaves de AÇÃO avulsa (pedir dica, regenerar) têm APENAS `streamText`.
 * - `default-success` / `default-failure` são fallbacks usados quando nenhuma
 *   chave específica é passada.
 *
 * Padrão de nomes: `<activity-type-em-kebab>-<outcome>`.
 * Ex.: `fill-the-blanks-success`, `decision-fork-zustand`, `break-and-fix-hint`.
 */
export interface ActivityFeedback {
  isSuccess?: boolean;
  modalMessage?: string;
  streamText?: string;
  streamDelayMs?: number;
}

export const activityFeedback: Record<string, ActivityFeedback> = {
  // === Quality Review ===
  'quality-review-generate': {
    streamText: `Gerando componente Header para BoxShop...

Analisando requisitos:
- Logo do e-commerce
- Navegação principal
- Indicador do carrinho

Criando estrutura semântica...

\`\`\`tsx
import React from 'react';

function Header() {
  return (
    <div style={{background: 'white', padding: '20px'}}>
      <img src="/logo.png" />
      <div>
        <a href="/">Home</a>
        <a href="/products">Produtos</a>
        <a href="/cart">Carrinho (3)</a>
      </div>
    </div>
  )
}

export default Header;
\`\`\`

✅ Componente gerado! Revise o código antes de aprovar.`,
    streamDelayMs: 2000,
  },

  'quality-review-approve': {
    isSuccess: false,
    modalMessage: `Você aprovou o código, mas existem alguns problemas:

1. **Acessibilidade**: A imagem não tem atributo \`alt\`
2. **Semântica**: Usando \`<div>\` ao invés de \`<header>\` e \`<nav>\`
3. **Manutenibilidade**: Inline styles dificultam manutenção
4. **TypeScript**: Sem tipagem adequada

Dica: Na próxima vez, verifique esses pontos antes de aprovar.`,
    streamText: `⚠️ Você aprovou o código, mas existem alguns problemas:

1. **Acessibilidade**: A imagem não tem atributo \`alt\`
2. **Semântica**: Usando \`<div>\` ao invés de \`<header>\` e \`<nav>\`
3. **Manutenibilidade**: Inline styles dificultam manutenção
4. **TypeScript**: Sem tipagem adequada

Dica: Na próxima vez, verifique esses pontos antes de aprovar.

O código foi aplicado, mas considere refatorar depois.`,
    streamDelayMs: 1500,
  },

  'quality-review-edit': {
    isSuccess: true,
    modalMessage: `Excelente! Você identificou os problemas e corrigiu manualmente.

Pontos que você melhorou:
• Semântica HTML correta
• Acessibilidade com alt text
• Código mais manutenível

Isso é o que diferencia um dev júnior de um pleno: **revisar criticamente** o output da IA.`,
    streamText: `✅ Excelente! Você identificou problemas e corrigiu manualmente.

Pontos que você melhorou:
- Semântica HTML correta
- Acessibilidade com alt text
- Código mais manutenível

Isso é o que diferencia um dev júnior de um pleno: **revisar criticamente** o output da IA.

Próxima activity desbloqueada!`,
    streamDelayMs: 1500,
  },

  // === Constrained Edit ===
  'constrained-edit-success': {
    isSuccess: true,
    modalMessage: `Ótimo trabalho na refatoração!

Você aplicou corretamente:
• \`useMemo\` para evitar recálculos desnecessários
• \`useCallback\` para memoizar o handler

Performance é crucial em listas grandes. Esses patterns vão te salvar em produção.`,
    streamText: `✅ Perfeito! Você otimizou o ProductCard corretamente.

Mudanças aplicadas:
- \`useMemo\` para memoizar o preço formatado
- \`useCallback\` para estabilizar a função de adicionar ao carrinho

O componente agora evita re-renders desnecessários. Próxima activity desbloqueada!`,
    streamDelayMs: 1500,
  },

  // === Decision Fork ===
  'decision-fork-context': {
    isSuccess: true,
    modalMessage: `Boa escolha! Context + useReducer é a abordagem nativa do React.

**Prós:**
• Zero dependências extras
• Familiar pra maioria dos devs
• Ótimo pra estados simples/médios

**Contras:**
• Pode causar re-renders desnecessários
• Mais boilerplate que Zustand

Não existe escolha "errada" aqui - cada abordagem tem trade-offs.`,
    streamText: `🎯 Você escolheu React Context + useReducer

Uma escolha sólida! Esta abordagem:
- ✅ Zero dependências extras
- ✅ Padrão bem documentado
- ✅ Bom para estados médios

Trade-offs:
- ⚠️ Re-renders em todos os consumers quando o contexto muda
- ⚠️ Pode ficar verboso com estados complexos

Criando arquivos: CartContext.tsx e useCart.ts...`,
    streamDelayMs: 1800,
  },

  'decision-fork-zustand': {
    isSuccess: true,
    modalMessage: `Boa escolha! Zustand é uma opção leve e pragmática.

**Prós:**
• API minimalista
• Sem boilerplate
• Re-renders otimizados por padrão

**Contras:**
• Dependência externa
• Menos "React way"

Não existe escolha "errada" aqui - cada abordagem tem trade-offs.`,
    streamText: `🎯 Você escolheu Zustand

Excelente escolha! Esta abordagem:
- ✅ API minimalista e intuitiva
- ✅ Seleção granular de estado (sem re-renders extras)
- ✅ TypeScript first

Trade-offs:
- ⚠️ Dependência externa (3kb gzipped)
- ⚠️ Menos "React-like"

Criando arquivo: stores/cartStore.ts...`,
    streamDelayMs: 1800,
  },

  'decision-fork-localstorage': {
    isSuccess: true,
    modalMessage: `Escolha pragmática! LocalStorage + Custom Hook.

**Prós:**
• Persistência automática
• Funciona offline
• Zero dependências

**Contras:**
• Sincronia entre abas requer mais código
• Limite de 5MB por origem

Solução simples e eficaz para muitos casos!`,
    streamText: `🎯 Você escolheu LocalStorage + Custom Hook

Escolha pragmática! Esta abordagem:
- ✅ Persistência automática
- ✅ Funciona offline
- ✅ Zero dependências

Trade-offs:
- ⚠️ Sincronia entre abas requer mais código
- ⚠️ Limite de 5MB por origem

Criando arquivo: hooks/usePersistedCart.ts...`,
    streamDelayMs: 1800,
  },

  // === Break & Fix ===
  'break-and-fix-hint': {
    streamText: `🔍 Analisando o erro...

O erro "Cannot read property 'map' of undefined" indica que você está tentando iterar sobre algo que é \`undefined\`.

Dica: Quando consumimos dados de um hook ou contexto, precisamos garantir que os dados existem antes de usá-los. Considere:
- Valores default
- Optional chaining (\`?.\`)
- Early return com loading state`,
    streamDelayMs: 1400,
  },

  'break-and-fix-success': {
    isSuccess: true,
    modalMessage: `Debug finalizado com sucesso! 🎉

Você identificou que \`items\` podia ser \`undefined\` e adicionou:
• Optional chaining ou
• Default value ou
• Early return

Esse tipo de bug é MUITO comum quando se usa dados de APIs ou stores. Sempre valide antes de iterar!`,
    streamText: `✅ Bug corrigido! Projeto funcionando novamente.

Você aplicou defensive coding:
- Adicionou fallback para array vazio
- Ou usou optional chaining

Esta é uma lição importante: **nunca confie que dados externos existem**. Sempre valide antes de usar.

🎉 Parabéns! Você completou todas as activities desta lesson!`,
    streamDelayMs: 1600,
  },

  'break-and-fix-failure': {
    isSuccess: false,
    modalMessage: `O projeto ainda está quebrado.

**Erro:** \`TypeError: Cannot read property 'map' of undefined\`

Isso significa que \`items\` é \`undefined\` quando o código tenta fazer \`.map()\`.

**Dica:** Como você pode garantir que \`items\` sempre seja um array antes de iterar?`,
  },

  // === Fill The Blanks ===
  'fill-the-blanks-success': {
    isSuccess: true,
    streamText: `✅ Todas as lacunas preenchidas corretamente.

Você não só completou o código — você entendeu **por que** cada peça vai onde vai. Esse exercício treina o que mais aparece no dia a dia: ler um snippet existente e completar com o valor/símbolo certo.

Próxima atividade desbloqueada.`,
    streamDelayMs: 1500,
  },

  'fill-the-blanks-failure': {
    isSuccess: false,
    streamText: `❌ Algumas lacunas ainda não estão certas.

Como revisar sem chutar:
- Olhe o **contexto** ao redor da lacuna (o que está antes e depois?).
- Pergunte: *"qual valor ou símbolo faz esta linha compilar e funcionar?"*
- As lacunas em vermelho mostram exatamente quais corrigir.

Ajuste e clique em **Validar código** de novo. Você pode tentar quantas vezes precisar.`,
    streamDelayMs: 1500,
  },

  // === Step Through ===
  'step-through-success': {
    isSuccess: true,
    streamText: `✅ Você simulou a execução do código corretamente, linha por linha.

Esse exercício treina o que mais diferencia um dev iniciante de um dev sênior: **rodar o código mentalmente** antes de pedir pro computador rodar.

Toda vez que você revisar um PR, leia assim — passo a passo — em vez de só olhar o diff geral.`,
    streamDelayMs: 1500,
  },

  'step-through-failure': {
    isSuccess: false,
    streamText: `❌ Algum dos valores não bateu com a execução real.

Dica para revisar:
- Volte ao primeiro step e confira o estado inicial das variáveis.
- Em cada linha, pergunte: *"qual variável muda aqui e para qual valor?"*
- Atribuição (\`=\`) acontece **depois** que o lado direito é calculado.

Tente de novo — você consegue rastrear linha por linha.`,
    streamDelayMs: 1500,
  },

  // === Fix With Choices ===
  'fix-with-choices-success': {
    isSuccess: true,
    modalMessage: `Excelente! 🎉
  Você identificou corretamente o problema e aplicou a solução ideal.

  Continue assim!`,
  },

  'fix-with-choices-failure': {
    isSuccess: false,
    modalMessage: `Quase lá! 😅

  A correção escolhida não resolve completamente o problema.

  Revise a lógica e tente novamente.`,
  },

  // === Video Challenge ===
  'video-challenge-success': {
    isSuccess: true,
    modalMessage: `Excelente aplicação do useMemo! 🎬

Você aprendeu com o vídeo e aplicou corretamente:
• \`useMemo\` para memoizar o array filtrado
• \`useMemo\` para cachear o cálculo do total
• Dependências corretas no array de deps

Isso evita recálculos a cada re-render. Performance importa!`,
  },

  // === Visual Implementation ===
  'visual-implementation-success': {
    isSuccess: true,
    modalMessage: `Design implementado com sucesso! 🎨

Você replicou o visual de referência:
• Cores e tipografia corretas
• Espaçamentos proporcionais
• Animações suaves

Transformar design em código é uma habilidade essencial. Você está evoluindo!`,
  },

  // === Fix the Code ===
  'fix-the-code-success': {
    isSuccess: true,
    modalMessage: `Ótimo trabalho! Você corrigiu o algoritmo e os testes passaram.

Sempre escreva casos de teste para código crítico – isso ajuda a encontrar bugs cedo!`,
  },

  // === Spot The Bug ===
  'spot-the-bug-success': {
    isSuccess: true,
    modalMessage: `Excelente olho clínico! 🎉

Saber identificar esses detalhes rapidamente é uma habilidade essencial — evita bugs em produção e poupa tempo de todo o time.`,
  },

  'spot-the-bug-failure': {
    isSuccess: false,
    modalMessage: `Ops, essa linha parece estar correta.

**Dicas para encontrar o bug:**
• Verifique se as variáveis usadas foram realmente declaradas.
• Olhe atentamente para os nomes das propriedades (TYPOS são comuns!).
• Erros de sintaxe ou referências nulas costumam se esconder em operações de Array.`,
  },

  // === Defaults (fallbacks quando a chave específica não é passada) ===
  'default-success': {
    isSuccess: true,
    modalMessage: `Muito bem! Você completou a atividade com sucesso.

Continue assim e você estará dominando esses conceitos em pouco tempo!`,
  },

  'default-failure': {
    isSuccess: false,
    modalMessage: `Não foi dessa vez, mas continue tentando!

Revise o código com atenção e tente identificar o que pode ser melhorado.`,
  },
};

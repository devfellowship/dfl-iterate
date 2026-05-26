export const aiResponses: Record<string, { text: string; delay: number }> = {
  'quality-review-generate': {
    text: `Gerando componente Header para BoxShop...

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
    delay: 2000,
  },

  'quality-review-approve': {
    text: `⚠️ Você aprovou o código, mas existem alguns problemas:

1. **Acessibilidade**: A imagem não tem atributo \`alt\`
2. **Semântica**: Usando \`<div>\` ao invés de \`<header>\` e \`<nav>\`
3. **Manutenibilidade**: Inline styles dificultam manutenção
4. **TypeScript**: Sem tipagem adequada

Dica: Na próxima vez, verifique esses pontos antes de aprovar.

O código foi aplicado, mas considere refatorar depois.`,
    delay: 1500,
  },

  'quality-review-edit': {
    text: `✅ Excelente! Você identificou problemas e corrigiu manualmente.

Pontos que você melhorou:
- Semântica HTML correta
- Acessibilidade com alt text
- Código mais manutenível

Isso é o que diferencia um dev júnior de um pleno: **revisar criticamente** o output da IA.

Próxima activity desbloqueada!`,
    delay: 1500,
  },

  'constrained-edit-success': {
    text: `✅ Perfeito! Você otimizou o ProductCard corretamente.

Mudanças aplicadas:
- \`useMemo\` para memoizar o preço formatado
- \`useCallback\` para estabilizar a função de adicionar ao carrinho

O componente agora evita re-renders desnecessários. Próxima activity desbloqueada!`,
    delay: 1500,
  },

  'decision-fork-context': {
    text: `🎯 Você escolheu React Context + useReducer

Uma escolha sólida! Esta abordagem:
- ✅ Zero dependências extras
- ✅ Padrão bem documentado
- ✅ Bom para estados médios

Trade-offs:
- ⚠️ Re-renders em todos os consumers quando o contexto muda
- ⚠️ Pode ficar verboso com estados complexos

Criando arquivos: CartContext.tsx e useCart.ts...`,
    delay: 1800,
  },

  'decision-fork-zustand': {
    text: `🎯 Você escolheu Zustand

Excelente escolha! Esta abordagem:
- ✅ API minimalista e intuitiva
- ✅ Seleção granular de estado (sem re-renders extras)
- ✅ TypeScript first

Trade-offs:
- ⚠️ Dependência externa (3kb gzipped)
- ⚠️ Menos "React-like"

Criando arquivo: stores/cartStore.ts...`,
    delay: 1800,
  },

  'decision-fork-localstorage': {
    text: `🎯 Você escolheu LocalStorage + Custom Hook

Escolha pragmática! Esta abordagem:
- ✅ Persistência automática
- ✅ Funciona offline
- ✅ Zero dependências

Trade-offs:
- ⚠️ Sincronia entre abas requer mais código
- ⚠️ Limite de 5MB por origem

Criando arquivo: hooks/usePersistedCart.ts...`,
    delay: 1800,
  },

  'break-and-fix-hint': {
    text: `🔍 Analisando o erro...

O erro "Cannot read property 'map' of undefined" indica que você está tentando iterar sobre algo que é \`undefined\`.

Dica: Quando consumimos dados de um hook ou contexto, precisamos garantir que os dados existem antes de usá-los. Considere:
- Valores default
- Optional chaining (\`?.\`)
- Early return com loading state`,
    delay: 1400,
  },

  'break-and-fix-success': {
    text: `✅ Bug corrigido! Projeto funcionando novamente.

Você aplicou defensive coding:
- Adicionou fallback para array vazio
- Ou usou optional chaining

Esta é uma lição importante: **nunca confie que dados externos existem**. Sempre valide antes de usar.

🎉 Parabéns! Você completou todas as activities desta lesson!`,
    delay: 1600,
  },

  'fill-the-blanks-success': {
    text: `✅ Todas as lacunas preenchidas corretamente.

Você não só completou o código — você entendeu **por que** cada peça vai onde vai. Esse exercício treina o que mais aparece no dia a dia: ler um snippet existente e completar com o valor/símbolo certo.

Próxima atividade desbloqueada.`,
    delay: 1500,
  },

  'fill-the-blanks-failure': {
    text: `❌ Algumas lacunas ainda não estão certas.

Como revisar sem chutar:
- Olhe o **contexto** ao redor da lacuna (o que está antes e depois?).
- Pergunte: *"qual valor ou símbolo faz esta linha compilar e funcionar?"*
- As lacunas em vermelho mostram exatamente quais corrigir.

Ajuste e clique em **Validar código** de novo. Você pode tentar quantas vezes precisar.`,
    delay: 1500,
  },

  'step-through-success': {
    text: `✅ Você simulou a execução do código corretamente, linha por linha.

Esse exercício treina o que mais diferencia um dev iniciante de um dev sênior: **rodar o código mentalmente** antes de pedir pro computador rodar.

Toda vez que você revisar um PR, leia assim — passo a passo — em vez de só olhar o diff geral.`,
    delay: 1500,
  },

  'step-through-failure': {
    text: `❌ Algum dos valores não bateu com a execução real.

Dica para revisar:
- Volte ao primeiro step e confira o estado inicial das variáveis.
- Em cada linha, pergunte: *"qual variável muda aqui e para qual valor?"*
- Atribuição (\`=\`) acontece **depois** que o lado direito é calculado.

Tente de novo — você consegue rastrear linha por linha.`,
    delay: 1500,
  },
};

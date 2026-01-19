export const aiResponses: Record<string, { text: string; delay: number }> = {
  'act-1-generate': {
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
  
  'act-1-feedback-approve': {
    text: `⚠️ Você aprovou o código, mas existem alguns problemas:

1. **Acessibilidade**: A imagem não tem atributo \`alt\`
2. **Semântica**: Usando \`<div>\` ao invés de \`<header>\` e \`<nav>\`
3. **Manutenibilidade**: Inline styles dificultam manutenção
4. **TypeScript**: Sem tipagem adequada

Dica: Na próxima vez, verifique esses pontos antes de aprovar.

O código foi aplicado, mas considere refatorar depois.`,
    delay: 1500,
  },
  
  'act-1-feedback-edit': {
    text: `✅ Excelente! Você identificou problemas e corrigiu manualmente.

Pontos que você melhorou:
- Semântica HTML correta
- Acessibilidade com alt text
- Código mais manutenível

Isso é o que diferencia um dev júnior de um pleno: **revisar criticamente** o output da IA.

Próxima activity desbloqueada!`,
    delay: 1500,
  },

  'act-2-hint': {
    text: `💡 Dica: Para evitar recálculos desnecessários, considere usar \`useMemo\` para valores computados.

Para funções que são passadas como props ou usadas em event handlers, \`useCallback\` pode ajudar a manter a referência estável.

Lembre-se: otimização prematura é a raiz de todo mal, mas em componentes que re-renderizam frequentemente (como cards em uma lista), essas otimizações fazem diferença!`,
    delay: 1200,
  },

  'act-2-success': {
    text: `✅ Perfeito! Você otimizou o ProductCard corretamente.

Mudanças aplicadas:
- \`useMemo\` para memoizar o preço formatado
- \`useCallback\` para estabilizar a função de adicionar ao carrinho

O componente agora evita re-renders desnecessários. Próxima activity desbloqueada!`,
    delay: 1500,
  },

  'act-3-context': {
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

  'act-3-zustand': {
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

  'act-3-localstorage': {
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

  'act-4-hint': {
    text: `🔍 Analisando o erro...

O erro "Cannot read property 'map' of undefined" indica que você está tentando iterar sobre algo que é \`undefined\`.

Dica: Quando consumimos dados de um hook ou contexto, precisamos garantir que os dados existem antes de usá-los. Considere:
- Valores default
- Optional chaining (\`?.\`)
- Early return com loading state`,
    delay: 1400,
  },

  'act-4-success': {
    text: `✅ Bug corrigido! Projeto funcionando novamente.

Você aplicou defensive coding:
- Adicionou fallback para array vazio
- Ou usou optional chaining

Esta é uma lição importante: **nunca confie que dados externos existem**. Sempre valide antes de usar.

🎉 Parabéns! Você completou todas as activities desta lesson!`,
    delay: 1600,
  },
};

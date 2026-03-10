export interface AIMessageTemplate {
  isSuccess: boolean;
  message: string;
}

export const aiMessageTemplates: Record<string, AIMessageTemplate> = {
  // Quality Review - Aprovou código ruim
  'act-1-feedback-approve': {
    isSuccess: false,
    message: `Você aprovou o código, mas existem alguns problemas:

1. **Acessibilidade**: A imagem não tem atributo \`alt\`
2. **Semântica**: Usando \`<div>\` ao invés de \`<header>\` e \`<nav>\`
3. **Manutenibilidade**: Inline styles dificultam manutenção
4. **TypeScript**: Sem tipagem adequada

Dica: Na próxima vez, verifique esses pontos antes de aprovar.`,
  },
  
  // Quality Review - Editou manualmente
  'act-1-feedback-edit': {
    isSuccess: true,
    message: `Excelente! Você identificou os problemas e corrigiu manualmente.

Pontos que você melhorou:
• Semântica HTML correta
• Acessibilidade com alt text
• Código mais manutenível

Isso é o que diferencia um dev júnior de um pleno: **revisar criticamente** o output da IA.`,
  },
  
  // Constrained Edit - Sucesso
  'act-2-success': {
    isSuccess: true,
    message: `Ótimo trabalho na refatoração!

Você aplicou corretamente:
• \`useMemo\` para evitar recálculos desnecessários
• \`useCallback\` para memoizar o handler

Performance é crucial em listas grandes. Esses patterns vão te salvar em produção.`,
  },
  
  // Decision Fork - Context
  'act-3-context': {
    isSuccess: true,
    message: `Boa escolha! Context + useReducer é a abordagem nativa do React.

**Prós:**
• Zero dependências extras
• Familiar pra maioria dos devs
• Ótimo pra estados simples/médios

**Contras:**
• Pode causar re-renders desnecessários
• Mais boilerplate que Zustand

Não existe escolha "errada" aqui - cada abordagem tem trade-offs.`,
  },
  
  // Decision Fork - Zustand
  'act-3-zustand': {
    isSuccess: true,
    message: `Boa escolha! Zustand é uma opção leve e pragmática.

**Prós:**
• API minimalista
• Sem boilerplate
• Re-renders otimizados por padrão

**Contras:**
• Dependência externa
• Menos "React way"

Não existe escolha "errada" aqui - cada abordagem tem trade-offs.`,
  },

  // Decision Fork - LocalStorage
  'act-3-localstorage': {
    isSuccess: true,
    message: `Escolha pragmática! LocalStorage + Custom Hook.

**Prós:**
• Persistência automática
• Funciona offline
• Zero dependências

**Contras:**
• Sincronia entre abas requer mais código
• Limite de 5MB por origem

Solução simples e eficaz para muitos casos!`,
  },
  
  // Break & Fix - Sucesso
  'act-4-success': {
    isSuccess: true,
    message: `Debug finalizado com sucesso! 🎉

Você identificou que \`items\` podia ser \`undefined\` e adicionou:
• Optional chaining ou
• Default value ou
• Early return

Esse tipo de bug é MUITO comum quando se usa dados de APIs ou stores. Sempre valide antes de iterar!`,
  },
  
  // Break & Fix - Ainda quebrado
  'act-4-wrong': {
    isSuccess: false,
    message: `O projeto ainda está quebrado.

**Erro:** \`TypeError: Cannot read property 'map' of undefined\`

Isso significa que \`items\` é \`undefined\` quando o código tenta fazer \`.map()\`.

**Dica:** Como você pode garantir que \`items\` sempre seja um array antes de iterar?`,
  },

  // Video Challenge - Sucesso
  'act-5-success': {
    isSuccess: true,
    message: `Excelente aplicação do useMemo! 🎬

Você aprendeu com o vídeo e aplicou corretamente:
• \`useMemo\` para memoizar o array filtrado
• \`useMemo\` para cachear o cálculo do total
• Dependências corretas no array de deps

Isso evita recálculos a cada re-render. Performance importa!`,
  },

  // Visual Implementation - Sucesso
  'act-6-success': {
    isSuccess: true,
    message: `Design implementado com sucesso! 🎨

Você replicou o visual de referência:
• Cores e tipografia corretas
• Espaçamentos proporcionais
• Animações suaves

Transformar design em código é uma habilidade essencial. Você está evoluindo!`,
  },

  // Spot The Bug - Sucesso
  'spot-the-bug-success': {
    isSuccess: true,
    message: `Excelente olho clínico! 🎉 
    
Você identificou o erro de lógica no código. No dia a dia, saber ler código alheio e encontrar esses "pequenos vacilos" antes que cheguem em produção economiza horas de debug do time.`,
  },

  // Spot The Bug - Falha (DICAS)
  'spot-the-bug-fail': {
    isSuccess: false,
    message: `Ops, essa linha parece estar correta. 
    
**Dicas para encontrar o bug:**
• Verifique se as variáveis usadas foram realmente declaradas.
• Olhe atentamente para os nomes das propriedades (TYPOS são comuns!).
• Erros de sintaxe ou referências nulas costumam se esconder em operações de Array.`,
  },

  // Default success
  'default-success': {
    isSuccess: true,
    message: `Muito bem! Você completou a atividade com sucesso.

Continue assim e você estará dominando esses conceitos em pouco tempo!`,
  },

  // Default failure
  'default-failure': {
    isSuccess: false,
    message: `Não foi dessa vez, mas continue tentando!

Revise o código com atenção e tente identificar o que pode ser melhorado.`,
  },
};

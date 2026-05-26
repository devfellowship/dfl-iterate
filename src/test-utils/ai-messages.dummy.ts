export interface AIMessageTemplate {
  isSuccess: boolean;
  message: string;
}

export const aiMessageTemplates: Record<string, AIMessageTemplate> = {
  // Quality Review — aprovou código ruim
  'quality-review-approve': {
    isSuccess: false,
    message: `Você aprovou o código, mas existem alguns problemas:

1. **Acessibilidade**: A imagem não tem atributo \`alt\`
2. **Semântica**: Usando \`<div>\` ao invés de \`<header>\` e \`<nav>\`
3. **Manutenibilidade**: Inline styles dificultam manutenção
4. **TypeScript**: Sem tipagem adequada

Dica: Na próxima vez, verifique esses pontos antes de aprovar.`,
  },

  // Quality Review — editou manualmente
  'quality-review-edit': {
    isSuccess: true,
    message: `Excelente! Você identificou os problemas e corrigiu manualmente.

Pontos que você melhorou:
• Semântica HTML correta
• Acessibilidade com alt text
• Código mais manutenível

Isso é o que diferencia um dev júnior de um pleno: **revisar criticamente** o output da IA.`,
  },

  // Constrained Edit — sucesso
  'constrained-edit-success': {
    isSuccess: true,
    message: `Ótimo trabalho na refatoração!

Você aplicou corretamente:
• \`useMemo\` para evitar recálculos desnecessários
• \`useCallback\` para memoizar o handler

Performance é crucial em listas grandes. Esses patterns vão te salvar em produção.`,
  },

  // Fix With Choices — sucesso
  'fix-with-choices-success': {
    isSuccess: true,
    message: `Excelente! 🎉
  Você identificou corretamente o problema e aplicou a solução ideal.

  Continue assim!`,
  },

  // Fix With Choices — falha
  'fix-with-choices-failure': {
    isSuccess: false,
    message: `Quase lá! 😅

  A correção escolhida não resolve completamente o problema.

  Revise a lógica e tente novamente.`,
  },

  // Decision Fork — Context
  'decision-fork-context': {
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

  // Decision Fork — Zustand
  'decision-fork-zustand': {
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

  // Decision Fork — LocalStorage
  'decision-fork-localstorage': {
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

  // Break & Fix — sucesso
  'break-and-fix-success': {
    isSuccess: true,
    message: `Debug finalizado com sucesso! 🎉

Você identificou que \`items\` podia ser \`undefined\` e adicionou:
• Optional chaining ou
• Default value ou
• Early return

Esse tipo de bug é MUITO comum quando se usa dados de APIs ou stores. Sempre valide antes de iterar!`,
  },

  // Break & Fix — ainda quebrado
  'break-and-fix-failure': {
    isSuccess: false,
    message: `O projeto ainda está quebrado.

**Erro:** \`TypeError: Cannot read property 'map' of undefined\`

Isso significa que \`items\` é \`undefined\` quando o código tenta fazer \`.map()\`.

**Dica:** Como você pode garantir que \`items\` sempre seja um array antes de iterar?`,
  },

  // Video Challenge — sucesso
  'video-challenge-success': {
    isSuccess: true,
    message: `Excelente aplicação do useMemo! 🎬

Você aprendeu com o vídeo e aplicou corretamente:
• \`useMemo\` para memoizar o array filtrado
• \`useMemo\` para cachear o cálculo do total
• Dependências corretas no array de deps

Isso evita recálculos a cada re-render. Performance importa!`,
  },

  // Visual Implementation — sucesso
  'visual-implementation-success': {
    isSuccess: true,
    message: `Design implementado com sucesso! 🎨

Você replicou o visual de referência:
• Cores e tipografia corretas
• Espaçamentos proporcionais
• Animações suaves

Transformar design em código é uma habilidade essencial. Você está evoluindo!`,
  },

  // Fix the Code — sucesso
  'fix-the-code-success': {
    isSuccess: true,
    message: `Ótimo trabalho! Você corrigiu o algoritmo e os testes passaram.

Sempre escreva casos de teste para código crítico – isso ajuda a encontrar bugs cedo!`,
  },

  // Spot The Bug — sucesso
  'spot-the-bug-success': {
    isSuccess: true,
    message: `Excelente olho clínico! 🎉
    
Saber identificar esses detalhes rapidamente é uma habilidade essencial — evita bugs em produção e poupa tempo de todo o time.`,
  },

  // Spot The Bug — falha (dicas)
  'spot-the-bug-failure': {
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

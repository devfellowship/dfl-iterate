import { Activity } from '@/types';
import { ActivityType, ActivityStatus } from '@/enums';

export const activitiesData: Activity[] = [
  {
    id: 'act-1',
    lessonId: 'lesson-1',
    order: 1,
    type: ActivityType.QUALITY_REVIEW,
    title: 'Revisão do Header Gerado',
    objective: 'A IA gerou um componente Header para o BoxShop. Avalie se está pronto para produção.',
    instructions: `A IA gerou o código abaixo usando Cloud Code.

Sua missão:
1. Leia o código gerado
2. Identifique problemas (acessibilidade, performance, boas práticas)
3. Decida: aprovar, pedir nova geração, ou editar manualmente

Dica: Preste atenção em hardcoded values e falta de tipagem.`,
    targetFiles: ['src/components/Header.tsx'],
    status: ActivityStatus.CURRENT,
    aiGeneratedCode: `import React from 'react';

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

export default Header;`,
    expectedIssues: [
      'Sem atributo alt na imagem',
      'Usando inline styles',
      'Falta de semântica HTML (div ao invés de header/nav)',
      'Número do carrinho hardcoded',
      'Sem TypeScript types',
    ],
  },
  {
    id: 'act-2',
    lessonId: 'lesson-1',
    order: 2,
    type: ActivityType.CONSTRAINED_EDIT,
    title: 'Refatorando o ProductCard',
    objective: 'O ProductCard funciona, mas tem problemas de performance. Melhore sem alterar a estrutura.',
    instructions: `O componente ProductCard está causando re-renders desnecessários.

Sua missão:
1. Identifique o problema de performance
2. Edite APENAS as regiões destacadas
3. Não altere a estrutura do componente

Restrição: Você só pode editar as linhas 8-12 e 18-22.`,
    targetFiles: ['src/components/ProductCard.tsx'],
    status: ActivityStatus.LOCKED,
    editableRegions: [
      { startLine: 8, endLine: 12, hint: 'Memoize este cálculo' },
      { startLine: 18, endLine: 22, hint: 'Evite criar nova função a cada render' },
    ],
  },
  {
    id: 'act-3',
    lessonId: 'lesson-1',
    order: 3,
    type: ActivityType.DECISION_FORK,
    title: 'Arquitetura de Estado',
    objective: 'O projeto vai crescer. Escolha como gerenciar o estado do carrinho.',
    instructions: `O BoxShop precisa de gerenciamento de estado para o carrinho.

Analise as opções e escolha uma abordagem. Sua decisão afetará as próximas activities e a estrutura do projeto.

Não existe resposta "errada" - cada opção tem trade-offs.`,
    targetFiles: ['src/context/', 'src/hooks/'],
    status: ActivityStatus.LOCKED,
    options: [
      {
        id: 'opt-context',
        label: 'React Context + useReducer',
        description: 'Solução nativa do React, sem dependências extras.',
        impact: 'Criará CartContext.tsx e useCart.ts',
      },
      {
        id: 'opt-zustand',
        label: 'Zustand',
        description: 'Store minimalista, API simples, ótimo DX.',
        impact: 'Criará stores/cartStore.ts',
      },
      {
        id: 'opt-localstorage',
        label: 'LocalStorage + Custom Hook',
        description: 'Persiste automaticamente, sem setup complexo.',
        impact: 'Criará hooks/usePersistedCart.ts',
      },
    ],
  },
  {
    id: 'act-4',
    lessonId: 'lesson-1',
    order: 4,
    type: ActivityType.BREAK_AND_FIX,
    title: 'Debug: Checkout Quebrado',
    objective: 'Uma mudança automática quebrou o checkout. Encontre e corrija o problema.',
    instructions: `⚠️ PROJETO QUEBRADO

Uma atualização de dependências causou erro no checkout.
O build está falhando.

Sua missão:
1. Analise o erro no console
2. Encontre a causa raiz
3. Corrija o código para o projeto voltar a funcionar

Erro atual: "TypeError: Cannot read property 'map' of undefined"`,
    targetFiles: ['src/pages/CheckoutPage.tsx'],
    status: ActivityStatus.LOCKED,
    aiGeneratedCode: `// Código com bug intencional
import { useCart } from '@/hooks/useCart';

export function CheckoutPage() {
  const { items } = useCart(); // items pode ser undefined!
  
  const total = items.map(item => item.price * item.quantity)
    .reduce((a, b) => a + b, 0);

  return (
    <div className="checkout">
      <h1>Checkout</h1>
      {items.map(item => (
        <div key={item.id}>
          {item.name} - R$ {item.price}
        </div>
      ))}
      <p>Total: R$ {total}</p>
    </div>
  );
}`,
  },
];

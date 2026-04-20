import { Activity } from '@/types';
import { ActivityType, ActivityStatus } from '@/enums';

export const activitiesData: Activity[] = [
  {
    id: 'act-1',
    lessonId: 'lesson-1',
    order: 2,
    type: ActivityType.READ_AND_CHOOSE,
    title: 'O que esse trecho de código faz?',
    objective: '',
    instructions: `É um trecho.`,
    targetFiles: ['src/context/', 'src/hooks/'],
    status: ActivityStatus.LOCKED,
    aiGeneratedCode: `const products = [
    { name: 'Luva de Boxe Pro', price: 'R$ 299,90', emoji: '🥊' },
    { name: 'Saco de Pancada', price: 'R$ 459,90', emoji: '🎯' },
    { name: 'Bandagem Elástica', price: 'R$ 29,90', emoji: '🩹' },
    { name: 'Protetor Bucal', price: 'R$ 49,90', emoji: '😬' },
  ];`,
    choices: [
      {
        id: 'opt-list-products',
        label: 'Lista de produtos',
        description: 'Inicializa uma lista de produtos',
      },
      {
        id: 'opt-add-product',
        label: 'Adicionar produtos',
        description: 'Adiciona um novo produto à lista',
      },
      {
        id: 'opt-iterate-products',
        label: 'Itera sobre a lista de produtos',
        description: 'Itera sobre a lista de produtos e exibe no console',
      },
    ],
  },

  {
    id: 'act-2',
    lessonId: 'lesson-1',
    order: 3,
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
    status: ActivityStatus.LOCKED,
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
    bugLine: 14,
    xpReward: 25,
  },
  {
    id: 'act-3',
    lessonId: 'lesson-1',
    order: 4,
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
    id: 'act-4',
    lessonId: 'lesson-1',
    order: 5,
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
    id: 'act-5',
    lessonId: 'lesson-1',
    order: 6,
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
  {
    id: 'act-6',
    lessonId: 'lesson-1',
    order: 7,
    type: ActivityType.VIDEO_CHALLENGE,
    title: 'Aprenda useMemo na Prática',
    objective: 'Assista como um dev sênior otimiza performance e aplique o mesmo pattern.',
    instructions: 'Após assistir o vídeo, implemente useMemo no componente para evitar recálculos desnecessários.',
    targetFiles: ['src/components/ProductList.tsx'],
    status: ActivityStatus.LOCKED,
    aiGeneratedCode: `import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export function ProductList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('');
  
  // TODO: Otimize com useMemo
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  const total = filteredProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div>
      <input 
        value={filter} 
        onChange={e => setFilter(e.target.value)}
        placeholder="Filtrar produtos..."
      />
      <p>Total: R$ {total.toFixed(2)}</p>
      {filteredProducts.map(p => (
        <div key={p.id}>{p.name} - R$ {p.price}</div>
      ))}
    </div>
  );
}`,
    videoConfig: {
      youtubeId: 'ohrTAqng3uo',
      title: 'Arquitetura final do seu E-Commerce de Boxe',
      duration: '10:38',
    },
  },
  {
    id: 'act-7',
    lessonId: 'lesson-1',
    order: 8,
    type: ActivityType.VISUAL_IMPLEMENTATION,
    title: 'Implemente o Badge de Promoção',
    objective: 'Veja o design do badge de "PROMOÇÃO" e implemente o CSS.',
    instructions: 'A imagem mostra como o badge deve ficar. Escreva o CSS/JSX para replicar o design.',
    targetFiles: ['src/components/PromoBadge.tsx'],
    status: ActivityStatus.LOCKED,
    aiGeneratedCode: `// Implemente o badge de promoção
export function PromoBadge() {
  return (
    <span className="promo-badge">
      {/* TODO: Estilize para parecer com a referência */}
      PROMOÇÃO
    </span>
  );
}

// CSS esperado:
// - Fundo vermelho vibrante
// - Texto branco em caps
// - Sombra suave
// - Animação pulse sutil`,
    visualConfig: {
      imageUrl: 'https://placehold.co/400x120/dc2626/ffffff?text=🔥+PROMOÇÃO+-50%25&font=montserrat',
      caption: 'Badge de promoção - Design aprovado',
      expectedOutput: 'Badge vermelho com texto branco, sombra e animação pulse',      
    },
  },
  
  {
  id: 'act-8',
  lessonId: 'lesson-1',
  order: 7,
  type: ActivityType.SPOT_THE_BUG,
  title: 'Spot the Bug',
  objective: 'Identify the line that contains a bug in the code.',
  instructions: 'Encontre a linha que contém o bug no código abaixo e clique em confirmar.',
  targetFiles: ['src/components/ReviewManager.tsx'],
  status: ActivityStatus.LOCKED,
  bugChallenges: [
    {
      code: `import { useState } from 'react';\nexport const FormatData = (): JSX.Element => {\nconst data: number[] = [1, 2, 3];\nif (data = null) return <span>Sem dados</span>;\nreturn <div>{data.join(', ')}</div>;\n};`,
      bugLine: 4,
      explanation: 'Atribuição (=) em vez de comparação.',
      tip: 'Use === para comparar valores em condições.'
    },
    {
      code: `interface User {\nname: string;\nage: number;\n}\nexport const UserCard = (props: { user?: User }): JSX.Element => {\nreturn (\n<div>\n<h2>{props.user.name}</h2>\n<p>{props.user?.age}</p>\n</div>\n);\n};`,
      bugLine: 8,
      explanation: 'Acesso a propriedade de objeto possivelmente undefined.',
      tip: 'Use optional chaining (props.user?.name).'
    },
    {
      code: `export const Sum = (): number => {\nconst a = 5;\nconst b = 3;\nreturn\na + b;\n};`,
      bugLine: 4,
      explanation: 'Quebra de linha após o return.',
      tip: 'O JavaScript encerra o return se houver quebra de linha.'
    },
    {
      code: `export const DoubledList = (): number[] => {\nconst numbers: number[] = [1, 2, 3];\nconst result = numbers.map((n: number): number => {\nn * 2;\n});\nreturn result;\n};`,
      bugLine: 4,
      explanation: 'Falta do return dentro do map.',
      tip: 'Funções com {} precisam de return explícito.'
    },
    {
      code: `import { useState } from 'react';\nexport const Counter = (): JSX.Element => {\nconst [value, setValue] = useState<number>(0);\nconst handleClick = (): void => {\nvalue++;\n};\nreturn <button onClick={handleClick}>{value}</button>;\n};`,
      bugLine: 5,
      explanation: 'Mutação direta de estado.',
      tip: 'Use o setter: setValue(value + 1).'
    },
    {
      code: `interface Props {\nonClick: () => void;\n}\nexport const Button = (props: Props): JSX.Element => {\nreturn (\n<button onClick={props.onClick()}>\nClick\n</button>\n);\n};`,
      bugLine: 6,
      explanation: 'Função executada durante a renderização.',
      tip: 'Passe apenas a referência: onClick={props.onClick}.'
    }
  ]
},
  {
    id: 'act-9',
    lessonId: 'lesson-1',
    order: 9,
    type: ActivityType.FIX_THE_CODE,
    title: 'Corrigindo FizzBuzz',
    objective: 'O código a seguir deveria retornar a string correta para FizzBuzz, mas está incompleto.',
    instructions: `A função abaixo deveria:
- retornar "Fizz" quando o número for múltiplo de 3
- retornar "Buzz" quando múltiplo de 5
- retornar "FizzBuzz" quando múltiplo de 15
- retornar o próprio número como string nos demais casos

Corrija o algoritmo para que todos os testes passem.`,
    targetFiles: ['src/utils/fizzbuzz.ts'],
    status: ActivityStatus.LOCKED,
    aiGeneratedCode: `export function fizzbuzz(n: number): string {
  let result = '';
  if (n % 3 === 0) result += 'Fizz';
  if (n % 5 === 0) result += 'Buzz';
  return result;
}`,
    testCases: [
      { description: 'n=3 retorna Fizz', input: '3', expectedOutput: 'Fizz' },
      { description: 'n=5 retorna Buzz', input: '5', expectedOutput: 'Buzz' },
      { description: 'n=15 retorna FizzBuzz', input: '15', expectedOutput: 'FizzBuzz' },
    ],
  },
  {
    id: 'act-10',
    lessonId: 'lesson-1',
    order: 10,
    type: ActivityType.FIX_WITH_CHOICES,
    title: 'Corrigir CheckoutPage',
    objective: 'Resolver erro de undefined',
    instructions: 'Escolha a melhor correção.',
    targetFiles: ['src/pages/CheckoutPage.tsx'],
    status: ActivityStatus.LOCKED,
    fixOptions: [
      {
        id: 'fix-1',
        code: 'const items = cart?.items;',
        explanation: 'Evita crash mas não garante array.',
        isCorrect: false,
      },
      {
        id: 'fix-2',
        code: 'const items = cart?.items ?? [];',
        explanation: 'Garante array seguro mesmo se undefined.',
        isCorrect: true,
      },
      {
        id: 'fix-3',
        code: 'try { ... } catch {}',
        explanation: 'Esconde o erro.',
        isCorrect: false,
  },
    ], 
  },
  {
    id: 'act-11',
    lessonId: 'lesson-1',
    order: 11,
    type: ActivityType.STEP_THROUGH,
    title: 'Simulação de Execução de Código',
    aiGeneratedCode: `let x = 5;\nlet y = 10;\nlet z = x + y;\nconsole.log(z);`,
    objective: 'Componente interativo onde o usuário simula execução passo a passo do código.',
    instructions: `Pergunta: "Qual o valor de X agora?" Input para resposta a cada step`,
    targetFiles: [],
    status: ActivityStatus.LOCKED,
    steps: [
      {
        lineNumber: 1,
        question: "Qual o valor de X agora?",
        correctAnswer: "5",
        variables: { x: 5, y: 0, z: 0 },
      },
      {
        lineNumber: 2,
        question: "Qual o valor de Y agora?",
        correctAnswer: "10",
        variables: { x: 5, y: 10, z: 0 },
      },
      {
        lineNumber: 3,
        question: "Qual o valor de Z agora?",
        correctAnswer: "15",
        variables: { x: 5, y: 10, z: 15 },
      },
    ],
  },
];
export type BugChallenge = {
  code: string;
  bugLine: number;
  explanation: string;
  tip: string;
};

const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export const generateBugChallenge = (): BugChallenge => {
  const fns = ['SampleComponent', 'DataPanel', 'StatsView', 'DebugWidget', 'ReportSection'];
  const fn = pick(fns);
  
  // Lista de desafios limpos (sem comentários)
  const challenges: BugChallenge[] = [
    {
      code: `import React from 'react';\ntype Payload = { id: string; status: 'pending' | 'approved' };\n\nexport default function ${fn}() {\n  const items = [1, 2, 3];\n  const first = itemsList[0];\n  return <div>{first}</div>;\n}`,
      bugLine: 7,
      explanation: 'A variável itemsList não está definida no escopo.',
      tip: 'Verifique se o identificador usado corresponde ao declarado.'
    },
    {
      code: `import React from 'react';\ntype Config = { id: string; status: 'active' | 'inactive' };\n\nexport default function ${fn}() {\n  const amount: number = '5';\n  return <span>{amount.toFixed(2)}</span>;\n}`,
      bugLine: 6,
      explanation: 'Atribuição de uma string para uma variável tipada como number.',
      tip: 'Considere usar Number() ou parseFloat() para conversão.'
    },
    {
      code: `import React from 'react';\n\nexport default function ${fn}() {\n  const status = 'approved';\n  if (status = 'active') {\n    return <div>Ativo</div>;\n  }\n  return <div>Inativo</div>;\n}`,
      bugLine: 5,
      explanation: 'Uso de operador de atribuição (=) no lugar de comparação (===).',
      tip: 'Lembre-se que = atribui e === compara.'
    },
    {
      code: `import React from 'react';\n\nexport default function ${fn}() {\n  const list = [10, 20, 30];\n  let sum = 0;\n  for (let i = 0; i <= list.length; i++) {\n    sum += list[i];\n  }\n  return <div>{sum}</div>;\n}`,
      bugLine: 6,
      explanation: 'O loop acessa um índice inválido (out of bounds) devido ao operador <=.',
      tip: 'Índices de array começam em 0 e vão até length - 1.'
    }
  ];

  return pick(challenges);
};
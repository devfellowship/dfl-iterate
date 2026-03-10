type BugChallenge = {
  code: string;
  bugLine: number;
  explanation: string;
  tip: string;
};

const functionNames = ['SampleComponent', 'DataPanel', 'StatsView', 'DebugWidget', 'ReportSection'];
const variableNames = ['items', 'total', 'count', 'value', 'amount'];
const numberValues = [3, 4, 5, 7, 10, 12];

const pick = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

const buildFile = (bodyLines: string[], bugIndexInBody: number) => {
  const header = [
    "import React from 'react';",
    '',
    'type ReviewPayload = {',
    "  id: string;",
    "  status: 'pending' | 'approved' | 'rejected';",
    '};',
    '',
  ];

  const footer = ['}', ''];

  const codeLines = [...header, ...bodyLines, ...footer];
  const bugLine = header.length + bugIndexInBody;

  return {
    code: codeLines.join('\n'),
    bugLine,
  };
};

const createWrongVariableNameChallenge = (): BugChallenge => {
  const fn = pick(functionNames);
  const goodVar = pick(variableNames);
  const badVar = `${goodVar}List`;
  const body = [
    `export default function ${fn}() {`,
    `  const ${goodVar} = [1, 2, 3];`,
    `  const first = ${badVar}[0];`,
    '  return <div>{first}</div>;',
  ];
  const { code, bugLine } = buildFile(body, 2);
  return {
    code,
    bugLine,
    explanation: `A variável ${badVar} não existe, o nome correto é ${goodVar}.`,
    tip: 'Verifique se o identificador usado já foi declarado no escopo.',
  };
};

const createStringInsteadOfNumberChallenge = (): BugChallenge => {
  const fn = pick(functionNames);
  const value = pick(numberValues);
  const body = [
    `export default function ${fn}() {`,
    `  const amount: number = '${value}';`,
    '  return <span>{amount.toFixed(2)}</span>;',
  ];
  const { code, bugLine } = buildFile(body, 1);
  return {
    code,
    bugLine,
    explanation: 'Uma string foi atribuída a uma variável tipada como number.',
    tip: 'Mantenha o tipo da constante consistente com a anotação TypeScript.',
  };
};

const createMissingReturnChallenge = (): BugChallenge => {
  const fn = pick(functionNames);
  const body = [
    `export default function ${fn}() {`,
    '  if (Math.random() > 0.5) {',
    "    return <div>Aprovado</div>;",
    '  }',
    '}',
  ];
  const { code, bugLine } = buildFile(body, 4);
  return {
    code,
    bugLine,
    explanation: 'A função de componente não retorna JSX em todos os caminhos de execução.',
    tip: 'Garanta que toda função de componente sempre retorne algum JSX.',
  };
};

const createIncorrectComparisonChallenge = (): BugChallenge => {
  const fn = pick(functionNames);
  const body = [
    `export default function ${fn}() {`,
    '  const status = "approved";',
    "  if (status = 'approved') {",
    "    return <div>OK</div>;",
    '  }',
    '  return <div>Erro</div>;',
  ];
  const { code, bugLine } = buildFile(body, 2);
  return {
    code,
    bugLine,
    explanation: 'Foi usado operador de atribuição em vez de comparação na condição.',
    tip: 'Use === para comparar valores em condições if.',
  };
};

const createUndefinedVariableChallenge = (): BugChallenge => {
  const fn = pick(functionNames);
  const name = pick(variableNames);
  const body = [
    `export default function ${fn}() {`,
    `  const ${name} = 10;`,
    '  const result = total + 1;',
    '  return <div>{result}</div>;',
  ];
  const { code, bugLine } = buildFile(body, 2);
  return {
    code,
    bugLine,
    explanation: 'A variável total não foi declarada antes de ser usada.',
    tip: 'Revise o escopo e certifique-se de declarar todas as variáveis usadas.',
  };
};

const createAsyncErrorChallenge = (): BugChallenge => {
  const fn = pick(functionNames);
  const body = [
    `export default function ${fn}() {`,
    '  const load = async () => {',
    "    const response = fetch('/api/data');",
    '    const json = await response.json();',
    '    return json;',
    '  };',
    '  load();',
    '  return <div>Carregando</div>;',
  ];
  const { code, bugLine } = buildFile(body, 2);
  return {
    code,
    bugLine,
    explanation: 'A chamada fetch não está sendo aguardada antes de chamar response.json().',
    tip: 'Use await ao chamar funções assíncronas para evitar acessar valores indefinidos.',
  };
};

const createOffByOneLoopChallenge = (): BugChallenge => {
  const fn = pick(functionNames);
  const body = [
    `export default function ${fn}() {`,
    '  const values = [1, 2, 3];',
    '  let sum = 0;',
    '  for (let i = 0; i <= values.length; i += 1) {',
    '    sum += values[i];',
    '  }',
    '  return <div>{sum}</div>;',
  ];
  const { code, bugLine } = buildFile(body, 3);
  return {
    code,
    bugLine,
    explanation: 'O loop acessa um índice fora do array usando <= em vez de <.',
    tip: 'Em loops baseados em length use i < length para evitar índices inválidos.',
  };
};

const createWrongPropertyAccessChallenge = (): BugChallenge => {
  const fn = pick(functionNames);
  const body = [
    `export default function ${fn}() {`,
    "  const payload = { id: '1', status: 'pending' };",
    "  return <div>{payload.state}</div>;",
  ];
  const { code, bugLine } = buildFile(body, 2);
  return {
    code,
    bugLine,
    explanation: "A propriedade state não existe em payload; o correto é status.",
    tip: 'Cheque a forma do objeto antes de acessar suas propriedades.',
  };
};

const createArrayMutationChallenge = (): BugChallenge => {
  const fn = pick(functionNames);
  const body = [
    `export default function ${fn}() {`,
    '  const initial = [1, 2, 3];',
    '  const sorted = initial.sort();',
    '  return <div>{initial.join(", ")}</div>;',
  ];
  const { code, bugLine } = buildFile(body, 2);
  return {
    code,
    bugLine,
    explanation: 'O método sort muta o array original, alterando initial.',
    tip: 'Crie uma cópia do array antes de ordenar, por exemplo usando [...initial].',
  };
};

const createIncorrectDestructuringChallenge = (): BugChallenge => {
  const fn = pick(functionNames);
  const body = [
    `export default function ${fn}() {`,
    "  const payload = { id: '1', status: 'approved' };",
    '  const [id, status] = payload;',
    '  return <div>{id} - {status}</div>;',
  ];
  const { code, bugLine } = buildFile(body, 2);
  return {
    code,
    bugLine,
    explanation: 'Está sendo usado destructuring de array em um objeto.',
    tip: 'Use const { id, status } = payload para desconstruir objetos.',
  };
};

export const generateBugChallenge = (): BugChallenge => {
  const factories: Array<() => BugChallenge> = [
    createWrongVariableNameChallenge,
    createStringInsteadOfNumberChallenge,
    createMissingReturnChallenge,
    createIncorrectComparisonChallenge,
    createUndefinedVariableChallenge,
    createAsyncErrorChallenge,
    createOffByOneLoopChallenge,
    createWrongPropertyAccessChallenge,
    createArrayMutationChallenge,
    createIncorrectDestructuringChallenge,
  ];

  const factory = pick(factories);
  return factory();
};

export type { BugChallenge };


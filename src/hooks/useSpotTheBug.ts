import { useState, useMemo, useEffect } from "react";
export const CHALLENGES = [
  {
    code: `import { useState } from 'react';
export const FormatData = (): JSX.Element => {
const data: number[] = [1, 2, 3];
if (data = null) return <span>Sem dados</span>;
return <div>{data.join(', ')}</div>;
};`,
    bugLine: 4,
    explanation: 'Atribuição (=) em vez de comparação.',
    tip: 'Use === para comparar valores em condições.'
  },
  {
    code: `interface User {
name: string;
age: number;
}
export const UserCard = (props: { user?: User }): JSX.Element => {
return (
<div>
<h2>{props.user.name}</h2>
<p>{props.user?.age}</p>
</div>
);
};`,
    bugLine: 8,
    explanation: 'Acesso a propriedade de objeto possivelmente undefined.',
    tip: 'Use optional chaining (props.user?.name).'
  },
  {
    code: `export const Sum = (): number => {
const a = 5;
const b = 3;
return
a + b;
};`,
    bugLine: 4,
    explanation: 'Quebra de linha após o return.',
    tip: 'O JavaScript encerra o return se houver quebra de linha.'
  },
  {
    code: `export const DoubledList = (): number[] => {
const numbers: number[] = [1, 2, 3];
const result = numbers.map((n: number): number => {
n * 2;
});
return result;
};`,
    bugLine: 4,
    explanation: 'Falta do return dentro do map.',
    tip: 'Funções com {} precisam de return explícito.'
  },
  {
    code: `import { useState } from 'react';
export const Counter = (): JSX.Element => {
const [value, setValue] = useState<number>(0);
const handleClick = (): void => {
value++;
};
return <button onClick={handleClick}>{value}</button>;
};`,
    bugLine: 5,
    explanation: 'Mutação direta de estado.',
    tip: 'Use o setter: setValue(value + 1).'
  },
  {
    code: `interface Props {
onClick: () => void;
}
export const Button = (props: Props): JSX.Element => {
return (
<button onClick={props.onClick()}>
Click
</button>
);
};`,
    bugLine: 6,
    explanation: 'Função executada durante a renderização.',
    tip: 'Passe apenas a referência: onClick={props.onClick}.'
  }
];

interface UseSpotTheBugParams {
  activityId: string;
  onSuccess: (explanation: string) => void;
  onError: () => void;
}

export function useSpotTheBug({ activityId, onSuccess, onError }: UseSpotTheBugParams) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);

  useEffect(() => {
    setChallengeIndex(Math.floor(Math.random() * CHALLENGES.length));
    setSelectedLine(null);
  }, [activityId]);

  const challenge = useMemo(() => CHALLENGES[challengeIndex], [challengeIndex]);

  const handleConfirm = () => {
    if (selectedLine === null) return;
    if (selectedLine === challenge.bugLine) {
      onSuccess(`**Explicação:** ${challenge.explanation}\n\n**Dica:** ${challenge.tip}`);
    } else {
      onError();
    }
  };

  return { challenge, selectedLine, setSelectedLine, handleConfirm };
}
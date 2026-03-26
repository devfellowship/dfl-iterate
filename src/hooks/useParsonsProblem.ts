import { useState } from "react";

interface CodeBlock {
  id: string;
  code: string;
}

export function useParsonsProblem(onSubmit: (orderedBlockIds: string[]) => void) {
  const [solutionOrder, setSolutionOrder] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (solutionOrder.length === 0) return;
    setSubmitted(true);
    onSubmit(solutionOrder);
  };

  return {
    solutionOrder,
    setSolutionOrder,
    submitted,
    handleSubmit,
  };
}
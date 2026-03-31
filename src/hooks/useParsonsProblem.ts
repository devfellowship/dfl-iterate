import { useState, useEffect } from "react";
import { createSwapy } from 'swapy';

interface CodeBlock {
  id: string;
  code: string;
}

export function useParsonsProblem(onSubmit: (orderedBlockIds: string[]) => void, correctOrder: string[], containerRef: React.RefObject<HTMLDivElement>) {
  const [solutionOrder, setSolutionOrder] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const swapy = createSwapy(containerRef.current, { animation: 'spring' });

    const updateSolutionOrder = () => {
      if (!containerRef.current) return;

      const targetSlotElements = Array.from(
        containerRef.current.querySelectorAll<HTMLDivElement>("[data-swapy-slot^='target-']")
      );

      const order = targetSlotElements
        .map((slot) => {
          const item = slot.querySelector<HTMLDivElement>('[data-swapy-item]');
          return item?.dataset.swapyItem || '';
        })
        .filter((id) => id && !id.startsWith('placeholder-'));

      setSolutionOrder(order);
    };

    swapy.onSwap(() => {
      updateSolutionOrder();
    });

    // initial order at mount
    updateSolutionOrder();

    return () => swapy.destroy();
  }, [containerRef]);

  const handleSubmit = () => {
    if (solutionOrder.length === 0) return;
    const correct = solutionOrder.join(',') === correctOrder.join(',');
    setIsCorrect(correct);
    setSubmitted(true);
    onSubmit(solutionOrder);
  };

  return {
    solutionOrder,
    setSolutionOrder,
    submitted,
    isCorrect,
    handleSubmit,
  };
}
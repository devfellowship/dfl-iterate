import { useState, useEffect, useMemo, useRef } from "react";
import { createSwapy } from 'swapy';
import { Activity } from '@/types';

export function useParsonsProblem(activity: Activity, onSubmit?: (orderedBlockIds: string[]) => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocks = useMemo(() => activity.codeBlocks || [], [activity.codeBlocks]);
  const correctOrder = activity.correctOrder || [];
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

    updateSolutionOrder();

    return () => swapy.destroy();
  }, [containerRef]);

  const handleSubmit = () => {
    if (solutionOrder.length === 0) return;
    const correct = solutionOrder.join(',') === correctOrder.join(',');
    setIsCorrect(correct);
    setSubmitted(true);
    onSubmit?.(solutionOrder);
  };

  const assembledCode = solutionOrder
    .map(blockId => blocks.find(b => b.id === blockId)?.code)
    .filter(Boolean)
    .join('\n');

  return {
    solutionOrder,
    setSolutionOrder,
    submitted,
    isCorrect,
    handleSubmit,
    assembledCode,
    blocks,
    containerRef,
  };
}
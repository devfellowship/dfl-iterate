// Origin: agent
import { useCallback, useEffect, useState } from 'react';
import type { Activity } from '@/types';

export interface UseReadAndChooseCallbacks {
  /**
   * Disparado ao confirmar a escolha.
   * `isCorrect` vem do flag `isCorrect` da `ChooseOption` selecionada no dummy.
   */
  onSubmit: (choiceId: string, isCorrect: boolean) => void;
}

/**
 * Padrão ouro (alinhado a `useFixTheCode` / `useQualityReview`):
 * `activity` + objeto `callbacks`.
 *
 * - Mantém estado de seleção + `isConfirming` (delay curto de feedback visual).
 * - Computa `isCorrect` lendo `activity.choices` — sem string mágica na página.
 * - Reseta seleção quando `activity.id` muda (troca de pill na lição).
 */
export function useReadAndChoose(activity: Activity, callbacks: UseReadAndChooseCallbacks) {
  const { onSubmit } = callbacks;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setIsConfirming(false);
  }, [activity.id]);

  const handleConfirm = useCallback(() => {
    if (!selectedOption) return;
    const choice = activity.choices?.find((c) => c.id === selectedOption);
    const isCorrect = Boolean(choice?.isCorrect);

    setIsConfirming(true);
    setTimeout(() => {
      onSubmit(selectedOption, isCorrect);
      setIsConfirming(false);
    }, 500);
  }, [selectedOption, activity.choices, onSubmit]);

  return { selectedOption, setSelectedOption, isConfirming, handleConfirm };
}

// Origin: agent
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Activity, Step } from '@/types';

export interface UseStepThroughCallbacks {
  /** Recebe `true` se todas as respostas baterem com `step.correctAnswer`. */
  onSubmit: (isCorrect: boolean) => void;
}

/**
 * Padrão ouro (alinhado a `useFixTheCode` / `useQualityReview`):
 * `activity` + objeto `callbacks`.
 *
 * Comportamento:
 * - Mantém `answers` indexado pelo índice do step.
 * - Avança/volta entre steps.
 * - Em `handleSubmit` calcula `isCorrect` comparando cada resposta (trim) com
 *   `step.correctAnswer` (trim) e dispara `callbacks.onSubmit(isCorrect)`.
 * - Reseta estado quando `activity.id` muda (troca de pill na lição).
 */
export function useStepThrough(activity: Activity, callbacks: UseStepThroughCallbacks) {
  const { onSubmit } = callbacks;

  const steps = useMemo<Step[]>(() => activity.steps ?? [], [activity.steps]);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    setCurrentStep(0);
    setAnswers({});
  }, [activity.id]);

  const currentStepData = useMemo(() => steps[currentStep], [steps, currentStep]);

  const isFirstStep = currentStep === 0;
  const isLastStep = steps.length > 0 && currentStep === steps.length - 1;

  const canSubmit =
    steps.length > 0 &&
    steps.every((_, i) => (answers[i] ?? '').trim().length > 0);

  const setAnswer = useCallback((stepIndex: number, value: string) => {
    setAnswers(prev => ({ ...prev, [stepIndex]: value }));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
  }, [steps.length]);

  const goToPrevious = useCallback(() => {
    setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    const isCorrect = steps.every(
      (step, i) => (answers[i] ?? '').trim() === step.correctAnswer.trim()
    );
    onSubmit(isCorrect);
  }, [steps, answers, canSubmit, onSubmit]);

  return {
    steps,
    currentStep,
    currentStepData,
    answers,
    setAnswer,
    goToNext,
    goToPrevious,
    isFirstStep,
    isLastStep,
    canSubmit,
    handleSubmit,
  };
}

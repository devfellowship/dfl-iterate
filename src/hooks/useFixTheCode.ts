// Origin: agent
import { useCallback, useEffect, useState } from 'react';
import { Activity } from '@/types';

export interface UseFixTheCodeCallbacks {
  onSubmit: (fixedCode: string) => void;
}

/**
 * Padrão ouro (alinhado ao `useQualityReview`): `activity` + objeto `callbacks`.
 * Mantém só o estado do código no editor e o envio final.
 */
export function useFixTheCode(activity: Activity, callbacks: UseFixTheCodeCallbacks) {
  const { onSubmit } = callbacks;

  const [code, setCode] = useState(() => activity.aiGeneratedCode ?? '');

  useEffect(() => {
    setCode(activity.aiGeneratedCode ?? '');
  }, [activity.id, activity.aiGeneratedCode]);

  const handleSubmit = useCallback(() => {
    onSubmit(code);
  }, [code, onSubmit]);

  return {
    code,
    setCode,
    handleSubmit,
  };
}

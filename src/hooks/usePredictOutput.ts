import { useMemo, useState } from 'react';
import { Activity } from '@/types';

export interface PredictOutputProps {
    activity: Activity;
    onSubmit: (output: string) => void;
    onError?: () => void;
  }
  
  export function usePredictOutput({ activity, onSubmit, onError}: PredictOutputProps) {
    const code = activity.aiGeneratedCode || '';
    const placeholder = useMemo(
      () => activity.placeholder?.[0]?.placeholder ?? 'Digite o que vai aparecer no console...',
      [activity.placeholder]
    );
    const [prediction, setPrediction] = useState('');
    const isCorrect = activity.expectedOutput?.trim() === prediction.trim();
    
    
    return {
      activity,
      onSubmit,
      onError,
      code,
      placeholder,
      prediction,
      setPrediction,
      isCorrect,
    };
  }

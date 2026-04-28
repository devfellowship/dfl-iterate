import {useState } from 'react';
import { Activity } from '@/types';

export interface PredictOutputProps {
    activity: Activity;
    onSubmit: (output: string) => void;
    onError?: () => void;
  }
  
  export function usePredictOutput({ activity, onSubmit, onError}: PredictOutputProps) {
    const code = activity.aiGeneratedCode || '';
    const [prediction, setPrediction] = useState('');
    const isCorrect = activity.expectedOutput?.trim() === prediction.trim();
    
    
    return {
      activity,
      onSubmit,
      onError,
      code,
      prediction,
      setPrediction,
      isCorrect,
    };
  }

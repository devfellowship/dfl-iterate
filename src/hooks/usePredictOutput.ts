import {useState } from 'react';
import { Activity } from '@/types';

export function usePredictOutput(activity: Activity) {
  const code = activity.aiGeneratedCode || '';
  const [prediction, setPrediction] = useState('');
  const isCorrect = activity.expectedOutput?.trim() === prediction.trim();

  return { code, prediction, setPrediction, isCorrect };
}

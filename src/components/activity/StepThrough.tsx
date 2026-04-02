import React from 'react';
import { Activity } from '@/types';
import { CodeDisplay } from '../organisms';
import Controls from '../molecules/ReadAndChoose/Controls';
import VariablesDisplay from '../molecules/VariablesDisplay';
import useStepThrough from '../../hooks/useStepThrough';

export interface StepThroughProps {
  activity: Activity;
  onSubmit: (answers: Record<number, string>) => void;
}

export function StepThrough({ activity, onSubmit }: StepThroughProps) {
  const {
    currentStep,
    answers,
    handleNext,
    handleBack,
    handleAnswerChange,
    currentStepData,
  } = useStepThrough(activity);

  return (
    <div className="flex h-screen">
      <CodeDisplay code={activity.aiGeneratedCode} currentLine={currentStep} />
      <VariablesDisplay variables={currentStepData.variables} />
      <Controls
        onBack={handleBack}
        onNext={handleNext}
        question={currentStepData.question}
        answer={answers[currentStep] || ''}
        onAnswerChange={(e) => handleAnswerChange(currentStep, e.target.value)}
        onSubmit={() => onSubmit(answers)}
      />
    </div>
  );
}
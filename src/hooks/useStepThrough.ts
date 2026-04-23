import { useState } from 'react';
import { Activity } from '@/types';

interface StepData {
  question: string;
  variables: Record<string, unknown>;
}

const useStepThrough = (activity: Activity) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const steps: StepData[] = (activity as Activity & { steps?: StepData[] }).steps || [];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (stepIndex: number, answer: string) => {
    setAnswers({
      ...answers,
      [stepIndex]: answer,
    });
  };

  return {
    currentStep,
    answers,
    handleNext,
    handleBack,
    handleAnswerChange,
    currentStepData: steps[currentStep],
  };
};

export default useStepThrough;
import { useState } from 'react';
import { Activity } from '../types/Activity';

const useStepThrough = (activity: Activity) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleNext = () => {
    if (currentStep < activity.steps.length - 1) {
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
    currentStepData: activity.steps[currentStep],
  };
};

export default useStepThrough;

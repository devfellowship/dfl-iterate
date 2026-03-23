import React from 'react';
import { Activity } from '../../types/Activity';
import CodeDisplay from '../organisms/CodeDisplay';
import Controls from '../molecules/Controls';
import VariablesDisplay from '../molecules/VariablesDisplay';
import useStepThrough from '../../hooks/useStepThrough';

const StepThrough: React.FC<{ activity: Activity; onSubmit: (answers: Record<number, string>) => void; }> = ({ activity, onSubmit }) => {
  const {
    currentStep,
    answers,
    handleNext,
    handleBack,
    handleAnswerChange,
    currentStepData,
  } = useStepThrough(activity);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
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
};

export default StepThrough;

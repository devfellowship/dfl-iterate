import React, { useState } from 'react';
import { Activity } from '@/types';
import { CodeDisplay } from '../organisms';
import Controls from '../molecules/Controls/Controls';
import VariablesDisplay from '../molecules/VariablesDisplay/VariablesDisplay';
import useStepThrough from '../../hooks/useStepThrough';
import useCardGame from '../../hooks/useCardGame';
import { ActivityGameCard } from '../game/ActivityGameCard'; 
import { GameButton } from '../game/GameButton'; 

export interface StepThroughProps {
  activity: Activity;
  onSubmit: (results: Record<number, string>) => void;
}

export function StepThrough({ activity, onSubmit }: StepThroughProps) {
  const {
    currentStep,
    answers,
    handleNext: handleStepNext,
    handleBack: handleStepBack,
    handleAnswerChange,
    currentStepData,
  } = useStepThrough(activity);

  const {
    handleNext: handleCardNext,
    handleBack: handleCardBack,
    handleCardSelection,
    currentCardData,
  } = useCardGame(activity);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    
  };

  return (
    <div className="flex h-screen">
      <CodeDisplay code={activity.aiGeneratedCode} currentLine={currentStep} />
      <VariablesDisplay variables={currentStepData.variables} />

      <ActivityGameCard
        type={activity.type}
        title={activity.title}
        question={activity.instructions}
        actions={
          !submitted && (
            <GameButton
              onClick={handleSubmit}
              disabled={!selectedId}
              variant="primary"
            >
              Confirmar correção
            </GameButton>
          )
        }
      >
        <div className="mb-6">
          <h3 className="font-bold mb-2">Código com erro:</h3>
          <pre className="bg-black text-green-400 p-4 rounded-xl text-sm overflow-auto">
            <code>{activity.aiGeneratedCode}</code>
          </pre>
        </div>
        
        <div className="space-y-4">
          {activity.choices?.map(option => (
            <label
              key={option.id}
              className={`block border rounded-xl p-4 cursor-pointer transition ${
                selectedId === option.id
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="fix-option"
                  checked={selectedId === option.id}
                  onChange={() => setSelectedId(option.id)}
                  disabled={submitted}
                  className="mt-1"
                />

                <div className="flex-1">
                  <pre className="bg-muted p-3 rounded-lg text-sm overflow-auto">
                    <code>{option.code}</code>
                  </pre>

                  {submitted && selectedId === option.id && (
                    <p
                      className={`mt-3 text-sm ${
                        option.isCorrect ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {option.explanation}
                    </p>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </ActivityGameCard>

      <div className="controls">
        <Controls
          onBack={() => {
            handleStepBack();
            handleCardBack();
          }}
          onNext={() => {
            handleStepNext();
            handleCardNext();
          }}
          question={currentStepData.question}
          answer={answers[currentStep] || ''}
          onAnswerChange={(e) => handleAnswerChange(currentStep, e.target.value)}
          onCardSelect={(e) => handleCardSelection(currentStep, e.target.value)}
          onSubmit={() => onSubmit(answers)}
          cards={currentCardData.cards}
        />
      </div>

      <div className="card-display">
        <h2>Cartas Atuais: {currentCardData.cards.join(', ')}</h2>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ActivityType } from '@/enums';
import { Activity } from '@/types';
import { ActivityGameCard, GameButton } from '@/components/game';

interface FixWithChoicesProps {
  activity: Activity;
  onSubmit: (selectedFixId: string) => void;
}

export function FixWithChoices({ activity, onSubmit }: FixWithChoicesProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (activity.type !== ActivityType.FIX_WITH_CHOICES) return null;

  const handleSubmit = () => {
    if (!selectedId) return;
    setSubmitted(true);
    onSubmit(selectedId);
  };

  console.log('FixWithChoices renderizou', activity);

  return (
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
      {/* Código bugado */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Código com erro:</h3>
        <pre className="bg-black text-green-400 p-4 rounded-xl text-sm overflow-auto">
          <code>{activity.aiGeneratedCode}</code>
        </pre>
      </div>

      {/* Opções */}
      <div className="space-y-4">
        {activity.fixOptions.map(option => (
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
  );
}
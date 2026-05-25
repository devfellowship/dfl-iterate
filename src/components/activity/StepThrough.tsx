import { Activity } from '@/types';
import { ActivityGameCard, GameButton } from '@/components/game';
import { CodeDisplay } from '@/components/organisms';
import VariablesDisplay from '@/components/molecules/VariablesDisplay/VariablesDisplay';
import { useStepThrough } from '@/hooks/useStepThrough';

export interface StepThroughProps {
  activity: Activity;
  onSubmit: (isCorrect: boolean) => void;
}

export function StepThrough({ activity, onSubmit }: StepThroughProps) {
  const {
    steps,
    currentStep,
    currentStepData,
    answers,
    setAnswer,
    goToNext,
    goToPrevious,
    isFirstStep,
    isLastStep,
    canSubmit,
    handleSubmit,
  } = useStepThrough(activity, { onSubmit });

  if (!currentStepData || steps.length === 0) {
    return (
      <ActivityGameCard
        type={activity.type}
        title={activity.title}
        question="Atividade sem passos configurados"
        actions={null}
      >
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Esta atividade não tem `steps` no dummy.
        </div>
      </ActivityGameCard>
    );
  }

  const code = activity.aiGeneratedCode ?? '';
  const highlightedLine = (currentStepData.lineNumber ?? 1) - 1;

  return (
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question={`Passo ${currentStep + 1} de ${steps.length} — ${currentStepData.question}`}
      actions={
        <>
          <GameButton onClick={goToPrevious} disabled={isFirstStep} variant="tertiary">
            Voltar
          </GameButton>
          {!isLastStep && (
            <GameButton onClick={goToNext} variant="secondary">
              Avançar
            </GameButton>
          )}
          {isLastStep && (
            <GameButton onClick={handleSubmit} disabled={!canSubmit} variant="primary">
              Enviar
            </GameButton>
          )}
        </>
      }
    >
      <div className="flex-1 flex overflow-hidden gap-4">
        <div className="w-[70%] overflow-auto rounded-lg border border-border bg-muted/30">
          <CodeDisplay code={code} currentLine={highlightedLine} />
        </div>

        <div className="w-[30%] flex flex-col gap-4 overflow-auto">
          <VariablesDisplay variables={currentStepData.variables ?? {}} />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground" htmlFor="step-answer">
              Sua resposta
            </label>
            <input
              id="step-answer"
              type="text"
              value={answers[currentStep] ?? ''}
              onChange={(e) => setAnswer(currentStep, e.target.value)}
              placeholder="Digite o valor esperado"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>
    </ActivityGameCard>
  );
}

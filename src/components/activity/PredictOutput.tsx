import { ActivityGameCard, GameButton } from '@/components/game';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Textarea } from '@/components/ui/textarea';
import {usePredictOutput } from '@/hooks/usePredictOutput';
import { Activity } from '@/types';

interface PredictOutputProps {
  activity: Activity;
  onSubmit: (output: string) => void;
  onError?: () => void;
}

export function PredictOutput({ activity, onSubmit, onError }: PredictOutputProps) {
  const { code, prediction, setPrediction, isCorrect } = usePredictOutput(activity);

return(
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question={activity.objective || activity.instructions || ''}
      actions={
        <GameButton
          onClick={() => {
            if (isCorrect) {
              onSubmit(prediction);
              return;
            }

            onError?.();
          }}
          disabled={!prediction}
          variant="primary"
        >
          Confirmar
        </GameButton>
      }
    >
      <div className="flex-1 flex flex-col gap-4 pb-4 overflow-hidden">
        {/* Código (somente leitura) */}
        <div className="shrink-0 rounded-xl overflow-hidden border border-border">
          <CodeEditor
            value={code}
            language="typescript"
            readOnly
            fontSize={14}
          />
        </div>

        {/* Previsão do aluno */}
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          <p className="text-sm font-bold text-foreground">Qual será o output?</p>
          <Textarea
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            className="flex-1 min-h-[140px] resize-none"
          />
        </div>
      </div>
    </ActivityGameCard>
);
}
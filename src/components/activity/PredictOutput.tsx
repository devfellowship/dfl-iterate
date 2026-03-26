import { useMemo, useState } from 'react';
import { Activity } from '@/types';
import { ActivityGameCard, GameButton } from '@/components/game';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { Textarea } from '@/components/ui/textarea';

export interface PredictOutputProps {
  activity: Activity;
}

export function PredictOutput({ activity }: PredictOutputProps) {
  const code = activity.aiGeneratedCode || '';
  const placeholder = useMemo(
    () => activity.placeholder?.[0]?.placeholder ?? 'Digite o que vai aparecer no console...',
    [activity.placeholder]
  );

  const [prediction, setPrediction] = useState('');

  return (
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question={activity.objective || activity.instructions || ''}
      actions={
        <GameButton
          variant="primary"
          disabled={!prediction.trim()}
          onClick={() => {
            // Por enquanto, esta activity é só UI (o placeholder funciona por aqui).
            // A lógica de validação/completion pode ser adicionada depois.
            console.log('PredictOutput prediction:', prediction);
          }}
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
          <p className="text-sm font-bold text-foreground">Sua previsão</p>
          <Textarea
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-h-[140px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Digite exatamente como você espera que a saída apareça.
          </p>
        </div>
      </div>
    </ActivityGameCard>
  );
}
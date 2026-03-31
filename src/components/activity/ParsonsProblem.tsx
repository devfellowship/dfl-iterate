import React, { useRef } from 'react';
import { Activity } from '@/types';
import { GripVertical, ListOrdered } from 'lucide-react';
import { useParsonsProblem } from '@/hooks/useParsonsProblem';
import { ActivityGameCard, GameButton } from '@/components/game';

interface ParsonsProblemProps {
  activity: Activity;
  onSubmit?: (orderedBlocks: string[]) => void;
}

export function ParsonsProblem({ activity, onSubmit }: ParsonsProblemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocks = React.useMemo(() => activity.codeBlocks || [], [activity.codeBlocks]);
  const { solutionOrder, setSolutionOrder, submitted, isCorrect, handleSubmit } = useParsonsProblem((ordered) => onSubmit?.(ordered), activity.correctOrder || [], containerRef);
//useParsonsProblem
  // Construir o código montado baseado na ordem atual
  const assembledCode = solutionOrder
    .map(blockId => blocks.find(b => b.id === blockId)?.code)
    .filter(Boolean)
    .join('\n');
//useParsonsProblem
  return (
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question={activity.instructions}
      actions={
        !submitted && (
          <GameButton
            onClick={handleSubmit}
            disabled={solutionOrder.length !== blocks.length}
            variant="primary"
          >
            Enviar solução
          </GameButton>
        )
      }
    >
    <div className="flex flex-col gap-6">
      {/* Área do Jogo (Swapy Container) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={containerRef}>
        {/* Coluna de Origem */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <GripVertical className="w-3 h-3" />
            Blocos Disponíveis
          </h3>
          <div className="space-y-2">
            {blocks.map((block) => (
              <div
                key={`source-${block.id}`}
                data-swapy-slot={`source-${block.id}`}
                className="min-h-[56px] bg-background/50 border-2 border-dashed border-border rounded-lg"
              >
                <div
                  data-swapy-item={block.id}
                  className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground transition-colors" />
                  <code className="font-mono text-sm text-foreground">{block.code}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna de Destino */}
        <div className="space-y-3 p-4 bg-muted/20 rounded-xl border border-dashed border-border">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <ListOrdered className="w-3 h-3" />
            Sua Solução
          </h3>

          <div className="space-y-2">
            {blocks.map((_, index) => (
              <div
                key={`target-placeholder-${index}`}
                data-swapy-slot={`target-${index}`}
                className="min-h-[56px] bg-background/50 border-2 border-dashed border-border rounded-lg"
              >
                <div
                  data-swapy-item={`placeholder-${index}`}
                  className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all"
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground transition-colors" />
                  <span className="text-xs text-muted-foreground">Solte aqui</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Código Montado */}
      {assembledCode && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            Código Montado
          </h3>
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <pre className="text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
              {assembledCode}
            </pre>
          </div>
        </div>
      )}

      {/* Feedback */}
      {submitted && isCorrect !== null && (
        <div className={`p-4 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <p className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '✅ Correto! Parabéns.' : '❌ Incorreto. Tente novamente.'}
          </p>
        </div>
      )}

      {/* Informações */}
      <div className="text-xs text-muted-foreground space-y-1">
        {activity.correctOrder && activity.correctOrder.length > 0 && (
          <p>
            Ordem correta: <span className="font-mono text-foreground">{activity.correctOrder.join(' → ')}</span>
          </p>
        )}
        <p>
          {solutionOrder.length > 0
            ? `Ordem atual: ${solutionOrder.join(' → ')}`
            : 'Arraste todos os blocos para a área à direita e depois envie.'}
        </p>
        <p className="text-primary">
          Blocos carregados: {blocks.length}
        </p>
        {blocks.length === 0 && (
          <p className="text-red-500">
            Nenhum bloco encontrado. Verifique se a atividade possui `codeBlocks` no teste.
          </p>
        )}
      </div>
    </div>
    </ActivityGameCard>
  );
}
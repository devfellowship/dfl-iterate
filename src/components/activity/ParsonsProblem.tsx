import { Activity } from '@/types';
import { useParsonsProblem } from '@/hooks/useParsonsProblem';
import { ActivityGameCard, GameButton } from '@/components/game';
import {
  AssembledCode,
  ResultBanner,
  SourceList,
  StatusInfo,
  TargetList,
} from '@/components/atoms';

interface ParsonsProblemProps {
  activity: Activity;
  onSubmit?: (orderedBlocks: string[]) => void;
}

export function ParsonsProblem({ activity, onSubmit }: ParsonsProblemProps) {
  const { solutionOrder, submitted, isCorrect, handleSubmit, assembledCode, blocks, containerRef } = useParsonsProblem(activity, onSubmit);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={containerRef}>
        <SourceList blocks={blocks} />
        <TargetList count={blocks.length} />
      </div>

      {assembledCode && <AssembledCode assembledCode={assembledCode} title="Código Montado"/>}


      <ResultBanner submitted={submitted} isCorrect={isCorrect} />

      <StatusInfo
        correctOrder={activity.correctOrder}
        solutionOrder={solutionOrder}
        blockCount={blocks.length}
      />
    </ActivityGameCard>
  );
}
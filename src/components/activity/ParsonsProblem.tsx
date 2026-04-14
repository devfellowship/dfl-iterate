import React, { useRef } from 'react';
import { Activity } from '@/types';
import { useParsonsProblem } from '@/hooks/useParsonsProblem';
import { ActivityGameCard, GameButton } from '@/components/game';
import {
  ParsonsProblemAssembledCode,
  ParsonsProblemResultBanner,
  ParsonsProblemSourceList,
  ParsonsProblemStatusInfo,
  ParsonsProblemTargetList,
} from '@/components/atoms/ParsonsProblem';

interface ParsonsProblemProps {
  activity: Activity;
  onSubmit?: (orderedBlocks: string[]) => void;
}

export function ParsonsProblem({ activity, onSubmit }: ParsonsProblemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocks = React.useMemo(() => activity.codeBlocks || [], [activity.codeBlocks]);
  const { solutionOrder, setSolutionOrder, submitted, isCorrect, handleSubmit, assembledCode } = useParsonsProblem((ordered) => onSubmit?.(ordered), activity.correctOrder || [], containerRef, blocks);
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
        <ParsonsProblemSourceList blocks={blocks} />
        <ParsonsProblemTargetList count={blocks.length} />
      </div>

      {assembledCode && <ParsonsProblemAssembledCode assembledCode={assembledCode} />}

      <ParsonsProblemResultBanner submitted={submitted} isCorrect={isCorrect} />

      <ParsonsProblemStatusInfo
        correctOrder={activity.correctOrder}
        solutionOrder={solutionOrder}
        blockCount={blocks.length}
      />
    </ActivityGameCard>
  );
}
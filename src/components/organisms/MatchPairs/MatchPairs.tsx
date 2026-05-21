import { useMemo, useRef, useState } from 'react';
import { Activity } from '@/types';
import { cn } from '@/lib/utils';
import { ActivityGameCard, GameButton } from '@/components/game';
import { PairList } from '@/components/molecules/PairList/PairList';
import { useMatchPairs } from '@/hooks/useMatchPairs';
import { useMatchLines } from '@/hooks/useMatchLines';

interface MatchPairsProps {
  activity: Activity;
  onMatch: (pairId: string) => void;
  onUnmatch: (pairId: string) => void;
  onComplete: () => void;
}

interface RightItem {
  id: string;
  value: string;
}

export function MatchPairs({ activity, onMatch, onUnmatch, onComplete }: MatchPairsProps) {
  const pairs = useMemo(() => activity.matchPairs ?? [], [activity.matchPairs]);
  const [shuffleSeed] = useState(() => Math.random());
  const rightItems = useMemo<RightItem[]>(() => {
    const items = pairs.map((pair, index) => ({ id: `right-${index}`, value: pair.right }));
    const shuffled = [...items];

    // Fisher-Yates with stable seed per render lifecycle.
    let seed = Math.floor(shuffleSeed * 1_000_000) || 1;
    const nextRand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(nextRand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, [pairs, shuffleSeed]);
  const rightValueById = useMemo(
    () =>
      rightItems.reduce<Record<string, string>>((acc, item) => {
        acc[item.id] = item.value;
        return acc;
      }, {}),
    [rightItems]
  );

  const {
    selectedLeftId,
    connections,
    pairFeedback,
    isSubmitted,
    isAllConnected,
    rightToLeftConnection,
    handleSelectLeft,
    handleSelectRight,
    submitAnswers,
    resetAttempt,
  } = useMatchPairs({
    pairs,
    rightValueById,
    onMatch,
    onUnmatch,
    onComplete,
  });

  const boardRef = useRef<HTMLDivElement | null>(null);
  const leftRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lines = useMatchLines({
    boardRef,
    leftRefs,
    rightRefs,
    connections,
  });

  return (
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question={activity.objective || 'Conecte os pares corretos'}
      actions={
        <div className="flex items-center gap-2">
          {!isSubmitted ? (
            <GameButton variant="secondary" disabled={!isAllConnected} onClick={submitAnswers}>
              Enviar resposta
            </GameButton>
          ) : (
            <GameButton variant="tertiary" onClick={resetAttempt}>
              Tentar novamente
            </GameButton>
          )}
          <GameButton variant="secondary" disabled>
            {Object.keys(connections).length}/{pairs.length} pares conectados
          </GameButton>
        </div>
      }
    >
      <div className="mb-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-2 text-sm text-muted-foreground">
        {!isSubmitted
          ? selectedLeftId
            ? 'Agora escolha o par correspondente na coluna da direita.'
            : 'Conecte todos os pares e clique em "Enviar resposta".'
          : 'Feedback exibido. Revise os pares e tente novamente se necessário.'}
      </div>

      <div ref={boardRef} className="relative flex-1 grid grid-cols-2 gap-4 pb-4 pt-3 overflow-hidden">
        <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full">
          {lines.map((line) => (
            <g key={`${line.leftId}-${line.rightId}`}>
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={
                  !isSubmitted
                    ? 'hsl(var(--warning))'
                    : pairFeedback[line.leftId] === 'correct'
                      ? 'hsl(var(--success))'
                      : 'hsl(var(--destructive))'
                }
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.9}
                className="match-line-draw"
              />
              <circle
                cx={line.x1}
                cy={line.y1}
                r={4}
                fill={
                  !isSubmitted
                    ? 'hsl(var(--warning))'
                    : pairFeedback[line.leftId] === 'correct'
                      ? 'hsl(var(--success))'
                      : 'hsl(var(--destructive))'
                }
              />
              <circle
                cx={line.x2}
                cy={line.y2}
                r={4}
                fill={
                  !isSubmitted
                    ? 'hsl(var(--warning))'
                    : pairFeedback[line.leftId] === 'correct'
                      ? 'hsl(var(--success))'
                      : 'hsl(var(--destructive))'
                }
              />
            </g>
          ))}
        </svg>
        <style>
          {`
            .match-line-draw {
              stroke-dasharray: 240;
              stroke-dashoffset: 240;
              animation: match-line-draw 220ms ease-out forwards;
            }

            @keyframes match-line-draw {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}
        </style>

        <PairList
          className="space-y-3 overflow-auto pr-1 pt-1 pl-1"
          items={pairs}
          getKey={(pair) => pair.id}
          getLabel={(pair) => pair.left}
          onItemClick={(pair) => handleSelectLeft(pair.id)}
          isItemDisabled={() => isSubmitted}
          setItemRef={(pair, el) => {
            leftRefs.current[pair.id] = el;
          }}
          getItemClassName={(pair) => {
            const isSelected = selectedLeftId === pair.id;
            const isMatched = Boolean(connections[pair.id]);
            const feedback = pairFeedback[pair.id];

            return cn(
              'relative z-20 w-full rounded-xl border px-4 py-3 text-left transition-all duration-200',
              'bg-card text-foreground',
              isSelected && !isMatched && !isSubmitted && 'border-primary ring-2 ring-primary/40',
              isMatched && !isSubmitted && 'border-warning bg-warning/10',
              isMatched && feedback === 'correct' && isSubmitted && 'border-success bg-success/10',
              isMatched && feedback === 'wrong' && isSubmitted && 'border-destructive bg-destructive/10',
              !isMatched && [
                  'border-border',
                  'hover:border-primary/60 hover:bg-muted/30 hover:shadow-md hover:-translate-y-0.5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                ],
              isSubmitted && 'cursor-default'
            );
          }}
          getItemBadge={(pair) => {
            const isMatched = Boolean(connections[pair.id]);
            const feedback = pairFeedback[pair.id];

            if (!isMatched) return null;
            if (!isSubmitted) {
              return (
                <span className="ml-2 inline-flex items-center rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
                  Selecionado
                </span>
              );
            }
            return (
              <span
                className={cn(
                  'ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  feedback === 'correct' && 'bg-success/20 text-success',
                  feedback === 'wrong' && 'bg-destructive/20 text-destructive'
                )}
              >
                {feedback === 'correct' ? 'Correto' : 'Incorreto'}
              </span>
            );
          }}
        />

        <PairList
          className="space-y-3 overflow-auto pl-1 pt-1"
          items={rightItems}
          getKey={(item) => item.id}
          getLabel={(item) => item.value}
          onItemClick={(item) => handleSelectRight(item.id)}
          isItemDisabled={(item) => {
            const connectedLeftId = rightToLeftConnection[item.id];
            const isMatched = Boolean(connectedLeftId);
            const isConnectedToCurrentLeft = connectedLeftId === selectedLeftId;
            return !selectedLeftId || isSubmitted || (isMatched && !isConnectedToCurrentLeft);
          }}
          setItemRef={(item, el) => {
            rightRefs.current[item.id] = el;
          }}
          getItemClassName={(item) => {
            const connectedLeftId = rightToLeftConnection[item.id];
            const isMatched = Boolean(connectedLeftId);
            const feedback = connectedLeftId ? pairFeedback[connectedLeftId] : undefined;

            return cn(
              'relative z-20 w-full rounded-xl border px-4 py-3 text-left transition-all duration-200',
              'bg-card text-foreground',
              isMatched && !isSubmitted && 'border-warning bg-warning/10',
              isMatched && feedback === 'correct' && isSubmitted && 'border-success bg-success/10',
              isMatched && feedback === 'wrong' && isSubmitted && 'border-destructive bg-destructive/10',
              !isMatched && 'border-border',
              selectedLeftId && !isSubmitted && !isMatched && 'hover:border-primary/60',
              (!selectedLeftId || isSubmitted) && 'opacity-80'
            );
          }}
          getItemBadge={(item) => {
            const connectedLeftId = rightToLeftConnection[item.id];
            const isMatched = Boolean(connectedLeftId);
            const feedback = connectedLeftId ? pairFeedback[connectedLeftId] : undefined;

            if (!isMatched) return null;
            if (!isSubmitted) {
              return (
                <span className="ml-2 inline-flex items-center rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
                  Selecionado
                </span>
              );
            }
            return (
              <span
                className={cn(
                  'ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  feedback === 'correct' && 'bg-success/20 text-success',
                  feedback === 'wrong' && 'bg-destructive/20 text-destructive'
                )}
              >
                {feedback === 'correct' ? 'Correto' : 'Incorreto'}
              </span>
            );
          }}
        />
      </div>
    </ActivityGameCard>
  );
}
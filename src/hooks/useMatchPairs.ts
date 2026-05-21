import { useMemo, useState } from 'react';
import { MatchPairItem } from '@/types';

type PairFeedback = 'correct' | 'wrong' | undefined;

interface UseMatchPairsParams {
  pairs: MatchPairItem[];
  rightValueById: Record<string, string>;
  onMatch?: (pairId: string) => void;
  onUnmatch?: (pairId: string) => void;
  onComplete?: () => void;
}

export function useMatchPairs({ pairs, rightValueById, onMatch, onUnmatch, onComplete }: UseMatchPairsParams) {
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [pairFeedback, setPairFeedback] = useState<Record<string, PairFeedback>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectLeft = (leftId: string) => {
    if (isSubmitted) return;
    setSelectedLeftId(leftId);
  };

  const handleSelectRight = (rightId: string) => {
    if (!selectedLeftId || isSubmitted) return;

    setConnections((prev) => {
      const next = { ...prev };

      Object.entries(next).forEach(([leftId, connectedRightId]) => {
        if (leftId !== selectedLeftId && connectedRightId === rightId) {
          delete next[leftId];
        }
      });

      next[selectedLeftId] = rightId;
      return next;
    });
    setSelectedLeftId(null);
  };

  const isAllConnected = Object.keys(connections).length === pairs.length && pairs.length > 0;
  const matchedRightIds = new Set(Object.values(connections));

  const rightToLeftConnection = useMemo(
    () =>
      Object.entries(connections).reduce<Record<string, string>>((acc, [leftId, rightId]) => {
        acc[rightId] = leftId;
        return acc;
      }, {}),
    [connections]
  );

  const submitAnswers = () => {
    if (!isAllConnected) return false;

    const nextFeedback = pairs.reduce<Record<string, PairFeedback>>((acc, pair) => {
      const selectedRightId = connections[pair.id];
      const selectedRightValue = selectedRightId ? rightValueById[selectedRightId] : undefined;
      const isCorrect = selectedRightValue === pair.right;

      acc[pair.id] = isCorrect ? 'correct' : 'wrong';
      if (isCorrect) {
        onMatch?.(pair.id);
      } else {
        onUnmatch?.(pair.id);
      }

      return acc;
    }, {});

    setPairFeedback(nextFeedback);
    setIsSubmitted(true);
    setSelectedLeftId(null);

    const allCorrect = pairs.every((pair) => nextFeedback[pair.id] === 'correct');
    if (allCorrect) {
      onComplete?.();
    }

    return allCorrect;
  };

  const resetAttempt = () => {
    setSelectedLeftId(null);
    setConnections({});
    setPairFeedback({});
    setIsSubmitted(false);
  };

  return {
    selectedLeftId,
    connections,
    pairFeedback,
    isSubmitted,
    isAllConnected,
    matchedRightIds,
    rightToLeftConnection,
    handleSelectLeft,
    handleSelectRight,
    submitAnswers,
    resetAttempt,
  };
}
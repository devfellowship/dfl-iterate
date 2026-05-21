import { RefObject, useEffect, useState } from 'react';

export interface MatchLine {
  leftId: string;
  rightId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface UseMatchLinesParams {
  boardRef: RefObject<HTMLDivElement | null>;
  leftRefs: RefObject<Record<string, HTMLButtonElement | null>>;
  rightRefs: RefObject<Record<string, HTMLButtonElement | null>>;
  connections: Record<string, string>;
}

export function useMatchLines({ boardRef, leftRefs, rightRefs, connections }: UseMatchLinesParams) {
  const [lines, setLines] = useState<MatchLine[]>([]);

  useEffect(() => {
    const updateLines = () => {
      const boardRect = boardRef.current?.getBoundingClientRect();
      if (!boardRect) return;

      const nextLines = Object.entries(connections)
        .map(([leftId, rightId]) => {
          const leftRect = leftRefs.current[leftId]?.getBoundingClientRect();
          const rightRect = rightRefs.current[rightId]?.getBoundingClientRect();
          if (!leftRect || !rightRect) return null;

          return {
            leftId,
            rightId,
            x1: leftRect.right - boardRect.left,
            y1: leftRect.top + leftRect.height / 2 - boardRect.top,
            x2: rightRect.left - boardRect.left,
            y2: rightRect.top + rightRect.height / 2 - boardRect.top,
          };
        })
        .filter((line): line is MatchLine => Boolean(line));

      setLines(nextLines);
    };

    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [boardRef, leftRefs, rightRefs, connections]);

  return lines;
}
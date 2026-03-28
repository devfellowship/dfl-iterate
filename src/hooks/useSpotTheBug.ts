import { useState, useMemo, useEffect } from "react";
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';

import { Activity } from "@/types";

interface UseSpotTheBugParams {
  activity: Activity; 
  onSuccess: (explanation: string) => void;
  onError: () => void;
}

export function useSpotTheBug({ activity, onSuccess, onError }: UseSpotTheBugParams) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);

  useEffect(() => {
    const total = activity.bugChallenges?.length || 0;

    if (total > 0) {
      setChallengeIndex(Math.floor(Math.random() * total));
    }

    setSelectedLine(null);
  }, [activity]);

  const challenge = useMemo(
    () => activity.bugChallenges?.[challengeIndex], 
    [challengeIndex, activity]
  );

  const highlightedLines = useMemo(() => {
    if (!challenge) return [];

    return Prism
      .highlight(challenge.code, Prism.languages.typescript, 'typescript')
      .split('\n');
  }, [challenge]);

  const handleConfirm = () => {
    if (selectedLine === null || !challenge) return; 

    if (selectedLine === challenge.bugLine) {
      onSuccess(`**Explicação:** ${challenge.explanation}\n\n**Dica:** ${challenge.tip}`);
    } else {
      onError();
    }
  };

  return { 
    challenge, 
    selectedLine, 
    setSelectedLine, 
    handleConfirm,
    highlightedLines 
  };
}
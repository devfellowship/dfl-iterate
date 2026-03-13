import { useState } from "react";

interface UseSpotTheBugParams {
  onSuccess: (explanation: string) => void;
  onError: (explanation: string) => void;
}

export function useSpotTheBug({ onSuccess, onError }: UseSpotTheBugParams) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);

  const handleConfirm = (bugLine: number, explanation: string) => {
    if (selectedLine === null) return;

    if (selectedLine === bugLine) {
      onSuccess(explanation);
    } else {
      onError(explanation);
    }
  };

  return { selectedLine, setSelectedLine, handleConfirm };
}
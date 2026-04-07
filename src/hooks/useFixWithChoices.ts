import { useState } from 'react';

export function useFixWithChoices(onSubmit: (id: string) => void) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedId) return;

    setSubmitted(true);
    onSubmit(selectedId);
  };

  return {
    selectedId,
    setSelectedId,
    submitted,
    handleSubmit,
  };
}
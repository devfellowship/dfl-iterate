import { useState } from 'react';
import { Activity } from '@/types';

interface CardData {
  cards: string[];
}

const useCardGame = (activity: Activity) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedCards, setSelectedCards] = useState<Record<number, string>>({});

  // Dummy cards for now, perhaps based on activity
  const cards = ['Card A', 'Card B', 'Card C'];

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleCardSelection = (stepIndex: number, value: string) => {
    setSelectedCards({
      ...selectedCards,
      [stepIndex]: value,
    });
  };

  const currentCardData: CardData = {
    cards: [cards[currentCardIndex]],
  };

  return {
    handleNext,
    handleBack,
    handleCardSelection,
    currentCardData,
  };
};

export default useCardGame;
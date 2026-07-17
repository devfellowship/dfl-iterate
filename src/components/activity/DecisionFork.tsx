import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, DecisionOption } from '@/types';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@devfellowship/components';
import { ActivityGameCard } from '@/components/game';
import { GameButton } from '@/components/game';

interface DecisionForkProps {
  activity: Activity;
  onDecide: (optionId: string) => void;
}

export function DecisionFork({ activity, onDecide }: DecisionForkProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    if (selectedOption) {
      setIsConfirming(true);
      setTimeout(() => {
        onDecide(selectedOption);
      }, 500);
    }
  };

  return (
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question="Qual abordagem você prefere?"
      actions={
        <GameButton 
          onClick={handleConfirm} 
          disabled={!selectedOption || isConfirming}
          variant="primary"
          icon={isConfirming ? <Sparkles className="w-5 h-5 animate-pulse" /> : undefined}
        >
          {isConfirming ? 'Aplicando...' : 'Confirmar'}
        </GameButton>
      }
    >
      {/* Options Grid */}
      <div className="grid gap-4 md:grid-cols-3 h-full content-center">
        {activity.options?.map((option, index) => (
          <OptionCard
            key={option.id}
            option={option}
            index={index}
            isSelected={selectedOption === option.id}
            onSelect={() => setSelectedOption(option.id)}
            disabled={isConfirming}
          />
        ))}
      </div>
    </ActivityGameCard>
  );
}

interface OptionCardProps {
  option: DecisionOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

function OptionCard({ option, index, isSelected, onSelect, disabled }: OptionCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative p-5 rounded-2xl border-2 text-left transition-all duration-200",
        "bg-card hover:bg-card/80",
        isSelected 
          ? "border-primary ring-4 ring-primary/20 shadow-lg" 
          : "border-border hover:border-primary/40"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={!disabled ? { y: -4, scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div 
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}

      <h3 className="font-display font-bold text-lg text-foreground mb-2 pr-8">
        {option.label}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        {option.description}
      </p>
      
      <div className="pt-3 border-t border-border">
        <span className="text-xs font-bold text-primary uppercase tracking-wide">Impacto:</span>
        <p className="text-sm text-muted-foreground mt-1">
          {option.impact}
        </p>
      </div>
    </motion.button>
  );
}

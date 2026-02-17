import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ChooseOption } from '@/types';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActivityGameCard } from '@/components/game';
import { GameButton } from '@/components/game';
import { CodeEditor } from '@/components/editor/CodeEditor';

interface ReadAndChooseProps {
  activity: Activity;
  onDecide: (optionId: string) => void;
}

export function ReadAndChoose({ activity, onDecide }: ReadAndChooseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const code = activity.aiGeneratedCode || '';

  const handleConfirm = () => {
    if (selectedOption) {
      setIsConfirming(true);
      setTimeout(() => {
        onDecide(selectedOption);
        setIsConfirming(false);
      }, 500);
    }
  };

  return (
    <ActivityGameCard
      type={activity.type}
      title={activity.title}
      question={activity.objective || ''}
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
      <div className="flex-1 flex flex-col gap-4 pb-4 overflow-hidden">
        {/* Code Snippet (Read-only) */}
        <div className="shrink-0 rounded-xl overflow-hidden border border-border">
          <CodeEditor
            value={code}
            language="typescript"
            readOnly
            fontSize={14}
          />
        </div>

        {/* Options Grid */}
        <div className="grid gap-4 md:grid-cols-3 pb-2">
          {activity.choices?.map((choice, index) => (
            <ChooseCard
              key={choice.id}
              choice={choice}
              index={index}
              isSelected={selectedOption === choice.id}
              onSelect={() => setSelectedOption(choice.id)}
              disabled={false}
            />
          ))}
        </div>
      </div>
    </ActivityGameCard>
  );
}

interface ChooseCardProps {
  choice: ChooseOption;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

function ChooseCard({ choice, index, isSelected, onSelect, disabled }: ChooseCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200",
        "bg-card hover:bg-card/80",
        isSelected 
          ? "border-primary ring-4 ring-primary/20 shadow-lg" 
          : "border-border hover:border-primary/40"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
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

      <h3 className="font-display font-bold text-md text-center text-foreground mb-2 pr-8">
        {choice.description}
      </h3>
      
      {/* <p className="text-sm text-muted-foreground mb-4">
        {choice.description}
      </p> */}
    </motion.button>
  );
}

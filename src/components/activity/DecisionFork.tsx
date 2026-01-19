import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, DecisionOption } from '@/types';
import { Check, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DecisionForkProps {
  activity: Activity;
  onDecide: (optionId: string) => void;
}

export function DecisionFork({ activity, onDecide }: DecisionForkProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleConfirm = () => {
    if (selectedOption) {
      setIsConfirming(true);
      setTimeout(() => {
        onDecide(selectedOption);
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <motion.div 
        className="p-4 rounded-lg bg-muted/30 border border-border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-semibold mb-2 text-foreground">Contexto</h3>
        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
          {activity.instructions}
        </pre>
      </motion.div>

      {/* Warning */}
      <motion.div 
        className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AlertCircle className="w-4 h-4 text-warning shrink-0" />
        <span className="text-sm text-muted-foreground">
          Sua decisão afetará as próximas activities e a estrutura do projeto
        </span>
      </motion.div>

      {/* Options Grid */}
      <motion.div 
        className="grid gap-4 md:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {activity.options?.map((option, index) => (
          <OptionCard
            key={option.id}
            option={option}
            index={index}
            isSelected={selectedOption === option.id}
            onSelect={() => handleSelect(option.id)}
            disabled={isConfirming}
          />
        ))}
      </motion.div>

      {/* Confirm Button */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 disabled:opacity-50"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isConfirming ? (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" />
                Aplicando decisão...
              </>
            ) : (
              <>
                Confirmar Escolha
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
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
        "relative p-6 rounded-xl border text-left transition-all duration-300",
        "bg-card hover:bg-card/80",
        isSelected 
          ? "border-primary ring-2 ring-primary/20" 
          : "border-border hover:border-primary/30"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={!disabled ? { y: -4 } : undefined}
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div 
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}

      <h3 className="font-bold text-lg text-foreground mb-2">
        {option.label}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        {option.description}
      </p>
      
      <div className="pt-4 border-t border-border">
        <span className="text-xs font-medium text-primary">Impacto:</span>
        <p className="text-sm text-muted-foreground mt-1">
          {option.impact}
        </p>
      </div>
    </motion.button>
  );
}

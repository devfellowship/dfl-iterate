import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Flame, Zap } from 'lucide-react';
import { Button } from '@devfellowship/components';

interface GameHeaderProps {
  lives: number;
  streak: number;
  xp: number;
  onBack?: () => void;
}

export function GameHeader({ lives, streak, xp, onBack }: GameHeaderProps) {
  return (
    <header className="shrink-0 min-h-[4.5rem] h-[4.5rem] px-4 flex items-center justify-between border-b border-border bg-card/50 gap-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="shrink-0 gap-1.5 pl-2 pr-3"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Início</span>
          </Button>
        )}
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-lg font-black text-primary-foreground">i</span>
        </div>
        <span className="font-display font-bold text-foreground hidden sm:block shrink-0">
          iterate
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <motion.div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Heart
                className={`w-5 h-5 ${i < lives ? 'text-life fill-life' : 'text-muted-foreground/30'}`}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-streak/10 border border-streak/20"
          whileHover={{ scale: 1.05 }}
        >
          <Flame className="w-4 h-4 text-streak" />
          <span className="font-bold text-sm text-streak">{streak}</span>
        </motion.div>

        <motion.div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-xp/10 border border-xp/20"
          whileHover={{ scale: 1.05 }}
        >
          <Zap className="w-4 h-4 text-xp" />
          <span className="font-bold text-sm text-xp">{xp}</span>
        </motion.div>
      </div>
    </header>
  );
}

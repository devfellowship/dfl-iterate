import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { Activity } from '@/types';
import { ActivityStatus } from '@/enums';
import { cn } from '@devfellowship/components';

interface ProgressPillsProps {
  activities: Activity[];
  currentIndex: number;
  onActivityClick: (index: number) => void;
}

export function ProgressPills({ activities, currentIndex, onActivityClick }: ProgressPillsProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {activities.map((activity, index) => {
        const isCompleted = activity.status === ActivityStatus.COMPLETED;
        const isCurrent = index === currentIndex;
        const isLocked = activity.status === ActivityStatus.LOCKED;

        return (
          <div key={activity.id} className="flex items-center">
            {/* Connector line */}
            {index > 0 && (
              <div 
                className={cn(
                  "w-8 h-1 rounded-full -mr-1",
                  index <= currentIndex ? "bg-primary" : "bg-muted"
                )}
              />
            )}
            
            <motion.button
              onClick={() => !isLocked && onActivityClick(index)}
              disabled={isLocked}
              className={cn(
                "relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all",
                "border-4",
                isCompleted && "bg-success border-success text-success-foreground",
                isCurrent && "bg-card border-primary text-primary animate-pulse-glow",
                isLocked && "bg-muted border-muted text-muted-foreground opacity-60 cursor-not-allowed"
              )}
              whileHover={!isLocked ? { scale: 1.1 } : undefined}
              whileTap={!isLocked ? { scale: 0.95 } : undefined}
            >
              {isCompleted ? (
                <Check className="w-6 h-6" />
              ) : isLocked ? (
                <Lock className="w-4 h-4" />
              ) : (
                index + 1
              )}

              {/* Current indicator glow */}
              {isCurrent && (
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-primary"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}

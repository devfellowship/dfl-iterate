import { motion } from 'framer-motion';
import { Activity } from '@/types';
import { ActivityType, ActivityStatus } from '@/enums';
import { Check, Lock, Search, Scissors, GitFork, Bug } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onClick: () => void;
  isActive: boolean;
}

const typeIcons = {
  [ActivityType.QUALITY_REVIEW]: Search,
  [ActivityType.CONSTRAINED_EDIT]: Scissors,
  [ActivityType.DECISION_FORK]: GitFork,
  [ActivityType.BREAK_AND_FIX]: Bug,
};

const typeLabels = {
  [ActivityType.QUALITY_REVIEW]: 'Quality Review',
  [ActivityType.CONSTRAINED_EDIT]: 'Constrained Edit',
  [ActivityType.DECISION_FORK]: 'Decision Fork',
  [ActivityType.BREAK_AND_FIX]: 'Break & Fix',
};

export function ActivityCard({ activity, index, onClick, isActive }: ActivityCardProps) {
  const Icon = typeIcons[activity.type];
  const isLocked = activity.status === ActivityStatus.LOCKED;
  const isCompleted = activity.status === ActivityStatus.COMPLETED;
  const isCurrent = activity.status === ActivityStatus.CURRENT;

  return (
    <motion.button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "relative w-full p-4 rounded-xl border text-left transition-all duration-300",
        isLocked && "opacity-40 cursor-not-allowed grayscale",
        isCurrent && "border-primary/50 bg-card shadow-lg",
        isCompleted && "border-success/30 bg-success/5",
        !isLocked && !isCurrent && !isCompleted && "border-border bg-card/50 hover:bg-card hover:border-border/80",
        isActive && isCurrent && "ring-2 ring-primary/50"
      )}
      whileHover={!isLocked ? { scale: 1.02 } : undefined}
      whileTap={!isLocked ? { scale: 0.98 } : undefined}
    >
      {/* Glow effect for current */}
      {isCurrent && (
        <div className="absolute inset-0 rounded-xl bg-primary/5 animate-pulse-glow" />
      )}

      <div className="relative flex items-start gap-3">
        {/* Icon container */}
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
          isLocked && "bg-muted",
          isCurrent && "bg-primary text-primary-foreground",
          isCompleted && "bg-success text-success-foreground",
          !isLocked && !isCurrent && !isCompleted && "bg-muted"
        )}>
          {isLocked ? (
            <Lock className="w-4 h-4" />
          ) : isCompleted ? (
            <Check className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {index + 1}. {typeLabels[activity.type]}
            </span>
          </div>
          <h3 className="font-semibold text-foreground truncate">
            {activity.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {activity.objective}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

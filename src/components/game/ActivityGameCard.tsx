import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ActivityType } from '@/enums';
import { Search, Scissors, GitBranch, Wrench, Video, Palette } from 'lucide-react';

interface ActivityGameCardProps {
  type: ActivityType;
  title: string;
  question: string;
  children: ReactNode;
  actions: ReactNode;
}

const typeConfig: Record<ActivityType, { icon: typeof Search; label: string; color: string }> = {
  [ActivityType.QUALITY_REVIEW]: {
    icon: Search,
    label: 'QUALITY REVIEW',
    color: 'text-primary'
  },
  [ActivityType.CONSTRAINED_EDIT]: {
    icon: Scissors,
    label: 'CONSTRAINED EDIT',
    color: 'text-warning'
  },
  [ActivityType.DECISION_FORK]: {
    icon: GitBranch,
    label: 'DECISION FORK',
    color: 'text-success'
  },
  [ActivityType.BREAK_AND_FIX]: {
    icon: Wrench,
    label: 'BREAK & FIX',
    color: 'text-destructive'
  },
  [ActivityType.VIDEO_CHALLENGE]: {
    icon: Video,
    label: 'VIDEO CHALLENGE',
    color: 'text-purple-400'
  },
  [ActivityType.VISUAL_IMPLEMENTATION]: {
    icon: Palette,
    label: 'VISUAL IMPLEMENTATION',
    color: 'text-cyan-400'
  },
  [ActivityType.READ_AND_CHOOSE]: {
    icon: Search,
    label: 'READ AND CHOOSE',
    color: 'text-primary'
  }
};

export function ActivityGameCard({ type, title, question, children, actions }: ActivityGameCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with type and title */}
      <div className="text-center mb-4 shrink-0">
        <motion.div 
          className={`inline-flex items-center gap-2 ${config.color} mb-2`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <Icon className="w-5 h-5" />
          <span className="font-display text-sm font-bold tracking-widest">
            {config.label}
          </span>
        </motion.div>
        <h1 className="font-display text-2xl font-black text-foreground">
          {title}
        </h1>
      </div>

      {/* Main content area - explicit flex-1 with overflow */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>

      {/* Question */}
      <div className="text-center py-4 shrink-0">
        <p className="text-lg text-muted-foreground font-medium">
          {question}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3 pb-4 shrink-0">
        {actions}
      </div>
    </motion.div>
  );
}

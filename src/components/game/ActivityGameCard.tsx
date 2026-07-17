import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ActivityType } from '@/enums';
import { useT } from '@/i18n/LangContext';
import {
  Search,
  Scissors,
  GitBranch,
  Wrench,
  Video,
  Palette,
  Bug,
  ChevronRight,
  Puzzle,
  Terminal,
  CheckCircle2,
  Award,
} from 'lucide-react';

interface ActivityGameCardProps {
  type: ActivityType;
  title: string;
  question: string;
  children: ReactNode;
  actions: ReactNode;
}

const typeConfig: Record<ActivityType, { icon: typeof Search; labelKey: string; color: string }> = {
  [ActivityType.FILL_THE_BLANKS]: {
    icon: Search,
    labelKey: 'game.activityGameCard.type.fillTheBlanks',
    color: 'text-primary'
  },
  [ActivityType.QUALITY_REVIEW]: {
    icon: Search,
    labelKey: 'game.activityGameCard.type.qualityReview',
    color: 'text-primary'
  },
  [ActivityType.TRUE_OR_FALSE]: {
    icon: CheckCircle2,
    labelKey: 'game.activityGameCard.type.trueOrFalse',
    color: 'text-primary'
  },
  [ActivityType.CONSTRAINED_EDIT]: {
    icon: Scissors,
    labelKey: 'game.activityGameCard.type.constrainedEdit',
    color: 'text-warning'
  },
  [ActivityType.DECISION_FORK]: {
    icon: GitBranch,
    labelKey: 'game.activityGameCard.type.decisionFork',
    color: 'text-success'
  },
  [ActivityType.BREAK_AND_FIX]: {
    icon: Wrench,
    labelKey: 'game.activityGameCard.type.breakAndFix',
    color: 'text-destructive'
  },

  [ActivityType.FIX_THE_CODE]: {
    icon: Bug,
    labelKey: 'game.activityGameCard.type.fixTheCode',
    color: 'text-yellow-400'
  },

  [ActivityType.VIDEO_CHALLENGE]: {
    icon: Video,
    labelKey: 'game.activityGameCard.type.videoChallenge',
    color: 'text-purple-400'
  },
  [ActivityType.VISUAL_IMPLEMENTATION]: {
    icon: Palette,
    labelKey: 'game.activityGameCard.type.visualImplementation',
    color: 'text-cyan-400'
  },

  [ActivityType.FIX_WITH_CHOICES]: {
    icon: Bug,
    labelKey: 'game.activityGameCard.type.fixWithChoices',
    color: 'text-red-400'
  },
  [ActivityType.READ_AND_CHOOSE]: {
    icon: Search,
    labelKey: 'game.activityGameCard.type.readAndChoose',
    color: 'text-primary'
  },
  [ActivityType.PARSONS_PROBLEM]: {
    icon: Puzzle,
    labelKey: 'game.activityGameCard.type.parsonsProblem',
    color: 'text-yellow-400',
  },
  [ActivityType.PREDICT_OUTPUT]: {
    icon: Wrench,
    labelKey: 'game.activityGameCard.type.predictOutput',
    color: 'text-primary',
  },
  [ActivityType.REPL_CHALLENGE]: {
    icon: Terminal,
    labelKey: 'game.activityGameCard.type.replChallenge',
    color: 'text-green-400',
  },
  [ActivityType.STEP_THROUGH]: {
    icon: ChevronRight,
    labelKey: 'game.activityGameCard.type.stepThrough',
    color: 'text-blue-400',
  },
  [ActivityType.SPOT_THE_BUG]: {
    icon: Bug,
    labelKey: 'game.activityGameCard.type.spotTheBug',
    color: 'text-orange-400',
  },
  [ActivityType.BEST_IMPLEMENTATION]: {
    icon: Award,
    labelKey: 'game.activityGameCard.type.bestImplementation',
    color: 'text-amber-400',
  },
};

export function ActivityGameCard({ type, title, question, children, actions }: ActivityGameCardProps) {
  const { t } = useT();
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="text-center mb-4 shrink-0">
        <motion.div
          className={`inline-flex items-center gap-2 ${config.color} mb-2`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <Icon className="w-5 h-5" />
          <span className="font-display text-sm font-bold tracking-widest">
            {t(config.labelKey)}
          </span>
        </motion.div>

        <h1 className="font-display text-2xl font-black text-foreground">
          {title}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>

      {/* Question (igual à main) */}
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
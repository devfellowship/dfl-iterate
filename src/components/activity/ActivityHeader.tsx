import { Activity } from '@/types';
import { ActivityType } from '@/enums';
import { Search, Scissors, GitFork, Bug } from 'lucide-react';

interface ActivityHeaderProps {
  activity: Activity;
}

const typeConfig = {
  [ActivityType.QUALITY_REVIEW]: { 
    icon: Search, 
    label: 'Quality Review',
    emoji: '🔍',
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
  },
  [ActivityType.CONSTRAINED_EDIT]: { 
    icon: Scissors, 
    label: 'Constrained Edit',
    emoji: '✂️',
    gradient: 'from-purple-500 to-pink-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'
  },
  [ActivityType.DECISION_FORK]: { 
    icon: GitFork, 
    label: 'Decision Fork',
    emoji: '🔀',
    gradient: 'from-primary to-orange-400',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    glow: 'shadow-[0_0_20px_rgba(243,147,37,0.3)]'
  },
  [ActivityType.BREAK_AND_FIX]: { 
    icon: Bug, 
    label: 'Break & Fix',
    emoji: '🐛',
    gradient: 'from-destructive to-red-400',
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    glow: 'shadow-[0_0_20px_rgba(197,38,20,0.3)]'
  },
};

export function ActivityHeader({ activity }: ActivityHeaderProps) {
  const config = typeConfig[activity.type];

  return (
    <div className="space-y-4">
      {/* Gamified Activity Badge */}
      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl border-2 ${config.bg} ${config.border} ${config.glow}`}>
        <span className="text-2xl">{config.emoji}</span>
        <span className={`text-sm font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
          {config.label}
        </span>
      </div>
      
      <h1 className="text-3xl font-bold text-foreground">
        {activity.title}
      </h1>
      
      <p className="text-lg text-muted-foreground">
        {activity.objective}
      </p>
    </div>
  );
}

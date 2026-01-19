import { Activity } from '@/types';
import { ActivityType } from '@/enums';
import { Search, Scissors, GitFork, Bug } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActivityHeaderProps {
  activity: Activity;
  activityNumber: number;
  totalActivities: number;
}

const typeConfig = {
  [ActivityType.QUALITY_REVIEW]: { 
    icon: Search, 
    label: 'Quality Review',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  [ActivityType.CONSTRAINED_EDIT]: { 
    icon: Scissors, 
    label: 'Constrained Edit',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  [ActivityType.DECISION_FORK]: { 
    icon: GitFork, 
    label: 'Decision Fork',
    color: 'bg-primary/20 text-primary border-primary/30'
  },
  [ActivityType.BREAK_AND_FIX]: { 
    icon: Bug, 
    label: 'Break & Fix',
    color: 'bg-destructive/20 text-destructive border-destructive/30'
  },
};

export function ActivityHeader({ activity, activityNumber, totalActivities }: ActivityHeaderProps) {
  const config = typeConfig[activity.type];
  const Icon = config.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Activity {activityNumber} de {totalActivities}
        </span>
        <Badge variant="outline" className={config.color}>
          <Icon className="w-3 h-3 mr-1" />
          {config.label}
        </Badge>
      </div>
      
      <h1 className="text-2xl font-bold text-foreground">
        {activity.title}
      </h1>
      
      <p className="text-muted-foreground">
        {activity.objective}
      </p>
    </div>
  );
}

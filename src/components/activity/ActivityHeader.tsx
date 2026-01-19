import { Activity } from '@/types';
import { ActivityType } from '@/enums';
import { Search, Scissors, GitFork, Bug } from 'lucide-react';

interface ActivityHeaderProps {
  activity: Activity;
}

export function ActivityHeader({ activity }: ActivityHeaderProps) {
  return (
    <h1 className="text-2xl font-bold text-foreground">
      {activity.title}
    </h1>
  );
}

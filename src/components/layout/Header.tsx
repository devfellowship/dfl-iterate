import { ArrowLeft, Circle } from 'lucide-react';
import { ProjectStatus } from '@/enums';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface HeaderProps {
  projectName: string;
  projectStatus: ProjectStatus;
  progress: number;
  currentActivity: number;
  totalActivities: number;
  onBack?: () => void;
}

const statusConfig = {
  [ProjectStatus.OK]: { 
    color: 'text-success', 
    bg: 'bg-success/20', 
    label: 'OK',
    icon: '🟢'
  },
  [ProjectStatus.WARNING]: { 
    color: 'text-warning', 
    bg: 'bg-warning/20', 
    label: 'WARNING',
    icon: '🟡'
  },
  [ProjectStatus.BROKEN]: { 
    color: 'text-destructive', 
    bg: 'bg-destructive/20', 
    label: 'BROKEN',
    icon: '🔴'
  },
};

export function Header({
  projectName,
  projectStatus,
  progress,
  currentActivity,
  totalActivities,
  onBack,
}: HeaderProps) {
  const status = statusConfig[projectStatus];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{projectName}</span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
              <span>{status.icon}</span>
              <span>{status.label}</span>
            </div>
          </div>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="text-xl font-bold text-gradient">iterate</span>
          <span className="text-xs text-muted-foreground">by DevFellowship</span>
        </div>

        {/* Right section - Progress */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{currentActivity}/{totalActivities}</span>
          </div>
          <div className="w-32 lg:w-48">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>
    </header>
  );
}

import { ArrowLeft } from 'lucide-react';
import { ProjectStatus } from '@/enums';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  projectName: string;
  projectStatus: ProjectStatus;
  trackTitle?: string;
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
  trackTitle,
  onBack,
}: HeaderProps) {
  const status = statusConfig[projectStatus];

  return (
    <header className="shrink-0 z-50 border-b border-border bg-background">
      <div className="flex items-center justify-between h-12 px-4">
        {/* Left section - Logo */}
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
            <span className="text-lg font-bold text-gradient">iterate</span>
            <span className="text-xs text-muted-foreground">by DevFellowship</span>
          </div>
        </div>

        {/* Center - Track Title */}
        {trackTitle && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <span className="text-sm font-medium text-muted-foreground">{trackTitle}</span>
          </div>
        )}

        {/* Right section - Status */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
            <span>{status.icon}</span>
            <span>{status.label}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

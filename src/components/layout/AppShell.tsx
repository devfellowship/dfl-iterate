import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ProjectStatus } from '@/enums';
import { Header } from './Header';

interface AppShellProps {
  children: ReactNode;
  projectName: string;
  projectStatus: ProjectStatus;
  currentActivity: number;
  totalActivities: number;
  trackTitle?: string;
  onBack?: () => void;
  activityButtons?: ReactNode;
}

export function AppShell({
  children,
  projectName,
  projectStatus,
  currentActivity,
  totalActivities,
  trackTitle,
  onBack,
  activityButtons,
}: AppShellProps) {
  const progress = (currentActivity / totalActivities) * 100;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header
        projectName={projectName}
        projectStatus={projectStatus}
        trackTitle={trackTitle}
        onBack={onBack}
      />
      
      <motion.main 
        className="flex-1 flex flex-col overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Gamified Progress Bar */}
        <div className="shrink-0 px-4 py-3 bg-card/30 border-b border-border">
          <div className="flex items-center gap-3">
            {/* Activity Buttons */}
            {activityButtons}
            
            {/* Progress Bar */}
            <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden border-2 border-border shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-primary to-orange-400 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
              </motion.div>
            </div>
          </div>
        </div>

        {children}
      </motion.main>
    </div>
  );
}

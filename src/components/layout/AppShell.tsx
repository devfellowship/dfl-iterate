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
  onBack?: () => void;
}

export function AppShell({
  children,
  projectName,
  projectStatus,
  currentActivity,
  totalActivities,
  onBack,
}: AppShellProps) {
  const progress = (currentActivity / totalActivities) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        projectName={projectName}
        projectStatus={projectStatus}
        progress={progress}
        currentActivity={currentActivity}
        totalActivities={totalActivities}
        onBack={onBack}
      />
      
      <motion.main 
        className="flex-1 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  );
}

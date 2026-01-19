import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout';
import { 
  ActivityHeader,
  QualityReview,
  ConstrainedEdit,
  DecisionFork,
  BreakAndFix
} from '@/components/activity';
import { ProjectPreview } from '@/components/preview';
import { AIResponse } from '@/components/ai';
import { GitLog } from '@/components/project';
import { useActivityPage } from '@/hooks';
import { ActivityType } from '@/enums';
import { lessonsData } from '@/test-utils/lessons.dummy';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [gitLogOpen, setGitLogOpen] = useState(false);

  const lesson = lessonsData.find(l => l.id === lessonId);

  const {
    currentActivity,
    activities,
    currentActivityIndex,
    project,
    gitLog,
    isAIStreaming,
    aiResponse,
    canAdvance,
    handleActivityComplete,
    handleDecision,
    handleCodeSubmit,
    triggerAIResponse,
    goToNextActivity,
    goToActivity,
    setProjectBroken,
  } = useActivityPage();

  // Set project broken when on Break & Fix activity
  useEffect(() => {
    if (currentActivity?.type === ActivityType.BREAK_AND_FIX) {
      setProjectBroken();
    }
  }, [currentActivity, setProjectBroken]);

  if (!lesson) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Lesson não encontrada</h1>
          <Button onClick={() => navigate('/')} className="game-button">Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const renderActivityContent = () => {
    if (!currentActivity) return null;

    switch (currentActivity.type) {
      case ActivityType.QUALITY_REVIEW:
        return (
          <QualityReview
            activity={currentActivity}
            onApprove={() => handleActivityComplete(currentActivity.id, 'act-1-feedback-approve')}
            onRegenerate={() => triggerAIResponse('act-1-generate')}
            onEdit={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, 'act-1-feedback-edit');
            }}
          />
        );
      
      case ActivityType.CONSTRAINED_EDIT:
        return (
          <ConstrainedEdit
            activity={currentActivity}
            onSubmit={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, 'act-2-success');
            }}
          />
        );
      
      case ActivityType.DECISION_FORK:
        return (
          <DecisionFork
            activity={currentActivity}
            onDecide={handleDecision}
          />
        );
      
      case ActivityType.BREAK_AND_FIX:
        return (
          <BreakAndFix
            activity={currentActivity}
            errorMessage="TypeError: Cannot read property 'map' of undefined
    at CheckoutPage (CheckoutPage.tsx:7:18)
    at renderWithHooks (react-dom.development.js:14985:18)
    at mountIndeterminateComponent (react-dom.development.js:17811:13)"
            onFix={(code) => handleCodeSubmit(code, currentActivity.targetFiles[0])}
            onRequestHint={() => triggerAIResponse('act-4-hint')}
          />
        );
      
      default:
        return null;
    }
  };

  const activityButtons = (
    <div className="flex gap-2 shrink-0">
      {activities.map((activity, index) => (
        <motion.button
          key={activity.id}
          onClick={() => goToActivity(index)}
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all border-2 ${
            index === currentActivityIndex
              ? 'bg-primary text-primary-foreground border-primary shadow-[0_3px_0_0_hsl(var(--primary)/0.5)]'
              : activity.status === 'completed'
              ? 'bg-success/20 text-success border-success/30 shadow-[0_3px_0_0_hsl(var(--success)/0.3)]'
              : activity.status === 'locked'
              ? 'bg-muted text-muted-foreground border-border opacity-50'
              : 'bg-muted text-muted-foreground border-border shadow-[0_3px_0_0_hsl(var(--border))]'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95, y: 2 }}
        >
          {index + 1}
        </motion.button>
      ))}
    </div>
  );

  return (
    <AppShell
      projectName={lesson.projectName}
      projectStatus={project.status}
      currentActivity={currentActivityIndex + 1}
      totalActivities={lesson.totalActivities}
      trackTitle={lesson.title}
      onBack={() => navigate('/')}
      activityButtons={activityButtons}
    >
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Activity Content */}
        <div className="flex-1 lg:w-[55%] flex flex-col border-r border-border overflow-hidden">
          {/* Activity Header - Compact */}
          <div className="shrink-0 px-6 py-4 border-b border-border bg-card/30">
            {currentActivity && (
              <ActivityHeader activity={currentActivity} />
            )}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* Activity Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentActivity?.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderActivityContent()}
                </motion.div>
              </AnimatePresence>

              {/* AI Response */}
              {(aiResponse || isAIStreaming) && (
                <AIResponse text={aiResponse} isStreaming={isAIStreaming} />
              )}

              {/* Navigation */}
              {canAdvance && currentActivityIndex < activities.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <Button onClick={goToNextActivity} className="game-button">
                    Próxima Activity
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              )}

              {/* Completion Message */}
              {currentActivityIndex === activities.length - 1 && canAdvance && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-8 rounded-xl bg-success/10 border-2 border-success/30"
                >
                  <span className="text-5xl mb-4 block">🎉</span>
                  <h3 className="text-2xl font-bold text-success mb-2">
                    Parabéns! Você completou esta lesson!
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Você construiu o {lesson.projectName} e tomou decisões técnicas reais.
                  </p>
                  <Button onClick={() => navigate('/')} className="game-button-outline">
                    Voltar ao início
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview + GitLog */}
        <div className="hidden lg:flex lg:w-[45%] flex-col overflow-hidden">
          {/* Preview with padding */}
          <div className="flex-1 p-4 overflow-hidden">
            <ProjectPreview 
              status={project.status} 
              errorMessage={currentActivity?.type === ActivityType.BREAK_AND_FIX 
                ? "TypeError: Cannot read property 'map' of undefined" 
                : undefined
              }
            />
          </div>
          
          {/* GitLog at bottom */}
          <GitLog
            entries={gitLog}
            isCollapsed={gitLogOpen}
            onToggle={() => setGitLogOpen(!gitLogOpen)}
          />
        </div>
      </div>
    </AppShell>
  );
}

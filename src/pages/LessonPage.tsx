import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QualityReview,
  ConstrainedEdit,
  DecisionFork,
  BreakAndFix
} from '@/components/activity';
import { ProjectPreview } from '@/components/preview';
import { GitLog } from '@/components/project';
import { 
  GameHeader, 
  ProgressPills, 
  ResultModal,
  AIHistoryDrawer,
  AIHistoryButton
} from '@/components/game';
import { useActivityPage, useAIHistory } from '@/hooks';
import { ActivityType } from '@/enums';
import { lessonsData } from '@/test-utils/lessons.dummy';
import { aiMessageTemplates } from '@/test-utils/ai-messages.dummy';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  // Drawer states
  const [gitLogOpen, setGitLogOpen] = useState(false);
  const [aiHistoryOpen, setAiHistoryOpen] = useState(false);
  
  // Result modal state
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{
    isSuccess: boolean;
    xpEarned: number;
    feedback: string;
    activityTitle: string;
  } | null>(null);

  // Game state
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(3);
  const [xp, setXp] = useState(0);

  // AI History
  const { messages: aiMessages, addMessage } = useAIHistory();

  const lesson = lessonsData.find(l => l.id === lessonId);

  const {
    currentActivity,
    activities,
    currentActivityIndex,
    project,
    gitLog,
    canAdvance,
    handleActivityComplete: originalHandleActivityComplete,
    handleDecision,
    handleCodeSubmit,
    triggerAIResponse,
    goToNextActivity,
    goToActivity,
    setProjectBroken,
  } = useActivityPage();

  // Handle activity completion with result modal
  const handleActivityComplete = useCallback((
    activityId: string, 
    responseKey?: string,
    forceSuccess: boolean = true
  ) => {
    const template = responseKey 
      ? aiMessageTemplates[responseKey] 
      : aiMessageTemplates['default-success'];
    
    const isSuccess = template?.isSuccess ?? forceSuccess;
    const feedback = template?.message ?? aiMessageTemplates['default-success'].message;
    const earnedXP = isSuccess ? 25 : 0;

    // Add to AI history
    addMessage({
      activityId,
      activityTitle: currentActivity?.title ?? 'Activity',
      activityOrder: currentActivityIndex + 1,
      message: feedback,
      isSuccess,
    });

    // Update game state
    if (isSuccess) {
      setXp(prev => prev + earnedXP);
    } else {
      setLives(prev => Math.max(0, prev - 1));
    }

    // Show result modal
    setResultData({
      isSuccess,
      xpEarned: earnedXP,
      feedback,
      activityTitle: currentActivity?.title ?? 'Activity',
    });
    setShowResult(true);

    // Only call original complete if success
    if (isSuccess) {
      originalHandleActivityComplete(activityId, responseKey);
    }
  }, [currentActivity, currentActivityIndex, addMessage, originalHandleActivityComplete]);

  // Handle result modal continue
  const handleResultContinue = () => {
    setShowResult(false);
    
    if (resultData?.isSuccess && currentActivityIndex < activities.length - 1) {
      goToNextActivity();
    }
    
    setResultData(null);
  };

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
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Lesson não encontrada</h1>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold"
          >
            Voltar ao início
          </button>
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
            onApprove={() => handleActivityComplete(currentActivity.id, 'act-1-feedback-approve', false)}
            onRegenerate={() => triggerAIResponse('act-1-generate')}
            onEdit={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, 'act-1-feedback-edit', true);
            }}
          />
        );
      
      case ActivityType.CONSTRAINED_EDIT:
        return (
          <ConstrainedEdit
            activity={currentActivity}
            onSubmit={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, 'act-2-success', true);
            }}
          />
        );
      
      case ActivityType.DECISION_FORK:
        return (
          <DecisionFork
            activity={currentActivity}
            onDecide={(optionId) => {
              handleDecision(optionId);
              // Map option to response key
              const responseKey = optionId === 'context' ? 'act-3-context' 
                : optionId === 'zustand' ? 'act-3-zustand' 
                : 'act-3-localstorage';
              handleActivityComplete(currentActivity.id, responseKey, true);
            }}
          />
        );
      
      case ActivityType.BREAK_AND_FIX:
        return (
          <BreakAndFix
            activity={currentActivity}
            errorMessage="TypeError: Cannot read property 'map' of undefined
    at CheckoutPage (CheckoutPage.tsx:7:18)"
            onFix={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, 'act-4-success', true);
            }}
            onRequestHint={() => triggerAIResponse('act-4-hint')}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Game Header */}
      <GameHeader 
        lives={lives}
        streak={streak}
        xp={xp}
      />

      {/* Progress Pills */}
      <div className="shrink-0 border-b border-border bg-card/30">
        <ProgressPills
          activities={activities}
          currentIndex={currentActivityIndex}
          onActivityClick={goToActivity}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Activity */}
        <div className="flex-1 lg:w-[55%] flex flex-col overflow-hidden p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActivity?.id}
              className="flex-1 overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderActivityContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Panel - Preview */}
        <div className="hidden lg:flex lg:w-[45%] flex-col p-4 relative">
          <ProjectPreview 
            status={project.status} 
            errorMessage={currentActivity?.type === ActivityType.BREAK_AND_FIX 
              ? "TypeError: Cannot read property 'map' of undefined" 
              : undefined
            }
          />
          
          {/* Git Log Toggle */}
          <GitLog
            entries={gitLog}
            isOpen={gitLogOpen}
            onToggle={() => setGitLogOpen(!gitLogOpen)}
          />
        </div>
      </div>

      {/* Footer Buttons - inside preview panel, next to GitLog */}
      <div className="hidden lg:block fixed bottom-5 right-24 z-40">
        <AIHistoryButton
          messageCount={aiMessages.length}
          onClick={() => setAiHistoryOpen(true)}
        />
      </div>

      {/* Result Modal */}
      {resultData && (
        <ResultModal
          isOpen={showResult}
          isSuccess={resultData.isSuccess}
          xpEarned={resultData.xpEarned}
          activityTitle={resultData.activityTitle}
          aiFeedback={resultData.feedback}
          onContinue={handleResultContinue}
        />
      )}

      {/* AI History Drawer */}
      <AIHistoryDrawer
        isOpen={aiHistoryOpen}
        onClose={() => setAiHistoryOpen(false)}
        messages={aiMessages}
      />
    </div>
  );
}

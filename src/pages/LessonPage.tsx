import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Bot } from 'lucide-react';
import { 
  QualityReview,
  ConstrainedEdit,
  DecisionFork,
  BreakAndFix,
  VideoChallenge,
  VisualImplementation
} from '@/components/activity';
import { DynamicPreview } from '@/components/preview';
import { GitLog } from '@/components/project';
import { 
  GameHeader, 
  ProgressPills, 
  ResultModal,
  AIHistoryDrawer,
  LessonCompleteScreen,
} from '@/components/game';
import { useActivityPage, useAIHistory, useSoundEffects, usePreviewState } from '@/hooks';
import { ActivityType, ActivityStatus, ProjectStatus } from '@/enums';
import { lessonsData } from '@/test-utils/lessons.dummy';
import { aiMessageTemplates } from '@/test-utils/ai-messages.dummy';
import { ReadAndChoose } from '@/components/activity/ReadAndChoose';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  // Sound effects
  const { playSuccess, playError, playCelebration } = useSoundEffects();
  
  // Drawer states
  const [gitLogOpen, setGitLogOpen] = useState(false);
  const [aiHistoryOpen, setAiHistoryOpen] = useState(false);
  const [showLessonComplete, setShowLessonComplete] = useState(false);
  const [lastCompletedActivity, setLastCompletedActivity] = useState<number | undefined>();
  
  // Result modal state
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<{
    isSuccess: boolean;
    xpEarned: number;
    feedback: string;
    activityTitle: string;
    isLastActivity: boolean;
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
    handleActivityComplete: originalHandleActivityComplete,
    handleDecision,
    handleCodeSubmit,
    triggerAIResponse,
    goToNextActivity,
    goToActivity,
    setProjectBroken,
    setProjectOK,
  } = useActivityPage();

  // Compute completed activities for preview state
  const completedActivities = useMemo(() => 
    activities
      .map((a, i) => a.status === ActivityStatus.COMPLETED ? i : -1)
      .filter(i => i !== -1),
    [activities]
  );

  // Dynamic preview state - based on current activity index for time travel
  const previewState = usePreviewState(currentActivityIndex, completedActivities, project.decisions);

  // Handle activity completion with result modal
  const handleActivityComplete = useCallback((
    activityId: string, 
    responseKey?: string,
    forceSuccess: boolean = true
  ) => {
    const template = responseKey 
      ? aiMessageTemplates[responseKey] 
      : aiMessageTemplates['default-success']
      ?? aiMessageTemplates['default-failure'];
    
    const isSuccess = template?.isSuccess ?? forceSuccess;
    const feedback = template?.message ?? aiMessageTemplates['default-success'].message ?? aiMessageTemplates['default-failure'].message;
    const earnedXP = isSuccess ? 25 : 0;
    const isLastActivity = currentActivityIndex === activities.length - 1;

    // Play sound
    if (isSuccess) {
      if (isLastActivity) {
        playCelebration();
      } else {
        playSuccess();
      }
      setLastCompletedActivity(currentActivityIndex);
    } else {
      playError();
    }

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
      isLastActivity: isSuccess && isLastActivity,
    });
    setShowResult(true);

    // Only call original complete if success
    if (isSuccess) {
      originalHandleActivityComplete(activityId, responseKey);
    }
  }, [currentActivity, currentActivityIndex, activities.length, addMessage, originalHandleActivityComplete, playSuccess, playError, playCelebration]);

  // Handle result modal continue
  const handleResultContinue = () => {
    setShowResult(false);
    
    if (resultData?.isSuccess) {
      if (resultData.isLastActivity) {
        // Show lesson complete screen
        setShowLessonComplete(true);
      } else if (currentActivityIndex < activities.length - 1) {
        goToNextActivity();
      }
    }
    
    setResultData(null);
  };

  // Handle lesson complete
  if (showLessonComplete) {
    return (
      <LessonCompleteScreen
        lessonTitle={lesson?.title || 'Lesson'}
        stats={{
          xpEarned: xp,
          livesRemaining: lives,
          streak: streak,
          timeMinutes: 32, // Mock
        }}
        decisions={project.decisions}
        githubRepo="github.com/seu-usuario/boxshop-iterate"
        onGoHome={() => navigate('/')}
      />
    );
  }

  // Set project broken only when on Break & Fix activity (and reset when leaving)
  useEffect(() => {
    if (currentActivity?.type === ActivityType.BREAK_AND_FIX) {
      // Only set broken if activity is not completed yet
      const isCompleted = completedActivities.includes(currentActivityIndex);
      if (!isCompleted) {
        setProjectBroken();
      }
    } else {
      // Reset to OK when not on Break & Fix
      setProjectOK();
    }
  }, [currentActivity, currentActivityIndex, completedActivities, setProjectBroken, setProjectOK]);

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

      case ActivityType.READ_AND_CHOOSE:
        return (
          <ReadAndChoose
            activity={currentActivity}
            onDecide={(choiceId) => {
              handleDecision(choiceId);
              const isCorrect = choiceId === 'opt-list-products';
              const responseKey = isCorrect ? 'default-success' : 'default-failure';
              handleActivityComplete(currentActivity.id, responseKey, isCorrect);
            }}
          />
        );



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
            onError={() => {
              handleActivityComplete(currentActivity.id, 'act-4-wrong', false);
            }}
            onRequestHint={() => triggerAIResponse('act-4-hint')}
          />
        );
      
      case ActivityType.VIDEO_CHALLENGE:
        return (
          <VideoChallenge
            activity={currentActivity}
            onComplete={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, 'act-5-success', true);
            }}
          />
        );
      
      case ActivityType.VISUAL_IMPLEMENTATION:
        return (
          <VisualImplementation
            activity={currentActivity}
            onComplete={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, 'act-6-success', true);
            }}
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
          <DynamicPreview 
            status={project.status} 
            previewState={previewState}
            lastCompletedActivity={lastCompletedActivity}
            errorMessage={currentActivity?.type === ActivityType.BREAK_AND_FIX && project.status === ProjectStatus.BROKEN
              ? "TypeError: Cannot read property 'map' of undefined" 
              : undefined
            }
          />
          
          {/* Git Log Drawer */}
          <GitLog
            entries={gitLog}
            isOpen={gitLogOpen}
            onToggle={() => setGitLogOpen(!gitLogOpen)}
          />
        </div>
      </div>

      {/* Footer Buttons - Aligned together */}
      <div className="hidden lg:flex fixed bottom-5 right-5 z-40 items-center gap-3">
        <motion.button
          onClick={() => setAiHistoryOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border hover:bg-muted transition-colors shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bot className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">{aiMessages.length}</span>
        </motion.button>

        <motion.button
          onClick={() => setGitLogOpen(!gitLogOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border hover:bg-muted transition-colors shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-bold text-foreground">{gitLog.length}</span>
        </motion.button>
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
          isLessonComplete={resultData.isLastActivity}
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

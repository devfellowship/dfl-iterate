import { useState, useEffect, useCallback, useMemo } from 'react';
import { TrueOrFalse } from '@/components/activity';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Bot } from 'lucide-react';
import {
  QualityReview,
  ConstrainedEdit,
  DecisionFork,
  BreakAndFix,
  VideoChallenge,
  VisualImplementation,
  PredictOutput,
  FixTheCode,
  StepThrough,
  FillTheBlanks,
  ReadAndChoose,
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
import { activityFeedback } from '@/consts/activity-feedback';
import { FixWithChoices } from '@/components/activity/FixWithChoices';
import { BestImplementation } from '@/components/activity/BestImplementation';
import { ParsonsProblem } from '@/components/activity/ParsonsProblem';
import { REPLChallenge } from '@/components/activity/REPLChallenge';
import { SpotTheBug } from '@/components/activity/SpotTheBug';

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
    recordDecision,
    handleCodeSubmit,
    triggerAIResponse,
    goToNextActivity,
    goToActivity,
    setProjectBroken,
    setProjectOK,
  } = useActivityPage(lessonId ?? '');

  // Compute completed activities for preview state
  const completedActivities = useMemo(() =>
    activities
      .map((a, i) => a.status === ActivityStatus.COMPLETED ? i : -1)
      .filter(i => i !== -1),
    [activities]
  );

  // Dynamic preview state - based on current activity index for time travel
  const previewState = usePreviewState(currentActivityIndex, completedActivities, project.decisions);

  /**
   * Orquestra a conclusão de uma atividade: toca som, mostra modal, atualiza
   * XP/lives e histórico — e, APENAS em caso de sucesso, desbloqueia a próxima.
   *
   * `isCorrect` é a fonte de verdade do resultado. `responseKey` serve só para
   * escolher a MENSAGEM mostrada ao aluno. Quando `responseKey` é omitido,
   * cai automaticamente em `default-success` / `default-failure`.
   *
   * @param activityId  Id da atividade que terminou.
   * @param isCorrect   Se o aluno acertou. Decide som, XP/lives e progressão.
   * @param responseKey Chave opcional em `activityFeedback` com a mensagem
   *                    específica a exibir. Default: `default-success`/`failure`.
   */
  const handleActivityComplete = useCallback((
    activityId: string,
    isCorrect: boolean,
    responseKey?: string,
  ) => {
    const key = responseKey ?? (isCorrect ? 'default-success' : 'default-failure');
    const feedback = activityFeedback[key];
    const fallbackKey = isCorrect ? 'default-success' : 'default-failure';
    const message =
      feedback?.modalMessage ?? activityFeedback[fallbackKey]?.modalMessage ?? '';

    const earnedXP = isCorrect ? 25 : 0;
    const isLastActivity = currentActivityIndex === activities.length - 1;

    if (isCorrect) {
      if (isLastActivity) {
        playCelebration();
      } else {
        playSuccess();
      }
      setLastCompletedActivity(currentActivityIndex);
    } else {
      playError();
    }

    addMessage({
      activityId,
      activityTitle: currentActivity?.title ?? 'Activity',
      activityOrder: currentActivityIndex + 1,
      message,
      isSuccess: isCorrect,
    });

    if (isCorrect) {
      setXp(prev => prev + earnedXP);
    } else {
      setLives(prev => Math.max(0, prev - 1));
    }

    setResultData({
      isSuccess: isCorrect,
      xpEarned: earnedXP,
      feedback: message,
      activityTitle: currentActivity?.title ?? 'Activity',
      isLastActivity: isCorrect && isLastActivity,
    });
    setShowResult(true);

    if (isCorrect) {
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
      case ActivityType.FILL_THE_BLANKS:
        return (
          <FillTheBlanks
            activity={currentActivity}
            onSubmit={(code, isCorrect) => {
              if (isCorrect) {
                handleCodeSubmit(code, currentActivity.targetFiles[0]);
              }
              handleActivityComplete(
                currentActivity.id,
                isCorrect,
                isCorrect ? 'fill-the-blanks-success' : 'fill-the-blanks-failure'
              );
            }}
          />
        );
              
      case ActivityType.TRUE_OR_FALSE:
        return (
          <TrueOrFalse
            key={currentActivity.id}
            activity={currentActivity}
            onSubmit={(answer) => {
              const isCorrect = answer === currentActivity.trueFalseConfig?.correctAnswer;
              handleActivityComplete(currentActivity.id, isCorrect);
            }}
          />
        );

      case ActivityType.READ_AND_CHOOSE:
        return (
          <ReadAndChoose
            activity={currentActivity}
            onSubmit={(choiceId, isCorrect) => {
              recordDecision(choiceId);
              handleActivityComplete(currentActivity.id, isCorrect);
            }}
          />
        );

      case ActivityType.SPOT_THE_BUG:
        return (
          <SpotTheBug
            activity={currentActivity}
            onSuccess={() =>
              handleActivityComplete(currentActivity.id, true, 'spot-the-bug-success')
            }
            onError={() =>
              handleActivityComplete(currentActivity.id, false, 'spot-the-bug-failure')
            }
          />
        );

      case ActivityType.QUALITY_REVIEW:
        return (
          <QualityReview
            activity={currentActivity}
            onApprove={() => handleActivityComplete(currentActivity.id, false, 'quality-review-approve')}
            onRegenerate={() => triggerAIResponse('quality-review-generate')}
            onEdit={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, true, 'quality-review-edit');
            }}
          />
        );

      case ActivityType.CONSTRAINED_EDIT:
        return (
          <ConstrainedEdit
            activity={currentActivity}
            onSubmit={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, true, 'constrained-edit-success');
            }}
          />
        );

      case ActivityType.DECISION_FORK:
        return (
          <DecisionFork
            activity={currentActivity}
            onDecide={(optionId) => {
              recordDecision(optionId);
              const responseKey =
                optionId === 'opt-context'
                  ? 'decision-fork-context'
                  : optionId === 'opt-zustand'
                    ? 'decision-fork-zustand'
                    : optionId === 'opt-localstorage'
                      ? 'decision-fork-localstorage'
                      : undefined;
              handleActivityComplete(currentActivity.id, true, responseKey);
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
              handleActivityComplete(currentActivity.id, true, 'break-and-fix-success');
            }}
            onError={() => {
              handleActivityComplete(currentActivity.id, false, 'break-and-fix-failure');
            }}
            onRequestHint={() => triggerAIResponse('break-and-fix-hint')}
          />
        );

      case ActivityType.VIDEO_CHALLENGE:
        return (
          <VideoChallenge
            activity={currentActivity}
            onComplete={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, true, 'video-challenge-success');
            }}
          />
        );

      case ActivityType.VISUAL_IMPLEMENTATION:
        return (
          <VisualImplementation
            activity={currentActivity}
            onComplete={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, true, 'visual-implementation-success');
            }}
          />
        );

      case ActivityType.FIX_THE_CODE:
        return (
          <FixTheCode
            activity={currentActivity}
            onSubmit={(code) => {
              handleCodeSubmit(code, currentActivity.targetFiles[0]);
              handleActivityComplete(currentActivity.id, true, 'fix-the-code-success');
            }}
          />
        );
      
      case ActivityType.BEST_IMPLEMENTATION:
        return (
          <BestImplementation
            activity={currentActivity}
            onSubmit={(selectedId) => {
              const isCorrect = selectedId === currentActivity.correctImplementationId;
              handleActivityComplete(currentActivity.id, isCorrect);
            }}
          />
        );
     
      case ActivityType.FIX_WITH_CHOICES:
        return (
          <FixWithChoices
            activity={currentActivity}
            onSubmit={(selectedId) => {
              const selected = currentActivity.fixOptions?.find(f => f.id === selectedId);
              const isCorrect = Boolean(selected?.isCorrect);

              handleActivityComplete(
                currentActivity.id,
                isCorrect,
                isCorrect ? 'fix-with-choices-success' : 'fix-with-choices-failure'
              );
            }}
          />
        );
        
      case ActivityType.REPL_CHALLENGE:
        return (
          <REPLChallenge
            activity={currentActivity}
            onSubmit={() => {
              handleActivityComplete(currentActivity.id, true, 'repl-challenge-success');
            }}
          />
        );
        
      case ActivityType.PARSONS_PROBLEM:
        return (
          <ParsonsProblem 
            activity={currentActivity} 
            onSubmit={(orderedIds) => {
              const correctOrder = currentActivity.correctOrder || [];
              const isCorrect = JSON.stringify(orderedIds) === JSON.stringify(correctOrder);

              handleActivityComplete(
                currentActivity.id,
                isCorrect,
                isCorrect ? 'parsons-problem-success' : 'parsons-problem-failure'
              );
            }}
          />
        );
        
      case ActivityType.PREDICT_OUTPUT:
        return (
          <PredictOutput 
            activity={currentActivity} 
            onSubmit={() => {
              handleActivityComplete(currentActivity.id, true);
            }}
            onError={() => {
              handleActivityComplete(currentActivity.id, false);
            }}
          />
        );

      case ActivityType.STEP_THROUGH:
        return (
          <StepThrough
            activity={currentActivity}
            onSubmit={(isCorrect) => {
              handleActivityComplete(
                currentActivity.id,
                isCorrect,
                isCorrect ? 'step-through-success' : 'step-through-failure'
              );
            }}
          />
        );

      default:
        return null;
    }
  };

  // Guards: lição inexistente ou sem atividades cadastradas.
  // Tem que vir DEPOIS de todos os hooks acima (Rules of Hooks).
  if (!lesson) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-bold text-foreground">Lição não encontrada</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Esta lição não existe ou foi removida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition"
        >
          Voltar para lições
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-bold text-foreground">{lesson.title}</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Esta lição ainda não tem atividades cadastradas.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition"
        >
          Voltar para lições
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Game Header */}
      <GameHeader
        lives={lives}
        streak={streak}
        xp={xp}
        onBack={() => navigate('/')}
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
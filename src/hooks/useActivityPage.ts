import { useState, useCallback, useEffect, useMemo } from 'react';
import { Activity } from '@/types';
import { ActivityStatus, ActivityType, ProjectStatus } from '@/enums';
import { activitiesData } from '@/test-utils/activities.dummy';
import { activityFeedback } from '@/consts/activity-feedback';
import { useProject } from './useProject';
import { useAIStreaming } from './useAIStreaming';

/**
 * Hook de página da lição.
 *
 * Recebe o `lessonId` (vindo da rota) e carrega as atividades dessa lição,
 * filtrando por `activity.lessonId` e ordenando por `activity.order`.
 *
 * O estado de progresso (`activities` com `status` mutável) reseta quando
 * `lessonId` muda — comportamento esperado ao trocar de lição.
 */
export function useActivityPage(lessonId: string) {
  const initialActivities = useMemo<Activity[]>(
    () =>
      activitiesData
        .filter((a) => a.lessonId === lessonId)
        .sort((a, b) => a.order - b.order),
    [lessonId]
  );

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activities, setActivities] = useState<Activity[]>(() => initialActivities);

  useEffect(() => {
    setActivities(initialActivities);
    setCurrentActivityIndex(0);
  }, [initialActivities]);

  
  const { 
    project, 
    gitLog, 
    updateFile, 
    setStatus, 
    addDecision, 
    addGitLogEntry 
  } = useProject();
  
  const { 
    text: aiResponse, 
    isStreaming: isAIStreaming, 
    streamText, 
    reset: resetAI 
  } = useAIStreaming();

  const currentActivity = useMemo(() => 
    activities[currentActivityIndex], 
    [activities, currentActivityIndex]
  );

  const canAdvance = useMemo(() => 
    currentActivity?.status === ActivityStatus.COMPLETED,
    [currentActivity]
  );

  const triggerAIResponse = useCallback(async (responseKey: string) => {
    const feedback = activityFeedback[responseKey];
    if (feedback?.streamText) {
      await streamText(feedback.streamText, 15);
    }
  }, [streamText]);

  const completeActivity = useCallback((activityId: string) => {
    setActivities(prev => prev.map((act, idx) => {
      if (act.id === activityId) {
        return { ...act, status: ActivityStatus.COMPLETED };
      }
      if (idx === currentActivityIndex + 1 && act.status === ActivityStatus.LOCKED) {
        return { ...act, status: ActivityStatus.CURRENT };
      }
      return act;
    }));
  }, [currentActivityIndex]);

  /**
   * Marca a atividade como `COMPLETED`, desbloqueia a próxima e dispara o
   * stream da resposta da AI.
   *
   * Este método é chamado pela `LessonPage` APENAS quando o aluno acerta
   * a atividade — a checagem de sucesso/falha vive na página (que decide
   * com base no `isCorrect` passado para `handleActivityComplete`). O hook
   * não precisa, portanto, ser informado do resultado.
   */
  const handleActivityComplete = useCallback(async (activityId: string, responseKey?: string) => {
    completeActivity(activityId);

    addGitLogEntry({
      activityId,
      message: `feat: ${currentActivity?.title} completada`,
      filesChanged: currentActivity?.targetFiles || [],
      type: 'activity_complete',
    });

    if (responseKey) {
      await triggerAIResponse(responseKey);
    }
  }, [completeActivity, addGitLogEntry, currentActivity, triggerAIResponse]);

  /**
   * Grava escolha no projeto/git log apenas. Conclusão da atividade e stream de AI
   * ficam com `handleActivityComplete` na LessonPage (modal + progresso).
   */
  const recordDecision = useCallback(
    (choiceId: string) => {
      if (!currentActivity) return;

      const fromOptions = currentActivity.options?.find((o) => o.id === choiceId);
      if (fromOptions) {
        addDecision({
          activityId: currentActivity.id,
          activityTitle: currentActivity.title,
          choice: fromOptions.label,
          timestamp: new Date(),
          description: fromOptions.impact,
        });
        addGitLogEntry({
          activityId: currentActivity.id,
          message: `decision: ${fromOptions.label} escolhido`,
          filesChanged: currentActivity.targetFiles ?? [],
          type: 'decision',
        });
        return;
      }

      const fromChoices = currentActivity.choices?.find((c) => c.id === choiceId);
      if (fromChoices) {
        addDecision({
          activityId: currentActivity.id,
          activityTitle: currentActivity.title,
          choice: fromChoices.label,
          timestamp: new Date(),
          description: fromChoices.description,
        });
        addGitLogEntry({
          activityId: currentActivity.id,
          message: `escolha: ${fromChoices.label}`,
          filesChanged: currentActivity.targetFiles ?? [],
          type: 'decision',
        });
      }
    },
    [currentActivity, addDecision, addGitLogEntry]
  );

  /**
   * Persiste o código submetido pelo aluno.
   *
   * Para `BREAK_AND_FIX`, também marca o projeto como `OK` e adiciona uma entrada
   * `fix` no git log — efeitos colaterais do estado do projeto.
   *
   * IMPORTANTE: este método NÃO dispara stream de AI nem completa a atividade.
   * Essa responsabilidade é da página (via `handleActivityComplete`), evitando
   * duplicação quando ambos são chamados em sequência.
   */
  const handleCodeSubmit = useCallback((code: string, filePath: string) => {
    updateFile(filePath, code);

    if (currentActivity?.type === ActivityType.BREAK_AND_FIX) {
      setStatus(ProjectStatus.OK);
      addGitLogEntry({
        activityId: currentActivity.id,
        message: `fix: bug corrigido em ${filePath}`,
        filesChanged: [filePath],
        type: 'fix',
      });
    }
  }, [updateFile, currentActivity, setStatus, addGitLogEntry]);

  const goToNextActivity = useCallback(() => {
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
      resetAI();
    }
  }, [currentActivityIndex, activities.length, resetAI]);

  const goToPreviousActivity = useCallback(() => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(prev => prev - 1);
      resetAI();
    }
  }, [currentActivityIndex, resetAI]);

  const goToActivity = useCallback((index: number) => {
    const activity = activities[index];
    if (activity && activity.status !== ActivityStatus.LOCKED) {
      setCurrentActivityIndex(index);
      resetAI();
    }
  }, [activities, resetAI]);

  const setProjectBroken = useCallback(() => {
    setStatus(ProjectStatus.BROKEN);
  }, [setStatus]);

  const setProjectOK = useCallback(() => {
    setStatus(ProjectStatus.OK);
  }, [setStatus]);

  return {
    currentActivity,
    activities,
    currentActivityIndex,
    project,
    gitLog,
    isAIStreaming,
    aiResponse,
    canAdvance,
    handleActivityComplete,
    recordDecision,
    handleCodeSubmit,
    triggerAIResponse,
    goToNextActivity,
    goToPreviousActivity,
    goToActivity,
    setProjectBroken,
    setProjectOK,
    resetAI,
  };
}

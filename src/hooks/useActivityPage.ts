import { useState, useCallback, useMemo } from 'react';
import { Activity } from '@/types';
import { ActivityStatus, ActivityType, ProjectStatus } from '@/enums';
import { activitiesData } from '@/test-utils/activities.dummy';
import { aiResponses } from '@/consts/ai-responses';
import { useProject } from './useProject';
import { useAIStreaming } from './useAIStreaming';

export function useActivityPage() {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activities, setActivities] = useState<Activity[]>(activitiesData);
  
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
    const response = aiResponses[responseKey];
    if (response) {
      await streamText(response.text, 15);
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

  const handleDecision = useCallback(async (optionId: string) => {
    const option = currentActivity?.options?.find(o => o.id === optionId);
    if (!option || !currentActivity) return;

    addDecision({
      activityId: currentActivity.id,
      activityTitle: currentActivity.title,
      choice: option.label,
      timestamp: new Date(),
      description: option.impact,
    });

    addGitLogEntry({
      activityId: currentActivity.id,
      message: `decision: ${option.label} escolhido`,
      filesChanged: currentActivity.targetFiles,
      type: 'decision',
    });

    const responseKey = `act-3-${optionId.replace('opt-', '')}`;
    await triggerAIResponse(responseKey);
    
    completeActivity(currentActivity.id);
  }, [currentActivity, addDecision, addGitLogEntry, triggerAIResponse, completeActivity]);

  const handleCodeSubmit = useCallback(async (code: string, filePath: string) => {
    updateFile(filePath, code);
    
    if (currentActivity?.type === ActivityType.BREAK_AND_FIX) {
      setStatus(ProjectStatus.OK);
      addGitLogEntry({
        activityId: currentActivity.id,
        message: `fix: bug corrigido em ${filePath}`,
        filesChanged: [filePath],
        type: 'fix',
      });
      await triggerAIResponse('act-4-success');
      completeActivity(currentActivity.id);
    }
  }, [updateFile, currentActivity, setStatus, addGitLogEntry, triggerAIResponse, completeActivity]);

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
    handleDecision,
    handleCodeSubmit,
    triggerAIResponse,
    goToNextActivity,
    goToPreviousActivity,
    goToActivity,
    setProjectBroken,
    resetAI,
  };
}

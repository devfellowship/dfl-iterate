import { useCallback, useEffect, useState } from 'react';
import { Activity } from '@/types';

/** Callbacks owned by the page / router — hook stays presentation-agnostic. */
export interface UseQualityReviewCallbacks {
  onApprove: () => void;
  onRegenerate: () => void;
  onEdit: (code: string) => void;
}

/**
 * Gold-standard activity hook: `activity` + stable `callbacks` object.
 * Keeps editor / warning UI state; resets when the activity instance changes.
 */
export function useQualityReview(activity: Activity, callbacks: UseQualityReviewCallbacks) {
  const { onApprove, onRegenerate, onEdit } = callbacks;

  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState(() => activity.aiGeneratedCode ?? '');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setCode(activity.aiGeneratedCode ?? '');
    setIsEditing(false);
    setShowWarning(false);
  }, [activity.id, activity.aiGeneratedCode]);

  const enterEditMode = useCallback(() => {
    setIsEditing(true);
  }, []);

  /** Atividade = fonte da verdade: descartar rascunho ao sair sem salvar (fluxo curto / bate-pronto). */
  const cancelEdit = useCallback(() => {
    setCode(activity.aiGeneratedCode ?? '');
    setIsEditing(false);
  }, [activity.aiGeneratedCode]);

  const saveEdit = useCallback(() => {
    onEdit(code);
    setIsEditing(false);
  }, [code, onEdit]);

  const approve = useCallback(() => {
    if (activity.expectedIssues?.length) {
      setShowWarning(true);
    }
    onApprove();
  }, [activity.expectedIssues, onApprove]);

  const activateEditFromPreview = useCallback(() => {
    if (!isEditing) {
      setIsEditing(true);
    }
  }, [isEditing]);

  return {
    code,
    setCode,
    isEditing,
    showWarning,
    question: isEditing
      ? 'Salve suas edições quando terminar'
      : 'O código está pronto para produção?',
    enterEditMode,
    cancelEdit,
    saveEdit,
    approve,
    onRegenerate,
    activateEditFromPreview,
  };
}

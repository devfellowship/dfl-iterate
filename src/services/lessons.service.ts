import { lessonsData } from '@/test-utils/lessons.dummy';
import { LessonsProgressData } from '@/test-utils/lesson-progress.dummy';
import type { LessonProgress } from '@/components/data-layer';
import type { Lesson } from '@/types';

/**
 * Camada de dados das lições.
 *
 * Hoje: lê do dummy local com latência simulada.
 * Amanhã: vira `fetch` para os endpoints definidos em `src/api/contracts.ts`.
 *
 * Regras desta camada (padrão do projeto):
 * - Funções assíncronas (`async`), sempre retornam Promise.
 * - Sem React aqui (nada de hooks, JSX, useState).
 * - Erro semântico (recurso não existe) é `throw new Error(...)`. O React Query
 *   transforma isso em estado `isError`, que a UI trata.
 */

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getLessons(): Promise<Lesson[]> {
  await simulateNetworkDelay();
  return lessonsData;
}

export async function getLessonById(id: string): Promise<Lesson> {
  await simulateNetworkDelay();
  const lesson = lessonsData.find((l) => l.id === id);
  if (!lesson) {
    throw new Error(`Lesson not found: ${id}`);
  }
  return lesson;
}

export async function getLessonProgressData(): Promise<LessonProgress[]> {
  await simulateNetworkDelay();
  return LessonsProgressData;
}

export async function getLessonProgress(lessonId: string): Promise<LessonProgress> {
  await simulateNetworkDelay();
  const lesson = LessonsProgressData.find((l) => l.lessonId === lessonId);
  if (!lesson) {
    throw new Error(`Lesson progress not found: ${lessonId}`);
  }
  return {
    lessonId: lesson.lessonId,
    completedActivities: lesson.completedActivities,
    totalActivities: lesson.totalActivities,
    percent: Math.round((lesson.completedActivities / lesson.totalActivities) * 100),
  };
}
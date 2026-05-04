/**
 * API Contracts for dfl-iterate
 *
 * Defines the request/response shapes for AI feedback endpoints
 * and lesson data APIs consumed by the platform.
 */

/** Request payload for AI code review feedback */
export interface AIFeedbackRequest {
  code: string;
  activityType: string;
  activityId: string;
  language: string;
  context?: string;
}

/** Streamed AI feedback response chunk */
export interface AIFeedbackChunk {
  type: 'text' | 'suggestion' | 'done';
  content: string;
  timestamp: number;
}

/** Lesson data fetched from the LMS backend */
export interface LessonPayload {
  id: string;
  title: string;
  description: string;
  projectName: string;
  totalActivities: number;
  estimatedMinutes: number;
  activities: ActivityPayload[];
}

/** Activity data within a lesson */
export interface ActivityPayload {
  id: string;
  order: number;
  type: string;
  title: string;
  objective: string;
  instructions: string;
  targetFiles: string[];
  options?: unknown[];
  testCases?: {
    input: string;
    expectedOutput: string;
    description: string;
  }[];
}

/** Progress submission for completed activities */
export interface ProgressSubmission {
  lessonId: string;
  activityId: string;
  completedAt: string;
  score?: number;
  codeSnapshot?: string;
}

/** API base paths (to be configured per environment) */
export const API_PATHS = {
  aiFeedback: '/api/ai/feedback',
  lessons: '/api/lessons',
  progress: '/api/progress',
} as const;

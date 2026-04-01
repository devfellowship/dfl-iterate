export type ActivityType = "STEP_THROUGH";

export interface Step {
  lineNumber: number;
  question: string;
  correctAnswer: string;
  variables?: Record<string, unknown>;
}

export interface Activity {
  type: ActivityType;
  aiGeneratedCode: string;
  steps: Step[];
}
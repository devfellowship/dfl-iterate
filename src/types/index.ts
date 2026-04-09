import { ActivityType, ActivityStatus, ProjectStatus } from '@/enums';
import { StepVariableValue } from './StepVariableValue';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  projectName: string;
  totalActivities: number;
  estimatedMinutes: number;
  thumbnail?: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  impact: string;
}

export type FixOption = {
  id: string;
  code: string;
  explanation: string;
  isCorrect: boolean;
};
export interface ChooseOption {
  id: string;
  label: string;
  description: string;
  code?: string;
  explanation?: string;
  isCorrect?: boolean;
}

export interface EditableRegion {
  startLine: number;
  endLine: number;
  hint?: string;
}

export interface VideoConfig {
  youtubeId: string;
  title: string;
  duration: string;
  thumbnailUrl?: string;
}

export interface VisualConfig {
  imageUrl: string;
  caption?: string;
  expectedOutput?: string;
}

export interface Step {
  lineNumber: number;
  question: string;
  correctAnswer: string;
  variables?: Record<string, StepVariableValue>;
}

export interface Activity {
  id: string;
  lessonId: string;
  order: number;
  type: ActivityType;
  title: string;
  objective: string;
  instructions: string;
  targetFiles: string[];
  status: ActivityStatus;
  options?: DecisionOption[]; 
  fixOptions?: FixOption[];
  choices?: ChooseOption[];
  aiGeneratedCode?: string;
  expectedIssues?: string[];
  editableRegions?: EditableRegion[];
  videoConfig?: VideoConfig;
  visualConfig?: VisualConfig;
 steps?: Step[];  
  testCases?: {
    input: string;
    expectedOutput: string;
    description: string;
  }[];
}

export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  language: string;
}

export interface Decision {
  activityId: string;
  activityTitle: string;
  choice?: string;
  timestamp: Date;
  description: string;
}

export interface ProjectState {
  id: string;
  name: string;
  status: ProjectStatus;
  currentActivityIndex: number;
  files: ProjectFile[];
  decisions: Decision[];
}

export interface GitLogEntry {
  id: string;
  activityId: string;
  message: string;
  timestamp: Date;
  filesChanged: string[];
  type: 'activity_complete' | 'decision' | 'fix';
}

/** result from executing a test case */
export interface TestResult {
  description: string;
  passed: boolean;
  output?: string;
}

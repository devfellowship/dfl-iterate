import { ActivityType, ActivityStatus, ProjectStatus } from '@/enums';

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
  aiGeneratedCode?: string;
  expectedIssues?: string[];
  editableRegions?: EditableRegion[];
  videoConfig?: VideoConfig;
  visualConfig?: VisualConfig;
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

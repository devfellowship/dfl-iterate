export enum ActivityType {
  QUALITY_REVIEW = 'quality_review',
  CONSTRAINED_EDIT = 'constrained_edit',
  DECISION_FORK = 'decision_fork',
  BREAK_AND_FIX = 'break_and_fix',
  VIDEO_CHALLENGE = 'video_challenge',
  VISUAL_IMPLEMENTATION = 'visual_implementation',
}

export enum ProjectStatus {
  OK = 'ok',
  WARNING = 'warning',
  BROKEN = 'broken',
}

export enum ActivityStatus {
  LOCKED = 'locked',
  CURRENT = 'current',
  COMPLETED = 'completed',
}

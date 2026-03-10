export enum ActivityType {
  READ_AND_CHOOSE = 'READ_AND_CHOOSE',
  SPOT_THE_BUG = 'SPOT_THE_BUG',
  QUALITY_REVIEW = 'QUALITY_REVIEW',
  CONSTRAINED_EDIT = 'CONSTRAINED_EDIT',
  DECISION_FORK = 'DECISION_FORK',
  BREAK_AND_FIX = 'BREAK_AND_FIX',
  VIDEO_CHALLENGE = 'VIDEO_CHALLENGE',
  VISUAL_IMPLEMENTATION = 'VISUAL_IMPLEMENTATION',
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

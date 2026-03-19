export enum ActivityType {
  QUALITY_REVIEW = 'quality_review',
  CONSTRAINED_EDIT = 'constrained_edit',
  DECISION_FORK = 'decision_fork',
  BREAK_AND_FIX = 'break_and_fix',
  VIDEO_CHALLENGE = 'video_challenge',
  VISUAL_IMPLEMENTATION = 'visual_implementation',
  FIX_WITH_CHOICES = "fix_with_choices",
  READ_AND_CHOOSE = "read_and_choose",
  FIX_THE_CODE = "fix_the_code",
  PREDICT_OUTPUT = "predict_output",
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

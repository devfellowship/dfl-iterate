export enum ActivityType {
  READ_AND_CHOOSE = 'read_and_choose',
  QUALITY_REVIEW = 'quality_review',
  CONSTRAINED_EDIT = 'constrained_edit',
  DECISION_FORK = 'decision_fork',
  BREAK_AND_FIX = 'break_and_fix',
  VIDEO_CHALLENGE = 'video_challenge',
  VISUAL_IMPLEMENTATION = 'visual_implementation',
  SPOT_THE_BUG = 'spot_the_bug',
  FIX_WITH_CHOICES = "fix_with_choices",
  READ_AND_CHOOSE = "read_and_choose",
  PREDICT_OUTPUT = "predict_output",
  FIX_THE_CODE = 'fix_the_code',
  TRUE_OR_FALSE = 'true_or_false',
  REPL_CHALLENGE = 'repl_challenge',
  STEP_THROUGH = 'step_through', 
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

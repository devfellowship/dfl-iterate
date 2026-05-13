export enum ActivityType {
  BEST_IMPLEMENTATION = 'best_implementation',
  BREAK_AND_FIX = 'break_and_fix',
  CONSTRAINED_EDIT = 'constrained_edit',
  DECISION_FORK = 'decision_fork',
  FILL_THE_BLANKS = 'fill_the_blanks',
  FIX_THE_CODE = 'fix_the_code',
  FIX_WITH_CHOICES = 'fix_with_choices',
  PARSONS_PROBLEM = 'parsons_problem',
  PREDICT_OUTPUT = 'predict_output',
  QUALITY_REVIEW = 'quality_review',
  READ_AND_CHOOSE = 'read_and_choose',
  REPL_CHALLENGE = 'repl_challenge',
  SPOT_THE_BUG = 'spot_the_bug',
  STEP_THROUGH = 'step_through',
  TRUE_OR_FALSE = 'true_or_false',
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

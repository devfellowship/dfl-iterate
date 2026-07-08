export type ActivityEventType =
  | "lesson_completed"
  | "achievement_unlocked"
  | "streak_milestone";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  label: string;
  occurredAt: string;
}

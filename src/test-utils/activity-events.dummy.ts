import { ActivityEvent } from "@/types";

export const activitiesEventData: ActivityEvent[] = [
  {
    id: 'evt-1',
    type: 'lesson_completed',
    label: 'Você completou a activity act-05',
    occurredAt: '2026-05-27T18:30:00.000Z'
  },
  {
    id: 'evt-2',
    type: 'achievement_unlocked',
    label: 'Conquista desbloqueada: Sequência de fogo',
    occurredAt: '2026-05-25T09:00:00.000Z'
  },
  {
    id: 'evt-3',
    type: 'streak_milestone',
    label: 'Streak de 3 dias alcançado',
    occurredAt: '2026-05-25T09:00:00.000Z'
  }
];
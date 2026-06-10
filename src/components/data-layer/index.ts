/**
 * Componentes presentacionais — Batch Camada de Dados.
 *
 * MAPA DE INTEGRAÇÃO (fellows conectam hooks aqui):
 *
 * GameHeader (`/lesson/:id`)          HomePage (`/`)
 * ├─ T1 UserProfileCard (compact)     ├─ T7 DailyChallengeBanner (topo do main)
 * ├─ T4 UserStatsBadge                ├─ T3 AnnouncementList
 * ├─ T6 AchievementsList (no drawer)  ├─ T5 LessonProgressBar (em cada LessonCard)
 * └─ T2 AppearanceSettingsPanel       └─ T8 LeaderboardTable
 *     (dentro do modal ⚙️)
 *
 * Estes componentes não importam React Query — só recebem props.
 */

export { UserProfileCard } from './UserProfileCard';
export { AppearanceSettingsPanel } from './AppearanceSettingsPanel';
export { AnnouncementList } from './AnnouncementList';
export { UserStatsBadge } from './UserStatsBadge';
export { LessonProgressBar } from './LessonProgressBar';
export { AchievementsList } from './AchievementsList';
export { DailyChallengeBanner } from './DailyChallengeBanner';
export { LeaderboardTable } from './LeaderboardTable';

export type * from './types';

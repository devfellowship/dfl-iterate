/**
 * Componentes presentacionais — Batch Camada de Dados.
 *
 * MAPA DE INTEGRAÇÃO (fellows conectam hooks nos *DataSlots*):
 *
 * HomePage header (`/`)
 * ├─ T1 UserProfileCard (compact)
 * ├─ T4 UserStatsBadge
 * ├─ T10 NotificationBell (drawer 🔔)
 * ├─ T6 AchievementsList (drawer 🏆)
 * └─ T2 AppearanceSettingsPanel (drawer ⚙️)
 *
 * HomePage body (`/`)
 * ├─ T9 ContinueLearningCard
 * ├─ T7 DailyChallengeBanner
 * ├─ T3 AnnouncementList
 * ├─ T11 RecentActivityFeed
 * ├─ T5 LessonProgressBar (LessonCard)
 * └─ T8 LeaderboardTable
 *
 * GameHeader (`/lesson/:id`) — vidas/streak/xp + botão voltar (fora do batch).
 */

export { UserProfileCard } from './UserProfileCard';
export { AppearanceSettingsPanel } from './AppearanceSettingsPanel';
export { AnnouncementList } from './AnnouncementList';
export { UserStatsBadge } from './UserStatsBadge';
export { LessonProgressBar } from './LessonProgressBar';
export { AchievementsList } from './AchievementsList';
export { DailyChallengeBanner } from './DailyChallengeBanner';
export { LeaderboardTable } from './LeaderboardTable';
export { ContinueLearningCard } from './ContinueLearningCard';
export { NotificationBellIcon, NotificationList } from './NotificationBell';
export { RecentActivityFeed } from './RecentActivityFeed';

export type * from './types';

export { HomePageHeaderDataSlots } from './HomePageHeaderDataSlots';
export { HomePageTopDataSlots, HomePageBottomDataSlots } from './HomePageDataSlots';

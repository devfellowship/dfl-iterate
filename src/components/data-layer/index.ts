/**
 * Componentes presentacionais — Batch Camada de Dados.
 *
 * MAPA DE INTEGRAÇÃO (fellows conectam hooks aqui):
 *
 * HomePage header (`/`)               HomePage body (`/`)
 * ├─ T1 UserProfileCard (compact)     ├─ T7 DailyChallengeBanner
 * ├─ T4 UserStatsBadge                ├─ T3 AnnouncementList
 * ├─ T6 AchievementsList (drawer)     ├─ T5 LessonProgressBar (LessonCard)
 * └─ T2 AppearanceSettingsPanel       └─ T8 LeaderboardTable
 *     (drawer ⚙️)
 *
 * GameHeader (`/lesson/:id`) — vidas/streak/xp da sessão + botão voltar ao início.
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

export { HomePageHeaderDataSlots } from './HomePageHeaderDataSlots';
export { HomePageTopDataSlots, HomePageBottomDataSlots } from './HomePageDataSlots';

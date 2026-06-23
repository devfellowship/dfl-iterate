import { useState } from 'react';
import { Settings, Trophy } from 'lucide-react';
import { Button } from '@devfellowship/components';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  UserProfileCard,
  UserStatsBadge,
  AppearanceSettingsPanel,
  AchievementsList,
  NotificationBellIcon,
  NotificationList,
} from '@/components/data-layer';
import {
  previewAchievements,
  previewNotifications,
  previewUserPreferences,
  previewUserProfile,
} from '@/components/data-layer/preview.mock';
import { PreviewSectionLabel } from './PreviewSectionLabel';
import { useGetUserStats } from '@/hooks';

/**
 * Preview + slots T1, T2, T4, T6 no header da `HomePage`.
 *
 * Fellow T1: substituir mock por `useGetUserProfile()` + estados.
 * Fellow T4: substituir mock por `useGetUserStats()`.
 * Fellow T6: drawer 🏆 → `useGetUserAchievements()`.
 * Fellow T2: drawer ⚙️ → `useGetUserPreferences()`.
 * Fellow T10: drawer 🔔 → `useGetNotifications()`.
 */
export function HomePageHeaderDataSlots() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const {
    data: stats,
    isError,
    isPending,
    refetch,
  } = useGetUserStats();

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
      {/* SLOT T4 */}
      {isError ? (
        <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <span>Não foi possível carregar seus stats.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Tentar de novo
          </Button>
        </div>
      ) : stats ? (
        <UserStatsBadge stats={stats} className="flex" />
      ) : (
        <span className="rounded-full border border-border bg-muted/25 px-3 py-2 text-sm text-muted-foreground">
          Carregando stats...
        </span>
      )}

      {/* SLOT T6 */}
      <Drawer open={achievementsOpen} onOpenChange={setAchievementsOpen}>
        <DrawerTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            aria-label="Conquistas"
          >
            <Trophy className="h-4 w-4 text-xp" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Conquistas</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-2">
            <PreviewSectionLabel taskId="T6" />
            <AchievementsList achievements={previewAchievements} />
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="mx-4 mb-4">
              Fechar
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {/* SLOT T10 */}
      <Drawer open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DrawerTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            aria-label="Notificações"
          >
            <NotificationBellIcon unreadCount={previewNotifications.unreadCount} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Notificações</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-2">
            <PreviewSectionLabel taskId="T10" />
            <NotificationList summary={previewNotifications} />
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="mx-4 mb-4">
              Fechar
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {/* SLOT T2 */}
      <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DrawerTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            aria-label="Preferências"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <div className="overflow-y-auto px-4 pb-2 pt-2">
            <PreviewSectionLabel taskId="T2" />
            <AppearanceSettingsPanel preferences={previewUserPreferences} />
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="mx-4 mb-4">
              Fechar
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {/* SLOT T1 */}
      <UserProfileCard profile={previewUserProfile} variant="compact" />
    </div>
  );
}

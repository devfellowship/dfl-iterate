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
  previewUserStats,
} from '@/components/data-layer/preview.mock';
import { PreviewSectionLabel } from './PreviewSectionLabel';
import { useGetUserProfile } from '@/hooks';
import { i } from 'framer-motion/client';

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
  const { data: userProfileData, isPending: isUserProfilePending, isError: isUserProfileError, refetch: userProfileRefetch, } = useGetUserProfile();

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
      {/* SLOT T4 */}
      <UserStatsBadge stats={previewUserStats} className="flex" />

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
      {isUserProfilePending ? (
            <div>Loading...</div>
         ) : isUserProfileError ? (
            <>
              <span>Erro</span>
              <Button onClick={() => userProfileRefetch()}>
                Tentar de novo
              </Button>
            </>
         ) : (
            <UserProfileCard 
              profile={userProfileData} 
              variant="compact" 
            />
         )
      }
    </div>
  );
}

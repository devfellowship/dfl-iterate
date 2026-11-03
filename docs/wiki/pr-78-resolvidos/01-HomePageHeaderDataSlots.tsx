import { useGetNotifications } from '@/hooks/useGetNotifications';
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
import { previewAchievements } from '@/components/data-layer/preview.mock';
import {
  useGetUserPreferences,
  useUpdateUserPreferences,
  useGetUserProfile,
  useGetUserStats,
} from '@/hooks';
import { PreviewSectionLabel } from './PreviewSectionLabel';

export function HomePageHeaderDataSlots() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pendingField, setPendingField] = useState<'theme' | 'sound' | null>(
    null,
  );

  const {
    data: userProfileData,
    isPending: isUserProfilePending,
    isError: isUserProfileError,
    refetch: userProfileRefetch,
  } = useGetUserProfile();

  const {
    data: notificationsData,
    isPending: isNotificationsPending,
    isError: isNotificationsError,
    refetch: notificationsRefetch,
  } = useGetNotifications();

  const {
    data: preferences,
    isPending: isPreferencesPending,
    isError: isPreferencesError,
    isFetching: isPreferencesFetching,
    refetch: refetchPreferences,
  } = useGetUserPreferences();

  const {
    mutate: updatePreferences,
    isPending: isUpdatingPreferences,
    isError: isUpdateError,
  } = useUpdateUserPreferences();

  const {
    data: userStatsData,
    isError: userStatsIsError,
    isPending: userStatsIsPending,
    refetch: userStatsRefetch,
  } = useGetUserStats();

  const isSavingPreferences = isUpdatingPreferences || isPreferencesFetching;
  const isSavingTheme = pendingField === 'theme' && isSavingPreferences;
  const isSavingSound = pendingField === 'sound' && isSavingPreferences;

  const handleToggleTheme = () => {
    if (!preferences) return;
    setPendingField('theme');
    updatePreferences({
      ...preferences,
      theme: preferences.theme === 'dark' ? 'light' : 'dark',
    });
  };

  const handleToggleSound = () => {
    if (!preferences) return;
    setPendingField('sound');
    updatePreferences({
      ...preferences,
      soundEffectsEnabled: !preferences.soundEffectsEnabled,
    });
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
      {/* SLOT T4 */}
      {userStatsIsPending ? (
        <span className="rounded-full border border-border bg-muted/25 px-3 py-2 text-sm text-muted-foreground">
          Carregando stats...
        </span>
      ) : userStatsIsError ? (
        <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <span>Não foi possível carregar seus stats.</span>
          <Button variant="outline" size="sm" onClick={() => userStatsRefetch()}>
            Tentar de novo
          </Button>
        </div>
      ) : userStatsData ? (
        <UserStatsBadge stats={userStatsData} className="flex" />
      ) : null}

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
            <NotificationBellIcon
              unreadCount={notificationsData?.unreadCount ?? 0}
            />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Notificações</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-2">
            <PreviewSectionLabel taskId="T10" />
            {isNotificationsPending ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Carregando...
              </p>
            ) : isNotificationsError ? (
              <div className="text-center py-6">
                <p className="text-sm text-destructive mb-2">
                  Erro ao carregar notificações.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => notificationsRefetch()}
                >
                  Tentar de novo
                </Button>
              </div>
            ) : (
              <NotificationList summary={notificationsData} />
            )}
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="mx-4 mb-4">
              Fechar
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {/* SLOT T2 / M2 */}
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
            {isPreferencesPending && <p>Carregando preferências…</p>}
            {isPreferencesError && (
              <div>
                <p>Não foi possível carregar suas preferências.</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => refetchPreferences()}
                >
                  Tentar de novo
                </Button>
              </div>
            )}
            {!isPreferencesPending && !isPreferencesError && preferences && (
              <AppearanceSettingsPanel
                preferences={preferences}
                onToggleTheme={handleToggleTheme}
                onToggleSound={handleToggleSound}
                isUpdatingTheme={isSavingTheme}
                isUpdatingSound={isSavingSound}
                updateError={
                  isUpdateError
                    ? 'Não foi possível salvar suas preferências.'
                    : undefined
                }
              />
            )}
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
          <Button onClick={() => userProfileRefetch()}>Tentar de novo</Button>
        </>
      ) : (
        <UserProfileCard profile={userProfileData} variant="compact" />
      )}
    </div>
  );
}

import { Button } from '@devfellowship/components';
import {
  DailyChallengeBanner,
  AnnouncementList,
  LeaderboardTable,
  ContinueLearningCard,
  RecentActivityFeed,
} from '@/components/data-layer';
import {
  previewActivityEvents,
  previewAnnouncements,
  previewDailyChallenge,
  previewLeaderboard,
  previewLearningResume,
} from '@/components/data-layer/preview.mock';
import { useAnnouncements } from '@/hooks';
import { PreviewSectionLabel } from './PreviewSectionLabel';
import { useGetRecentActivity } from '@/hooks';

/** SLOT T9, T7, T3, T11 — topo da HomePage (antes do hero) */
export function HomePageTopDataSlots() {
  const {
    data: announcementesData = [],
    isPending: isAnnouncementsPending,
    isError: isAnnouncementsError,
    refetch: refetchAnnouncements,
  } = useAnnouncements();

  const { data: activityEvents, isPending: isActivityPending, isError: isActivityError, refetch: refetchActivity } = useGetRecentActivity();
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 mb-12">
      <section data-slot="T9">
        <PreviewSectionLabel taskId="T9" />
        <ContinueLearningCard resume={previewLearningResume} />
      </section>

      <section data-slot="T7">
        <PreviewSectionLabel taskId="T7" />
        <DailyChallengeBanner challenge={previewDailyChallenge} />
      </section>

      <section data-slot="T3">
        <h2 className="text-lg font-semibold text-foreground mb-3">Avisos</h2>
        {isAnnouncementsPending ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Carregando avisos...
          </p>
        ) : isAnnouncementsError ? (
          <div
            className="flex flex-col items-center gap-4 py-4"
            data-testid="announcement-list-error"
          >
            <p className="text-muted-foreground text-center max-w-md">
              Não foi possível carregar os avisos.
            </p>
            <Button onClick={() => refetchAnnouncements()}>Tentar de novo</Button>
          </div>
        ) : (
          <AnnouncementList announcementsData={announcementesData} />
        )}
      </section>

      <section data-slot="T11">
        <h2 className="text-lg font-semibold text-foreground mb-3">Atividade recente</h2>
        <PreviewSectionLabel taskId="T11" />

        {isActivityPending && <p>Carregando...</p>}

        {isActivityError && (
          <div>
            <p>Erro ao carregar atividade recente.</p>
            <button onClick={() => refetchActivity()}>Tentar de Novo</button>
          </div>
        )}

        {activityEvents && <RecentActivityFeed events={activityEvents} />}
      </section>
    </div>
  );
}

/** SLOT T8 — rodapé da HomePage (após o grid de lições) */
export function HomePageBottomDataSlots() {
  return (
    <section className="max-w-4xl mx-auto mt-12" data-slot="T8">
      <PreviewSectionLabel taskId="T8" />
      <LeaderboardTable entries={previewLeaderboard} />
    </section>
  );
}

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
import { PreviewSectionLabel } from './PreviewSectionLabel';

/** SLOT T9, T7, T3, T11 — topo da HomePage (antes do hero) */
export function HomePageTopDataSlots() {
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
        <PreviewSectionLabel taskId="T3" />
        <AnnouncementList announcements={previewAnnouncements} />
      </section>

      <section data-slot="T11">
        <h2 className="text-lg font-semibold text-foreground mb-3">Atividade recente</h2>
        <PreviewSectionLabel taskId="T11" />
        <RecentActivityFeed events={previewActivityEvents} />
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

import {
  DailyChallengeBanner,
  AnnouncementList,
  LeaderboardTable,
} from '@/components/data-layer';
import {
  previewAnnouncements,
  previewDailyChallenge,
  previewLeaderboard,
} from '@/components/data-layer/preview.mock';
import { PreviewSectionLabel } from './PreviewSectionLabel';

/** SLOT T7 + T3 — topo da HomePage (antes do hero) */
export function HomePageTopDataSlots() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 mb-12">
      <section data-slot="T7">
        <PreviewSectionLabel taskId="T7" />
        <DailyChallengeBanner challenge={previewDailyChallenge} />
      </section>

      <section data-slot="T3">
        <h2 className="text-lg font-semibold text-foreground mb-3">Avisos</h2>
        <PreviewSectionLabel taskId="T3" />
        <AnnouncementList announcements={previewAnnouncements} />
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

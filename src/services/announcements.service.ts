import { announcementsData } from '@/test-utils/announcements.dummy';
import type { Announcement } from '@/types';

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

function isActiveAnnouncement(announcement: Announcement): boolean {
  if (announcement.expiresAt === null) return true;
  return new Date(announcement.expiresAt).getTime() > Date.now();
}

export async function getAnnouncements(): Promise<Announcement[]> {
  await simulateNetworkDelay();

  const announcementsDataResponse = announcementsData;
  const announcementsDataResponseFiltered =
    announcementsDataResponse.filter(isActiveAnnouncement);

  return announcementsDataResponseFiltered;
}

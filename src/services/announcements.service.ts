import { announcementsData } from '@/test-utils/announcements.dummy';
import type { Announcement } from '@/types';

const SIMULATED_LATENCY_MS = 300;
const announcementsDataResponseFiltered = announcementsData.filter(isActiveAnnouncement);
const announcementesDataResponse = {
  announcements: getAnnouncements,
  isLoading: false,
  isError: false,
  error: null,
};


const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

function isActiveAnnouncement(announcement: Announcement): boolean {
  if (announcement.expiresAt === null) return true;
  return new Date(announcement.expiresAt).getTime() > Date.now();
}

export async function getAnnouncements(): Promise<Announcement[]> {
  await simulateNetworkDelay();
  return announcementsDataResponseFiltered;
}

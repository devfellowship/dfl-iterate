import { ActivityEvent } from "@/types";
import { activitiesEventData } from "@/test-utils/activity-events.dummy";

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getRecentActivity(): Promise<ActivityEvent[]> {
  await simulateNetworkDelay();
  return [...activitiesEventData]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0);
}

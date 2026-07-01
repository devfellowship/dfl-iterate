import { ActivityEvent } from "@/components/data-layer";
import { activitiesEventData } from "@/test-utils/activity-events.dummy";

const SIMULATED_LATENCY_MS = 300;

const simulateNetworkDelay = () =>
    new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getRecentActivity(limit = 10): Promise<ActivityEvent[]> {
    await simulateNetworkDelay();
    return [...activitiesEventData].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)
    ).slice(0, limit);
}
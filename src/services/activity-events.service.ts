import { supabase } from "@/lib/supabase";
import { ActivityEvent, ActivityEventType } from "@/types";

type ActivityEventRow = {
  id: string;
  type: ActivityEventType;
  label: string;
  occurred_at: string;
};

function mapRowToEvent(row: ActivityEventRow): ActivityEvent {
  return {
    id: row.id,
    type: row.type,
    label: row.label,
    occurredAt: row.occurred_at,
  };
}

export async function getRecentActivity(): Promise<ActivityEvent[]> {
  const { data, error } = await supabase
    .from("activity_events")
    .select("id, type, label, occurred_at")
    .order("occurred_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load recent activity: ${error.message}`);
  }

  if (!data) {
    throw new Error("Recent activity not found");
  }

  return data.map(mapRowToEvent);
}

export async function addActivityEvent({
  type,
  label,
}: {
  type: ActivityEventType;
  label: string;
}): Promise<ActivityEvent> {
  const trimmedLabel = label.trim();
  if (!trimmedLabel) {
    throw new Error("Activity label is required");
  }

  const id = crypto.randomUUID();
  const occurredAt = new Date().toISOString();

  const { data, error } = await supabase
    .from("activity_events")
    .insert({ id, type, label: trimmedLabel, occurred_at: occurredAt })
    .select("id, type, label, occurred_at")
    .single();

  if (error) {
    throw new Error(`Failed to register activity event: ${error.message}`);
  }

  if (!data) {
    throw new Error("Activity event not found after insert");
  }

  return mapRowToEvent(data);
}

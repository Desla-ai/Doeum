// Shared types for request data - used by both NewRequestPage and RequestDetailPage
//
// MATCHING SCORE GUIDELINES:
// - matchingScore is always a number in the range 0-1000 (raw value, no conversion)
// - Display format: {score}점 (e.g., "920점")
// - DO NOT multiply/divide by 10 - store and display the raw 0-1000 value

export type RequestStatus =
  | "posted"
  | "assigned"
  | "escrow_held"
  | "in_progress"
  | "done_by_helper"
  | "confirmed"
  | "cancelled";

export type HelperTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

export interface PreferredHelper {
  id: string;
  name: string;
  tier: HelperTier;
  /** Matching score: 0-1000 range (raw value, display as "{score}점") */
  matchingScore: number;
}

export interface RequestData {
  id: string;
  category: string;
  status: RequestStatus;
  datetime: string;
  time: string;
  location: string;
  region?: string;
  price: number;
  description: string;
  photos: string[];
  preferredHelper?: PreferredHelper;
  createdAt?: string;
}

// Validation helper to ensure required fields exist
export function isValidRequestData(data: unknown): data is RequestData {
  if (!data || typeof data !== "object") return false;
  const req = data as Record<string, unknown>;
  return (
    typeof req.id === "string" &&
    typeof req.category === "string" &&
    typeof req.status === "string" &&
    typeof req.datetime === "string" &&
    typeof req.time === "string" &&
    typeof req.location === "string" &&
    typeof req.price === "number" &&
    typeof req.description === "string" &&
    Array.isArray(req.photos)
  );
}

// Spec section 9. Deliberately kept out of publicProfiles (the broadly-readable directory
// mirror) -- visibility here is mutual opt-in only, enforced server-side in firestore.rules,
// not just hidden in the UI: reading another member's marriageProfiles doc only succeeds if
// *both* people have a status other than "not_listed".
export type MarriageStatus = "not_listed" | "open_to_consider" | "open_to_requests";

export const MARRIAGE_STATUSES: MarriageStatus[] = ["not_listed", "open_to_consider", "open_to_requests"];

export const MARRIAGE_STATUS_LABELS: Record<MarriageStatus, string> = {
  not_listed: "Not Listed",
  open_to_consider: "Open to Consider",
  open_to_requests: "Open to Requests",
};

export const DEFAULT_MARRIAGE_STATUS: MarriageStatus = "not_listed";

export type MarriageProfile = {
  id: string;
  status: MarriageStatus;
  note?: string;
};

export type MembershipStatus = "pending" | "active" | "expired" | "suspended" | "cancelled";

export const MEMBERSHIP_STATUSES: MembershipStatus[] = ["pending", "active", "expired", "suspended", "cancelled"];

export const MEMBERSHIP_STATUS_LABELS: Record<MembershipStatus, string> = {
  pending: "Pending",
  active: "Active",
  expired: "Expired",
  suspended: "Suspended",
  cancelled: "Cancelled",
};

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function todayISO(): string {
  return toISODate(new Date());
}

// Adds one year to an ISO date (YYYY-MM-DD) and returns the result in the same format.
export function addOneYear(isoDate: string): string {
  const d = new Date(isoDate);
  d.setFullYear(d.getFullYear() + 1);
  return toISODate(d);
}

// The date a fresh renewal should extend to: one year past whichever is later, the
// membership's current renewal date or today. Extending from the old date keeps an
// on-time renewal aligned to its original cycle; falling back to today keeps a renewal
// made long after lapsing from landing on a date that's still in the past.
export function nextRenewalDate(currentRenewalDate: string | undefined | null): string {
  const today = todayISO();
  const base = currentRenewalDate && currentRenewalDate > today ? currentRenewalDate : today;
  return addOneYear(base);
}

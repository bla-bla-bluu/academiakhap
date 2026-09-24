import { doc, runTransaction, type Firestore } from "firebase/firestore";

// AK26080 0047: 0001-0003 are reserved permanently for founding/institutional leadership
// and must be assigned by hand in the admin panel, never auto-issued. Year is 2 digits
// (26 for 2026) and the sequence is 5 digits, per the exact 11-character format requested.
export const RESERVED_MEMBER_SLOTS = 3;

export function formatMemberId(sequence: number, joinDate: Date): string {
  const year = String(joinDate.getFullYear()).slice(-2);
  const month = String(joinDate.getMonth() + 1).padStart(2, "0");
  const num = String(sequence).padStart(5, "0");
  return `AK${year}${month}${num}`;
}

export const MEMBER_ID_PATTERN = /^AK\d{2}(0[1-9]|1[0-2])\d{5}$/;

// Reads the join year/month back out of a Member ID string, e.g. for a manually-assigned
// reserved ID (0001-0003) where the ID itself, not "now", is the source of truth for when
// that person's membership began. The 2-digit year is read as 20XX.
export function parseMemberIdJoinDate(memberId: string): Date | null {
  const match = memberId.match(/^AK(\d{2})(0[1-9]|1[0-2])\d{5}$/);
  if (!match) return null;
  return new Date(2000 + Number(match[1]), Number(match[2]) - 1, 1);
}

// Atomically claims the next sequential Member ID. The counter starts implicitly at
// RESERVED_MEMBER_SLOTS, so the first auto-issued ID is 00004; a transaction (not a batch)
// is required so two admins approving members at the same moment can never claim the same
// number. If the caller's write fails after this resolves, the number is simply skipped --
// never reused -- which matches the no-recycling rule as well as reuse would.
export async function claimNextMemberId(db: Firestore): Promise<string> {
  const counterRef = doc(db, "counters", "memberSequence");
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? (snap.data().value as number) : RESERVED_MEMBER_SLOTS;
    const next = current + 1;
    tx.set(counterRef, { value: next }, { merge: true });
    return formatMemberId(next, new Date());
  });
}

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth, type Gender, type Role } from "../../contexts/AuthContext";
import { sendJoiningEmail } from "../../lib/email";

const ASSIGNABLE_ROLES: Role[] = ["admin", "trustee", "member", "scholar"];
const money = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

type AdminTab = "overview" | "donations" | "expenses" | "members" | "requests";

type Donation = { id: string; donorName: string; amount: number; note: string | null; donatedAt: string };
type OrgExpense = { id: string; title: string; amount: number; note: string | null; spentAt: string };
type MemberRow = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  totalAllotted: number;
  totalSpent: number;
  remainingBalance: number;
  gotr?: string;
  age?: number;
  village?: string;
  district?: string;
  state?: string;
  eduQualification?: string;
  gender?: Gender;
  detailsCompleted?: boolean;
};
type MemberExpenseRow = { id: string; amount: number; description: string; spentAt: string; createdAt: Timestamp | null };
type OrgTotals = { totalDonations: number; totalOrgExpenses: number; totalAllotted: number; balance: number };
type RegistrationRequest = { id: string; fullName: string; email: string; status: string };

const cardClass = "border border-[#b38b59]/25 rounded-[2rem] p-6 bg-[#faf6ef]";
const inputClass = "w-full rounded-2xl border border-[#c8a97d] bg-white px-4 py-3 outline-none";
const buttonClass = "px-6 py-3 rounded-full bg-[#5b3419] text-white font-semibold hover:bg-[#3b2415] transition disabled:opacity-60";
const ghostButtonClass = "px-5 py-2 rounded-full border border-[#5b3419] text-[#5b3419] font-semibold hover:bg-[#5b3419] hover:text-white transition";

export default function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>("overview");

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-8">
        {(["overview", "donations", "expenses", "members", "requests"] as AdminTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "px-5 py-2 rounded-full bg-[#5b3419] text-white font-semibold" : ghostButtonClass}
          >
            {t === "requests" ? "Pending Requests" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewSection />}
      {tab === "donations" && <DonationsSection />}
      {tab === "expenses" && <ExpensesSection />}
      {tab === "members" && <MembersSection />}
      {tab === "requests" && <PendingRequestsSection />}
    </div>
  );
}

function OverviewSection() {
  const [data, setData] = useState<OrgTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "orgSummary", "totals"),
      (snap) => {
        setData(snap.exists() ? (snap.data() as OrgTotals) : null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  if (loading) return <p className="text-[#4a3728]">Loading...</p>;
  if (error) return <p className="text-[#8c2f23]">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-[#5b3419] text-white p-8">
        <p className="uppercase tracking-[0.25em] text-sm text-[#e7d6be] mb-2">Current Balance</p>
        <p className="text-4xl font-bold">{money(data?.balance ?? 0)}</p>
      </div>
      <div className={cardClass}>
        <div className="flex justify-between py-2 border-b border-[#b38b59]/20">
          <span>Total Donations</span>
          <span className="font-bold">{money(data?.totalDonations ?? 0)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-[#b38b59]/20">
          <span>Org Expenses</span>
          <span className="font-bold">{money(data?.totalOrgExpenses ?? 0)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span>Allotted to Members</span>
          <span className="font-bold">{money(data?.totalAllotted ?? 0)}</span>
        </div>
      </div>
    </div>
  );
}

function DonationsSection() {
  const { user } = useAuth();
  const [items, setItems] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "donations"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Donation, "id">) })));
        setLoading(false);
      },
      (err) => {
        setLoadError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const handleAdd = async () => {
    setError(null);
    const numericAmount = parseFloat(amount);
    if (!donorName.trim() || !numericAmount || numericAmount <= 0) {
      setError("Enter a donor name and a valid amount.");
      return;
    }
    setSubmitting(true);
    try {
      const batch = writeBatch(db);
      batch.set(doc(collection(db, "donations")), {
        donorName: donorName.trim(),
        amount: numericAmount,
        note: note.trim() || null,
        donatedAt: todayISO(),
        createdBy: user!.uid,
        createdAt: serverTimestamp(),
      });
      batch.set(
        doc(db, "orgSummary", "totals"),
        { totalDonations: increment(numericAmount), balance: increment(numericAmount) },
        { merge: true }
      );
      await batch.commit();
      setDonorName("");
      setAmount("");
      setNote("");
    } catch (err: any) {
      setError(err.message ?? "Could not save donation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <h3 className="text-xl font-bold mb-4">Record a Donation</h3>
        <div className="space-y-3">
          <input className={inputClass} placeholder="Donor Name" value={donorName} onChange={(e) => setDonorName(e.target.value)} />
          <input className={inputClass} placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" />
          <input className={inputClass} placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          {error ? <p className="text-[#8c2f23] text-sm">{error}</p> : null}
          <button onClick={handleAdd} disabled={submitting} className={buttonClass}>
            {submitting ? "Saving..." : "Add Donation"}
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold">Recent Donations</h3>
      {loading ? (
        <p className="text-[#4a3728]">Loading...</p>
      ) : loadError ? (
        <p className="text-[#8c2f23]">Error: {loadError}</p>
      ) : items.length === 0 ? (
        <p className="text-[#4a3728]">No donations recorded yet.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className={cardClass}>
            <div className="flex justify-between">
              <span className="font-bold">{item.donorName}</span>
              <span className="font-bold text-[#2f6b3a]">+{money(item.amount)}</span>
            </div>
            <p className="text-sm text-[#8b6a43]">{item.donatedAt}</p>
            {item.note ? <p className="text-[#4a3728] mt-1">{item.note}</p> : null}
          </div>
        ))
      )}
    </div>
  );
}

function ExpensesSection() {
  const { user } = useAuth();
  const [items, setItems] = useState<OrgExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "orgExpenses"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<OrgExpense, "id">) })));
        setLoading(false);
      },
      (err) => {
        setLoadError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const handleAdd = async () => {
    setError(null);
    const numericAmount = parseFloat(amount);
    if (!title.trim() || !numericAmount || numericAmount <= 0) {
      setError("Enter a title and a valid amount.");
      return;
    }
    setSubmitting(true);
    try {
      const batch = writeBatch(db);
      batch.set(doc(collection(db, "orgExpenses")), {
        title: title.trim(),
        amount: numericAmount,
        note: note.trim() || null,
        spentAt: todayISO(),
        createdBy: user!.uid,
        createdAt: serverTimestamp(),
      });
      batch.set(
        doc(db, "orgSummary", "totals"),
        { totalOrgExpenses: increment(numericAmount), balance: increment(-numericAmount) },
        { merge: true }
      );
      await batch.commit();
      setTitle("");
      setAmount("");
      setNote("");
    } catch (err: any) {
      setError(err.message ?? "Could not save expense.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <h3 className="text-xl font-bold mb-4">Record an Org Expense</h3>
        <div className="space-y-3">
          <input className={inputClass} placeholder="Title (e.g. Printing, Archive Visit)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className={inputClass} placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" />
          <input className={inputClass} placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          {error ? <p className="text-[#8c2f23] text-sm">{error}</p> : null}
          <button onClick={handleAdd} disabled={submitting} className={buttonClass}>
            {submitting ? "Saving..." : "Add Expense"}
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold">Recent Org Expenses</h3>
      {loading ? (
        <p className="text-[#4a3728]">Loading...</p>
      ) : loadError ? (
        <p className="text-[#8c2f23]">Error: {loadError}</p>
      ) : items.length === 0 ? (
        <p className="text-[#4a3728]">No expenses recorded yet.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className={cardClass}>
            <div className="flex justify-between">
              <span className="font-bold">{item.title}</span>
              <span className="font-bold text-[#8c2f23]">-{money(item.amount)}</span>
            </div>
            <p className="text-sm text-[#8b6a43]">{item.spentAt}</p>
            {item.note ? <p className="text-[#4a3728] mt-1">{item.note}</p> : null}
          </div>
        ))
      )}
    </div>
  );
}

function MembersSection() {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [allotAmount, setAllotAmount] = useState("");
  const [allotNote, setAllotNote] = useState("");
  const [allotSubmitting, setAllotSubmitting] = useState(false);
  const [allotError, setAllotError] = useState<string | null>(null);

  const [expandedExpenses, setExpandedExpenses] = useState<MemberExpenseRow[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [emailResult, setEmailResult] = useState<{ id: string; message: string } | null>(null);

  useEffect(() => {
    let profiles: Record<string, Omit<MemberRow, "id" | "totalAllotted" | "totalSpent" | "remainingBalance">> = {};
    let summaries: Record<string, { totalAllotted: number; totalSpent: number; remainingBalance: number }> = {};

    const merge = () => {
      const rows = Object.keys(profiles).map((id) => ({
        id,
        ...profiles[id],
        totalAllotted: summaries[id]?.totalAllotted ?? 0,
        totalSpent: summaries[id]?.totalSpent ?? 0,
        remainingBalance: summaries[id]?.remainingBalance ?? 0,
      }));
      rows.sort((a, b) => a.fullName.localeCompare(b.fullName));
      setMembers(rows);
      setLoading(false);
    };

    const unsubProfiles = onSnapshot(
      query(collection(db, "profiles"), orderBy("fullName")),
      (snap) => {
        profiles = {};
        snap.docs.forEach((d) => {
          const data = d.data();
          if (data.role !== "admin") {
            profiles[d.id] = {
              fullName: data.fullName,
              email: data.email,
              role: data.role,
              gotr: data.gotr,
              age: data.age,
              village: data.village,
              district: data.district,
              state: data.state,
              eduQualification: data.eduQualification,
              gender: data.gender,
              detailsCompleted: data.detailsCompleted,
            };
          }
        });
        merge();
      },
      (err) => {
        setLoadError(err.message);
        setLoading(false);
      }
    );

    const unsubSummaries = onSnapshot(
      collection(db, "memberSummaries"),
      (snap) => {
        summaries = {};
        snap.docs.forEach((d) => {
          summaries[d.id] = d.data() as { totalAllotted: number; totalSpent: number; remainingBalance: number };
        });
        merge();
      },
      (err) => {
        setLoadError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubProfiles();
      unsubSummaries();
    };
  }, []);

  useEffect(() => {
    if (!expandedId) {
      setExpandedExpenses([]);
      return;
    }
    setExpensesLoading(true);
    const q = query(collection(db, "memberExpenses"), where("memberId", "==", expandedId));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MemberExpenseRow, "id">) }));
        items.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
        setExpandedExpenses(items);
        setExpensesLoading(false);
      },
      () => {
        setExpensesLoading(false);
      }
    );
    return unsubscribe;
  }, [expandedId]);

  const handleAllot = async (memberId: string) => {
    setAllotError(null);
    const numericAmount = parseFloat(allotAmount);
    if (!numericAmount || numericAmount <= 0) {
      setAllotError("Enter a valid amount.");
      return;
    }
    setAllotSubmitting(true);
    try {
      const batch = writeBatch(db);
      batch.set(doc(collection(db, "memberAllocations")), {
        memberId,
        amount: numericAmount,
        note: allotNote.trim() || null,
        allottedBy: user!.uid,
        createdAt: serverTimestamp(),
      });
      batch.set(
        doc(db, "memberSummaries", memberId),
        { totalAllotted: increment(numericAmount), remainingBalance: increment(numericAmount) },
        { merge: true }
      );
      batch.set(
        doc(db, "orgSummary", "totals"),
        { totalAllotted: increment(numericAmount), balance: increment(-numericAmount) },
        { merge: true }
      );
      await batch.commit();
      setAllotAmount("");
      setAllotNote("");
      setExpandedId(null);
    } catch (err: any) {
      setAllotError(err.message ?? "Could not save allotment.");
    } finally {
      setAllotSubmitting(false);
    }
  };

  const handlePullBack = async (member: MemberRow) => {
    setAllotError(null);
    const numericAmount = parseFloat(allotAmount);
    if (!numericAmount || numericAmount <= 0) {
      setAllotError("Enter a valid amount.");
      return;
    }
    if (numericAmount > member.remainingBalance) {
      setAllotError(`Cannot pull back more than the unspent balance (${money(member.remainingBalance)}).`);
      return;
    }
    setAllotSubmitting(true);
    try {
      const batch = writeBatch(db);
      batch.set(doc(collection(db, "memberAllocations")), {
        memberId: member.id,
        amount: -numericAmount,
        note: allotNote.trim() || "Fund pulled back by admin",
        allottedBy: user!.uid,
        createdAt: serverTimestamp(),
      });
      batch.set(
        doc(db, "memberSummaries", member.id),
        { totalAllotted: increment(-numericAmount), remainingBalance: increment(-numericAmount) },
        { merge: true }
      );
      batch.set(
        doc(db, "orgSummary", "totals"),
        { totalAllotted: increment(-numericAmount), balance: increment(numericAmount) },
        { merge: true }
      );
      await batch.commit();
      setAllotAmount("");
      setAllotNote("");
      setExpandedId(null);
    } catch (err: any) {
      setAllotError(err.message ?? "Could not pull back the fund.");
    } finally {
      setAllotSubmitting(false);
    }
  };

  const handleDeleteExpense = async (memberId: string, expense: MemberExpenseRow) => {
    if (!window.confirm(`Remove this ₹${expense.amount} expense ("${expense.description}")? This gives the amount back to the member's remaining balance.`)) {
      return;
    }
    setDeletingExpenseId(expense.id);
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, "memberExpenses", expense.id));
      batch.set(
        doc(db, "memberSummaries", memberId),
        { totalSpent: increment(-expense.amount), remainingBalance: increment(expense.amount) },
        { merge: true }
      );
      await batch.commit();
    } catch (err: any) {
      window.alert(err.message ?? "Could not remove expense.");
    } finally {
      setDeletingExpenseId(null);
    }
  };

  const handleDeleteMember = async (member: MemberRow) => {
    if (
      !window.confirm(
        `Remove ${member.fullName} from the community? This revokes their access -- they'll need to be re-approved to rejoin. Their financial history stays on record.`
      )
    ) {
      return;
    }
    setDeletingMemberId(member.id);
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, "profiles", member.id));
      batch.delete(doc(db, "memberSummaries", member.id));
      await batch.commit();
      setViewDetailsId(null);
      setExpandedId(null);
    } catch (err: any) {
      window.alert(err.message ?? "Could not remove this member.");
    } finally {
      setDeletingMemberId(null);
    }
  };

  const handleSendJoiningEmail = async (member: MemberRow) => {
    setSendingEmailId(member.id);
    setEmailResult(null);
    try {
      await sendJoiningEmail(member.fullName, member.email, member.role);
      setEmailResult({ id: member.id, message: "Email sent." });
    } catch (err: any) {
      setEmailResult({ id: member.id, message: err.message ?? "Could not send the email." });
    } finally {
      setSendingEmailId(null);
    }
  };

  if (loading) return <p className="text-[#4a3728]">Loading...</p>;
  if (loadError) return <p className="text-[#8c2f23]">Error: {loadError}</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Members</h3>
      {members.length === 0 ? (
        <p className="text-[#4a3728]">No members yet. Add one from the Pending Requests tab.</p>
      ) : (
        members.map((m) => (
          <div key={m.id} className={cardClass}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">{m.fullName}</span>
              <span className="text-xs uppercase tracking-wide text-[#8b6a43]">{m.role}</span>
            </div>
            <p className="text-sm text-[#8b6a43] mb-2">
              {m.detailsCompleted ? `${m.gender === "male" ? "M" : "F"} • ${m.age} yrs` : "Profile details not submitted yet"}
            </p>
            <div className="flex justify-between py-1">
              <span>Allotted</span>
              <span>{money(m.totalAllotted)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Spent</span>
              <span>{money(m.totalSpent)}</span>
            </div>
            <div className="flex justify-between py-1 font-bold">
              <span>Remaining</span>
              <span>{money(m.remainingBalance)}</span>
            </div>

            <div className="flex flex-wrap gap-4 mt-3">
              <button
                onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                className="text-[#5b3419] font-semibold underline underline-offset-4"
              >
                {expandedId === m.id ? "Cancel" : "Manage Fund →"}
              </button>
              <button
                onClick={() => setViewDetailsId(viewDetailsId === m.id ? null : m.id)}
                className="text-[#5b3419] font-semibold underline underline-offset-4"
              >
                {viewDetailsId === m.id ? "Hide Details" : "View Details →"}
              </button>
              <button
                onClick={() => handleSendJoiningEmail(m)}
                disabled={sendingEmailId === m.id}
                className="text-[#5b3419] font-semibold underline underline-offset-4 disabled:opacity-60"
              >
                {sendingEmailId === m.id ? "Sending..." : "Send Joining Email"}
              </button>
              <button
                onClick={() => handleDeleteMember(m)}
                disabled={deletingMemberId === m.id}
                className="text-[#8c2f23] font-semibold underline underline-offset-4 disabled:opacity-60"
              >
                {deletingMemberId === m.id ? "Removing..." : "Delete"}
              </button>
            </div>

            {emailResult?.id === m.id && (
              <p className={`text-sm mt-2 ${emailResult.message === "Email sent." ? "text-[#2f6b3a]" : "text-[#8c2f23]"}`}>
                {emailResult.message}
              </p>
            )}

            {viewDetailsId === m.id && (
              <div className="mt-4 space-y-1 border-t border-[#b38b59]/20 pt-4">
                {m.detailsCompleted ? (
                  <>
                    <div className="flex justify-between py-1"><span>Email</span><span>{m.email}</span></div>
                    <div className="flex justify-between py-1"><span>Gender</span><span>{m.gender === "male" ? "Male" : "Female"}</span></div>
                    <div className="flex justify-between py-1"><span>Age</span><span>{m.age}</span></div>
                    <div className="flex justify-between py-1"><span>Gotr</span><span>{m.gotr}</span></div>
                    <div className="flex justify-between py-1"><span>Village</span><span>{m.village}</span></div>
                    <div className="flex justify-between py-1"><span>District</span><span>{m.district}</span></div>
                    <div className="flex justify-between py-1"><span>State</span><span>{m.state}</span></div>
                    <div className="flex justify-between py-1"><span>Education</span><span>{m.eduQualification}</span></div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between py-1"><span>Email</span><span>{m.email}</span></div>
                    <p className="text-[#4a3728] text-sm">
                      This member hasn't submitted their profile details yet (gotr, age, village, etc.) --
                      they'll be prompted on their next login.
                    </p>
                  </>
                )}
              </div>
            )}

            {expandedId === m.id && (
              <div className="mt-4 space-y-3">
                <input className={inputClass} placeholder="Amount (₹)" value={allotAmount} onChange={(e) => setAllotAmount(e.target.value)} type="number" />
                <input className={inputClass} placeholder="Note (optional)" value={allotNote} onChange={(e) => setAllotNote(e.target.value)} />
                {allotError ? <p className="text-[#8c2f23] text-sm">{allotError}</p> : null}
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => handleAllot(m.id)} disabled={allotSubmitting} className={buttonClass}>
                    {allotSubmitting ? "Saving..." : "Confirm Allotment"}
                  </button>
                  <button
                    onClick={() => handlePullBack(m)}
                    disabled={allotSubmitting}
                    className="px-6 py-3 rounded-full bg-[#8c2f23] text-white font-semibold hover:bg-[#6e2419] transition disabled:opacity-60"
                  >
                    {allotSubmitting ? "Saving..." : "Pull Back Fund"}
                  </button>
                </div>

                <div className="border-t border-[#b38b59]/20 pt-4">
                  <h4 className="font-bold mb-2">{m.fullName}'s Expense History</h4>
                  <p className="text-sm text-[#8b6a43] mb-3">
                    If a member reports a false or mistaken entry, remove it here -- the amount is
                    added back to their remaining balance.
                  </p>
                  {expensesLoading ? (
                    <p className="text-[#4a3728]">Loading...</p>
                  ) : expandedExpenses.length === 0 ? (
                    <p className="text-[#4a3728]">No expenses logged yet.</p>
                  ) : (
                    expandedExpenses.map((expense) => (
                      <div key={expense.id} className="bg-white/60 border border-[#b38b59]/20 rounded-xl p-4 mb-2">
                        <div className="flex justify-between">
                          <span className="font-bold">{money(expense.amount)}</span>
                          <span className="text-sm text-[#8b6a43]">{expense.spentAt}</span>
                        </div>
                        <p className="text-[#4a3728]">{expense.description}</p>
                        <button
                          onClick={() => handleDeleteExpense(m.id, expense)}
                          disabled={deletingExpenseId === expense.id}
                          className="text-[#8c2f23] font-semibold mt-1"
                        >
                          {deletingExpenseId === expense.id ? "Removing..." : "Remove this entry"}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function ManualApproveSection() {
  const [open, setOpen] = useState(false);
  const [uid, setUid] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleApprove = async () => {
    setError(null);
    if (!uid.trim() || !fullName.trim() || !email.trim()) {
      setError("Enter the user's UID, full name, and email.");
      return;
    }
    setSubmitting(true);
    try {
      const targetUid = uid.trim();
      const batch = writeBatch(db);
      batch.set(doc(db, "profiles", targetUid), { fullName: fullName.trim(), email: email.trim(), role });
      if (role !== "admin") {
        batch.set(doc(db, "memberSummaries", targetUid), {
          totalAllotted: 0,
          totalSpent: 0,
          remainingBalance: 0,
        });
      }
      batch.delete(doc(db, "registrationRequests", targetUid));
      await batch.commit();
      setUid("");
      setFullName("");
      setEmail("");
      setRole("member");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message ?? "Could not approve this account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cardClass}>
      <button onClick={() => setOpen(!open)} className="text-[#5b3419] font-semibold underline underline-offset-4">
        {open ? "Cancel" : "Approve a stuck account by UID →"}
      </button>
      <p className="text-sm text-[#8b6a43] mt-2">
        For accounts created in Firebase Authentication that never got a registration request on
        file (e.g. signed up before a rules fix). Find the UID on the Authentication tab in the
        Firebase Console.
      </p>

      {open && (
        <div className="mt-4 space-y-3">
          <input className={inputClass} placeholder="User UID" value={uid} onChange={(e) => setUid(e.target.value)} />
          <input className={inputClass} placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input className={inputClass} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            {ASSIGNABLE_ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={role === r ? "px-4 py-2 rounded-full bg-[#5b3419] text-white text-sm" : "px-4 py-2 rounded-full border border-[#5b3419] text-[#5b3419] text-sm"}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          {error ? <p className="text-[#8c2f23] text-sm">{error}</p> : null}
          {success ? <p className="text-[#2f6b3a] text-sm">Approved.</p> : null}
          <button onClick={handleApprove} disabled={submitting} className={buttonClass}>
            {submitting ? "Approving..." : "Approve"}
          </button>
        </div>
      )}
    </div>
  );
}

function PendingRequestsSection() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [role, setRole] = useState<Role>("member");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "registrationRequests"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setRequests(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<RegistrationRequest, "id">) })));
        setLoading(false);
      },
      (err) => {
        setLoadError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const handleApprove = async (request: RegistrationRequest) => {
    setError(null);
    setSubmitting(true);
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, "profiles", request.id), {
        fullName: request.fullName,
        email: request.email,
        role,
      });
      if (role !== "admin") {
        batch.set(doc(db, "memberSummaries", request.id), {
          totalAllotted: 0,
          totalSpent: 0,
          remainingBalance: 0,
        });
      }
      batch.delete(doc(db, "registrationRequests", request.id));
      await batch.commit();
      setExpandedId(null);
      setRole("member");
    } catch (err: any) {
      setError(err.message ?? "Could not approve this request.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!window.confirm("Reject this registration request?")) return;
    await setDoc(doc(db, "registrationRequests", requestId), { status: "rejected" }, { merge: true });
  };

  if (loading) return <p className="text-[#4a3728]">Loading...</p>;
  if (loadError) return <p className="text-[#8c2f23]">Error: {loadError}</p>;

  return (
    <div className="space-y-6">
      <ManualApproveSection />

      <h3 className="text-xl font-bold">Pending Requests</h3>
      {requests.length === 0 ? (
        <p className="text-[#4a3728]">No pending registration requests.</p>
      ) : (
        requests.map((request) => (
          <div key={request.id} className={cardClass}>
            <p className="font-bold text-lg">{request.fullName}</p>
            <p className="text-[#4a3728]">{request.email}</p>

            <button
              onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
              className="mt-3 text-[#5b3419] font-semibold underline underline-offset-4"
            >
              {expandedId === request.id ? "Cancel" : "Review →"}
            </button>

            {expandedId === request.id && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-[#8b6a43]">Assign a role:</p>
                <div className="flex flex-wrap gap-2">
                  {ASSIGNABLE_ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={role === r ? "px-4 py-2 rounded-full bg-[#5b3419] text-white text-sm" : "px-4 py-2 rounded-full border border-[#5b3419] text-[#5b3419] text-sm"}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
                {error ? <p className="text-[#8c2f23] text-sm">{error}</p> : null}
                <div className="flex gap-3">
                  <button onClick={() => handleApprove(request)} disabled={submitting} className={buttonClass}>
                    {submitting ? "Approving..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-6 py-3 rounded-full border border-[#8c2f23] text-[#8c2f23] font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

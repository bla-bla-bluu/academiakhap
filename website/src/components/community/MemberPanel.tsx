import { useEffect, useState } from "react";
import {
  collection,
  doc,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";

const money = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

type MemberSummary = { totalAllotted: number; totalSpent: number; remainingBalance: number };
type MemberExpense = { id: string; amount: number; description: string; spentAt: string; createdAt: Timestamp | null };
type OrgTotals = { totalDonations: number; totalOrgExpenses: number };

const cardClass = "border border-[#b38b59]/25 rounded-[2rem] p-6 bg-[#faf6ef]";
const inputClass = "w-full rounded-2xl border border-[#c8a97d] bg-white px-4 py-3 outline-none";
const buttonClass = "px-6 py-3 rounded-full bg-[#5b3419] text-white font-semibold hover:bg-[#3b2415] transition disabled:opacity-60";

export default function MemberPanel() {
  const { user, profile } = useAuth();
  const [balance, setBalance] = useState<MemberSummary | null>(null);
  const [expenses, setExpenses] = useState<MemberExpense[]>([]);
  const [orgTotals, setOrgTotals] = useState<OrgTotals | null>(null);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSeeOrgTotals = profile?.role !== "scholar";

  useEffect(() => {
    if (!user) return;

    const unsubSummary = onSnapshot(doc(db, "memberSummaries", user.uid), (snap) => {
      setBalance(snap.exists() ? (snap.data() as MemberSummary) : null);
      setLoading(false);
    });

    const expensesQuery = query(collection(db, "memberExpenses"), where("memberId", "==", user.uid));
    const unsubExpenses = onSnapshot(expensesQuery, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MemberExpense, "id">) }));
      items.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
      setExpenses(items);
    });

    return () => {
      unsubSummary();
      unsubExpenses();
    };
  }, [user]);

  useEffect(() => {
    if (!user || !canSeeOrgTotals) {
      setOrgTotals(null);
      return;
    }
    const unsubscribe = onSnapshot(doc(db, "orgSummary", "totals"), (snap) => {
      setOrgTotals(snap.exists() ? (snap.data() as OrgTotals) : null);
    });
    return unsubscribe;
  }, [user, canSeeOrgTotals]);

  const handleAdd = async () => {
    setError(null);
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0 || !description.trim()) {
      setError("Enter a valid amount and a description.");
      return;
    }
    setSubmitting(true);
    try {
      const batch = writeBatch(db);
      batch.set(doc(collection(db, "memberExpenses")), {
        memberId: user!.uid,
        amount: numericAmount,
        description: description.trim(),
        spentAt: todayISO(),
        createdAt: serverTimestamp(),
      });
      batch.set(
        doc(db, "memberSummaries", user!.uid),
        { totalSpent: increment(numericAmount), remainingBalance: increment(-numericAmount) },
        { merge: true }
      );
      await batch.commit();
      setAmount("");
      setDescription("");
    } catch (err: any) {
      setError(err.message ?? "Could not save expense.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-[#4a3728]">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-[#5b3419] text-white p-8">
        <p className="uppercase tracking-[0.25em] text-sm text-[#e7d6be] mb-2">Remaining Balance</p>
        <p className="text-4xl font-bold">{money(balance?.remainingBalance ?? 0)}</p>
      </div>

      <div className={cardClass}>
        <div className="flex justify-between py-2 border-b border-[#b38b59]/20">
          <span>Total Allotted to You</span>
          <span className="font-bold">{money(balance?.totalAllotted ?? 0)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span>Total You've Spent</span>
          <span className="font-bold">{money(balance?.totalSpent ?? 0)}</span>
        </div>
      </div>

      {canSeeOrgTotals && (
        <div className={cardClass}>
          <h3 className="text-lg font-bold mb-3">Academia Khap Totals</h3>
          <div className="flex justify-between py-2 border-b border-[#b38b59]/20">
            <span>Total Donations Received</span>
            <span className="font-bold">{money(orgTotals?.totalDonations ?? 0)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Total Expenses Made</span>
            <span className="font-bold">{money(orgTotals?.totalOrgExpenses ?? 0)}</span>
          </div>
        </div>
      )}

      <div className={cardClass}>
        <h3 className="text-lg font-bold mb-2">Log an Expense</h3>
        <p className="text-sm text-[#8b6a43] mb-4">
          Record how you used your allotted research or scholarship funds.
        </p>
        <div className="space-y-3">
          <input className={inputClass} placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} type="number" />
          <textarea
            className={inputClass}
            placeholder="What was this expense for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          {error ? <p className="text-[#8c2f23] text-sm">{error}</p> : null}
          <button onClick={handleAdd} disabled={submitting} className={buttonClass}>
            {submitting ? "Saving..." : "Add Expense"}
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold">Your Expense History</h3>
      {expenses.length === 0 ? (
        <p className="text-[#4a3728]">No expenses logged yet.</p>
      ) : (
        expenses.map((item) => (
          <div key={item.id} className={cardClass}>
            <div className="flex justify-between">
              <span className="font-bold">{money(item.amount)}</span>
              <span className="text-sm text-[#8b6a43]">{item.spentAt}</span>
            </div>
            <p className="text-[#4a3728]">{item.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

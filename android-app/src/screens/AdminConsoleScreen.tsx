import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import { db, createMemberAuthAccount } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { formStyles } from "../theme/formStyles";
import { COLORS } from "../theme/colors";

type AdminTab = "overview" | "donations" | "expenses" | "members";

type Donation = { id: string; donorName: string; amount: number; note: string | null; donatedAt: string };
type OrgExpense = { id: string; title: string; amount: number; note: string | null; spentAt: string };
type Role = "admin" | "trustee" | "member" | "scholar";

const ASSIGNABLE_ROLES: Role[] = ["admin", "trustee", "member", "scholar"];

type MemberRow = {
  id: string;
  fullName: string;
  role: Role;
  totalAllotted: number;
  totalSpent: number;
  remainingBalance: number;
};
type MemberExpenseRow = {
  id: string;
  amount: number;
  description: string;
  spentAt: string;
  createdAt: Timestamp | null;
};
type OrgTotals = {
  totalDonations: number;
  totalOrgExpenses: number;
  totalAllotted: number;
  balance: number;
};

const money = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function AdminConsoleScreen() {
  const { profile, signOut } = useAuth();
  const [tab, setTab] = useState<AdminTab>("overview");

  return (
    <View style={formStyles.screen}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 12 }}>
        {(["overview", "donations", "expenses", "members"] as AdminTab[]).map((t) => {
          const active = tab === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[
                formStyles.buttonGhost,
                { paddingVertical: 8, paddingHorizontal: 14, minHeight: undefined },
                active && { backgroundColor: COLORS.primaryAccent },
              ]}
            >
              <Text style={active ? formStyles.buttonText : formStyles.buttonGhostText}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {tab === "overview" && <OverviewSection />}
      {tab === "donations" && <DonationsSection />}
      {tab === "expenses" && <ExpensesSection />}
      {tab === "members" && <MembersSection />}

      <TouchableOpacity style={{ marginHorizontal: 16, marginBottom: 16 }} onPress={signOut}>
        <Text style={{ color: COLORS.danger, textAlign: "center", fontWeight: "700" }}>
          Log Out ({profile?.fullName})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function OverviewSection() {
  const [data, setData] = useState<OrgTotals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "orgSummary", "totals"), (snap) => {
      setData(snap.exists() ? (snap.data() as OrgTotals) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <ScrollView contentContainerStyle={formStyles.scrollContent}>
      {loading ? (
        <ActivityIndicator color={COLORS.primaryAccent} />
      ) : (
        <>
          <View style={formStyles.darkCard}>
            <Text style={[formStyles.label, { color: COLORS.mutedCreamOnDark }]}>Current Balance</Text>
            <Text style={{ color: COLORS.white, fontSize: 36, fontWeight: "800" }}>
              {money(data?.balance ?? 0)}
            </Text>
          </View>
          <View style={formStyles.card}>
            <View style={formStyles.rowBetween}>
              <Text style={formStyles.body}>Total Donations</Text>
              <Text style={formStyles.value}>{money(data?.totalDonations ?? 0)}</Text>
            </View>
            <View style={formStyles.divider} />
            <View style={formStyles.rowBetween}>
              <Text style={formStyles.body}>Org Expenses</Text>
              <Text style={formStyles.value}>{money(data?.totalOrgExpenses ?? 0)}</Text>
            </View>
            <View style={formStyles.divider} />
            <View style={formStyles.rowBetween}>
              <Text style={formStyles.body}>Allotted to Members</Text>
              <Text style={formStyles.value}>{money(data?.totalAllotted ?? 0)}</Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function DonationsSection() {
  const { user } = useAuth();
  const [items, setItems] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "donations"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Donation, "id">) })));
      setLoading(false);
    });
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
      const donationRef = doc(collection(db, "donations"));
      batch.set(donationRef, {
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
    <ScrollView contentContainerStyle={formStyles.scrollContent}>
      <View style={formStyles.card}>
        <Text style={formStyles.cardTitle}>Record a Donation</Text>
        <TextInput
          style={formStyles.input}
          placeholder="Donor Name"
          placeholderTextColor={COLORS.mutedBrown}
          value={donorName}
          onChangeText={setDonorName}
        />
        <TextInput
          style={formStyles.input}
          placeholder="Amount (₹)"
          placeholderTextColor={COLORS.mutedBrown}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={formStyles.input}
          placeholder="Note (optional)"
          placeholderTextColor={COLORS.mutedBrown}
          value={note}
          onChangeText={setNote}
        />
        {error ? <Text style={formStyles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[formStyles.button, submitting && formStyles.buttonDisabled]}
          onPress={handleAdd}
          disabled={submitting}
        >
          <Text style={formStyles.buttonText}>{submitting ? "Saving..." : "Add Donation"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={formStyles.cardTitle}>Recent Donations</Text>
      {loading ? (
        <ActivityIndicator color={COLORS.primaryAccent} />
      ) : items.length === 0 ? (
        <Text style={formStyles.body}>No donations recorded yet.</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={formStyles.card}>
            <View style={formStyles.rowBetween}>
              <Text style={formStyles.value}>{item.donorName}</Text>
              <Text style={[formStyles.value, { color: COLORS.success }]}>+{money(item.amount)}</Text>
            </View>
            <Text style={formStyles.body}>{item.donatedAt}</Text>
            {item.note ? <Text style={formStyles.body}>{item.note}</Text> : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

function ExpensesSection() {
  const { user } = useAuth();
  const [items, setItems] = useState<OrgExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "orgExpenses"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<OrgExpense, "id">) })));
      setLoading(false);
    });
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
      const expenseRef = doc(collection(db, "orgExpenses"));
      batch.set(expenseRef, {
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
    <ScrollView contentContainerStyle={formStyles.scrollContent}>
      <View style={formStyles.card}>
        <Text style={formStyles.cardTitle}>Record an Org Expense</Text>
        <TextInput
          style={formStyles.input}
          placeholder="Title (e.g. Printing, Archive Visit)"
          placeholderTextColor={COLORS.mutedBrown}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={formStyles.input}
          placeholder="Amount (₹)"
          placeholderTextColor={COLORS.mutedBrown}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={formStyles.input}
          placeholder="Note (optional)"
          placeholderTextColor={COLORS.mutedBrown}
          value={note}
          onChangeText={setNote}
        />
        {error ? <Text style={formStyles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[formStyles.button, submitting && formStyles.buttonDisabled]}
          onPress={handleAdd}
          disabled={submitting}
        >
          <Text style={formStyles.buttonText}>{submitting ? "Saving..." : "Add Expense"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={formStyles.cardTitle}>Recent Org Expenses</Text>
      {loading ? (
        <ActivityIndicator color={COLORS.primaryAccent} />
      ) : items.length === 0 ? (
        <Text style={formStyles.body}>No expenses recorded yet.</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={formStyles.card}>
            <View style={formStyles.rowBetween}>
              <Text style={formStyles.value}>{item.title}</Text>
              <Text style={[formStyles.value, { color: COLORS.danger }]}>-{money(item.amount)}</Text>
            </View>
            <Text style={formStyles.body}>{item.spentAt}</Text>
            {item.note ? <Text style={formStyles.body}>{item.note}</Text> : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

function MembersSection() {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [allotAmount, setAllotAmount] = useState("");
  const [allotNote, setAllotNote] = useState("");
  const [allotSubmitting, setAllotSubmitting] = useState(false);
  const [allotError, setAllotError] = useState<string | null>(null);

  const [expandedExpenses, setExpandedExpenses] = useState<MemberExpenseRow[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  const [showAddMember, setShowAddMember] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<Role>("member");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  useEffect(() => {
    let profiles: Record<string, { fullName: string; role: Role }> = {};
    let summaries: Record<string, { totalAllotted: number; totalSpent: number; remainingBalance: number }> = {};

    const merge = () => {
      const rows = Object.keys(profiles).map((id) => ({
        id,
        fullName: profiles[id].fullName,
        role: profiles[id].role,
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
          if (data.role !== "admin") profiles[d.id] = { fullName: data.fullName, role: data.role };
        });
        merge();
      }
    );

    const unsubSummaries = onSnapshot(collection(db, "memberSummaries"), (snap) => {
      summaries = {};
      snap.docs.forEach((d) => {
        summaries[d.id] = d.data() as { totalAllotted: number; totalSpent: number; remainingBalance: number };
      });
      merge();
    });

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
    // Filtered by memberId only (no orderBy) so this doesn't need a composite index --
    // sorted client-side instead.
    const q = query(collection(db, "memberExpenses"), where("memberId", "==", expandedId));
    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MemberExpenseRow, "id">) }));
      items.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
      setExpandedExpenses(items);
      setExpensesLoading(false);
    });
    return unsubscribe;
  }, [expandedId]);

  const handleDeleteExpense = (memberId: string, expense: MemberExpenseRow) => {
    Alert.alert(
      "Remove this expense?",
      `${money(expense.amount)} -- ${expense.description}\n\nThis gives the amount back to the member's remaining balance. This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setDeletingExpenseId(expense.id);
            try {
              const batch = writeBatch(db);
              batch.delete(doc(db, "memberExpenses", expense.id));
              batch.set(
                doc(db, "memberSummaries", memberId),
                {
                  totalSpent: increment(-expense.amount),
                  remainingBalance: increment(expense.amount),
                },
                { merge: true }
              );
              await batch.commit();
            } catch (err: any) {
              Alert.alert("Could not remove expense", err.message ?? "Please try again.");
            } finally {
              setDeletingExpenseId(null);
            }
          },
        },
      ]
    );
  };

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
      const allocationRef = doc(collection(db, "memberAllocations"));
      batch.set(allocationRef, {
        memberId,
        amount: numericAmount,
        note: allotNote.trim() || null,
        allottedBy: user!.uid,
        createdAt: serverTimestamp(),
      });
      batch.set(
        doc(db, "memberSummaries", memberId),
        {
          totalAllotted: increment(numericAmount),
          remainingBalance: increment(numericAmount),
        },
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
      setAllotError(
        `Cannot pull back more than the unspent balance (${money(member.remainingBalance)}).`
      );
      return;
    }
    setAllotSubmitting(true);
    try {
      const batch = writeBatch(db);
      const allocationRef = doc(collection(db, "memberAllocations"));
      batch.set(allocationRef, {
        memberId: member.id,
        amount: -numericAmount,
        note: allotNote.trim() || "Fund pulled back by admin",
        allottedBy: user!.uid,
        createdAt: serverTimestamp(),
      });
      batch.set(
        doc(db, "memberSummaries", member.id),
        {
          totalAllotted: increment(-numericAmount),
          remainingBalance: increment(-numericAmount),
        },
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

  const handleAddMember = async () => {
    setAddError(null);
    setAddSuccess(null);
    if (!newName.trim() || !newEmail.trim() || newPassword.length < 6) {
      setAddError("Full name, email, and a password of at least 6 characters are required.");
      return;
    }
    setAddSubmitting(true);
    try {
      const newUid = await createMemberAuthAccount(newEmail.trim(), newPassword);
      const batch = writeBatch(db);
      batch.set(doc(db, "profiles", newUid), {
        fullName: newName.trim(),
        email: newEmail.trim(),
        role: newRole,
      });
      batch.set(doc(db, "memberSummaries", newUid), {
        totalAllotted: 0,
        totalSpent: 0,
        remainingBalance: 0,
      });
      await batch.commit();
      setAddSuccess(`${newRole.charAt(0).toUpperCase() + newRole.slice(1)} account created for ${newName.trim()}.`);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("member");
    } catch (err: any) {
      setAddError(err.message ?? "Could not create member.");
    } finally {
      setAddSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={formStyles.scrollContent}>
      <View style={formStyles.card}>
        <TouchableOpacity onPress={() => setShowAddMember((v) => !v)}>
          <Text style={formStyles.cardTitle}>{showAddMember ? "Add Member ▾" : "Add Member ▸"}</Text>
        </TouchableOpacity>
        {showAddMember && (
          <>
            <TextInput
              style={formStyles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.mutedBrown}
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={formStyles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.mutedBrown}
              value={newEmail}
              onChangeText={setNewEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={formStyles.input}
              placeholder="Initial Password"
              placeholderTextColor={COLORS.mutedBrown}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <Text style={formStyles.label}>Role</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {ASSIGNABLE_ROLES.map((r) => {
                const active = newRole === r;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setNewRole(r)}
                    style={[
                      formStyles.buttonGhost,
                      { paddingVertical: 8, paddingHorizontal: 14, minHeight: undefined },
                      active && { backgroundColor: COLORS.primaryAccent },
                    ]}
                  >
                    <Text style={active ? formStyles.buttonText : formStyles.buttonGhostText}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {addError ? <Text style={formStyles.errorText}>{addError}</Text> : null}
            {addSuccess ? <Text style={formStyles.successText}>{addSuccess}</Text> : null}
            <TouchableOpacity
              style={[formStyles.button, addSubmitting && formStyles.buttonDisabled]}
              onPress={handleAddMember}
              disabled={addSubmitting}
            >
              <Text style={formStyles.buttonText}>
                {addSubmitting ? "Creating..." : "Create Member Account"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={formStyles.cardTitle}>Members</Text>
      {loading ? (
        <ActivityIndicator color={COLORS.primaryAccent} />
      ) : members.length === 0 ? (
        <Text style={formStyles.body}>No members yet. Add one above.</Text>
      ) : (
        members.map((m) => (
          <View key={m.id} style={formStyles.card}>
            <View style={formStyles.rowBetween}>
              <Text style={formStyles.value}>{m.fullName}</Text>
              <Text style={formStyles.label}>{m.role.charAt(0).toUpperCase() + m.role.slice(1)}</Text>
            </View>
            <View style={formStyles.rowBetween}>
              <Text style={formStyles.body}>Allotted</Text>
              <Text style={formStyles.body}>{money(m.totalAllotted)}</Text>
            </View>
            <View style={formStyles.rowBetween}>
              <Text style={formStyles.body}>Spent</Text>
              <Text style={formStyles.body}>{money(m.totalSpent)}</Text>
            </View>
            <View style={formStyles.rowBetween}>
              <Text style={[formStyles.body, { fontWeight: "700" }]}>Remaining</Text>
              <Text style={formStyles.value}>{money(m.remainingBalance)}</Text>
            </View>

            <TouchableOpacity onPress={() => setExpandedId(expandedId === m.id ? null : m.id)}>
              <Text style={[formStyles.buttonGhostText, { marginTop: 6 }]}>
                {expandedId === m.id ? "Cancel" : "Manage Fund →"}
              </Text>
            </TouchableOpacity>

            {expandedId === m.id && (
              <View style={{ gap: 8, marginTop: 8 }}>
                <TextInput
                  style={formStyles.input}
                  placeholder="Amount (₹)"
                  placeholderTextColor={COLORS.mutedBrown}
                  value={allotAmount}
                  onChangeText={setAllotAmount}
                  keyboardType="numeric"
                />
                <TextInput
                  style={formStyles.input}
                  placeholder="Note (optional)"
                  placeholderTextColor={COLORS.mutedBrown}
                  value={allotNote}
                  onChangeText={setAllotNote}
                />
                {allotError ? <Text style={formStyles.errorText}>{allotError}</Text> : null}
                <TouchableOpacity
                  style={[formStyles.button, allotSubmitting && formStyles.buttonDisabled]}
                  onPress={() => handleAllot(m.id)}
                  disabled={allotSubmitting}
                >
                  <Text style={formStyles.buttonText}>
                    {allotSubmitting ? "Saving..." : "Confirm Allotment"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    formStyles.button,
                    { backgroundColor: COLORS.danger },
                    allotSubmitting && formStyles.buttonDisabled,
                  ]}
                  onPress={() => handlePullBack(m)}
                  disabled={allotSubmitting}
                >
                  <Text style={formStyles.buttonText}>
                    {allotSubmitting ? "Saving..." : "Pull Back Fund"}
                  </Text>
                </TouchableOpacity>

                <View style={formStyles.divider} />
                <Text style={formStyles.cardTitle}>{m.fullName}'s Expense History</Text>
                <Text style={formStyles.subtitle}>
                  If a member reports a false or mistaken entry, remove it here -- the amount is
                  added back to their remaining balance.
                </Text>
                {expensesLoading ? (
                  <ActivityIndicator color={COLORS.primaryAccent} />
                ) : expandedExpenses.length === 0 ? (
                  <Text style={formStyles.body}>No expenses logged yet.</Text>
                ) : (
                  expandedExpenses.map((expense) => (
                    <View key={expense.id} style={formStyles.card}>
                      <View style={formStyles.rowBetween}>
                        <Text style={formStyles.value}>{money(expense.amount)}</Text>
                        <Text style={formStyles.label}>{expense.spentAt}</Text>
                      </View>
                      <Text style={formStyles.body}>{expense.description}</Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteExpense(m.id, expense)}
                        disabled={deletingExpenseId === expense.id}
                      >
                        <Text style={[formStyles.errorText, { marginTop: 4, fontWeight: "700" }]}>
                          {deletingExpenseId === expense.id ? "Removing..." : "Remove this entry"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

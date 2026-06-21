import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { formStyles } from "../theme/formStyles";
import { COLORS } from "../theme/colors";

type MemberSummary = {
  totalAllotted: number;
  totalSpent: number;
  remainingBalance: number;
};

type MemberExpense = {
  id: string;
  amount: number;
  description: string;
  spentAt: string;
  createdAt: Timestamp | null;
};

type OrgTotals = {
  totalDonations: number;
  totalOrgExpenses: number;
};

const money = (n: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function MemberConsoleScreen() {
  const { profile, user, signOut } = useAuth();
  const [balance, setBalance] = useState<MemberSummary | null>(null);
  const [expenses, setExpenses] = useState<MemberExpense[]>([]);
  const [orgTotals, setOrgTotals] = useState<OrgTotals | null>(null);
  const [loading, setLoading] = useState(true);

  const canSeeOrgTotals = profile?.role !== "scholar";

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubSummary = onSnapshot(doc(db, "memberSummaries", user.uid), (snap) => {
      setBalance(snap.exists() ? (snap.data() as MemberSummary) : null);
      setLoading(false);
    });

    // Filtered by memberId only (no orderBy) so this doesn't need a composite index --
    // sorted client-side instead.
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
    const unsubTotals = onSnapshot(doc(db, "orgSummary", "totals"), (snap) => {
      setOrgTotals(snap.exists() ? (snap.data() as OrgTotals) : null);
    });
    return unsubTotals;
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
      const expenseRef = doc(collection(db, "memberExpenses"));
      batch.set(expenseRef, {
        memberId: user!.uid,
        amount: numericAmount,
        description: description.trim(),
        spentAt: todayISO(),
        createdAt: serverTimestamp(),
      });
      batch.set(
        doc(db, "memberSummaries", user!.uid),
        {
          totalSpent: increment(numericAmount),
          remainingBalance: increment(-numericAmount),
        },
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

  return (
    <View style={formStyles.screen}>
      <ScrollView contentContainerStyle={formStyles.scrollContent}>
        <Text style={formStyles.title}>Welcome, {profile?.fullName}</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.primaryAccent} />
        ) : (
          <>
            <View style={formStyles.darkCard}>
              <Text style={[formStyles.label, { color: COLORS.mutedCreamOnDark }]}>Remaining Balance</Text>
              <Text style={{ color: COLORS.white, fontSize: 36, fontWeight: "800" }}>
                {money(balance?.remainingBalance ?? 0)}
              </Text>
            </View>

            <View style={formStyles.card}>
              <View style={formStyles.rowBetween}>
                <Text style={formStyles.body}>Total Allotted to You</Text>
                <Text style={formStyles.value}>{money(balance?.totalAllotted ?? 0)}</Text>
              </View>
              <View style={formStyles.divider} />
              <View style={formStyles.rowBetween}>
                <Text style={formStyles.body}>Total You've Spent</Text>
                <Text style={formStyles.value}>{money(balance?.totalSpent ?? 0)}</Text>
              </View>
            </View>

            {canSeeOrgTotals && (
              <View style={formStyles.card}>
                <Text style={formStyles.cardTitle}>Academia Khap Totals</Text>
                <View style={formStyles.rowBetween}>
                  <Text style={formStyles.body}>Total Donations Received</Text>
                  <Text style={formStyles.value}>{money(orgTotals?.totalDonations ?? 0)}</Text>
                </View>
                <View style={formStyles.divider} />
                <View style={formStyles.rowBetween}>
                  <Text style={formStyles.body}>Total Expenses Made</Text>
                  <Text style={formStyles.value}>{money(orgTotals?.totalOrgExpenses ?? 0)}</Text>
                </View>
              </View>
            )}
          </>
        )}

        <View style={formStyles.card}>
          <Text style={formStyles.cardTitle}>Log an Expense</Text>
          <Text style={formStyles.subtitle}>
            Record how you used your allotted research or scholarship funds.
          </Text>
          <TextInput
            style={formStyles.input}
            placeholder="Amount (₹)"
            placeholderTextColor={COLORS.mutedBrown}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={[formStyles.input, formStyles.textArea]}
            placeholder="What was this expense for?"
            placeholderTextColor={COLORS.mutedBrown}
            value={description}
            onChangeText={setDescription}
            multiline
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

        <Text style={formStyles.cardTitle}>Your Expense History</Text>
        {expenses.length === 0 ? (
          <Text style={formStyles.body}>No expenses logged yet.</Text>
        ) : (
          expenses.map((item) => (
            <View key={item.id} style={formStyles.card}>
              <View style={formStyles.rowBetween}>
                <Text style={formStyles.value}>{money(item.amount)}</Text>
                <Text style={formStyles.body}>{item.spentAt}</Text>
              </View>
              <Text style={formStyles.body}>{item.description}</Text>
            </View>
          ))
        )}

        <TouchableOpacity style={{ marginTop: 8 }} onPress={signOut}>
          <Text style={{ color: COLORS.danger, textAlign: "center", fontWeight: "700" }}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

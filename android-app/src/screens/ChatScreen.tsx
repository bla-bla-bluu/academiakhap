import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addDoc, collection, limitToLast, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { formStyles } from "../theme/formStyles";
import { COLORS } from "../theme/colors";

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
};

export default function ChatScreen() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    const q = query(collection(db, "chatMessages"), orderBy("createdAt", "asc"), limitToLast(200));
    const unsubscribe = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatMessage, "id">) })));
    });
    return unsubscribe;
  }, []);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || !user) return;
    setSending(true);
    try {
      await addDoc(collection(db, "chatMessages"), {
        senderId: user.uid,
        senderName: profile?.fullName ?? "Unknown",
        message: text,
        createdAt: serverTimestamp(),
      });
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={formStyles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const mine = item.senderId === user?.uid;
          return (
            <View
              style={{
                alignSelf: mine ? "flex-end" : "flex-start",
                maxWidth: "82%",
                backgroundColor: mine ? COLORS.primaryAccent : COLORS.bgCard,
                borderColor: "rgba(179, 139, 89, 0.3)",
                borderWidth: mine ? 0 : 1,
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 10,
              }}
            >
              {!mine && (
                <Text style={{ color: COLORS.mutedBrown, fontSize: 11, fontWeight: "700", marginBottom: 2 }}>
                  {item.senderName}
                </Text>
              )}
              <Text style={{ color: mine ? COLORS.white : COLORS.textPrimary, fontSize: 15 }}>
                {item.message}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={[formStyles.body, { textAlign: "center", marginTop: 24 }]}>
            No messages yet. Start the discussion.
          </Text>
        }
      />

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightBorder,
          backgroundColor: COLORS.bgMain,
        }}
      >
        <TextInput
          style={[formStyles.input, { flex: 1 }]}
          placeholder="Write a message..."
          placeholderTextColor={COLORS.mutedBrown}
          value={draft}
          onChangeText={setDraft}
          multiline
        />
        <TouchableOpacity
          style={[
            formStyles.button,
            { paddingHorizontal: 20 },
            (sending || !draft.trim()) && formStyles.buttonDisabled,
          ]}
          onPress={handleSend}
          disabled={sending || !draft.trim()}
        >
          <Text style={formStyles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

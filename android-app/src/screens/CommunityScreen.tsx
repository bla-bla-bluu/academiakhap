import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { formStyles } from "../theme/formStyles";
import { COLORS } from "../theme/colors";

const MAX_LENGTH = 500;

type CommunityPost = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: Timestamp | null;
};

type CommunityComment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: Timestamp | null;
};

const formatTimestamp = (ts: Timestamp | null) => (ts ? ts.toDate().toLocaleString() : "Just now");

export default function CommunityScreen() {
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

  return selectedPost ? (
    <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
  ) : (
    <PostFeed onSelectPost={setSelectedPost} />
  );
}

function NewPostComposer({
  placeholder,
  onSubmit,
}: {
  placeholder: string;
  onSubmit: (body: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const text = draft.trim();
    if (!text) return;
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(text);
      setDraft("");
    } catch (err: any) {
      setError(err.message ?? "Could not post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={formStyles.card}>
      <TextInput
        style={[formStyles.input, formStyles.textArea]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.mutedBrown}
        value={draft}
        onChangeText={(text) => setDraft(text.slice(0, MAX_LENGTH))}
        multiline
        maxLength={MAX_LENGTH}
      />
      <View style={formStyles.rowBetween}>
        <Text style={[formStyles.label, draft.length >= MAX_LENGTH && { color: COLORS.danger }]}>
          {draft.length}/{MAX_LENGTH}
        </Text>
        {error ? <Text style={formStyles.errorText}>{error}</Text> : null}
      </View>
      <TouchableOpacity
        style={[formStyles.button, (submitting || !draft.trim()) && formStyles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting || !draft.trim()}
      >
        <Text style={formStyles.buttonText}>{submitting ? "Posting..." : "Post"}</Text>
      </TouchableOpacity>
    </View>
  );
}

function PostFeed({ onSelectPost }: { onSelectPost: (post: CommunityPost) => void }) {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "communityPosts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CommunityPost, "id">) })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleNewPost = async (body: string) => {
    await addDoc(collection(db, "communityPosts"), {
      authorId: user!.uid,
      authorName: profile?.fullName ?? "Unknown",
      body,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <ScrollView contentContainerStyle={formStyles.scrollContent}>
      <Text style={formStyles.title}>Community</Text>
      <Text style={formStyles.subtitle}>
        Share an update or start a discussion. Text only, up to {MAX_LENGTH} characters -- no images or GIFs.
      </Text>

      <NewPostComposer placeholder="What's on your mind?" onSubmit={handleNewPost} />

      {loading ? (
        <ActivityIndicator color={COLORS.primaryAccent} />
      ) : posts.length === 0 ? (
        <Text style={formStyles.body}>No posts yet. Be the first to start a discussion.</Text>
      ) : (
        posts.map((post) => (
          <TouchableOpacity key={post.id} onPress={() => onSelectPost(post)} activeOpacity={0.85}>
            <View style={formStyles.card}>
              <View style={formStyles.rowBetween}>
                <Text style={formStyles.value}>{post.authorName}</Text>
                <Text style={formStyles.label}>{formatTimestamp(post.createdAt)}</Text>
              </View>
              <Text style={formStyles.body}>{post.body}</Text>
              <Text style={[formStyles.buttonGhostText, { marginTop: 6 }]}>View discussion →</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

function PostDetail({ post, onBack }: { post: CommunityPost; onBack: () => void }) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filtered by postId only (no orderBy) so this doesn't need a composite index --
    // sorted client-side instead.
    const q = query(collection(db, "communityComments"), where("postId", "==", post.id));
    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CommunityComment, "id">) }));
      items.sort((a, b) => (a.createdAt?.toMillis() ?? 0) - (b.createdAt?.toMillis() ?? 0));
      setComments(items);
      setLoading(false);
    });
    return unsubscribe;
  }, [post.id]);

  const handleNewComment = async (body: string) => {
    await addDoc(collection(db, "communityComments"), {
      postId: post.id,
      authorId: user!.uid,
      authorName: profile?.fullName ?? "Unknown",
      body,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <ScrollView contentContainerStyle={formStyles.scrollContent}>
      <TouchableOpacity onPress={onBack}>
        <Text style={[formStyles.buttonGhostText, { marginBottom: 8 }]}>← Back to Community</Text>
      </TouchableOpacity>

      <View style={formStyles.card}>
        <View style={formStyles.rowBetween}>
          <Text style={formStyles.value}>{post.authorName}</Text>
          <Text style={formStyles.label}>{formatTimestamp(post.createdAt)}</Text>
        </View>
        <Text style={formStyles.body}>{post.body}</Text>
      </View>

      <Text style={formStyles.cardTitle}>Comments</Text>
      {loading ? (
        <ActivityIndicator color={COLORS.primaryAccent} />
      ) : comments.length === 0 ? (
        <Text style={formStyles.body}>No comments yet.</Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} style={formStyles.card}>
            <View style={formStyles.rowBetween}>
              <Text style={formStyles.value}>{comment.authorName}</Text>
              <Text style={formStyles.label}>{formatTimestamp(comment.createdAt)}</Text>
            </View>
            <Text style={formStyles.body}>{comment.body}</Text>
          </View>
        ))
      )}

      <NewPostComposer placeholder="Add a comment..." onSubmit={handleNewComment} />
    </ScrollView>
  );
}

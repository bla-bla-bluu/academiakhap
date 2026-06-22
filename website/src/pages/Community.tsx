import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import Navbar from "../components/Navbar";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";

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

export default function CommunityPage() {
  return (
    <AuthProvider>
      <CommunityPageContent />
    </AuthProvider>
  );
}

function CommunityPageContent() {
  const { user, profile, loading, signIn, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPostId = searchParams.get("post");

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">
      <Navbar links={[{ to: "/", label: "Home" }, { to: "/community", label: "Community", active: true }]} />

      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 pt-12 sm:pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">Academia Khap</p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-6">Community</h1>
          <p className="text-[#4a3728] max-w-2xl">
            A discussion space for Academia Khap members. Share an update or join a discussion --
            text only, up to {MAX_LENGTH} characters, no images or GIFs. The same community feed
            members see in the Academia Khap Android app.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {loading ? (
          <p className="text-[#4a3728]">Loading...</p>
        ) : !user ? (
          <LoginForm signIn={signIn} />
        ) : !profile ? (
          <p className="text-[#4a3728]">
            Your account doesn't have a profile set up yet. Contact an Academia Khap admin.
          </p>
        ) : (
          <>
            {selectedPostId ? (
              <PostDetail postId={selectedPostId} onBack={() => setSearchParams({})} />
            ) : (
              <PostFeed onSelectPost={(id) => setSearchParams({ post: id })} />
            )}
            <button
              onClick={signOut}
              className="mt-10 text-[#8c2f23] font-semibold underline underline-offset-4"
            >
              Log Out
            </button>
          </>
        )}
      </section>
    </div>
  );
}

function LoginForm({
  signIn,
}: {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }
    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) setError(signInError);
  };

  return (
    <div className="max-w-md mx-auto border border-[#b38b59]/25 rounded-[2.5rem] p-10 bg-[#faf6ef]">
      <h2 className="text-2xl font-bold mb-3">Member &amp; Admin Login</h2>
      <p className="text-[#4a3728] mb-6">
        Accounts are created by an Academia Khap admin. Contact{" "}
        <a href="mailto:academiakhap@gmail.com" className="underline underline-offset-4">
          academiakhap@gmail.com
        </a>{" "}
        if you need access.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-3 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-3 outline-none"
        />
        {error ? <p className="text-[#8c2f23] text-sm">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-2xl bg-[#5b3419] text-white font-semibold hover:bg-[#3b2415] transition disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

function Composer({
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
    <div className="border border-[#b38b59]/25 rounded-[2.5rem] p-6 bg-[#faf6ef] mb-8">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
        placeholder={placeholder}
        rows={4}
        maxLength={MAX_LENGTH}
        className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-4 outline-none resize-none"
      />
      <div className="flex items-center justify-between mt-2">
        <span className={`text-sm ${draft.length >= MAX_LENGTH ? "text-[#8c2f23]" : "text-[#8b6a43]"}`}>
          {draft.length}/{MAX_LENGTH}
        </span>
        {error ? <span className="text-[#8c2f23] text-sm">{error}</span> : null}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitting || !draft.trim()}
        className="mt-3 px-6 py-3 rounded-full bg-[#5b3419] text-white font-semibold hover:bg-[#3b2415] transition disabled:opacity-60"
      >
        {submitting ? "Posting..." : "Post"}
      </button>
    </div>
  );
}

function PostCard({ post, footer }: { post: CommunityPost; footer: ReactNode }) {
  return (
    <div className="border border-[#b38b59]/25 rounded-[2.5rem] p-6 bg-[#faf6ef]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold">{post.authorName}</span>
        <span className="text-sm text-[#8b6a43]">{formatTimestamp(post.createdAt)}</span>
      </div>
      <p className="text-[#4a3728] mb-4 whitespace-pre-wrap">{post.body}</p>
      {footer}
    </div>
  );
}

function PostFeed({ onSelectPost }: { onSelectPost: (id: string) => void }) {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

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

  const handleShare = async (post: CommunityPost) => {
    const url = `${window.location.origin}/community?post=${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Academia Khap Community", text: post.body, url });
      } catch {
        // User cancelled the share sheet -- nothing to do.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setShareNotice("Link copied to clipboard.");
    setTimeout(() => setShareNotice(null), 2500);
  };

  return (
    <div>
      <Composer placeholder="What's on your mind?" onSubmit={handleNewPost} />
      {shareNotice ? <p className="text-[#2f6b3a] text-sm mb-4">{shareNotice}</p> : null}
      {loading ? (
        <p className="text-[#4a3728]">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-[#4a3728]">No posts yet. Be the first to start a discussion.</p>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              footer={
                <div className="flex gap-5">
                  <button
                    onClick={() => onSelectPost(post.id)}
                    className="text-[#5b3419] font-semibold underline underline-offset-4"
                  >
                    View discussion
                  </button>
                  <button
                    onClick={() => handleShare(post)}
                    className="text-[#5b3419] font-semibold underline underline-offset-4"
                  >
                    Share
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PostDetail({ postId, onBack }: { postId: string; onBack: () => void }) {
  const { user, profile } = useAuth();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubPost = onSnapshot(doc(db, "communityPosts", postId), (snap) => {
      setPost(snap.exists() ? { id: snap.id, ...(snap.data() as Omit<CommunityPost, "id">) } : null);
      setLoading(false);
    });

    // Filtered by postId only (no orderBy) so this doesn't need a composite index --
    // sorted client-side instead.
    const q = query(collection(db, "communityComments"), where("postId", "==", postId));
    const unsubComments = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CommunityComment, "id">) }));
      items.sort((a, b) => (a.createdAt?.toMillis() ?? 0) - (b.createdAt?.toMillis() ?? 0));
      setComments(items);
    });

    return () => {
      unsubPost();
      unsubComments();
    };
  }, [postId]);

  const handleNewComment = async (body: string) => {
    await addDoc(collection(db, "communityComments"), {
      postId,
      authorId: user!.uid,
      authorName: profile?.fullName ?? "Unknown",
      body,
      createdAt: serverTimestamp(),
    });
  };

  if (loading) return <p className="text-[#4a3728]">Loading...</p>;
  if (!post) return <p className="text-[#4a3728]">This post could not be found.</p>;

  return (
    <div>
      <button onClick={onBack} className="text-[#5b3419] font-semibold underline underline-offset-4 mb-6">
        ← Back to Community
      </button>

      <div className="mb-8">
        <PostCard post={post} footer={null} />
      </div>

      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-[#4a3728] mb-6">No comments yet.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-[#b38b59]/20 rounded-2xl p-5 bg-white/60">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">{comment.authorName}</span>
                <span className="text-sm text-[#8b6a43]">{formatTimestamp(comment.createdAt)}</span>
              </div>
              <p className="text-[#4a3728] whitespace-pre-wrap">{comment.body}</p>
            </div>
          ))}
        </div>
      )}

      <Composer placeholder="Add a comment..." onSubmit={handleNewComment} />
    </div>
  );
}

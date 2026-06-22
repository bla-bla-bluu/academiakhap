import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  collection,
  deleteDoc,
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
import Navbar from "../components/Navbar";
import { AuthProvider, useAuth, type Role } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import AdminPanel from "../components/community/AdminPanel";
import MemberPanel from "../components/community/MemberPanel";
import CompleteProfileForm from "../components/community/CompleteProfileForm";

const MAX_LENGTH = 500;

type CommunityPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  body: string;
  commentCount: number;
  createdAt: Timestamp | null;
};

type CommunityComment = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  body: string;
  createdAt: Timestamp | null;
};

type PortalTab = "tools" | "community";

const formatTimestamp = (ts: Timestamp | null) => (ts ? ts.toDate().toLocaleString() : "Just now");

const AVATAR_COLORS = ["#5b3419", "#8b6a43", "#8c2f23", "#2f6b3a", "#3b2415", "#b38b59"];

function avatarColor(name: string) {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ backgroundColor: avatarColor(name) }}
    >
      {initial}
    </div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  if (role === "member") return null;
  return (
    <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-[#efe4cf] text-[#8b6a43] border border-[#b38b59]/40">
      {role}
    </span>
  );
}

export default function CommunityPage() {
  return (
    <AuthProvider>
      <CommunityPageContent />
    </AuthProvider>
  );
}

function CommunityPageContent() {
  const { user, profile, registrationStatus, loading, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPostId = searchParams.get("post");
  const [tab, setTab] = useState<PortalTab>("tools");

  const renderAuthenticatedContent = () => {
    if (!profile) {
      if (registrationStatus === "pending") {
        return (
          <div className="max-w-md mx-auto border border-[#b38b59]/25 rounded-[2.5rem] p-10 bg-[#faf6ef] text-center">
            <h2 className="text-2xl font-bold mb-3">Request Pending</h2>
            <p className="text-[#4a3728]">
              Your registration has been sent to an Academia Khap admin for approval. You'll be
              able to access your account once it's approved -- check back soon.
            </p>
          </div>
        );
      }
      if (registrationStatus === "rejected") {
        return (
          <div className="max-w-md mx-auto border border-[#b38b59]/25 rounded-[2.5rem] p-10 bg-[#faf6ef] text-center">
            <h2 className="text-2xl font-bold mb-3">Request Not Approved</h2>
            <p className="text-[#4a3728]">
              Your registration request wasn't approved. Contact{" "}
              <a href="mailto:academiakhap@gmail.com" className="underline underline-offset-4">
                academiakhap@gmail.com
              </a>{" "}
              if you believe this is a mistake.
            </p>
          </div>
        );
      }
      return (
        <p className="text-[#4a3728] text-center">
          Your account doesn't have a profile set up yet. Contact an Academia Khap admin.
        </p>
      );
    }

    if (profile.role !== "admin" && !profile.detailsCompleted) {
      return <CompleteProfileForm />;
    }

    return (
      <>
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setTab("tools")}
            className={tab === "tools" ? "px-5 py-2 rounded-full bg-[#5b3419] text-white font-semibold" : "px-5 py-2 rounded-full border border-[#5b3419] text-[#5b3419] font-semibold"}
          >
            {profile.role === "admin" ? "Admin Tools" : "My Fund"}
          </button>
          <button
            onClick={() => setTab("community")}
            className={tab === "community" ? "px-5 py-2 rounded-full bg-[#5b3419] text-white font-semibold" : "px-5 py-2 rounded-full border border-[#5b3419] text-[#5b3419] font-semibold"}
          >
            Vidvat Panchayat
          </button>
        </div>

        {tab === "tools" && (profile.role === "admin" ? <AdminPanel /> : <MemberPanel />)}
        {tab === "community" &&
          (selectedPostId ? (
            <PostDetail postId={selectedPostId} onBack={() => setSearchParams({})} />
          ) : (
            <PostFeed onSelectPost={(id) => setSearchParams({ post: id })} />
          ))}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">
      <Navbar links={[{ to: "/", label: "Home" }, { to: "/community", label: "Vidvat Panchayat", active: true }]} />

      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 pt-12 sm:pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">Academia Khap</p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-6">Vidvat Panchayat</h1>
          <p className="text-[#4a3728] max-w-2xl">
            Academia Khap's members area: track donations and fund allotments, log expenses, and
            deliberate on research and community matters in a focused, text-only assembly.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {loading ? (
          <p className="text-[#4a3728]">Loading...</p>
        ) : !user ? (
          <AuthGate />
        ) : (
          <>
            {renderAuthenticatedContent()}
            <div className="text-center mt-10">
              <button onClick={signOut} className="text-[#8c2f23] font-semibold underline underline-offset-4">
                Log Out
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function AuthGate() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-3 mb-6 justify-center">
        <button
          onClick={() => setMode("login")}
          className={mode === "login" ? "px-5 py-2 rounded-full bg-[#5b3419] text-white font-semibold" : "px-5 py-2 rounded-full border border-[#5b3419] text-[#5b3419] font-semibold"}
        >
          Log In
        </button>
        <button
          onClick={() => setMode("register")}
          className={mode === "register" ? "px-5 py-2 rounded-full bg-[#5b3419] text-white font-semibold" : "px-5 py-2 rounded-full border border-[#5b3419] text-[#5b3419] font-semibold"}
        >
          Register
        </button>
      </div>
      {mode === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}

function GoogleButton({ onError }: { onError: (message: string) => void }) {
  const { signInWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleClick = async () => {
    setSubmitting(true);
    const { error } = await signInWithGoogle();
    setSubmitting(false);
    if (error) onError(error);
  };

  return (
    <button
      onClick={handleClick}
      disabled={submitting}
      className="w-full py-3 rounded-2xl border border-[#5b3419] text-[#5b3419] font-semibold hover:bg-[#5b3419] hover:text-white transition disabled:opacity-60"
    >
      {submitting ? "Connecting..." : "Continue with Google"}
    </button>
  );
}

function LoginForm() {
  const { signIn } = useAuth();
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
    <div className="border border-[#b38b59]/25 rounded-[2.5rem] p-10 bg-[#faf6ef]">
      <h2 className="text-2xl font-bold mb-3">Member &amp; Admin Login</h2>
      <p className="text-[#4a3728] mb-6">
        Don't have an account yet? Switch to "Register" above -- new accounts need admin
        approval before they're active.
      </p>
      <div className="space-y-4">
        <GoogleButton onError={setError} />
        <div className="flex items-center gap-3 text-[#8b6a43] text-sm">
          <div className="flex-1 h-px bg-[#b38b59]/30" />
          or
          <div className="flex-1 h-px bg-[#b38b59]/30" />
        </div>
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
    </div>
  );
}

function RegisterForm() {
  const { registerWithEmail } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim() || !email.trim() || password.length < 6) {
      setError("Full name, email, and a password of at least 6 characters are required.");
      return;
    }
    setSubmitting(true);
    const { error: registerError } = await registerWithEmail(fullName.trim(), email.trim(), password);
    setSubmitting(false);
    if (registerError) {
      setError(registerError);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="border border-[#b38b59]/25 rounded-[2.5rem] p-10 bg-[#faf6ef] text-center">
        <h2 className="text-2xl font-bold mb-3">Request Sent</h2>
        <p className="text-[#4a3728]">
          Your registration has been sent to an Academia Khap admin for approval. Log back in
          here once you've been approved.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#b38b59]/25 rounded-[2.5rem] p-10 bg-[#faf6ef]">
      <h2 className="text-2xl font-bold mb-3">Register</h2>
      <p className="text-[#4a3728] mb-6">
        New accounts are reviewed by an Academia Khap admin before they're activated.
      </p>
      <div className="space-y-4">
        <GoogleButton onError={setError} />
        <div className="flex items-center gap-3 text-[#8b6a43] text-sm">
          <div className="flex-1 h-px bg-[#b38b59]/30" />
          or
          <div className="flex-1 h-px bg-[#b38b59]/30" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-3 outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-[#c8a97d] bg-white px-5 py-3 outline-none"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
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
            {submitting ? "Submitting..." : "Request an Account"}
          </button>
        </form>
      </div>
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

function PostCard({
  post,
  footer,
  onDelete,
}: {
  post: CommunityPost;
  footer: ReactNode;
  onDelete?: () => void;
}) {
  const { profile } = useAuth();
  return (
    <div className="border border-[#b38b59]/25 rounded-[2rem] p-6 bg-[#faf6ef] shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-3 mb-3">
        <Avatar name={post.authorName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold">{post.authorName}</span>
            <RoleBadge role={post.authorRole} />
          </div>
          <span className="text-sm text-[#8b6a43]">{formatTimestamp(post.createdAt)}</span>
        </div>
        {profile?.role === "admin" && onDelete && (
          <button onClick={onDelete} className="text-[#8c2f23] text-sm font-semibold underline underline-offset-4 flex-shrink-0">
            Delete
          </button>
        )}
      </div>
      <p className="text-[#4a3728] mb-4 whitespace-pre-wrap leading-relaxed">{post.body}</p>
      {footer}
    </div>
  );
}

function PostFeed({ onSelectPost }: { onSelectPost: (id: string) => void }) {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "communityPosts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setPosts(snap.docs.map((d) => ({ id: d.id, commentCount: 0, ...(d.data() as Omit<CommunityPost, "id">) })));
        setLoading(false);
      },
      (err) => {
        setLoadError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const handleNewPost = async (body: string) => {
    await setDoc(doc(collection(db, "communityPosts")), {
      authorId: user!.uid,
      authorName: profile?.fullName ?? "Unknown",
      authorRole: profile?.role ?? "member",
      body,
      commentCount: 0,
      createdAt: serverTimestamp(),
    });
  };

  const handleShare = async (post: CommunityPost) => {
    const url = `${window.location.origin}/community?post=${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Vidvat Panchayat -- Academia Khap", text: post.body, url });
      } catch {
        // User cancelled the share sheet -- nothing to do.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setShareNotice("Link copied to clipboard.");
    setTimeout(() => setShareNotice(null), 2500);
  };

  const handleDelete = async (post: CommunityPost) => {
    if (!window.confirm("Delete this post and all its replies? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "communityPosts", post.id));
    } catch (err: any) {
      window.alert(err.message ?? "Could not delete this post.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">The Scholarly Assembly</h2>
        <p className="text-[#4a3728]">
          An open council for the Academia Khap community to raise questions, share findings, and
          deliberate together.
        </p>
      </div>

      <Composer placeholder="Share your thoughts with the Panchayat..." onSubmit={handleNewPost} />
      {shareNotice ? <p className="text-[#2f6b3a] text-sm mb-4">{shareNotice}</p> : null}
      {loading ? (
        <p className="text-[#4a3728]">Loading posts...</p>
      ) : loadError ? (
        <p className="text-[#8c2f23]">Error: {loadError}</p>
      ) : posts.length === 0 ? (
        <p className="text-[#4a3728]">No posts yet. Be the first to raise a topic.</p>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={() => handleDelete(post)}
              footer={
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => onSelectPost(post.id)}
                    className="text-[#5b3419] font-semibold underline underline-offset-4"
                  >
                    {post.commentCount > 0 ? `${post.commentCount} ${post.commentCount === 1 ? "Reply" : "Replies"} →` : "Join the discussion →"}
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
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const unsubPost = onSnapshot(
      doc(db, "communityPosts", postId),
      (snap) => {
        setPost(snap.exists() ? { id: snap.id, commentCount: 0, ...(snap.data() as Omit<CommunityPost, "id">) } : null);
        setLoading(false);
      },
      (err) => {
        setLoadError(err.message);
        setLoading(false);
      }
    );

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
    const batch = writeBatch(db);
    batch.set(doc(collection(db, "communityComments")), {
      postId,
      authorId: user!.uid,
      authorName: profile?.fullName ?? "Unknown",
      authorRole: profile?.role ?? "member",
      body,
      createdAt: serverTimestamp(),
    });
    batch.update(doc(db, "communityPosts", postId), { commentCount: increment(1) });
    await batch.commit();
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post and all its replies? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "communityPosts", postId));
      onBack();
    } catch (err: any) {
      window.alert(err.message ?? "Could not delete this post.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await deleteDoc(doc(db, "communityComments", commentId));
    } catch (err: any) {
      window.alert(err.message ?? "Could not delete this reply.");
    }
  };

  if (loading) return <p className="text-[#4a3728]">Loading...</p>;
  if (loadError) return <p className="text-[#8c2f23]">Error: {loadError}</p>;
  if (!post) return <p className="text-[#4a3728]">This post could not be found.</p>;

  return (
    <div>
      <button onClick={onBack} className="text-[#5b3419] font-semibold underline underline-offset-4 mb-6">
        ← Back to Vidvat Panchayat
      </button>

      <div className="mb-8">
        <PostCard post={post} footer={null} onDelete={handleDeletePost} />
      </div>

      <h2 className="text-xl font-bold mb-4">
        {comments.length === 0 ? "No replies yet" : `${comments.length} ${comments.length === 1 ? "Reply" : "Replies"}`}
      </h2>
      {comments.length > 0 && (
        <div className="relative mb-8 ml-5 pl-8 border-l-2 border-[#b38b59]/30 space-y-5">
          {comments.map((comment) => (
            <div key={comment.id} className="relative">
              <div className="absolute -left-[42px] top-0">
                <Avatar name={comment.authorName} />
              </div>
              <div className="border border-[#b38b59]/20 rounded-2xl p-5 bg-white/70">
                <div className="flex items-start justify-between mb-1 gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold">{comment.authorName}</span>
                    <RoleBadge role={comment.authorRole} />
                  </div>
                  <span className="text-sm text-[#8b6a43] whitespace-nowrap">{formatTimestamp(comment.createdAt)}</span>
                </div>
                <p className="text-[#4a3728] whitespace-pre-wrap leading-relaxed">{comment.body}</p>
                {profile?.role === "admin" && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-[#8c2f23] text-sm font-semibold underline underline-offset-4 mt-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Composer placeholder="Add your voice to this discussion..." onSubmit={handleNewComment} />
    </div>
  );
}

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
import AdminPanel from "../components/community/AdminPanel";
import MemberPanel from "../components/community/MemberPanel";

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

type PortalTab = "tools" | "community";

const formatTimestamp = (ts: Timestamp | null) => (ts ? ts.toDate().toLocaleString() : "Just now");

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
            Discussion
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
      <Navbar links={[{ to: "/", label: "Home" }, { to: "/community", label: "Community", active: true }]} />

      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 pt-12 sm:pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">Academia Khap</p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-6">Community</h1>
          <p className="text-[#4a3728] max-w-2xl">
            Academia Khap's members area: track donations and fund allotments, log expenses, and
            discuss research and community matters in a focused, text-only space.
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

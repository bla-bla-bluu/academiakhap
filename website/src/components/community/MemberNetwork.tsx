import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, deleteDoc, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { roleLabel, useAuth, type Role } from "../../contexts/AuthContext";
import {
  DEFAULT_NETWORK_STATUS,
  NETWORK_STATUSES,
  NETWORK_STATUS_DESCRIPTIONS,
  NETWORK_STATUS_LABELS,
  type ConnectionRequest,
  type NetworkStatus,
} from "../../lib/network";

const cardClass = "border border-[#b38b59]/25 rounded-[2rem] p-6 bg-[#faf6ef]";
const inputClass = "w-full rounded-2xl border border-[#c8a97d] bg-white px-4 py-3 outline-none";
const buttonClass = "px-6 py-3 rounded-full bg-[#5b3419] text-white font-semibold hover:bg-[#3b2415] transition disabled:opacity-60";

type DirectoryRow = {
  id: string;
  fullName: string;
  role: Role;
  memberId?: string;
  district?: string;
  state?: string;
  profession?: string;
  expertise?: string;
  researchInterests?: string;
  languages?: string;
  bio?: string;
  networkStatus?: NetworkStatus;
};

export default function MemberNetwork() {
  const { user, profile, updateNetworkStatus, syncPublicProfile } = useAuth();
  const [directory, setDirectory] = useState<DirectoryRow[]>([]);
  const [outgoing, setOutgoing] = useState<ConnectionRequest[]>([]);
  const [incoming, setIncoming] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Self-heal: make sure this member's own public mirror exists/is current the moment they
  // open this tab, so profiles created or last edited before this feature shipped still show
  // up in the directory without needing an admin backfill pass.
  useEffect(() => {
    syncPublicProfile().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "publicProfiles"), orderBy("fullName")), (snap) => {
      setDirectory(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DirectoryRow, "id">) })));
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubOut = onSnapshot(query(collection(db, "connectionRequests"), where("fromUid", "==", user.uid)), (snap) => {
      setOutgoing(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ConnectionRequest, "id">) })));
    });
    const unsubIn = onSnapshot(query(collection(db, "connectionRequests"), where("toUid", "==", user.uid)), (snap) => {
      setIncoming(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ConnectionRequest, "id">) })));
    });
    return () => {
      unsubOut();
      unsubIn();
    };
  }, [user]);

  const handleRespond = async (request: ConnectionRequest, accept: boolean) => {
    const payload: Record<string, unknown> = { status: accept ? "accepted" : "declined", respondedAt: serverTimestamp() };
    if (accept) payload.toEmail = profile?.email ?? "";
    await setDoc(doc(db, "connectionRequests", request.id), payload, { merge: true });
  };

  const pendingIncoming = incoming.filter((r) => r.status === "pending");

  if (!user || !profile) return null;

  return (
    <div className="space-y-8">
      <div className={cardClass}>
        <h3 className="text-xl font-bold mb-2">Your Connection Status</h3>
        <p className="text-sm text-[#8b6a43] mb-4">Controls whether other members can send you a connection request. You can change this anytime.</p>
        <div className="flex flex-wrap gap-2">
          {NETWORK_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => updateNetworkStatus(s)}
              className={
                (profile.networkStatus ?? DEFAULT_NETWORK_STATUS) === s
                  ? "px-4 py-2 rounded-full bg-[#5b3419] text-white text-sm"
                  : "px-4 py-2 rounded-full border border-[#5b3419] text-[#5b3419] text-sm"
              }
            >
              {NETWORK_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <p className="text-sm text-[#8b6a43] mt-3">{NETWORK_STATUS_DESCRIPTIONS[profile.networkStatus ?? DEFAULT_NETWORK_STATUS]}</p>
      </div>

      {pendingIncoming.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-xl font-bold mb-4">Requests Awaiting Your Response</h3>
          <div className="space-y-4">
            {pendingIncoming.map((r) => (
              <div key={r.id} className="border border-[#b38b59]/20 rounded-2xl p-4 bg-white/60">
                <p className="font-bold">{r.fromName}</p>
                {r.message && <p className="text-[#4a3728] mt-1 whitespace-pre-wrap">{r.message}</p>}
                <div className="flex gap-4 mt-3">
                  <button onClick={() => handleRespond(r, true)} className="text-[#2f6b3a] font-semibold underline underline-offset-4">
                    Accept
                  </button>
                  <button onClick={() => handleRespond(r, false)} className="text-[#8c2f23] font-semibold underline underline-offset-4">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold mb-4">Member Directory</h3>
        {loading ? (
          <p className="text-[#4a3728]">Loading...</p>
        ) : (
          <div className="space-y-4">
            {directory
              .filter((m) => m.id !== user.uid)
              .map((m) => (
                <DirectoryCard
                  key={m.id}
                  member={m}
                  myUid={user.uid}
                  myName={profile.fullName}
                  myEmail={profile.email}
                  outgoing={outgoing.find((r) => r.toUid === m.id)}
                  incoming={incoming.find((r) => r.fromUid === m.id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DirectoryCard({
  member,
  myUid,
  myName,
  myEmail,
  outgoing,
  incoming,
}: {
  member: DirectoryRow;
  myUid: string;
  myName: string;
  myEmail: string;
  outgoing?: ConnectionRequest;
  incoming?: ConnectionRequest;
}) {
  const [composing, setComposing] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setError(null);
    setBusy(true);
    try {
      // A deterministic id (rather than an auto-generated one) means a second request to the
      // same person fails outright at the rules layer instead of piling up duplicates.
      await setDoc(doc(db, "connectionRequests", `${myUid}_${member.id}`), {
        fromUid: myUid,
        fromName: myName,
        fromEmail: myEmail,
        toUid: member.id,
        message: message.trim() || null,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setComposing(false);
      setMessage("");
    } catch (err: any) {
      setError(err.message ?? "Could not send request.");
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!outgoing) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "connectionRequests", outgoing.id));
    } catch (err: any) {
      window.alert(err.message ?? "Could not cancel request.");
    } finally {
      setBusy(false);
    }
  };

  const details = [member.profession, member.expertise, member.researchInterests, member.languages].filter(Boolean);
  const location = [member.district, member.state].filter(Boolean).join(", ");

  return (
    <div className={cardClass}>
      <div className="flex justify-between items-start gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-lg">{member.fullName}</span>
            <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-[#efe4cf] text-[#8b6a43] border border-[#b38b59]/40">
              {roleLabel(member.role)}
            </span>
          </div>
          {location && <p className="text-sm text-[#8b6a43]">{location}</p>}
        </div>
      </div>

      {details.length > 0 && <p className="text-[#4a3728] mt-2 text-sm">{details.join(" • ")}</p>}
      {member.bio && <p className="text-[#4a3728] mt-2">{member.bio}</p>}

      <div className="mt-4 border-t border-[#b38b59]/20 pt-4">
        {incoming?.status === "pending" ? (
          <p className="text-sm text-[#8b6a43]">Sent you a request -- respond above.</p>
        ) : incoming?.status === "accepted" ? (
          <p className="text-sm text-[#2f6b3a] font-semibold">Connected -- {incoming.fromEmail}</p>
        ) : outgoing?.status === "pending" ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8b6a43]">Request sent</span>
            <button onClick={handleCancel} disabled={busy} className="text-[#8c2f23] text-sm font-semibold underline underline-offset-4 disabled:opacity-60">
              Cancel
            </button>
          </div>
        ) : outgoing?.status === "accepted" ? (
          <p className="text-sm text-[#2f6b3a] font-semibold">Connected -- {outgoing.toEmail}</p>
        ) : outgoing?.status === "declined" ? (
          <p className="text-sm text-[#8b6a43]">Request declined.</p>
        ) : member.networkStatus === "closed" ? (
          <p className="text-sm text-[#8b6a43]">Not open to connections.</p>
        ) : composing ? (
          <div className="space-y-3">
            <textarea
              className={inputClass}
              placeholder="Add a short message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
            />
            {error && <p className="text-[#8c2f23] text-sm">{error}</p>}
            <div className="flex gap-3">
              <button onClick={handleSend} disabled={busy} className={buttonClass}>
                {busy ? "Sending..." : "Send Request"}
              </button>
              <button onClick={() => setComposing(false)} className="text-[#8b6a43] text-sm underline underline-offset-4">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setComposing(true)} className="text-[#5b3419] font-semibold underline underline-offset-4">
            Send Connection Request →
          </button>
        )}
      </div>
    </div>
  );
}

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
import { HERITAGE_DESIGNATION_LABELS, type HeritageDesignation } from "../../lib/researcher";
import {
  DEFAULT_MARRIAGE_STATUS,
  MARRIAGE_STATUSES,
  MARRIAGE_STATUS_LABELS,
  type MarriageProfile,
  type MarriageStatus,
} from "../../lib/marriage";

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
  heritageDesignation?: HeritageDesignation | null;
  heritageArea?: string;
  recognitionNote?: string;
};

type BlockRow = { id: string; blockedUid: string };

export default function MemberNetwork() {
  const { user, profile, updateNetworkStatus, updateMarriageStatus, syncPublicProfile } = useAuth();
  const [directory, setDirectory] = useState<DirectoryRow[]>([]);
  const [outgoing, setOutgoing] = useState<ConnectionRequest[]>([]);
  const [incoming, setIncoming] = useState<ConnectionRequest[]>([]);
  const [blocks, setBlocks] = useState<BlockRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [marriageOthers, setMarriageOthers] = useState<MarriageProfile[]>([]);
  const marriageStatus = profile?.marriageStatus ?? DEFAULT_MARRIAGE_STATUS;
  const marriageOptedIn = marriageStatus !== "not_listed";

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
    const unsubBlocks = onSnapshot(query(collection(db, "blocks"), where("blockerUid", "==", user.uid)), (snap) => {
      setBlocks(snap.docs.map((d) => ({ id: d.id, blockedUid: d.data().blockedUid as string })));
    });
    return () => {
      unsubOut();
      unsubIn();
      unsubBlocks();
    };
  }, [user]);

  // Only fetched once this member has opted in themselves -- the security rule enforces that a
  // read only succeeds when both sides have a status other than "not_listed", so this query
  // would come back empty (or error) for anyone who hasn't opted in, by design.
  useEffect(() => {
    if (!marriageOptedIn) {
      setMarriageOthers([]);
      return;
    }
    const q = query(collection(db, "marriageProfiles"), where("status", "!=", "not_listed"));
    const unsub = onSnapshot(q, (snap) => {
      setMarriageOthers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<MarriageProfile, "id">) })));
    }, () => setMarriageOthers([]));
    return unsub;
  }, [marriageOptedIn]);

  const handleRespond = async (request: ConnectionRequest, accept: boolean) => {
    const payload: Record<string, unknown> = { status: accept ? "accepted" : "declined", respondedAt: serverTimestamp() };
    if (accept) payload.toEmail = profile?.email ?? "";
    await setDoc(doc(db, "connectionRequests", request.id), payload, { merge: true });
  };

  const handleBlock = async (blockedUid: string) => {
    if (!user) return;
    await setDoc(doc(db, "blocks", `${user.uid}_${blockedUid}`), {
      blockerUid: user.uid,
      blockedUid,
      createdAt: serverTimestamp(),
    });
    // A block also ends any existing connection between the two, in either direction.
    await Promise.all([
      deleteDoc(doc(db, "connectionRequests", `${user.uid}_${blockedUid}`)).catch(() => {}),
      deleteDoc(doc(db, "connectionRequests", `${blockedUid}_${user.uid}`)).catch(() => {}),
    ]);
  };

  const handleUnblock = async (blockRowId: string) => {
    await deleteDoc(doc(db, "blocks", blockRowId));
  };

  const handleReport = async (reportedUid: string, reportedName: string, reason: string) => {
    if (!user || !profile) return;
    await setDoc(doc(collection(db, "memberReports")), {
      reporterUid: user.uid,
      reporterName: profile.fullName,
      reportedUid,
      reportedName,
      reason,
      status: "open",
      createdAt: serverTimestamp(),
    });
  };

  const pendingIncoming = incoming.filter((r) => r.status === "pending");
  const blockedIds = new Set(blocks.map((b) => b.blockedUid));
  const blockedMembers = directory.filter((m) => blockedIds.has(m.id));

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

      <MarriageNetworkCard
        status={marriageStatus}
        note={profile.marriageNote}
        others={marriageOthers.filter((m) => m.id !== user.uid)}
        directory={directory}
        onUpdate={updateMarriageStatus}
      />

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

      {blockedMembers.length > 0 && (
        <div className={cardClass}>
          <h3 className="text-lg font-bold mb-4">Blocked Members</h3>
          <div className="space-y-3">
            {blockedMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3">
                <span>{m.fullName}</span>
                <button
                  onClick={() => handleUnblock(`${user.uid}_${m.id}`)}
                  className="text-[#5b3419] font-semibold text-sm underline underline-offset-4"
                >
                  Unblock
                </button>
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
              .filter((m) => m.id !== user.uid && !blockedIds.has(m.id))
              .map((m) => (
                <DirectoryCard
                  key={m.id}
                  member={m}
                  myUid={user.uid}
                  myName={profile.fullName}
                  myEmail={profile.email}
                  outgoing={outgoing.find((r) => r.toUid === m.id)}
                  incoming={incoming.find((r) => r.fromUid === m.id)}
                  onBlock={() => handleBlock(m.id)}
                  onReport={(reason) => handleReport(m.id, m.fullName, reason)}
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
  onBlock,
  onReport,
}: {
  member: DirectoryRow;
  myUid: string;
  myName: string;
  myEmail: string;
  outgoing?: ConnectionRequest;
  incoming?: ConnectionRequest;
  onBlock: () => Promise<void>;
  onReport: (reason: string) => Promise<void>;
}) {
  const [composing, setComposing] = useState(false);
  const [message, setMessage] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);
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

  const handleRemoveConnection = async (requestId: string) => {
    if (!window.confirm(`Remove your connection with ${member.fullName}?`)) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "connectionRequests", requestId));
    } catch (err: any) {
      window.alert(err.message ?? "Could not remove this connection.");
    } finally {
      setBusy(false);
    }
  };

  const handleBlockClick = async () => {
    if (!window.confirm(`Block ${member.fullName}? This also removes any existing connection with them.`)) return;
    setBusy(true);
    try {
      await onBlock();
    } catch (err: any) {
      window.alert(err.message ?? "Could not block this member.");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) return;
    setBusy(true);
    try {
      await onReport(reportReason.trim());
      setReporting(false);
      setReportReason("");
      setReportSent(true);
      setTimeout(() => setReportSent(false), 3000);
    } catch (err: any) {
      window.alert(err.message ?? "Could not send report.");
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
            {member.heritageDesignation && (
              <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-[#e5efe0] text-[#2f6b3a] border border-[#2f6b3a]/30">
                {HERITAGE_DESIGNATION_LABELS[member.heritageDesignation]}
                {member.heritageArea ? ` -- ${member.heritageArea}` : ""}
              </span>
            )}
          </div>
          {location && <p className="text-sm text-[#8b6a43]">{location}</p>}
        </div>
      </div>

      {member.recognitionNote && <p className="text-sm text-[#8b6a43] mt-2 italic">{member.recognitionNote}</p>}
      {details.length > 0 && <p className="text-[#4a3728] mt-2 text-sm">{details.join(" • ")}</p>}
      {member.bio && <p className="text-[#4a3728] mt-2">{member.bio}</p>}

      <div className="mt-4 border-t border-[#b38b59]/20 pt-4">
        {incoming?.status === "pending" ? (
          <p className="text-sm text-[#8b6a43]">Sent you a request -- respond above.</p>
        ) : incoming?.status === "accepted" ? (
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm text-[#2f6b3a] font-semibold">Connected -- {incoming.fromEmail}</p>
            <button
              onClick={() => handleRemoveConnection(incoming.id)}
              disabled={busy}
              className="text-[#8c2f23] text-sm underline underline-offset-4 disabled:opacity-60"
            >
              Remove Connection
            </button>
          </div>
        ) : outgoing?.status === "pending" ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8b6a43]">Request sent</span>
            <button onClick={handleCancel} disabled={busy} className="text-[#8c2f23] text-sm font-semibold underline underline-offset-4 disabled:opacity-60">
              Cancel
            </button>
          </div>
        ) : outgoing?.status === "accepted" ? (
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm text-[#2f6b3a] font-semibold">Connected -- {outgoing.toEmail}</p>
            <button
              onClick={() => handleRemoveConnection(outgoing.id)}
              disabled={busy}
              className="text-[#8c2f23] text-sm underline underline-offset-4 disabled:opacity-60"
            >
              Remove Connection
            </button>
          </div>
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

      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        {reporting ? (
          <div className="w-full space-y-2">
            <textarea
              className={inputClass}
              placeholder="Why are you reporting this member?"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={2}
            />
            <div className="flex gap-3">
              <button onClick={handleSubmitReport} disabled={busy || !reportReason.trim()} className="text-[#8c2f23] font-semibold underline underline-offset-4 disabled:opacity-60">
                Submit Report
              </button>
              <button onClick={() => setReporting(false)} className="text-[#8b6a43] underline underline-offset-4">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <button onClick={handleBlockClick} disabled={busy} className="text-[#8b6a43] underline underline-offset-4 disabled:opacity-60">
              Block
            </button>
            <button onClick={() => setReporting(true)} className="text-[#8b6a43] underline underline-offset-4">
              Report
            </button>
            {reportSent && <span className="text-[#2f6b3a]">Report sent.</span>}
          </>
        )}
      </div>
    </div>
  );
}

// Deliberately separate from the main directory: visibility here is mutual opt-in only (a
// member sees others only once they've set their own status to something other than "Not
// Listed"), so this can't just be another column on the regular directory card.
function MarriageNetworkCard({
  status,
  note,
  others,
  directory,
  onUpdate,
}: {
  status: MarriageStatus;
  note?: string;
  others: MarriageProfile[];
  directory: DirectoryRow[];
  onUpdate: (status: MarriageStatus, note?: string) => Promise<{ error: string | null }>;
}) {
  const [noteDraft, setNoteDraft] = useState(note ?? "");
  const [busy, setBusy] = useState(false);
  const optedIn = status !== "not_listed";

  const handleSetStatus = async (newStatus: MarriageStatus) => {
    setBusy(true);
    await onUpdate(newStatus, noteDraft);
    setBusy(false);
  };

  const handleSaveNote = async () => {
    setBusy(true);
    await onUpdate(status, noteDraft);
    setBusy(false);
  };

  return (
    <div className={cardClass}>
      <h3 className="text-xl font-bold mb-2">Marriage Networking</h3>
      <p className="text-sm text-[#8b6a43] mb-4">
        Voluntary and adult-only. Visibility is mutual: another member only appears here for you,
        and you only appear for them, once you've both set your status to something other than
        "Not Listed". Nobody's status is shown anywhere else on the site.
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {MARRIAGE_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleSetStatus(s)}
            disabled={busy}
            className={
              status === s
                ? "px-4 py-2 rounded-full bg-[#5b3419] text-white text-sm disabled:opacity-60"
                : "px-4 py-2 rounded-full border border-[#5b3419] text-[#5b3419] text-sm disabled:opacity-60"
            }
          >
            {MARRIAGE_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {optedIn && (
        <div className="mb-4 space-y-2">
          <textarea
            className={inputClass}
            placeholder="Optional note visible only to others who are also listed"
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={2}
          />
          <button onClick={handleSaveNote} disabled={busy} className="text-[#5b3419] font-semibold text-sm underline underline-offset-4 disabled:opacity-60">
            Save Note
          </button>
        </div>
      )}

      {optedIn && (
        <div className="border-t border-[#b38b59]/20 pt-4">
          <p className="text-sm text-[#8b6a43] mb-3">Other members also listed:</p>
          {others.length === 0 ? (
            <p className="text-[#4a3728] text-sm">No one else is listed yet.</p>
          ) : (
            <div className="space-y-3">
              {others.map((m) => {
                const person = directory.find((d) => d.id === m.id);
                return (
                  <div key={m.id} className="border border-[#b38b59]/20 rounded-2xl p-4 bg-white/60">
                    <p className="font-bold">{person?.fullName ?? "Member"}</p>
                    <p className="text-sm text-[#8b6a43]">{MARRIAGE_STATUS_LABELS[m.status]}</p>
                    {m.note && <p className="text-[#4a3728] mt-1">{m.note}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

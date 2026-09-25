import { useEffect, useState, type FormEvent } from "react";
import { collection, doc, deleteDoc, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import {
  RESEARCH_LEVELS,
  RESEARCH_LEVEL_LABELS,
  VERIFICATION_STATUS_LABELS,
  type HeritageSubmission,
  type ResearchLevel,
} from "../../lib/heritage";
import { HERITAGE_DESIGNATION_LABELS } from "../../lib/researcher";

const cardClass = "border border-[#b38b59]/25 rounded-[2rem] p-6 bg-[#faf6ef]";
const inputClass = "w-full rounded-2xl border border-[#c8a97d] bg-white px-4 py-3 outline-none";
const buttonClass = "px-6 py-3 rounded-full bg-[#5b3419] text-white font-semibold hover:bg-[#3b2415] transition disabled:opacity-60";

const STATUS_LABELS: Record<string, string> = { submitted: "Under Review", published: "Published", rejected: "Not Published" };
const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-[#efe4cf] text-[#8b6a43] border-[#b38b59]/40",
  published: "bg-[#e5efe0] text-[#2f6b3a] border-[#2f6b3a]/30",
  rejected: "bg-[#f3e2dc] text-[#8c2f23] border-[#8c2f23]/30",
};

const emptyForm = {
  state: "",
  district: "",
  tehsil: "",
  village: "",
  subject: "",
  date: "",
  location: "",
  historicalClaim: "",
  source: "",
  interviewee: "",
  intervieweeAge: "",
  photoNotes: "",
  researcherObservations: "",
  independentVerification: "",
  currentCondition: "",
  references: "",
  researchLevel: 1 as ResearchLevel,
};

export default function HeritageResearch() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mine, setMine] = useState<HeritageSubmission[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(query(collection(db, "heritageSubmissions"), where("researcherUid", "==", user.uid)), (snap) => {
      setMine(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<HeritageSubmission, "id">) })));
    });
    return unsub;
  }, [user]);

  const setField = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user || !profile) return;
    if (!form.village.trim() || !form.district.trim() || !form.subject.trim() || !form.historicalClaim.trim() || !form.source.trim()) {
      setError("Village, District, Subject, Historical Claim and Source are required.");
      return;
    }
    setSubmitting(true);
    try {
      await setDoc(doc(collection(db, "heritageSubmissions")), {
        researcherUid: user.uid,
        researcherName: profile.fullName,
        researcherMemberId: profile.memberId ?? null,
        researcherDesignation: profile.heritageDesignation ? HERITAGE_DESIGNATION_LABELS[profile.heritageDesignation] : null,
        researcherArea: profile.heritageArea ?? null,
        state: form.state.trim() || null,
        district: form.district.trim(),
        tehsil: form.tehsil.trim() || null,
        village: form.village.trim(),
        subject: form.subject.trim(),
        date: form.date || null,
        location: form.location.trim() || null,
        historicalClaim: form.historicalClaim.trim(),
        source: form.source.trim(),
        interviewee: form.interviewee.trim() || null,
        intervieweeAge: form.intervieweeAge ? parseInt(form.intervieweeAge, 10) : null,
        photoNotes: form.photoNotes.trim() || null,
        researcherObservations: form.researcherObservations.trim() || null,
        independentVerification: form.independentVerification.trim() || null,
        currentCondition: form.currentCondition.trim() || null,
        references: form.references.trim() || null,
        researchLevel: form.researchLevel,
        verificationStatus: null,
        publicationStatus: "submitted",
        createdAt: serverTimestamp(),
      });
      setForm(emptyForm);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message ?? "Could not submit your research.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async (id: string) => {
    if (!window.confirm("Withdraw this submission? This cannot be undone.")) return;
    await deleteDoc(doc(db, "heritageSubmissions", id));
  };

  return (
    <div className="space-y-8">
      <div className={cardClass}>
        <h3 className="text-xl font-bold mb-2">Submit Village Heritage Research</h3>
        <p className="text-sm text-[#8b6a43] mb-6">
          Document village history, gotra and marriage traditions, old buildings, folk memory, or any other heritage
          subject. Record the source of every claim rather than presenting it as established fact -- an editor
          reviews every submission before it's published, and classifies it (verified fact, oral history, local
          tradition, and so on) so readers know what kind of claim they're looking at.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input className={inputClass} placeholder="Village *" value={form.village} onChange={setField("village")} />
            <input className={inputClass} placeholder="District *" value={form.district} onChange={setField("district")} />
            <input className={inputClass} placeholder="Tehsil" value={form.tehsil} onChange={setField("tehsil")} />
            <input className={inputClass} placeholder="State" value={form.state} onChange={setField("state")} />
          </div>
          <input className={inputClass} placeholder="Subject *  (e.g. Origin of the village name)" value={form.subject} onChange={setField("subject")} />
          <div className="grid sm:grid-cols-2 gap-3">
            <input className={inputClass} type="date" value={form.date} onChange={setField("date")} />
            <input className={inputClass} placeholder="Location (e.g. near the old well)" value={form.location} onChange={setField("location")} />
          </div>
          <textarea className={inputClass} placeholder="Historical Claim *" value={form.historicalClaim} onChange={setField("historicalClaim")} rows={4} />
          <textarea
            className={inputClass}
            placeholder="Source * (e.g. Interview with 82-year-old resident X; or a named document/record)"
            value={form.source}
            onChange={setField("source")}
            rows={2}
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <input className={inputClass} placeholder="Interviewee (if any)" value={form.interviewee} onChange={setField("interviewee")} />
            <input className={inputClass} placeholder="Interviewee Age" type="number" value={form.intervieweeAge} onChange={setField("intervieweeAge")} />
          </div>
          <input className={inputClass} placeholder="Photo/document notes (e.g. where originals are kept)" value={form.photoNotes} onChange={setField("photoNotes")} />
          <textarea className={inputClass} placeholder="Researcher's Observations" value={form.researcherObservations} onChange={setField("researcherObservations")} rows={2} />
          <textarea
            className={inputClass}
            placeholder="Independent Verification (can this be corroborated? by what?)"
            value={form.independentVerification}
            onChange={setField("independentVerification")}
            rows={2}
          />
          <input className={inputClass} placeholder="Current Condition (for a site/structure)" value={form.currentCondition} onChange={setField("currentCondition")} />
          <textarea className={inputClass} placeholder="References" value={form.references} onChange={setField("references")} rows={2} />

          <div>
            <p className="text-sm text-[#8b6a43] mb-2">Research Level</p>
            <div className="flex flex-wrap gap-2">
              {RESEARCH_LEVELS.map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setForm((f) => ({ ...f, researchLevel: lvl }))}
                  className={
                    form.researchLevel === lvl
                      ? "px-4 py-2 rounded-full bg-[#5b3419] text-white text-sm"
                      : "px-4 py-2 rounded-full border border-[#5b3419] text-[#5b3419] text-sm"
                  }
                >
                  {RESEARCH_LEVEL_LABELS[lvl]}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-[#8c2f23] text-sm">{error}</p>}
          {success && <p className="text-[#2f6b3a] text-sm">Submitted for review.</p>}
          <button type="submit" disabled={submitting} className={buttonClass}>
            {submitting ? "Submitting..." : "Submit for Review"}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Your Submissions</h3>
        {mine.length === 0 ? (
          <p className="text-[#4a3728]">You haven't submitted any heritage research yet.</p>
        ) : (
          <div className="space-y-4">
            {mine.map((m) => (
              <div key={m.id} className={cardClass}>
                <div className="flex justify-between items-start gap-3 flex-wrap">
                  <div>
                    <p className="font-bold text-lg">{m.subject}</p>
                    <p className="text-sm text-[#8b6a43]">
                      {[m.village, m.tehsil, m.district].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[m.publicationStatus]}`}>
                    {STATUS_LABELS[m.publicationStatus]}
                  </span>
                </div>
                {m.verificationStatus && (
                  <p className="text-sm text-[#8b6a43] mt-2">Classified as: {VERIFICATION_STATUS_LABELS[m.verificationStatus]}</p>
                )}
                {m.editorialNote && <p className="text-[#4a3728] mt-2 text-sm">Editor's note: {m.editorialNote}</p>}
                {m.publicationStatus !== "published" && (
                  <button onClick={() => handleWithdraw(m.id)} className="mt-3 text-[#8c2f23] text-sm underline underline-offset-4">
                    Withdraw
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

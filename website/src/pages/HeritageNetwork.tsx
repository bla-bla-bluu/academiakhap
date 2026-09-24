import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/Navbar";
import { RESEARCH_LEVEL_LABELS, VERIFICATION_STATUS_LABELS, type HeritageSubmission } from "../lib/heritage";

const cardClass = "border border-[#b38b59]/25 rounded-[2rem] p-6 bg-[#faf6ef]";

export default function HeritageNetworkPage() {
  const [entries, setEntries] = useState<HeritageSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [district, setDistrict] = useState("all");
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("entry");

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "heritageSubmissions"), where("publicationStatus", "==", "published")), (snap) => {
      setEntries(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<HeritageSubmission, "id">) })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const districts = useMemo(() => Array.from(new Set(entries.map((e) => e.district))).sort(), [entries]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (district !== "all" && e.district !== district) return false;
      if (!search.trim()) return true;
      const haystack = `${e.subject} ${e.village} ${e.tehsil ?? ""} ${e.district}`.toLowerCase();
      return haystack.includes(search.trim().toLowerCase());
    });
  }, [entries, district, search]);

  const researchers = useMemo(() => {
    const counts = new Map<string, number>();
    entries.forEach((e) => counts.set(e.researcherName, (counts.get(e.researcherName) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  const selected = entries.find((e) => e.id === selectedId);

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">
      <Navbar
        links={[
          { to: "/", label: "Home" },
          { to: "/research", label: "Archive" },
          { to: "/heritage-network", label: "Heritage Network", active: true },
          { to: "/community", label: "Chaupal" },
        ]}
      />

      <section className="bg-[#efe4cf] border-b border-[#8b6a43]/20 pt-12 sm:pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">Academia Khap</p>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight mb-6">Village Heritage Research Network</h1>
          <p className="text-[#4a3728] max-w-2xl">
            Village origin, gotra and marriage traditions, old buildings and baolis, folk memory, revenue and
            genealogical records, documented village by village by Academia Khap's researcher network. Every entry
            below has gone through editorial review and carries a classification -- verified fact, oral history,
            local tradition, and so on -- so it's clear what kind of claim you're reading.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {selected ? (
          <div>
            <button
              onClick={() => setSearchParams({})}
              className="text-[#5b3419] font-semibold underline underline-offset-4 mb-6"
            >
              ← Back to all entries
            </button>
            <EntryDetail entry={selected} />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-8">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="rounded-2xl border border-[#c8a97d] bg-white px-4 py-3 outline-none"
              >
                <option value="all">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search village, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[200px] rounded-2xl border border-[#c8a97d] bg-white px-4 py-3 outline-none"
              />
            </div>

            {loading ? (
              <p className="text-[#4a3728]">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-[#4a3728]">
                {entries.length === 0
                  ? "No published entries yet -- the researcher network is just getting started."
                  : "No entries match this filter."}
              </p>
            ) : (
              <div className="space-y-5">
                {filtered.map((entry) => (
                  <div key={entry.id} className={cardClass}>
                    <div className="flex justify-between items-start gap-3 flex-wrap">
                      <div>
                        <p className="font-bold text-lg">{entry.subject}</p>
                        <p className="text-sm text-[#8b6a43]">{[entry.village, entry.tehsil, entry.district].filter(Boolean).join(", ")}</p>
                      </div>
                      {entry.verificationStatus && (
                        <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-[#efe4cf] text-[#8b6a43] border border-[#b38b59]/40">
                          {VERIFICATION_STATUS_LABELS[entry.verificationStatus]}
                        </span>
                      )}
                    </div>
                    <p className="text-[#4a3728] mt-3 line-clamp-3">{entry.historicalClaim}</p>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-[#8b6a43]">Researcher: {entry.researcherName}</p>
                      <button
                        onClick={() => setSearchParams({ entry: entry.id })}
                        className="text-[#5b3419] font-semibold underline underline-offset-4"
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {researchers.length > 0 && (
              <div className="mt-16">
                <h3 className="text-xl font-bold mb-4">Researchers</h3>
                <div className="flex flex-wrap gap-3">
                  {researchers.map(([name, count]) => (
                    <span key={name} className="px-4 py-2 rounded-full border border-[#b38b59]/30 bg-[#faf6ef] text-sm">
                      {name} <span className="text-[#8b6a43]">({count})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={`${cardClass} mt-16 text-center`}>
              <h3 className="text-xl font-bold mb-2">Are you documenting your village's history?</h3>
              <p className="text-[#4a3728] mb-4">
                Academia Khap members can submit village heritage research -- origin stories, gotra and marriage
                traditions, old buildings, folk memory -- through Chaupal.
              </p>
              <a href="/community" className="inline-block px-6 py-3 rounded-full bg-[#5b3419] text-white font-semibold hover:bg-[#3b2415] transition">
                Submit Research via Chaupal
              </a>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function EntryDetail({ entry }: { entry: HeritageSubmission }) {
  const field = (label: string, value?: string | number | null) =>
    value ? (
      <div className="py-2 border-b border-[#b38b59]/15">
        <p className="text-sm text-[#8b6a43] uppercase tracking-wide mb-1">{label}</p>
        <p className="text-[#4a3728] whitespace-pre-wrap">{value}</p>
      </div>
    ) : null;

  return (
    <div className={cardClass}>
      <div className="flex justify-between items-start gap-3 flex-wrap mb-4">
        <div>
          <h2 className="text-2xl font-bold">{entry.subject}</h2>
          <p className="text-[#8b6a43]">{[entry.village, entry.tehsil, entry.district, entry.state].filter(Boolean).join(", ")}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {entry.verificationStatus && (
            <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-[#efe4cf] text-[#8b6a43] border border-[#b38b59]/40">
              {VERIFICATION_STATUS_LABELS[entry.verificationStatus]}
            </span>
          )}
          <span className="text-xs text-[#8b6a43]">{RESEARCH_LEVEL_LABELS[entry.researchLevel]}</span>
        </div>
      </div>

      {field("Historical Claim", entry.historicalClaim)}
      {field("Source", entry.source)}
      {field("Date", entry.date)}
      {field("Location", entry.location)}
      {field("Interviewee", entry.interviewee && entry.intervieweeAge ? `${entry.interviewee}, ${entry.intervieweeAge}` : entry.interviewee)}
      {field("Researcher's Observations", entry.researcherObservations)}
      {field("Independent Verification", entry.independentVerification)}
      {field("Current Condition", entry.currentCondition)}
      {field("References", entry.references)}

      <p className="text-sm text-[#8b6a43] mt-4">
        Researcher: {entry.researcherName}
        {entry.researcherMemberId ? ` (${entry.researcherMemberId})` : ""}
      </p>
    </div>
  );
}

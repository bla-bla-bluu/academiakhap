import type React from "react";

// The nested structure described in "The Architecture". Built from divs rather than an
// SVG so the labels stay selectable, reflow on narrow screens, and are read in order by
// a screen reader. Widths step up to show scope, not to encode any measured quantity.
const TIERS = [
  { term: "Sarv Khap", gloss: "khap of khaps — regional council convened across many khaps", scale: "many khaps", w: "100%", tone: "top" },
  { term: "Khap", gloss: "the clan-territorial unit; 12 thambas", scale: "84 villages", w: "95%", tone: "khap" },
  { term: "Thamba · Tapa", gloss: "thamba in western Uttar Pradesh, tapa in Haryana", scale: "12–14 villages", w: "88%", tone: "mid" },
  { term: "Ganwand", gloss: "holds its own council", scale: "4–5 villages", w: "81%", tone: "mid" },
  { term: "Village", gloss: "constituted of pannas", scale: "1 village", w: "74%", tone: "base" },
  { term: "Panna · Patti", gloss: "a group of tholas", scale: "part of a village", w: "67%", tone: "base" },
  { term: "Thola", gloss: "a group of kunbhas", scale: "several families", w: "60%", tone: "base" },
  { term: "Kunbha", gloss: "a group of related families", scale: "smallest unit", w: "53%", tone: "base" },
];

const TONE: Record<string, string> = {
  top: "bg-[#5b3419] text-[#faf6ef] border-[#5b3419]",
  khap: "bg-[#8b6a43] text-[#faf6ef] border-[#8b6a43]",
  mid: "bg-[#efe4cf] text-[#3b2415] border-[#b38b59]/45",
  base: "bg-[#f8f4ed] text-[#4a3728] border-[#b38b59]/30",
};

export default function KhapHierarchyDiagram() {
  return (
    <figure className="my-10 rounded-[2rem] border border-[#b38b59]/30 bg-[#faf6ef] p-6 sm:p-8 not-prose">
      <figcaption className="mb-6">
        <p className="uppercase tracking-[0.2em] text-xs font-bold text-[#8b6a43] mb-2">Figure 1</p>
        <h3 className="text-xl sm:text-2xl font-bold text-[#3b2415] leading-snug">
          The nested architecture of a khap
        </h3>
        <p className="text-[15px] leading-7 text-[#6b5746] mt-2">
          Each tier attempts a dispute first and passes it upward only if it cannot be
          settled. A khap is therefore the appellate forum, not the first one.
        </p>
      </figcaption>

      <div className="relative">
        {/* escalation rail */}
        <div className="hidden sm:flex absolute left-0 top-0 bottom-0 w-8 flex-col items-center justify-between pointer-events-none">
          <span aria-hidden="true" className="text-[#8b6a43] text-lg leading-none">▲</span>
          <span
            aria-hidden="true"
            className="flex-1 my-1 w-px bg-gradient-to-t from-[#b38b59]/20 to-[#8b6a43]/70"
          />
          <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] tracking-[0.18em] uppercase text-[#8b6a43] font-bold whitespace-nowrap">
            disputes escalate
          </span>
        </div>

        <ol className="flex flex-col gap-2 sm:pl-12">
          {TIERS.map((t) => (
            <li key={t.term} className="flex min-w-0 justify-center sm:justify-start">
              <div
                // Inline width would beat any Tailwind class, so the step is carried as a
                // custom property and only applied from sm up. On phones every tier is
                // full width -- a 53%-wide box cannot hold its labels at 430px.
                style={{ "--tier-w": t.w } as React.CSSProperties}
                className={`box-border w-full sm:w-[var(--tier-w)] max-w-full min-w-0 rounded-xl border px-4 py-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 ${TONE[t.tone]}`}
              >
                <span className="font-bold text-[16px] sm:text-[17px] whitespace-nowrap">{t.term}</span>
                <span className="text-[13px] sm:text-[14px] opacity-85 leading-6">{t.gloss}</span>
                <span className="ml-auto text-[12px] sm:text-[13px] font-bold opacity-90 whitespace-nowrap">
                  {t.scale}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-[13px] leading-6 text-[#6b5746] mt-6 border-t border-[#b38b59]/25 pt-4">
        Tiers after M.C. Pradhan, <em>The Political System of the Jats of Northern India</em>{" "}
        (Oxford University Press, 1966), with the kunbha-to-Sarv-Khap sequence as recorded by
        Om Prakash. Pradhan notes the ganwand tier rests on oral tradition and observed
        practice rather than historical evidence. The eighty-four-village khap is the
        classical definition; actual khaps vary.
      </p>
    </figure>
  );
}

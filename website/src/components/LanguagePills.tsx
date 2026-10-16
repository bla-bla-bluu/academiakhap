import { useEffect, useRef, useState } from "react";
import { getCurrentLanguage, switchLanguage, type LanguageCode } from "../lib/googleTranslate";

// One compact dropdown rather than four separate pills -- with 7 nav links already in the
// row, four more buttons just for language made the header read as a wall of pills. This
// keeps the same four languages behind a single control that takes the same width as one
// nav link.
const LANGUAGES: { code: LanguageCode; short: string; full: string }[] = [
  { code: "en", short: "EN", full: "English" },
  { code: "hi", short: "हिं", full: "हिंदी" },
  { code: "pa", short: "ਪੰ", full: "ਪੰਜਾਬੀ" },
  { code: "ur", short: "اردو", full: "اردو" },
];

export default function LanguagePills() {
  // Google's cookie isn't readable until the client mounts, so this starts as "en"
  // (correct for a first-time visitor) and corrects itself once mounted for a returning
  // one -- a one-frame flash on repeat visits, not a bug in the read.
  const [active, setActive] = useState<LanguageCode>("en");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActive(getCurrentLanguage());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const activeLang = LANGUAGES.find((l) => l.code === active) ?? LANGUAGES[0];

  return (
    <div className="relative notranslate" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose site language"
        className="whitespace-nowrap flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-full border border-[#5b3419] text-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300 text-sm sm:text-base leading-none"
      >
        <span aria-hidden="true">🌐</span>
        <span>{activeLang.short}</span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 min-w-[8rem] bg-white border border-[#b38b59]/40 rounded-2xl shadow-lg overflow-hidden z-30"
        >
          {LANGUAGES.map(({ code, full }) => {
            const isActive = code === active;
            return (
              <button
                key={code}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  setOpen(false);
                  if (!isActive) switchLanguage(code);
                }}
                className={
                  isActive
                    ? "block w-full text-left px-4 py-2 text-sm bg-[#efe4cf] text-[#5b3419] font-semibold"
                    : "block w-full text-left px-4 py-2 text-sm text-[#4a3728] hover:bg-[#faf6ef]"
                }
              >
                {full}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

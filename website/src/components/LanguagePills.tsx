import { useEffect, useState } from "react";
import { getCurrentLanguage, switchLanguage, type LanguageCode } from "../lib/googleTranslate";

// Matches the Navbar's own nav-link pill styling exactly (see Navbar.tsx), sized down
// slightly since these are secondary controls sitting alongside primary navigation.
const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "pa", label: "ਪੰ" },
  { code: "ur", label: "اردو" },
];

export default function LanguagePills() {
  // Google's cookie isn't readable until the client mounts, so this starts as "en"
  // (correct for a first-time visitor) and corrects itself once mounted for a returning
  // one -- a one-frame flash on repeat visits, not a bug in the read.
  const [active, setActive] = useState<LanguageCode>("en");

  useEffect(() => {
    setActive(getCurrentLanguage());
  }, []);

  return (
    <div className="flex items-center gap-1.5 notranslate" role="group" aria-label="Choose site language">
      {LANGUAGES.map(({ code, label }) => {
        const isActive = code === active;
        return (
          <button
            key={code}
            type="button"
            onClick={() => {
              if (!isActive) switchLanguage(code);
            }}
            aria-pressed={isActive}
            className={
              isActive
                ? "whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-full bg-[#5b3419] text-white text-xs sm:text-sm leading-none"
                : "whitespace-nowrap px-2.5 sm:px-3 py-1.5 rounded-full border border-[#5b3419] hover:bg-[#5b3419] hover:text-white transition duration-300 text-xs sm:text-sm leading-none"
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

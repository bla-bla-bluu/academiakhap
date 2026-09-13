// Shared helpers for driving Google's website-translate widget (see LanguageSwitcher.tsx,
// the invisible engine that loads it, and LanguagePills.tsx, the themed control users
// actually see) via its "googtrans" cookie rather than its own UI.
//
// Google's script reads this cookie on every page load and applies the recorded
// translation before the widget's own selector (which this site hides entirely) ever
// renders. Every switch here -- including back to English -- goes through a full page
// reload of that cookie, rather than mutating the widget's hidden <select> in place and
// dispatching a change event. The in-place method does switch language correctly, but
// was not reliably reversible back to the original English text in testing: a reload
// always produces a known-good state (the real, unmodified English page, fetched fresh,
// if no cookie says otherwise), at the cost of losing in-page scroll position -- an
// acceptable trade for a control people expect to just work, including the way back.

export type LanguageCode = "en" | "hi" | "pa" | "ur";

const COOKIE_NAME = "googtrans";

function domainVariants(): (string | undefined)[] {
  const host = window.location.hostname;
  const variants: (string | undefined)[] = [undefined, host, `.${host}`];
  const labels = host.split(".");
  if (labels.length > 2) {
    variants.push(`.${labels.slice(-2).join(".")}`);
  }
  return variants;
}

export function getCurrentLanguage(): LanguageCode {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (!match) return "en";
  const parts = decodeURIComponent(match[1]).split("/").filter(Boolean);
  const code = parts[1];
  return code === "hi" || code === "pa" || code === "ur" ? code : "en";
}

export function switchLanguage(code: LanguageCode) {
  // Clear every domain variant the cookie could have been set under first -- a stale
  // value scoped differently from whatever we set (or choose not to set) below would
  // otherwise still win when Google's script reads the cookie on the fresh load.
  for (const domain of domainVariants()) {
    const domainPart = domain ? `; domain=${domain}` : "";
    document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC${domainPart}`;
  }
  if (code !== "en") {
    document.cookie = `${COOKIE_NAME}=/en/${code}; path=/`;
  }
  window.location.reload();
}

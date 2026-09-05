import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position on navigation. When the URL carries a hash (e.g. /#donate)
// it scrolls to that section instead -- without this the plain scrollTo(0, 0) below
// would fire on the pathname change and silently swallow the anchor.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // On a cold load the target may not be mounted when this first runs, so retry
    // across a few frames before falling back to the top of the page.
    const id = decodeURIComponent(hash.slice(1));
    let frames = 0;
    let raf = requestAnimationFrame(function attempt() {
      const el = document.getElementById(id);
      if (el) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        return;
      }
      if (frames++ < 40) {
        raf = requestAnimationFrame(attempt);
      } else {
        window.scrollTo(0, 0);
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { articlesNewestFirst } from "../data/articles";

// Every article, all the time -- no slice(). Auto-scrolling means new articles show up
// here on their own as they're added, the way articlesNewestFirst was already designed
// for elsewhere on this page, rather than needing this list hand-maintained.
//
// The scroll is CSS only (a duplicated track sliding from 0 to -50%, which lines the
// second copy up exactly where the first started, so the loop has no visible seam) --
// no JS animation loop, so it can't jank or drop frames under load. Speed is set in
// seconds-per-card rather than a fixed total duration, so the pace stays constant (and
// "slowly slowly", per the ask) as more articles are published rather than speeding up
// to cram more content into the same duration.
const SECONDS_PER_CARD = 7;

function ArticleCardCompact({
  title,
  category,
  slug,
}: {
  title: string;
  category: string;
  slug: string;
}) {
  return (
    <Link
      to={slug}
      className="group flex-shrink-0 w-72 sm:w-80 bg-[#f8f2e7] border border-[#b38b59]/30 rounded-[1.75rem] p-6 shadow-sm hover:shadow-xl hover:border-[#5b3419]/40 transition"
    >
      <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#5b3419] text-white text-xs sm:text-sm mb-4">
        {category}
      </div>
      <h3 className="text-lg sm:text-xl font-bold leading-snug mb-3 group-hover:underline underline-offset-4">
        {title}
      </h3>
      <span className="text-sm font-semibold text-[#5b3419]">Read Article &rarr;</span>
    </Link>
  );
}

export default function ArticleMarquee() {
  const articles = articlesNewestFirst;
  const duration = articles.length * SECONDS_PER_CARD;

  // Auto-scroll is exactly the motion prefers-reduced-motion exists to suppress. Rather
  // than just freezing the animated (doubled) track -- which would leave every article
  // sitting there twice -- render a single, plainly scrollable row instead. matchMedia
  // isn't available while this renders for prerendering, so it starts animated (correct
  // for the common case) and corrects itself once mounted in the browser.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-2">
        {articles.map((article) => (
          <ArticleCardCompact
            key={article.id}
            title={article.title}
            category={article.category}
            slug={article.slug}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="marquee-viewport">
      <div className="marquee-track" style={{ animationDuration: `${duration}s` }}>
        {/* Rendered twice back to back -- the second copy is what the loop scrolls onto
            as the first scrolls off, so there is never a visible gap or reset. */}
        {[...articles, ...articles].map((article, i) => (
          <ArticleCardCompact
            key={`${article.id}-${i}`}
            title={article.title}
            category={article.category}
            slug={article.slug}
          />
        ))}
      </div>
    </div>
  );
}

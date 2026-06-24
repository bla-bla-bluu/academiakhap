import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "../data/articles";

const SLIDE_DURATION = 3000;

function articleKey(slug: string) {
  return slug.split("/").filter(Boolean).pop();
}

export default function ArticleSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % articles.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  if (articles.length === 0) return null;

  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-[#5b3419] overflow-hidden">
      {articles.map((article, i) => (
        <Link
          key={article.id}
          to={`/research?article=${articleKey(article.slug)}`}
          className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-16 transition-opacity duration-700 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#e7d6be] mb-4">
            {article.category}
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-4xl">
            {article.title}
          </h2>
          <span className="mt-5 text-sm sm:text-base text-[#f3dfc0] underline underline-offset-4">
            Read on the Archive →
          </span>
        </Link>
      ))}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {articles.map((article, i) => (
          <button
            key={article.id}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

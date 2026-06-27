import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "../data/articles";

const SLIDE_DURATION = 3000;

function articleKey(slug: string) {
  return slug.split("/").filter(Boolean).pop();
}

export default function ArticleSlideshow() {
  const totalSlides = 1 + articles.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % totalSlides);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [totalSlides]);

  return (
    <div className="relative w-full h-48 sm:h-72 lg:h-96 bg-[#5b3419] overflow-hidden">
      {/* Slide 0: header banner -- object-contain so the full banner always shows, never cropped */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          index === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
        }`}
      >
        <img src="/header.png" alt="Academia Khap Header" className="w-full h-full object-contain" />
      </div>

      {/* Slides 1..n: articles */}
      {articles.map((article, i) => {
        const slideIndex = i + 1;
        return (
          <Link
            key={article.id}
            to={`/research/${articleKey(article.slug)}`}
            className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-16 transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#e7d6be] mb-2 sm:mb-4">
              {article.category}
            </span>
            <h2 className="text-base sm:text-2xl lg:text-4xl font-bold text-white leading-tight max-w-4xl line-clamp-3">
              {article.title}
            </h2>
            <span className="mt-2 sm:mt-5 text-xs sm:text-base text-[#f3dfc0] underline underline-offset-4">
              Read on the Archive →
            </span>
          </Link>
        );
      })}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
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

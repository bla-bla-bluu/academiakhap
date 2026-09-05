import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ArticleCard from "../components/ArticleCard";
import KhapHierarchyDiagram from "../components/KhapHierarchyDiagram";
import { articles, articlesNewestFirst } from "../data/articles";
import { Search } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  article: "Article",
  discussion: "Discussion",
  podcast: "Podcast",
  video: "Video",
};

// Body paragraphs are plain strings, so inline cross-references are written as
// [label](/research/slug) and turned into router links here. Only internal paths are
// accepted -- an article should not be able to inject an arbitrary outbound link.
function renderParagraph(text: string): ReactNode {
  const pattern = /\[([^\]]+)\]\((\/[A-Za-z0-9\-_/]*)\)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <Link
        key={`${m.index}-${m[2]}`}
        to={m[2]}
        className="underline underline-offset-2 decoration-[#b38b59] hover:text-[#5b3419]"
      >
        {m[1]}
      </Link>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out.length ? out : text;
}

function renderSource(source: string): ReactNode {
  const doiMatch = source.match(/\bDOI:\s*(\S+)/i);
  if (doiMatch) {
    const doi = doiMatch[1].replace(/[).,]+$/, "");
    const start = doiMatch.index ?? 0;
    const before = source.slice(0, start);
    const after = source.slice(start + doiMatch[0].length);
    return (
      <>
        {before}
        <a
          href={`https://doi.org/${doi}`}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-[#5b3419]"
        >
          DOI: {doi}
        </a>
        {after}
      </>
    );
  }

  const parts = source.split(/(https?:\/\/[^\s]+)/g);
  if (parts.length > 1) {
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-[#5b3419] break-all"
        >
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  return source;
}

export default function ResearchPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const articleRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState("");

  const filteredArticles = articlesNewestFirst.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );
  const selectedArticle = slug
    ? articles.find((article) => article.slug.endsWith(`/${slug}`)) ?? null
    : null;

  useEffect(() => {
    if (!selectedArticle || !articleRef.current) return;

    const scrollTimer = window.setTimeout(() => {
      articleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);

    return () => window.clearTimeout(scrollTimer);
  }, [selectedArticle]);

  const handleArticleSelect = (articleId: number) => {
    const article = articles.find((item) => item.id === articleId);
    if (!article) return;

    const articleKey = article.slug.split("/").filter(Boolean).pop();
    if (!articleKey) return;
    navigate(`/research/${articleKey}`);
  };

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">
      <Navbar links={[{ to: "/", label: "Home" }, { to: "/community", label: "Chaupal" }]} />

      <div className="grid lg:grid-cols-[320px_1fr] xl:grid-cols-[350px_1fr] min-h-screen">
        <div className="border-r border-[#b38b59]/20 bg-[#efe4cf] p-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Archive</h2>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-4 text-[#8b6a43]" />
            <input
              type="text"
              placeholder="Search the archive..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#b38b59]/30 bg-white py-4 pl-14 pr-4 outline-none"
            />
          </div>

          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                category={article.category}
                type={article.type}
                active={article.id === selectedArticle?.id}
                onClick={() => handleArticleSelect(article.id)}
              />
            ))}
          </div>
        </div>

        <div ref={articleRef} className="scroll-mt-4 p-6 sm:p-8 lg:p-12">
          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Articles, Discussions & Media
          </p>

          {!selectedArticle ? (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-8">Knowledge Archive</h1>

              <p className="text-base sm:text-lg lg:text-xl leading-8 sm:leading-9 lg:leading-10 text-[#4a3728] max-w-5xl">
                Articles, community discussions backed by evidence, podcasts, and video features --
                each supported with historical references, archival material, and documented
                sources.
              </p>

              <div className="mt-12 rounded-[2rem] border border-[#b38b59]/20 bg-[#faf6ef] p-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-5">Start Exploring</h2>

                <p className="text-base sm:text-lg leading-8 sm:leading-9 text-[#4a3728]">
                  Choose something from the left panel to begin reading, listening, or watching.
                  It will open in this right panel for faster browsing.
                </p>
              </div>
            </>
          ) : (
            <article className="max-w-5xl">
              <div className="flex items-center gap-3 mb-3">
                <p className="text-sm uppercase tracking-[0.25em] text-[#8b6a43]">
                  {selectedArticle.category}
                </p>
                <span className="text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full bg-[#efe4cf] text-[#8b6a43]">
                  {TYPE_LABELS[selectedArticle.type]}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {selectedArticle.title}
              </h1>

              {selectedArticle.author && (
                <p className="mb-8 text-[15px] text-[#6b5746]">
                  By <span className="font-bold text-[#5b3419]">{selectedArticle.author}</span>
                </p>
              )}

              {(selectedArticle.type === "podcast" || selectedArticle.type === "video") &&
                selectedArticle.mediaUrl && (
                  <div className="mb-10 rounded-[2rem] overflow-hidden border border-[#b38b59]/20 aspect-video">
                    <iframe
                      src={selectedArticle.mediaUrl}
                      title={selectedArticle.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

              <div className="space-y-6 text-base sm:text-lg leading-8 sm:leading-9 text-[#4a3728]">
                {selectedArticle.body.map((paragraph, i) => {
                  // "::figure:<id>" renders a diagram component instead of prose. Kept as a
                  // plain string so the body array stays serialisable for prerendering.
                  if (paragraph.startsWith("::figure:")) {
                    const figure = paragraph.slice("::figure:".length).trim();
                    return figure === "khap-hierarchy" ? <KhapHierarchyDiagram key={i} /> : null;
                  }
                  return paragraph.startsWith("## ") ? (
                    <h2 key={i} className="text-2xl sm:text-3xl font-bold text-[#3b2415]">
                      {paragraph.slice(3)}
                    </h2>
                  ) : (
                    <p key={i}>{renderParagraph(paragraph)}</p>
                  );
                })}
              </div>

              <div className="mt-12 rounded-[2rem] border border-[#b38b59]/20 bg-[#faf6ef] p-8">
                <h2 className="text-2xl font-bold mb-4">Evidence & Sources</h2>
                <ol className="space-y-2 list-decimal pl-6 text-[#4a3728]">
                  {selectedArticle.sources.map((source) => (
                    <li key={source}>{renderSource(source)}</li>
                  ))}
                </ol>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

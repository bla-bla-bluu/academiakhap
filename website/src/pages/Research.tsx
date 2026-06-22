import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ArticleCard from "../components/ArticleCard";
import { articles } from "../data/articles";
import { Search } from "lucide-react";

export default function ResearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );
  const selectedArticle = articles.find((article) => article.id === selectedArticleId) ?? null;

  useEffect(() => {
    const articleParam = searchParams.get("article");
    if (!articleParam) {
      setSelectedArticleId(null);
      return;
    }

    const matched = articles.find((article) => article.slug.endsWith(`/${articleParam}`));
    setSelectedArticleId(matched ? matched.id : null);
  }, [searchParams]);

  const handleArticleSelect = (articleId: number) => {
    setSelectedArticleId(articleId);
    const article = articles.find((item) => item.id === articleId);
    if (!article) return;

    const articleKey = article.slug.split("/").filter(Boolean).pop();
    if (!articleKey) return;
    setSearchParams({ article: articleKey });
  };

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#3b2415] font-serif">
      <Navbar links={[{ to: "/", label: "Home" }, { to: "/community", label: "Vidvat Panchayat" }]} />

      <div className="grid lg:grid-cols-[320px_1fr] xl:grid-cols-[350px_1fr] min-h-screen">
        <div className="border-r border-[#b38b59]/20 bg-[#efe4cf] p-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Research Archive</h2>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-4 text-[#8b6a43]" />
            <input
              type="text"
              placeholder="Search articles..."
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
                active={article.id === selectedArticleId}
                onClick={() => handleArticleSelect(article.id)}
              />
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-12">
          <p className="uppercase tracking-[0.35em] text-sm text-[#8b6a43] mb-4">
            Publications & Articles
          </p>

          {!selectedArticle ? (
            <>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-8">Research & Evidence Archive</h1>

              <p className="text-base sm:text-lg lg:text-xl leading-8 sm:leading-9 lg:leading-10 text-[#4a3728] max-w-5xl">
                Explore detailed articles supported with historical references,
                archival material, community records, source citations,
                images, academic arguments, and documented evidence.
              </p>

              <div className="mt-12 rounded-[2rem] border border-[#b38b59]/20 bg-[#faf6ef] p-10">
                <h2 className="text-2xl sm:text-3xl font-bold mb-5">Select an Article</h2>

                <p className="text-base sm:text-lg leading-8 sm:leading-9 text-[#4a3728]">
                  Choose an article from the left panel to begin reading.
                  The article will open in this right panel for faster browsing.
                </p>
              </div>
            </>
          ) : (
            <article className="max-w-5xl">
              <p className="text-sm uppercase tracking-[0.25em] text-[#8b6a43] mb-3">
                {selectedArticle.category}
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                {selectedArticle.title}
              </h1>

              <div className="space-y-6 text-base sm:text-lg leading-8 sm:leading-9 text-[#4a3728]">
                {selectedArticle.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-12 rounded-[2rem] border border-[#b38b59]/20 bg-[#faf6ef] p-8">
                <h2 className="text-2xl font-bold mb-4">Evidence & Sources</h2>
                <ul className="space-y-2 list-disc pl-6 text-[#4a3728]">
                  {selectedArticle.sources.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

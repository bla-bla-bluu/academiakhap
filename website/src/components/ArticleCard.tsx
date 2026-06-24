import type { ContentType } from "../data/articles";

type ArticleCardProps = {
  title: string;
  category: string;
  type: ContentType;
  onClick: () => void;
  active?: boolean;
};

const TYPE_LABELS: Record<ContentType, string> = {
  article: "Article",
  discussion: "Discussion",
  podcast: "Podcast",
  video: "Video",
};

export default function ArticleCard({ title, category, type, onClick, active = false }: ArticleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full text-left rounded-2xl border p-5 transition duration-300 ${
        active
          ? "bg-[#5b3419] text-white border-[#5b3419]"
          : "border-[#b38b59]/20 bg-[#faf6ef] hover:bg-[#5b3419] hover:text-white"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className={`text-xs uppercase tracking-[0.2em] ${active ? "text-[#f3dfc0]" : "text-[#8b6a43]"}`}>
          {category}
        </p>
        <span
          className={`text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
            active ? "bg-white/20 text-white" : "bg-[#efe4cf] text-[#8b6a43]"
          }`}
        >
          {TYPE_LABELS[type]}
        </span>
      </div>
      <h3 className="font-bold text-lg leading-7">{title}</h3>
    </button>
  );
}

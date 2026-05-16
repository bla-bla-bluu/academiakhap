type ArticleCardProps = {
  title: string;
  category: string;
  onClick: () => void;
  active?: boolean;
};

export default function ArticleCard({ title, category, onClick, active = false }: ArticleCardProps) {
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
      <p className={`text-xs uppercase tracking-[0.2em] mb-2 ${active ? "text-[#f3dfc0]" : "text-[#8b6a43]"}`}>
        {category}
      </p>
      <h3 className="font-bold text-lg leading-7">{title}</h3>
    </button>
  );
}

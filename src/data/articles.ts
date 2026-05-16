import InterCasteMarriage from "../content/articles/InterCasteMarriage";
import JatIdentity from "../content/articles/JatIdentity";
import BornSuperiorNarrative from "../content/articles/BornSuperiorNarrative";
import HistoricalTerms from "../content/articles/HistoricalTerms";

export type Article = {
  id: number;
  title: string;
  category: string;
  slug: string;
  body: string[];
  sources: string[];
};

export const articles: Article[] = [
  {
    id: 1,
    title: "Inter-Caste Marriage, Gotra & Cultural Continuity",
    category: "Social Structure",
    slug: "/research/inter-caste-marriage",
    body: InterCasteMarriage.body,
    sources: InterCasteMarriage.sources,
  },
  {
    id: 2,
    title: "Jat, Jatt, Jutt & Tribal Identity",
    category: "History & Identity",
    slug: "/research/jat-identity",
    body: JatIdentity.body,
    sources: JatIdentity.sources,
  },
  {
    id: 3,
    title: "Social Media & Born Superior Narratives",
    category: "Social Analysis",
    slug: "/research/born-superior-narrative",
    body: BornSuperiorNarrative.body,
    sources: BornSuperiorNarrative.sources,
  },
  {
    id: 4,
    title: "Language, Transliteration & Historical Terms",
    category: "Linguistics",
    slug: "/research/historical-terms",
    body: HistoricalTerms.body,
    sources: HistoricalTerms.sources,
  },
];

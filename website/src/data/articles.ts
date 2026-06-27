import Kuchesar from "../content/articles/Kuchesar";
import IndoIranianHeritage from "../content/articles/indo-iranian-heritage";
import PilaniaZamindars from "../content/articles/PilaniaZamindars";
import DelhiVillages from "../content/articles/DelhiVillages";

export type ContentType = "article" | "discussion" | "podcast" | "video";

export type Article = {
  id: number;
  title: string;
  category: string;
  slug: string;
  type: ContentType;
  mediaUrl?: string;
  body: string[];
  sources: string[];
};

export const articles: Article[] = [
  {
    id: 1,
    title: "History and Heritage of the Pilania Zamindars",
    category: "History",
    slug: "/research/pilania-zamindars",
    type: "article",
    body: PilaniaZamindars.body,
    sources: PilaniaZamindars.sources,
  },
  {
    id: 2,
    title: "The Royal Legacy of Kuchesar",
    category: "History",
    slug: "/research/kuchesar",
    type: "article",
    body: Kuchesar.body,
    sources: Kuchesar.sources,
  },
  {
    id: 3,
    title: "Population Genetics and the Indo-Iranian Heritage: A Review of Recent Studies",
    category: "Population Genetics",
    slug: "/research/indo-iranian-heritage",
    type: "article",
    body: IndoIranianHeritage.body,
    sources: IndoIranianHeritage.sources,
  },
  {
    id: 4,
    title: "Delhi's Vanishing Villages: Khap Tradition and the Urban Village Crisis",
    category: "Urban Heritage",
    slug: "/research/delhi-villages",
    type: "article",
    body: DelhiVillages.body,
    sources: DelhiVillages.sources,
  },
];

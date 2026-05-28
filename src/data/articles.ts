import Kuchesar from "../content/articles/Kuchesar";
import PilaniaZamindars from "../content/articles/PilaniaZamindars";

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
    title: "History and Heritage of the Pilania Zamindars",
    category: "History",
    slug: "/research/pilania-zamindars",
    body: PilaniaZamindars.body,
    sources: PilaniaZamindars.sources,
  },
  {
    id: 2,
    title: "The Royal Legacy of Kuchesar",
    category: "History",
    slug: "/research/kuchesar",
    body: Kuchesar.body,
    sources: Kuchesar.sources,
  },
];

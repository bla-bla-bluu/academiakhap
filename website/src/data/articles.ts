import Kuchesar from "../content/articles/Kuchesar";
import IndoIranianHeritage from "../content/articles/indo-iranian-heritage";
import PilaniaZamindars from "../content/articles/PilaniaZamindars";
import DelhiVillages from "../content/articles/DelhiVillages";
import KhapPanchayat2026 from "../content/articles/KhapPanchayat2026";
import KhapPanchayatSystem from "../content/articles/KhapPanchayatSystem";
import MandkolaMahapanchayat2026 from "../content/articles/MandkolaMahapanchayat2026";
import PhogatKhapPanchayat2026 from "../content/articles/PhogatKhapPanchayat2026";

export type ContentType = "article" | "discussion" | "podcast" | "video";

export type Article = {
  id: number;
  title: string;
  category: string;
  slug: string;
  type: ContentType;
  /** Named byline. Omit for pieces authored by the Archive itself. */
  author?: string;
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
    author: "Mr. Harsh Choudhary",
    body: PilaniaZamindars.body,
    sources: PilaniaZamindars.sources,
  },
  {
    id: 2,
    title: "The Royal Legacy of Kuchesar",
    category: "History",
    slug: "/research/kuchesar",
    type: "article",
    author: "Mr. Harsh Choudhary",
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
    author: "Puneet Singh Singhal",
    body: DelhiVillages.body,
    sources: DelhiVillages.sources,
  },
  {
    id: 5,
    title: "Reading Khap Panchayats in Full: The Ramrai Meetings of August 2026",
    category: "Society & Institutions",
    slug: "/research/khap-panchayat-2026",
    type: "article",
    author: "Mr. Deepak Dhillon",
    body: KhapPanchayat2026.body,
    sources: KhapPanchayat2026.sources,
  },
  {
    id: 6,
    title: "The Khap Panchayat: Origins, Structure, and How It Actually Works",
    category: "Society & Institutions",
    slug: "/research/khap-panchayat-system",
    type: "article",
    author: "Mr. Deepak Dhillon",
    body: KhapPanchayatSystem.body,
    sources: KhapPanchayatSystem.sources,
  },
  {
    id: 7,
    title: "Sarv Khap, Sarvajatiya, Sarvadharma: The 52 Pal Mahapanchayat at Mandkola",
    category: "Society & Institutions",
    slug: "/research/mandkola-mahapanchayat-2026",
    type: "article",
    author: "Mr. Deepak Dhillon",
    body: MandkolaMahapanchayat2026.body,
    sources: MandkolaMahapanchayat2026.sources,
  },
  {
    id: 8,
    title: "The Phogat Khap Panchayat at Charkhi Dadri, 13 September 2026",
    category: "Society & Institutions",
    slug: "/research/phogat-khap-panchayat-2026",
    type: "article",
    author: "Mr. Deepak Dhillon",
    body: PhogatKhapPanchayat2026.body,
    sources: PhogatKhapPanchayat2026.sources,
  },
];

// Newest first. `articles` stays in publication order (id ascending) because prerendering,
// SEO lookups and permalinks key off it; anything that DISPLAYS a list should use this.
export const articlesNewestFirst: Article[] = [...articles].sort((a, b) => b.id - a.id);

export const SITE_URL = "https://academiakhap.org";
export const SITE_NAME = "Academia Khap";
export const DEFAULT_DESCRIPTION =
  "Academia Khap is a knowledge archive of evidence-based articles, community discussions, podcasts, and videos on local history, tradition, and culture -- from the stone age to the present.";
export const DEFAULT_IMAGE = `${SITE_URL}/header.png`;

export const staticPages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Academia Khap | Research, History, Culture & Community Documentation",
    description: DEFAULT_DESCRIPTION,
  },
  "/about": {
    title: "About Academia Khap | Research Team & Contributors",
    description:
      "Meet the Academia Khap team working on research publications, historical documentation, policy discussion, cultural preservation, and community knowledge.",
  },
  "/work": {
    title: "Work With Academia Khap | Research & Heritage Collaboration",
    description:
      "Collaborate with Academia Khap on historical research, rural heritage documentation, social analysis, media work, legal studies, and community initiatives.",
  },
  "/research": {
    title: "Knowledge Archive | Academia Khap",
    description:
      "Explore Academia Khap's archive of articles, evidence-based discussions, podcasts, and videos on rural heritage, zamindari history, Jat history, architecture, and regional cultural documentation.",
  },
  "/contact": {
    title: "Contact Academia Khap | Research & Collaboration",
    description:
      "Contact Academia Khap for research collaborations, publications, institutional partnerships, historical documentation, media engagement, and community initiatives.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Academia Khap",
    description:
      "How Academia Khap collects, uses, and protects information through the Academia Khap app and website.",
  },
  "/terms-of-service": {
    title: "Terms of Service | Academia Khap",
    description:
      "The terms governing use of the Academia Khap app and website, including the Chaupal community tools and Archive.",
  },
};

export const SCHEMA_TYPES: Record<string, string> = {
  article: "ScholarlyArticle",
  discussion: "Article",
  podcast: "PodcastEpisode",
  video: "VideoObject",
};

export function getArticleKey(slug: string) {
  return slug.split("/").filter(Boolean).pop();
}

export function getArticleDescription(body: string[]) {
  return (
    body.find((paragraph) => !paragraph.startsWith("## ") && paragraph.length > 90) ??
    DEFAULT_DESCRIPTION
  ).slice(0, 155);
}

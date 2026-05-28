import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { articles } from "../data/articles";

const SITE_URL = "https://academiakhap.vercel.app";
const SITE_NAME = "Academia Khap";
const DEFAULT_DESCRIPTION =
  "Academia Khap is a research platform for evidence-based historical study, cultural documentation, social analysis, rural heritage, and community scholarship.";
const DEFAULT_IMAGE = `${SITE_URL}/header.png`;

const staticPages: Record<string, { title: string; description: string }> = {
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
    title: "Research Archive | Academia Khap",
    description:
      "Read Academia Khap research articles on rural heritage, zamindari history, Jat history, architecture, social systems, and regional cultural documentation.",
  },
  "/contact": {
    title: "Contact Academia Khap | Research & Collaboration",
    description:
      "Contact Academia Khap for research collaborations, publications, institutional partnerships, historical documentation, media engagement, and community initiatives.",
  },
};

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function getArticleKey(slug: string) {
  return slug.split("/").filter(Boolean).pop();
}

function getArticleDescription(body: string[]) {
  return (
    body.find((paragraph) => paragraph.length > 90) ?? DEFAULT_DESCRIPTION
  ).slice(0, 155);
}

export default function SEO() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const articleParam = params.get("article");
    const article = articleParam
      ? articles.find((item) => item.slug.endsWith(`/${articleParam}`))
      : null;

    const page = staticPages[location.pathname] ?? staticPages["/"];
    const title = article ? `${article.title} | Academia Khap Research` : page.title;
    const description = article ? getArticleDescription(article.body) : page.description;
    const canonicalPath = article
      ? `/research?article=${getArticleKey(article.slug)}`
      : location.pathname;
    const canonicalUrl = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
    const type = article ? "article" : "website";

    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", "index, follow, max-image-preview:large");
    upsertMeta("name", "author", SITE_NAME);
    upsertMeta(
      "name",
      "keywords",
      "Academia Khap, Khap research, Jat history, rural heritage, zamindari history, Bulandshahr history, cultural documentation, Indian history"
    );

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", DEFAULT_IMAGE);
    upsertMeta("property", "og:locale", "en_IN");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", DEFAULT_IMAGE);

    upsertLink("canonical", canonicalUrl);

    let structuredData = document.getElementById("structured-data");
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "structured-data";
      structuredData.setAttribute("type", "application/ld+json");
      document.head.appendChild(structuredData);
    }

    structuredData.textContent = JSON.stringify(
      article
        ? {
            "@context": "https://schema.org",
            "@type": "ScholarlyArticle",
            headline: article.title,
            description,
            author: {
              "@type": "Organization",
              name: SITE_NAME,
            },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              logo: {
                "@type": "ImageObject",
                url: `${SITE_URL}/logo_clean.png`,
              },
            },
            mainEntityOfPage: canonicalUrl,
            url: canonicalUrl,
            image: DEFAULT_IMAGE,
            about: article.category,
            citation: article.sources,
          }
        : {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/logo_clean.png`,
            description: DEFAULT_DESCRIPTION,
            sameAs: [
              "https://www.youtube.com/@academiakhap",
              "https://www.instagram.com/khap.academia",
              "https://www.linkedin.com/in/khap-academia/",
            ],
          }
    );
  }, [location.pathname, location.search]);

  return null;
}

// Runs after `vite build` (see package.json "postbuild"). Generates a real static HTML file
// per article and per static page with the correct <title>/meta/OG/JSON-LD tags baked in, so
// link-preview bots (WhatsApp, Facebook, Twitter, etc.) -- which fetch raw HTML and never run
// JavaScript -- see accurate previews instead of the generic homepage tags. Real browsers get
// the exact same file (same #root + script tags as the main index.html), so React Router mounts
// normally and the page is fully interactive; SEO.tsx's client-side logic then just confirms the
// same values are already correct.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { articles } from "../src/data/articles";
import {
  DEFAULT_IMAGE,
  SCHEMA_TYPES,
  SITE_NAME,
  SITE_URL,
  getArticleDescription,
  getArticleKey,
  staticPages,
} from "../src/lib/seo-data";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildHtml({
  title,
  description,
  canonicalUrl,
  structuredData,
}: {
  title: string;
  description: string;
  canonicalUrl: string;
  structuredData: Record<string, unknown>;
}) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  let html = template;
  html = html.replace(/<title>.*?<\/title>/, `<title>${safeTitle}</title>`);
  html = html.replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${safeDescription}" />`);
  html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta property="og:type"[^>]*\/>/, `<meta property="og:type" content="article" />`);
  html = html.replace(/<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${safeTitle}" />`);
  html = html.replace(
    /<meta property="og:description"[^>]*\/>/,
    `<meta property="og:description" content="${safeDescription}" />`
  );
  html = html.replace(/<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${safeTitle}" />`);
  html = html.replace(
    /<meta name="twitter:description"[^>]*\/>/,
    `<meta name="twitter:description" content="${safeDescription}" />`
  );
  html = html.replace(
    /<script type="application\/ld\+json" id="structured-data">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="structured-data">${JSON.stringify(structuredData)}</script>`
  );

  return html;
}

function writePage(urlPath: string, html: string) {
  const outDir = path.join(distDir, urlPath);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  console.log(`prerendered ${urlPath}/`);
}

// Static pages (skip "/" -- the root index.html already has the homepage's tags).
for (const [pagePath, page] of Object.entries(staticPages)) {
  if (pagePath === "/") continue;
  const canonicalUrl = `${SITE_URL}${pagePath}`;
  const html = buildHtml({
    title: page.title,
    description: page.description,
    canonicalUrl,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo_clean.png`,
      description: page.description,
    },
  });
  writePage(pagePath.replace(/^\//, ""), html);
}

// One static file per article, at /research/<slug>/.
for (const article of articles) {
  const key = getArticleKey(article.slug);
  if (!key) continue;

  const description = getArticleDescription(article.body);
  const canonicalUrl = `${SITE_URL}/research/${key}`;
  const title = `${article.title} | Academia Khap Archive`;

  const html = buildHtml({
    title,
    description,
    canonicalUrl,
    structuredData: {
      "@context": "https://schema.org",
      "@type": SCHEMA_TYPES[article.type] ?? "Article",
      headline: article.title,
      name: article.title,
      description,
      author: { "@type": "Organization", name: SITE_NAME },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo_clean.png` },
      },
      mainEntityOfPage: canonicalUrl,
      url: canonicalUrl,
      image: DEFAULT_IMAGE,
      thumbnailUrl: DEFAULT_IMAGE,
      embedUrl: article.mediaUrl,
      about: article.category,
      citation: article.sources,
    },
  });

  writePage(`research/${key}`, html);
}

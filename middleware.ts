import { articles } from "./website/src/data/articles";
import {
  DEFAULT_IMAGE,
  SITE_NAME,
  SITE_URL,
  getArticleDescription,
  staticPages,
} from "./website/src/lib/seo-data";

export const config = {
  matcher: ["/", "/about", "/work", "/research", "/contact", "/privacy-policy", "/terms-of-service"],
};

// Link-preview/crawler bots that fetch raw HTML without executing JavaScript -- they never see
// the meta tags SEO.tsx sets client-side, so every shared link previews as the generic homepage.
// This middleware serves them a tiny static HTML document with the correct tags for the exact
// URL requested instead, while real browsers fall through to the normal SPA untouched.
const BOT_USER_AGENT = /facebookexternalhit|WhatsApp|Twitterbot|Slackbot|TelegramBot|LinkedInBot|Discordbot|SkypeUriPreview|Pinterest|redditbot|Googlebot|bingbot|vkShare/i;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtml({
  title,
  description,
  canonicalUrl,
}: {
  title: string;
  description: string;
  canonicalUrl: string;
}) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${safeTitle}</title>
<meta name="description" content="${safeDescription}" />
<link rel="canonical" href="${canonicalUrl}" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:type" content="article" />
<meta property="og:title" content="${safeTitle}" />
<meta property="og:description" content="${safeDescription}" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:image" content="${DEFAULT_IMAGE}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${safeTitle}" />
<meta name="twitter:description" content="${safeDescription}" />
<meta name="twitter:image" content="${DEFAULT_IMAGE}" />
<meta http-equiv="refresh" content="0; url=${canonicalUrl}" />
</head>
<body>
<a href="${canonicalUrl}">${safeTitle}</a>
</body>
</html>`;
}

export default function middleware(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!BOT_USER_AGENT.test(userAgent)) {
    return; // not a link-preview bot -- let the normal SPA serve this request
  }

  const url = new URL(request.url);
  const articleParam = url.searchParams.get("article");
  const article = articleParam
    ? articles.find((item) => item.slug.endsWith(`/${articleParam}`))
    : null;

  const page = staticPages[url.pathname] ?? staticPages["/"];
  const title = article ? `${article.title} | Academia Khap Archive` : page.title;
  const description = article ? getArticleDescription(article.body) : page.description;
  const canonicalUrl = `${SITE_URL}${url.pathname === "/" ? "" : url.pathname}${
    articleParam ? `?article=${articleParam}` : ""
  }`;

  return new Response(renderHtml({ title, description, canonicalUrl }), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

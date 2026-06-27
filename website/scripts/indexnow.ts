// Pushes every known URL to the IndexNow API (api.indexnow.org), which fans out to every
// participating search engine (Bing, Yandex, Seznam, Naver, and others) -- much faster than
// waiting for each one to crawl the site on its own schedule. Safe to re-run any time, including
// after adding a new article: it just re-announces the full current URL list.
//
// Run with: npx tsx scripts/indexnow.ts
import { articles } from "../src/data/articles";
import { SITE_URL, getArticleKey, staticPages } from "../src/lib/seo-data";

const INDEXNOW_KEY = "9b190be3054e74b27d7240acc483a9f4";
const HOST = "academiakhap.org";

const urlList = [
  SITE_URL,
  ...Object.keys(staticPages).filter((p) => p !== "/").map((p) => `${SITE_URL}${p}`),
  ...articles.map((article) => `${SITE_URL}/research/${getArticleKey(article.slug)}`),
];

async function main() {
  console.log(`Submitting ${urlList.length} URLs to IndexNow:`);
  urlList.forEach((u) => console.log(`  ${u}`));

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  console.log(`\nIndexNow response: ${response.status} ${response.statusText}`);
  const text = await response.text();
  if (text) console.log(text);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

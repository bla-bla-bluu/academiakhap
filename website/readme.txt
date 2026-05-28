ACADEMIA KHAP WEBSITE PROJECT GUIDE
===================================

This folder is the clean website project that should be uploaded to GitHub.

Project folder:
/Users/dr/Desktop/khap/website

Important:
- Run all npm/build/deploy commands from this website folder.
- Do not upload the parent /Users/dr/Desktop/khap folder if it contains loose images, old builds, node_modules, or the older nested khap project.
- The parent folder is only a workspace/container now.


1) CURRENT STRUCTURE
--------------------
App routing:
- src/App.tsx

Site pages:
- src/pages/Home.tsx
- src/pages/About.tsx
- src/pages/Work.tsx
- src/pages/Research.tsx
- src/pages/Contact.tsx

Reusable UI:
- src/components/Navbar.tsx
- src/components/ArticleCard.tsx
- src/components/SEO.tsx

Research article registry:
- src/data/articles.ts

Article content files:
- src/content/articles/PilaniaZamindars.ts
- src/content/articles/Kuchesar.ts

Public/static files:
- public/header.png
- public/logo_clean.png
- public/robots.txt
- public/sitemap.xml
- public/site.webmanifest
- public/google5cd0b001d87ca66c.html

SEO/site config:
- index.html
- vercel.json

Android handoff:
- readmeapk.txt


2) INSTALL AND RUN
------------------
From /Users/dr/Desktop/khap/website:

npm install
npm run dev
npm run build

For local production preview:

npm run preview


3) DEPLOYMENT
-------------
Vercel project settings should point to this folder.

If the GitHub repository root is the website folder:
- Build command: npm run build
- Output directory: dist

If the GitHub repository root is still the parent folder:
- Root directory: website
- Build command: npm run build
- Output directory: dist

Recommended:
Upload only the website folder contents as the repository root. This keeps old images, old builds, node_modules, and unrelated files out of the repo.


4) ARTICLE FLOW
---------------
The Research page uses the existing right-panel article system.

Home page article links use:
/research?article=<article-key>

Research article registry uses canonical slugs:
/research/<article-key>

Example:
Home link:
/research?article=pilania-zamindars

Registry slug:
/research/pilania-zamindars

Research.tsx reads the article query param and opens the selected article in the reading panel. Do not create standalone article pages unless the architecture is intentionally changed.


5) ADD A NEW RESEARCH ARTICLE
-----------------------------
Step 1: Create a content file:
src/content/articles/NewArticleName.ts

Use this format:

const NewArticleName = {
  body: [
    "Introduction",
    "Paragraph text..."
  ],
  sources: [
    "Source 1",
    "Source 2"
  ],
};

export default NewArticleName;

Step 2: Register it in:
src/data/articles.ts

Add:
- import
- unique id
- title
- category
- slug: "/research/article-key"
- body: NewArticleName.body
- sources: NewArticleName.sources

Step 3: Add a featured card on Home if needed:
src/pages/Home.tsx

Use:
slug: "/research?article=article-key"


6) EXISTING ARTICLES
--------------------
Current articles:

1. History and Heritage of the Pilania Zamindars
- key: pilania-zamindars
- content: src/content/articles/PilaniaZamindars.ts

2. The Royal Legacy of Kuchesar
- key: kuchesar
- content: src/content/articles/Kuchesar.ts


7) SEO FILES
------------
Keep these files in place:

- public/robots.txt
- public/sitemap.xml
- public/site.webmanifest
- public/google5cd0b001d87ca66c.html
- src/components/SEO.tsx
- index.html

After adding new public article URLs, update:
- public/sitemap.xml


8) WHAT NOT TO UPLOAD
---------------------
Do not upload these from the parent workspace:

- node_modules
- dist
- old nested khap folder
- loose generated image files in the parent folder
- .DS_Store files
- temporary local files

The clean upload target is:
/Users/dr/Desktop/khap/website


9) QUICK CHECK
--------------
Before pushing or deploying:

cd /Users/dr/Desktop/khap/website
npm run build

If the build passes, routing/imports are generally correct.


10) TROUBLESHOOTING
-------------------
Issue: Home Read Article opens Research but no article selected.
Check:
- Home link is /research?article=<key>
- Matching entry exists in src/data/articles.ts with slug /research/<key>

Issue: Article missing from Research list.
Check:
- New entry added in src/data/articles.ts
- No TypeScript syntax errors in the content file

Issue: Google verification fails.
Check:
- public/google5cd0b001d87ca66c.html exists
- After deployment, this URL opens:
  https://academiakhap.vercel.app/google5cd0b001d87ca66c.html


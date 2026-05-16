KHAP PROJECT EDIT GUIDE (FOR GPT / DEVELOPERS)

Project root:
/Users/dr/Desktop/khap

----------------------------------------
1) CURRENT STRUCTURE (IMPORTANT)
----------------------------------------
Main app routing:
- src/App.tsx

Site pages:
- src/pages/Home.tsx
- src/pages/About.tsx
- src/pages/Work.tsx
- src/pages/Research.tsx

Reusable UI:
- src/components/Navbar.tsx
- src/components/ArticleCard.tsx

Research article registry:
- src/data/articles.ts

Actual article content (one file per article):
- src/content/articles/InterCasteMarriage.ts
- src/content/articles/JatIdentity.ts
- src/content/articles/BornSuperiorNarrative.ts
- src/content/articles/HistoricalTerms.ts

Assets:
- src/assets/logo.png
- src/assets/logo_clean.png

----------------------------------------
2) HOW ARTICLE FLOW WORKS
----------------------------------------
- Home page "Read Article" buttons go to:
  /research?article=<article-key>

- Research page reads the query param and renders article content
  in the RIGHT PANEL (no full page navigation).

- The article key is matched from article slug in src/data/articles.ts.

Example:
slug = /research/jat-identity
query = ?article=jat-identity

----------------------------------------
3) ADD A NEW NORMAL PAGE (ABOUT-LIKE PAGE)
----------------------------------------
Goal: Add a brand-new route page (example: Contact page)

Step 1: Create page file
- Create: src/pages/Contact.tsx

Step 2: Register route in App.tsx
- Open: src/App.tsx
- Add import:
  import ContactPage from "./pages/Contact";
- Add route:
  <Route path="/contact" element={<ContactPage />} />

Step 3: Add navigation links where needed
- Update links/buttons in Home/About/Work/Navbar as required.

----------------------------------------
4) ADD A NEW RESEARCH ARTICLE (RIGHT PANEL SYSTEM)
----------------------------------------
Goal: Add a new article that appears in Research left panel and opens in right panel.

Step 1: Create article content file
- Path: src/content/articles/<NewArticleName>.ts
- Export default object with:
  - body: string[]
  - sources: string[]

Template:
const NewArticleName = {
  body: [
    "Paragraph 1...",
    "Paragraph 2..."
  ],
  sources: [
    "Source 1",
    "Source 2"
  ]
};

export default NewArticleName;

Step 2: Register in data/articles.ts
- Import the new content file.
- Add new entry in articles array with:
  - id (unique number)
  - title
  - category
  - slug (must be /research/<key>)
  - body: NewArticleName.body
  - sources: NewArticleName.sources

Example slug:
/research/my-new-topic

Step 3: (Optional but recommended) Add on Home featured cards
- Open: src/pages/Home.tsx
- In posts array, add item with:
  - title
  - category
  - excerpt
  - slug: "/research?article=my-new-topic"

IMPORTANT:
- For Home links, use query style slug:
  /research?article=<key>
- In articles.ts, keep canonical slug style:
  /research/<key>

----------------------------------------
5) EDIT EXISTING ARTICLE CONTENT
----------------------------------------
- Do NOT edit big text inside Research.tsx.
- Edit only the specific file in:
  src/content/articles/*.ts

Examples:
- Edit Jat article:
  src/content/articles/JatIdentity.ts
- Edit Inter-caste article:
  src/content/articles/InterCasteMarriage.ts

----------------------------------------
6) WHAT NOT TO DO
----------------------------------------
- Do not recreate standalone pages under src/pages/articles/*.tsx.
  (That legacy system was removed.)

- Do not put long article text directly in src/pages/Research.tsx.
  Research.tsx is layout + selection logic only.

----------------------------------------
7) QUICK CHECK AFTER CHANGES
----------------------------------------
Run:
npm run build

If build passes, routing/imports are generally correct.

----------------------------------------
8) TROUBLESHOOTING
----------------------------------------
Issue: Home Read Article opens Research but no article selected.
Check:
- Home link is /research?article=<key>
- Matching entry exists in src/data/articles.ts with slug /research/<key>

Issue: Article missing from left panel.
Check:
- New entry added in src/data/articles.ts
- No TS syntax errors in content file

Issue: Clicking article from left panel does nothing.
Check:
- ArticleCard onClick wiring in src/pages/Research.tsx
- Article id exists and is unique


# Academia Khap Deployment

The clean deployable project now lives in this folder:

`/Users/dr/Desktop/khap/website`

## Vercel Settings

If this folder is uploaded as the Git repository root:

- Build command: `npm run build`
- Output directory: `dist`

If the parent folder is used as the Git repository root:

- Root directory: `website`
- Build command: `npm run build`
- Output directory: `dist`

Recommended: upload only the contents of `website/` to GitHub so unrelated files from the parent workspace are not included.

## Local Check

```bash
cd /Users/dr/Desktop/khap/website
npm install
npm run build
```

## Important Files

- `index.html`: base SEO metadata
- `src/components/SEO.tsx`: route-aware SEO metadata
- `public/robots.txt`: crawler access
- `public/sitemap.xml`: submitted URLs
- `public/google5cd0b001d87ca66c.html`: Google Search Console verification
- `vercel.json`: Vercel SPA rewrites and headers

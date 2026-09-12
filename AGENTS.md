# Site build rules

- Work only inside this repository. Identity: site-build.
- Follow /Users/sonpiaz/cos/briefs/2026-09-12-build-sonpiaz-site.md.
- Keep supplied project descriptions, introductions and article content unchanged.
- Short interface strings may be authored without approval: navigation labels, section titles, alt text, aria-labels, RSS labels, and Read more. Use English without em dashes.
- Approved 404: h1 "Page not found"; paragraph "That page does not exist, or it moved."; link "Back to the home page" pointing to /.
- This clarification was supplied directly by Son on 2026-09-12 and supersedes the brief's blanket restriction on new interface copy.
- Astro 5 static, one global CSS file, no Tailwind, UI framework or webfonts.
- Existing content and .internal reference documents were authored by cos-brand.
- Deploy only to existing Vercel project prj_CKqNvOT7mCkACvNPqcZFAp5Bovyk, scope sonpiazs-projects.
- Round3 Git workflow supersedes the earlier local-only rule: use feat/sonpiaz-site and a PR to main on the existing origin. Do not create another remote. Keep the candidate awaiting cos-brand approval before merge/promotion.
- Browser testing uses the approved browse binary with BROWSE_PORT=9412 and repository-local state.
- Display timeline and project started metadata as short English month plus year. Wave 2 overrides article detail dates to short month, day and year (Sep 12, 2026); writing lists remain Sep 2026. Retain ISO datetime attributes. Always rebuild after content edits before deploying.
- Wave 2: follow /Users/sonpiaz/cos/briefs/2026-09-12-site-seo-geo-mapping.md. Add routes only; never rename or remove an existing public URL.
- Product tiers: main products first, then side projects. Home main includes all main projects ordered by order; side includes featured side projects ordered by order, followed by All projects. Projects index groups by tier, then status, then order. Affitor status comes from current content (Live).
- Add Stack between Projects and About in navigation. Preserve all editorial content bytes supplied by cos-brand.
- Apply main-before-side tier ordering before per-tier order in all product listings, including llms.txt and llms-full.txt. Both llms files use Products and Side projects sections.
- Deployment gate: read lessons.md before deploy; vercel build --prod and exactly 33 dist HTML files before vercel deploy --prebuilt --prod. Never deploy the raw root directory. Curl every public route and compare with build. Builds . [0ms] is not a failure criterion; use artifact and route evidence. Only cos-brand may promote or roll back deployments. site-build never runs promote or rollback.

- Round3: only edit templates/CSS under src, preserve content and all live URLs. Candidate must pass all routes and seven-width checks, then wait for cos-brand approval before promotion. Use --skip-domain for candidate uploads. Share URL previews, never file:// page links.
- Reading links in prose and reading CTAs must retain foreground color and a faint underline at rest, with 3px underline offset and currentColor underline on hover. Screenshot limit is WIDTH 1400px; crop the initial viewport for review and preserve unscaled full-page originals in full/. Never shrink a full-page screenshot by its height.
- Current expected build: 33 HTML pages and 23 projects (4 Products, 19 Side projects). Visibility private displays a Private label beside status; absent/public has no label. Empty links render status/visibility and started only, without trailing separators or Updated.

- Deployment authority (2026-09-12): all deploy commands must run from /Users/sonpiaz/sonpiaz-site, never an isolated build directory. Nested build directories must not contain .vercel. Upload a candidate only when authorized, report it and stop; cos-brand is the sole promotion owner. The owner lifted the incident hold and authorized a candidate from origin/main 61cf903; promotion remains exclusively with cos-brand.
- Content ownership: cos-brand maintains the 23 project profiles and the verifiable-facts-only rule, including removal of money figures. Do not edit content files.

- Critical repository boundary (2026-09-12): NEVER push to GitHub sonpiaz/sonpiaz. That separate legacy repository is linked to the production Vercel project and a push can redeploy the old site. This workspace may push only to the verified origin sonpiaz/sonpiaz-site. Check the remote before every push.

- Agent-readable surface (2026-09-12): follow /Users/sonpiaz/cos/board/AGENT-READABLE-SURFACE.md. Markdown twins and llms content must be generated from the same Astro content collections as HTML, never hand-maintained. Keep immutable shared entity IDs, include Markdown URLs in sitemap, and run the CI completeness/freshness guard plus isolated negative tests. No infrastructure provider names in public Markdown. This task authorizes additive generator/guard/metadata changes through PR and merge after independent verification; only cos-brand promotes.

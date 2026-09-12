---
name: open-affiliate
slug: open-affiliate
one_liner: Publishes affiliate program terms as open data that agents can query.
status: Live
tier: side
started: 2026-04
order: 3
featured: true
problem: >
  Affiliate program terms live in PDFs, in help centers, and behind logins.
  A partner comparing ten programs reads ten different pages and still cannot
  tell which pays better. An AI agent asked to recommend one has nothing
  structured to read, so it guesses from a blog post.
approach: >
  One YAML file per program, in public, in git. A build step compiles those
  files into a website, a REST API, a TypeScript SDK, a CLI and an MCP server,
  so a human and an agent read the same record. Community votes feed a 0 to 100
  score, which makes the ranking arguable instead of secret.
stage: >
  Live at openaffiliate.dev. 760 programs in the registry as of 2026-09-12,
  and 32 open issues that are almost all new program submissions waiting for
  review.
vision: >
  When an agent recommends a product, someone should be able to see the terms
  behind that recommendation. An open registry is the smallest honest version
  of that: the data is public, so the bias is visible.
evidence:
  - claim: 760 programs live in the registry, checked 2026-09-12
    source: https://openaffiliate.dev
  - claim: 70 stars, 76 forks on GitHub as of 2026-09-12
    source: https://github.com/Affitor/open-affiliate
  - claim: openaffiliate-mcp at 23 downloads per week on npm, week of 2026-09-05
    source: https://www.npmjs.com/package/openaffiliate-mcp
links:
  site: https://openaffiliate.dev
  repo: https://github.com/Affitor/open-affiliate
---

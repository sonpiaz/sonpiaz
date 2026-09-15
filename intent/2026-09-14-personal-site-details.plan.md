---
status: planned
---

# Personal site details implementation plan

## Files and order

1. Add shared project ordering, logo metadata, Stack URL attribution, and a
   validated Stack content collection.
2. Add self-hosted product marks, selected Stack marks, and the optimized
   portrait.
3. Rebuild Home, Projects, About, Stack, and the global footer from shared data,
   keeping unique prose with its canonical owner.
4. Import the two cleaned articles with original dates and canonical site URLs.
5. Add a bounded GitHub contribution parser, committed fallback snapshot,
   generated SVG, and build integration.
6. Update Markdown, LLM, RSS, sitemap, JSON-LD, provenance, and guards.
7. Add focused tests and a schedule-only daily rebuild workflow.

## Risks and checks

- Product order can drift between surfaces. One comparator and output assertions
  must cover HTML, Markdown, LLM text, and JSON-LD.
- External Stack links can lose or duplicate attribution. One URL helper and
  exact query-parameter tests must cover every entry.
- Remote contribution HTML is untrusted. Status, type, timeout, size, schema,
  duplicate-date, malformed-value, and injection tests must fail closed.
- A network outage can break deploys. The build must render the committed
  last-known-good snapshot when fetching fails.
- Scheduled writes can bypass normal review. The workflow must run the complete
  suite first, use minimal permissions, accept no event text in shell, support a
  repository-variable kill switch, and only create an empty trusted commit.
- Imported prose can expose unsafe claims or private data. Repository and
  history guards, money/percentage checks, and an independent review must pass.
- Images can shift layout or hotlink. Every rendered image must be self-hosted,
  have fixed dimensions, and omit empty optional image elements.

## Proof

- `npm run verify:site`
- `actionlint`
- `npm audit`
- repository audit and public-release checklist
- isolated negative tests with a clean worktree afterward
- HTTP status and content-type checks for every generated route
- seven viewport widths in light and dark modes, keyboard focus, reduced motion,
  missing-graph fallback, and horizontal-overflow checks
- independent review of the diff and the schedule workflow

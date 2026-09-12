---
name: XRay
slug: xray
one_liner: Turns an X thread into a structured research report for a person or an agent.
status: Live
tier: side
visibility: public
started: 2026-05
order: 13
featured: false
problem: >
  The most current thinking in AI often lives in long threads on X, and reading them properly takes
  an hour. Scrapers return raw text with no structure, and a timeline client is built for scrolling,
  not for understanding.
approach: >
  Fetch the thread and its replies, cache them, and have a model turn the whole conversation into a
  structured report with sources. It ships as a command line tool and as an MCP server, so an agent
  can call it directly.
stage: >
  Shipped at v1.0.1 in May 2026, public and open source.
vision: >
  Research on social platforms becomes something an agent does with citations, instead of something
  a person does by scrolling.
evidence:
  - claim: 721 unit tests passing at v1.0.1
    source: https://github.com/sonpiaz/xray
  - claim: 10 releases shipped in a single day
links:
  repo: https://github.com/sonpiaz/xray
---

---
name: hidrix-tools
slug: hidrix-tools
one_liner: Gives a coding agent web search, social search and page fetching in one server.
status: Live
tier: side
visibility: public
started: 2026-03
order: 14
featured: false
problem: >
  Coding agents are good at reading code and weak at finding out what people are saying about a
  library, a bug, or a product on Reddit and X. Wiring separate search tools into every agent is
  repetitive and fragile.
approach: >
  One standalone MCP server with seven tools, calling each service directly rather than through a
  larger runtime, so any agent that speaks MCP gets the same search abilities.
stage: >
  Shipped and public since April 2026, and used every day by the agents that build the other
  projects on this site.
vision: >
  Search stops being a feature each agent reimplements and becomes a shared tool they all plug into.
evidence:
  - claim: 41 stars on GitHub as of 2026-09-12
    source: https://github.com/sonpiaz/hidrix-tools
  - claim: 7 tools in one MCP server
links:
  repo: https://github.com/sonpiaz/hidrix-tools
---

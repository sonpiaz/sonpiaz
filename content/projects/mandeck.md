---
name: Mandeck
slug: mandeck
one_liner: Lets one developer run many coding agents at once and hand work between them.
status: Live
tier: main
started: 2026-06
order: 2
featured: true
problem: >
  A developer running Claude Code, Codex and Cursor at once loses track of which
  window holds what. Each CLI owns its own terminal tab, its own login, and its own
  memory of the job. Nothing connects them, so the person becomes the wire between
  every pair of windows.
approach: >
  Mandeck is a native macOS terminal where each agent keeps its own CLI and
  subscription. The deck owns only the panes, and adds a local HTTP API on top.
  Through it one agent opens a pane for another, reads its screen, and waits.
  The trade is deliberate: macOS only, no token resale, nothing for anyone to meter.
stage: >
  Version 0.1.6 shipped on 2026-09-04 and is downloadable from mandeck.dev today,
  with no signup. Driving the deck from a paired iPhone over an encrypted channel
  works in that release. Voice control is built and works, but it still sits on a
  branch, not in a release. I run my own daily work inside it, which is where the bug reports
  come from.
vision: >
  Agent work is moving from one chat at a time to many jobs running unattended.
  If that holds, a terminal stops being where you type and becomes where you
  dispatch. Mandeck bets that layer belongs on your own machine and your own
  subscriptions, not a cloud.
evidence:
  - claim: Launches 25 agent CLIs (Claude Code, Codex, Cursor, Gemini, Grok, OpenClaw and 19 more) plus a plain shell
    source: https://mandeck.dev/docs
  - claim: Eight releases from v0.1.0 (2026-07-05) to v0.1.6 (2026-09-04)
    source: https://mandeck.dev/changelog
  - claim: Agent control surface is 24 HTTP routes and 23 MCP tools, counted on main at 2026-09-12
    source: https://mandeck.dev/agents
  - claim: Ran 10 agent panes across 3 tabs on my own Mac on 2026-09-12
  - claim: Free to download, no signup and no metering
links:
  site: https://mandeck.dev
  docs: https://mandeck.dev/docs
---

Mandeck started because the bottleneck stopped being the model. Once you run three or
four agent CLIs at the same time, the slow part is not any one of them thinking. It is
you noticing that one finished, reading what it did, and carrying it to the next window.

So the deck was built around one rule: an agent that hands work to another agent owns
that handoff. Spawning a pane is not the end of the job. The deck holds the spawner to
it, reminds them to check, and rings the human only if nobody does. A job turns to done
on an explicit signal and never on a guess, because a terminal that goes quiet tells you
nothing about whether the work landed.

The other decision that shaped it: no accounts, no gateway, no resale. Every pane runs
the CLI you already installed, signed in to the subscription you already pay for. That
closes the obvious business model and rules out a cloud version. It also means nothing
sits between you and your tools, and there is no meter to watch.

It is the tool my other projects get built inside, which is the only quality bar that has
held so far.

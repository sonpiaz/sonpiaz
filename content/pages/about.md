---
title: About
---

I build developer tools and AI infrastructure, and I run them myself before I ask
anyone else to.

I started in affiliate marketing, which is where I learned that the hard part of
software is rarely the software. Affitor, the platform I spent 2025 and most of
2026 on, does its job: it turns a link into a click, a click into a sale, and a
sale into a commission that gets paid. What software alone could not do was start
a two sided market from zero, and knowing that is worth more than another quarter
of hoping.

What I do now sits one layer down. Kyma API is a gateway that gives developers
one key and one endpoint for a hundred open and frontier models, and it publishes
a measured uptime number for each of them instead of a marketing one. Mandeck is
a macOS terminal for running many coding agents at once, where one agent can open
a pane for another and wait for the result. Build to Own is a four week cohort
that takes Vietnamese builders from a real problem to something people pay for.

Most of my work is open source. The repositories that get used are usually the
small ones: a command that lets an AI agent watch a video, a registry of
affiliate program terms published as plain YAML, a library of agent skills that
are just text files anyone can read and change.

I live in the Bay Area and study computer science, and the community I build for
is Vietnamese. I publish the numbers, including the ones that make the work look
worse, because a number you can check is the only part of a claim that survives
contact with someone who does not know you.

## How the work gets done

Almost everything above is now built by agents, and the interesting part is the
structure rather than the models. Four manager agents each own one project. A
manager does not write code: it reads the state of its project, writes the spec,
breaks it into tickets, and starts its own workers on them. Mandeck is the room
those workers run in.

Work is assigned by measured strength, not by preference. Claude writes the specs,
the reviews and the priorities. Codex and Cursor do the construction, because
Claude is the scarcest budget I have, and proposing costs less of it than typing.
A separate agent is measuring which model is actually good at which job. It uses
finished work rather than benchmarks, and writes the answer down so the next
manager does not have to rediscover it.

They report to each other through one shared pulse file instead of messaging.
A message costs tokens on both ends and creates an obligation to reply; a line in
a file costs the reader only when they choose to read it.

The hardest part was handing work over cleanly. Long instructions typed straight
into a terminal got cut off halfway, and an agent would sit there having never
started. Now every assignment is a file in the repo, and the instruction is one
line that points at it, so the agent reads the whole brief and says what it read
before it writes anything.

That setup merged and verified ten changes on production in a single night.

## The community

I run a Vietnamese community called [**Cơm AI lo**](https://comailo.vn), around
200,000 members. The
name is a pun that works twice: *cơm* is a meal, and *cơm để AI lo* means the AI
takes care of the meal. That is also the argument. Once making things gets cheap
enough and material needs are covered, money matters less than it used to. People
then get to spend their time on work they actually want to do. It is a common
belief in technology circles, and I have not seen it proved yet. Build to Own is
where I test it on real people with real deadlines.

## What I have shipped

- **Kyma API**. One key for the open and frontier models, with uptime you can check. Most gateways tell you a model is available; this one publishes what it measured per model and routes around the ones that are down. 3.19 billion tokens across 257,882 requests since April 2026.
- **Mandeck**. A macOS terminal for running many coding agents at once. One agent opens a pane for another, hands it work and waits for the result, so a team of agents fits on one screen instead of twenty tabs. 25 agent CLIs supported, and 24 HTTP routes so the agents can drive it themselves.
- **Affitor**. Affiliate software for SaaS brands. A brand runs a partner program without building the tracking: a link becomes a click, a click becomes a lead, a lead becomes a sale, and the commission is calculated and paid out. Live, with brands on it.
- **Build to Own**. A four week cohort for Vietnamese builders who have followed enough tutorials and shipped nothing. A fixed deadline, a brief at the end of every session, and a public demo day, so the work has to exist by a date. 140 builders in the first run.
- **affiliate-skills**. Affiliate work is a long chain of small jobs an agent could do, if somebody wrote the instructions down. 50 skills as plain text files, so any agent that can read a file can run the funnel. 659 stars, and the most used thing I have written.
- **open-affiliate**. Affiliate program terms live in PDFs and behind logins, so neither a partner nor an agent can compare them. 760 programs published as YAML in public, with an API, a CLI, an SDK and an MCP server built from the same records.
- **watch-cli**. An AI agent cannot watch a video. This turns any social video into timestamped frames and a transcript so a coding agent can read it, for roughly fifty times less than sending the whole file to a multimodal API. 250 stars.
- **Haynoi**. Dictation tools punish you for switching between Vietnamese and English mid sentence, which is how most Vietnamese developers talk. Hold a key, speak, and the words land in whatever app has focus. Shipped and free while the model bill stays small.

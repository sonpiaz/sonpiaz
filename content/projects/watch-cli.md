---
name: watch-cli
slug: watch-cli
one_liner: Gives a coding agent eyes and ears for any social video.
status: Live
tier: side
started: 2026-04
order: 2
featured: true
problem: >
  An AI agent cannot watch a video. A conference talk, a product demo, a
  twenty minute tutorial: all of it is invisible to the model reading your
  terminal. The workaround is to send the whole file to a multimodal API,
  which is slow and costs real money per minute.
approach: >
  Pull the video, cut it into timestamped frames, transcribe the audio, and
  hand the agent both. The agent sees the diagram on the slide and reads the
  sentence that explains it, so it can cite the moment ("at 04:32") instead of
  guessing. The trade is fidelity: you lose motion, you keep meaning, and the
  cost drops by roughly fifty times.
stage: >
  Shipped and maintained. v0.3.4 as of 2026-09-04, installed with one curl
  command or as a Claude Code skill. Every watch is cached locally, so a repeat
  call on the same URL returns in 0.07 seconds and costs nothing.
vision: >
  Video is the largest body of engineering knowledge that agents still cannot
  read. When watching is one line in a shell script, the default way to learn a
  new tool stops being the docs and starts being the talk somebody already gave.
evidence:
  - claim: 250 stars, 66 forks on GitHub as of 2026-09-12
    source: https://github.com/sonpiaz/watch-cli
  - claim: 479 release asset downloads across all versions
    source: https://github.com/sonpiaz/watch-cli/releases
  - claim: Handles YouTube, X, LinkedIn, TikTok, Reddit, Vimeo and local files
links:
  site: https://github.com/sonpiaz/watch-cli
  repo: https://github.com/sonpiaz/watch-cli
---

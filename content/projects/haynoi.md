---
name: Haynoi
slug: haynoi
one_liner: Types what you say on macOS, in Vietnamese and English at once.
status: Live
tier: side
started: 2026-04
order: 4
featured: true
problem: >
  Dictation tools treat Vietnamese as a second language. They punish you for
  switching mid sentence, which is exactly how a Vietnamese developer talks:
  half the nouns are English, the grammar around them is not. So the tool that
  should save typing makes you retype.
approach: >
  Hold a key, speak, release. The audio goes straight to a speech model tuned
  for code switching and the text lands in whatever app has focus, through the
  macOS accessibility layer rather than the clipboard. Two tiers, one fast and
  one accurate, because a Slack reply and a spec do not need the same model.
stage: >
  Shipped. v0.3.10 released 2026-09-01, roughly twenty releases since June.
  Free to use.
vision: >
  Speaking becomes a normal way to write software, not a novelty. The test is
  a Vietnamese engineer dictating a pull request description without once
  reaching for the keyboard to fix a word.
evidence:
  - claim: 634 dictations from 9 users in one week, measured 2026-09-06
  - claim: 18 stars on GitHub, installed by 21 people on day one
    source: https://github.com/sonpiaz/haynoi
links:
  site: https://haynoi.com
  repo: https://github.com/sonpiaz/haynoi
---

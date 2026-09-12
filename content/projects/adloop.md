---
name: adloop
slug: adloop
one_liner: Runs paid ad campaigns inside guardrails you set, and writes down every decision.
status: Building
tier: side
visibility: private
started: 2026-09
order: 12
featured: false
problem: >
  Small advertisers keep paying for campaigns that stopped working, because nobody has time to
  watch the numbers every day. Handing the account to an automated tool is scary for the same
  reason: one bad change can spend a week of budget in an afternoon.
approach: >
  An agent loop that observes, decides, then screens every proposed change against hard rules
  before it acts: a budget cap, no unknown campaign ids, no more than a few changes at once. Any
  change that breaks a rule is blocked, and every call it made is kept as a written record.
stage: >
  Private and early. Proven on a synthetic ad account in September 2026. It has not yet been run
  against a real ad account, and it will not be until the guardrails have been.
vision: >
  Automated ad management that an owner can trust because it can be audited, not because it
  promises to be smart.
evidence:
  - claim: 8 guardrail tests passing on a synthetic account
  - claim: 0 real ad accounts touched so far, by design
links: {}
---

---
name: kyma-icp-agent
slug: kyma-icp-agent
one_liner: Sorts new signups into real customers worth a person's time and everything else.
status: Building
tier: side
visibility: public
started: 2026-08
order: 8
featured: false
problem: >
  A developer platform gets thousands of signups, and a founder cannot read them all. Most
  never become customers, a few are exactly who the product is for, and eyeballing a signup
  log does not tell them apart. The cost of guessing wrong is a week spent on the wrong accounts.
approach: >
  A triage agent scores each account against an ideal customer profile, and a deterministic
  evaluation harness grades the agent without asking another model for its opinion. The harness
  was built to find mistakes in the profile itself, not only in the code.
stage: >
  Built in one night at a hackathon on 2026-08-25 and run against real production account data.
  Not yet wired into the product as a live step.
vision: >
  Customer research becomes a test suite. When the profile of an ideal customer is written down as
  something a harness can check, it can be argued with, corrected, and rerun every week.
evidence:
  - claim: 2,610 accounts triaged in the first run, 2026-08-25
  - claim: 15 of 20 cases passing on the full local evaluation, with no model used as a judge
links: {}
---

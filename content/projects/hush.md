---
name: hush
slug: hush
one_liner: Keeps passwords in a local encrypted vault, with no cloud and no browser extension.
status: Building
tier: side
visibility: private
started: 2026-09
order: 18
featured: false
problem: >
  Password managers ask you to trust a company, its cloud, and a browser extension that reads every
  page you open. For someone who would rather not, the alternative is usually a text file.
approach: >
  A small local vault with no network access at all. Secrets are sealed with modern public key
  encryption, there is an offline recovery key, and it uses only standard library cryptography so
  the whole thing can be audited in an afternoon.
stage: >
  Private and in progress, September 2026. Used to move personal credentials out of an older
  password manager.
vision: >
  Keeping secrets safe should not require trusting anyone else's server.
evidence:
  - claim: n/a, personal tool with no users outside development
links: {}
---

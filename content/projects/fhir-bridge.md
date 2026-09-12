---
name: FHIR Bridge
slug: fhir-bridge
one_liner: Helps engineers map raw health device data into the FHIR standard without inventing citations.
status: Building
tier: side
visibility: private
started: 2026-08
order: 9
featured: false
problem: >
  An engineer with health data from a device often needs it in FHIR R4, the standard hospitals and
  clinical systems exchange, without having years of FHIR expertise. Asking a chat model is the
  obvious shortcut and the dangerous one, because a model will confidently quote a rule that does
  not exist.
approach: >
  The assistant is never allowed to cite on its own. It can only name a rule key; the server then
  resolves that key to the real page and quote on hl7.org. The model cannot invent a citation,
  because it never writes one.
stage: >
  Private. Built in a two day sprint in August 2026 from a problem a collaborator brought, and
  verified against the live specification. Not launched.
vision: >
  In regulated domains, an AI assistant should be structurally unable to fabricate a source. The
  pattern here, where the model points and the server quotes, applies well beyond health data.
evidence:
  - claim: 111 specification assertions passing, re-verified live against hl7.org
  - claim: n/a, pre-launch and not used outside development yet
links: {}
---

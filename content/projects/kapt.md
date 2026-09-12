---
name: Kapt
slug: kapt
one_liner: Captures, annotates and reads text out of macOS screenshots.
status: Live
tier: side
started: 2026-04
order: 7
featured: false
problem: >
  Explaining a bug means taking a screenshot, drawing a box on it, and pulling
  out the error text so it can be pasted somewhere searchable. That is three
  tools on macOS, and the scrolling part does not exist at all.
approach: >
  One menu bar app doing the whole loop: region, fullscreen or scrolling
  capture through ScreenCaptureKit, an annotation editor, and Vision framework
  OCR so the text in the image becomes text you can paste.
stage: >
  Shipped at v1.0.0 in April 2026 and installable today. It does the job it was built for,
  so there is nothing left to add until a new need shows up.
vision: >
  None beyond its own use. This one exists because the workflow was annoying
  every day and a native app fixed it.
evidence:
  - claim: v1.0.0 shipped 2026-04-03, installable with brew install --cask sonpiaz/tap/kapt
    source: https://github.com/sonpiaz/kapt/releases/tag/v1.0.0
  - claim: Signed with a Developer ID and distributed through a Homebrew tap
links:
  repo: https://github.com/sonpiaz/kapt
---

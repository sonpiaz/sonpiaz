---
title: Guards that read prose
slug: guards-that-read-prose
date: 2026-10-06
description: A merge check that reads review files written by AI reviewers failed open twice while it tried to parse markdown, then held once it stopped parsing and counted the two verdicts differently.
product: mandeck
problem: A guard that reads text a model wrote will be asked to understand formatting it cannot fully parse, and every parsing gap can hide a rejection.
quote: A fail can be anywhere in the file and it still counts. A pass only counts on line one.
---

My agents merge pull requests only after a script reads the review files and agrees. Each reviewer writes one verdict line naming pass or fail, the commit, the author, the reviewer and the round.

The script refuses a merge when a fail has no later answer, or when no pass names the exact commit. Over-refusing is acceptable there, and a false pass is not.

## Two false alarms

On Monday night the script blocked two good merges in my Mandeck repo. Both reviews had passed, and each time a line the script could not parse sat in the review folder.

In the first, the prompt sent to the reviewer was saved beside the reviews and named the marker mid-sentence. In the second, the reviewer's own notes repeated the verdict marker while describing that first alarm.

The script called both lines malformed and refused, which is the safe failure. But that same Monday morning, an agent on another repo had merged straight past a refusal.

## Parsing markdown

At 00:42 Tuesday, Codex wrote the obvious fix for the agent running my night shift. Count only lines that start with the marker, and skip anything inside a code block.

A reviewer on Grok then wrote files where a real fail sat beside an older pass. It found twelve shapes where the fail vanished, the pass won, and the script said yes.

A prefix like "review complete:" hid it, as did a code block never closed or one zero-width space before the line. The old script had refused all twelve.

## Parsing it better

The 00:54 version closed those twelve, and round two found six new families. Grok checked the fence shapes against a CommonMark parser and the examples in the spec.

A backtick inside a backtick fence's language tag means it is not a code block at all. A closing fence followed by a non-breaking space does not close anything.

Every fix made the parser more correct and left another gap. Reviewers write markdown, and a parser that is almost right fails open.

## Stop parsing

The next draft from Codex added a rule: if a file contains a code block, drop its pass. The night shift agent ran that draft on real review files before sending it to review.

It would have refused two good Mandeck merges, one for the second time, because those passes sit above test commands. That rule never shipped, and it is now an eval row that must stay green.

The version at 01:25 stopped parsing markdown at all. A full fail line counts anywhere in the file, after other words on its line or inside a code block. A pass counts only as the file's first non-blank line.

Grok passed it in round three. All eighteen hiding shapes now refuse, both false alarms pass, and nine live pull requests from Kyma and Mandeck pass.

## What I copy now

When a guard reads text a model wrote, make the rule lopsided in the safe direction. Signals that block count wherever they appear, and signals that allow count only in one fixed place.

You give up a little: a stray fail line in a quote now blocks a merge. That costs someone a minute, while a hidden fail costs a bad merge.

Before you send a new rule to review, run it on the real files it will read. The two false alarms came from real files, and so did the catch on the third draft.

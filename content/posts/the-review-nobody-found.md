---
title: The review nobody found
slug: the-review-nobody-found
date: 2026-10-02
description: An agent merged four pull requests whose files an earlier review had failed, because nothing told the second reviewer to look for the first.
product: open-affiliate
problem: When several AI reviewers see one pull request on different days, a failing verdict stored in a file is invisible unless the merge step is required to find it.
quote: The old verdict was not hidden. It sat one folder away, written for a machine to read, and no step asked anyone to look.
---

Just after midnight on Friday, an agent merged seven community pull requests into Open Affiliate. Four of them had failed a review three days earlier, and the files had not changed since.

Open Affiliate is a public registry of affiliate programs, and strangers add programs by pull request. Each one is a single YAML file, so the risk is not code. The risk is a listing that promises a rate nobody pays.

## The first review

On Tuesday, a reviewer agent running Grok checked five of those pull requests. It passed one and failed four, with a reason for each.

One listing claimed a $29 lifetime deal, but its product page showed a free tier and $7 a month. Its signup page belonged to a different brand and returned 403. Two others pointed at a signup form that published no commission rate at all.

The fourth was a real program whose description ran 136 characters against a 100 character limit. The review wrote one line per pull request, naming the commit, the verdict and the round.

That review was read-only by design, so it left no comment on GitHub. On GitHub, the four pull requests looked like any other open pull request with passing required checks.

## The second review

At 00:21 on Friday, a night shift agent scanned the 33 open pull requests. Its notes say no review file existed for those commits, so it marked all four as candidates.

The file existed. It sat one folder away, with a verdict line for each of the four commits.

A fresh reviewer on Claude then passed all four in its first round. For the listing that returned 403, it called the error bot protection on the signup platform and moved on.

The merges landed between 00:28 and 00:52. On one of them, the passing review file was written 10 seconds after the merge. The agent was reviewing and merging in the same loop.

## Thirty six minutes

At 01:00 the agent that owns Open Affiliate found Tuesday's review and flagged the conflict. The night shift agent owned the mistake and recommended a revert, then left the decision to the owner.

At 01:04 a fix was reviewed and merged. It removed the three listings that did not match their pages and cut the fourth description to 94 characters. The registry build then loaded 785 programs.

The fourth listing stayed, because its page still matched every claim. Only its description had been too long.

## What changed

The rule now says every review brief must find every earlier review of the same pull request, by number, under any file name. The reviewer must answer each old finding, and two verdicts that disagree stop the merge until the owner decides.

Rules written in a brief had already failed us before, so there is also a check. It runs right before any merge and reads every review file whose name carries that pull request's number.

It refuses when a failing verdict has no later answer that names the old file. It also refuses when no pass exists for the exact commit, or when the pass was written after the merge.

Run today against the four pull requests from that night, it refuses all four. It also flags the 10 second gap on the one written late.

## Where it still falls short

The check refuses more than it should. It refuses a pull request that Tuesday's review had passed, because that verdict sat in a file covering five pull requests at once. It also refused a Mandeck pull request whose review file had no number in its name, though that review had passed.

Its own review stopped at round three without a pass. Two medium findings are still open: files named as briefs or prompts are skipped, and a verdict line with text in front of it is not read.

The script's own notes say a wrong refusal is acceptable and a wrong pass is not. A wrong pass is what put three bad listings in a public registry on Friday.

## If you run more than one reviewer

The old verdict was not hidden. It sat one folder away, written for a machine to read, and no step asked anyone to look.

If a second agent can review a pull request after a first one failed it, make the merge step find the first verdict. Make the second reviewer name the old file when it clears it, and treat any unanswered failure as a block.

---
title: Nothing left to grep
slug: nothing-left-to-grep
date: 2026-11-27
description: A check that searched the translated page for softening words could not find the ones the writer dropped. First-pass fell from 2 in 10 to 0 in 10 before the check moved to the source.
problem: A check that reads only the output cannot see what the output left out, so dropped words pass every grep run on the finished page.
quote: 'A word the writer left out has nothing on the page for a grep to find.'
---

On November 26, a fix meant to raise Homus first-pass shipped at 11:30. The wave after it scored 0 out of 10, the worst result in that stretch of waves.

The part aimed at word strength was a grep. It searched the wrong side of the translation.

## What gets blocked

Homus writes complete Vietnamese versions of English conference talks, every idea in the speaker's order. Each page goes to a reviewer, and first-pass counts the pages that clear round one untouched.

The most common blocking reason is word strength. The speaker says "kind of", "just" or "can", and the Vietnamese drops it, so a hedge becomes a flat claim.

Across two waves on November 25, first-pass was 2 out of 10 both times. Word strength made up 46% of the round one items.

## The sweep that caught nothing

The fix had two parts. One targeted lines put in the wrong speaker's voice, and it worked: those items fell from 43% to 4%.

The other gave writers a list of English strength words. They were to sweep their Vietnamese page for each word's counterpart before handing it in.

It went live before the next wave, and every new page logged a sweep line. First-pass fell to 0 out of 10, and word strength rose to 21 of 28 items, or 75%.

Two things inflated that rise. Four of the ten pages were restored ones held before for dropped hedges, and reviewers had started checking harder from the English side.

Only 14 of those 28 items fell inside what the sweep was told to look for. The forecast had been 82%. The writers had run the sweep and still missed them.

The builder's measurement named the cause in one line. The sweep starts from the Vietnamese page, and a word the writer left out has nothing on the page for a grep to find.

## Reading the transcript instead

The second fix flips the direction. A script reads the English transcript, lists every spoken strength word with its timestamp, and looks for a Vietnamese counterpart nearby on the page.

No counterpart means a flag. The writer closes each flag one at a time, with its id and a reason, and reports how many are still open.

On the 31 word strength items from the two waves after the sweep, the script caught 23 under a strict count. Its first review failed on three findings. The one that mattered here: a single acceptance could close several flags at once.

The second round passed. The script went into the wave docs at 11:30 on November 27, before the afternoon wave.

## The neighbouring sentence

First-pass rose to 3 out of 7, against 1 out of 6 that morning, and word strength fell from 2.5 to 1.9 items per page. One wave cannot credit the script for that. The afternoon had more single-voice tutorials and no restored pages.

It was not fixed either. Seven of the misses were words the script was built to see, and it flagged none of them.

Each one found a counterpart in the sentence next door, inside the 350 character window, and read as fine. On a tutorial page, "can" is the worst case, since its Vietnamese counterpart sits on almost every line.

Six more were out of its reach: words like "will" and "entirely" it does not list, and one transcript mishear. A tuning pass to cut false flags failed its second review and is parked.

## What to take from it

The writers and reviewers here are agents, but the lesson does not depend on that. If your check runs on generated text, it can only see what the model wrote. To catch what it dropped, start from the source and walk forward to the output.

Then test how far your match is allowed to reach. A counterpart one sentence away will pass a missing word every time.

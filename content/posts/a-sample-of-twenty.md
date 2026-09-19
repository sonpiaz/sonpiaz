---
title: A sample of twenty
slug: a-sample-of-twenty
date: 2026-09-18
description: A cleanup agent canceled 151 tickets after a sample said 31% of its list was right, and the 90% bar that has stopped two batches since.
product: mandeck
problem: An agent's bulk cleanup arrives as one confident list, and nobody can read every row before it runs.
quote: Every usable row had evidence outside the board. Every wrong row rested on one field inside it.
---

On Tuesday afternoon an agent was cleaning up my task board. It had found 258
tickets that looked dead: not started, no owner, no project, no description. It
proposed canceling all of them.

Before anything ran, every tenth ticket on that list went to a model from a
different vendor. It opened all 26 and agreed with 8 of the cancels, which is
31%.

Another 15 of the 26 were finished work, 12 of them pull requests that had
merged while the ticket sat untouched. The last 3 were alive, and one was
scheduled for that Thursday.

I asked for the list to be sorted again before anything ran.

The agent sorted it again, and then applied it. When the second sample was
graded at 17:23, 9 of its 10 tickets were already canceled. The grade was 4 out
of 10.

## What 151 cancels look like

It ran 151 cancels and 104 closes in one pass. Open tickets fell from 568 to
325, which reads like a productive afternoon.

I opened 6 of the canceled tickets. A file name was the whole title on 4 of
them, one was an index line, and one said only "PR".

None of them was old work. They were the rows that point at my documents: the
board's table of contents.

The log was no help. For 141 of the 151 cancels it held the word "ok" and
nothing else, so I could not ask why any single row had gone.

Undoing it took about two hours. When the last restore pass ran, 133 of the
151 rows were already open again, and that pass changed the other 18 in one go.

One of the 133 was never canceled. Its first write had failed.

Later that night 20 more index rows from the same day's cleanup went back too.
The board had 1111 row anchors before that restore and 1111 after.

## The bar

The rule that came out of it has three parts.

- A row whose title is a file name or an index line is never canceled.
- Any other bulk change waits for a sample graded by a reviewer that did not write the proposal, and below 90% agreement it does not run.
- The log keeps the evidence for each row, never just "ok".

It was tested the next evening. An audit of the board proposed 10 cancels, and a
second reviewer checked all 10 instead of sampling. The two agreed on 8.

That is 80%, so the batch stayed off. The 8 tickets where both checks agreed
were canceled one at a time, each write logged.

## 20 rows out of 132

The harder test came the same night, when the first agent was back with 132
more tickets to cancel.

This time it drew a sample before touching anything: 20 rows, picked with a
fixed seed so anyone could draw the same 20 again. Every row carried one reason.
It was an attachment, and its parent ticket was already closed.

A model from another vendor opened every ticket, every parent, and the files
those tickets pointed at.

It found 1 correct cancel. Another 4 rows were finished work, which should be
closed as completed and not canceled. The other 15 were wrong.

That is 5% right, or 25% if you count the finished rows as usable.

The 15 fell into three groups.

- 4 were tickets the same agent had restored the night before, now up for canceling again.
- 7 were index rows: a file name, a settings link, a run output.
- 4 had a closed parent and unfinished work inside, one of them a checklist with most boxes still empty.

None of the 132 was canceled.

## Where the right answers came from

The 5 usable rows had one thing in common: evidence outside the board. On 4 of
them, GitHub reported the linked pull request as merged. The fifth pointed at
the exact file another ticket already held.

Every wrong row rested on one field inside the board: the parent was closed.
Nobody had opened the file the row pointed to.

The first sample had said the same thing. Of its 15 finished rows, 12 were
merged pull requests, checkable from outside the board.

So a cleanup now has one branch it can take without me.

A ticket that links to a pull request is checked against GitHub, and a merged
one is closed as completed. That script first ran at 00:44 the same night and
closed 36 tickets.

Every line of its log carries the pull request link. The script left one
ticket alone, because its pull request was still open, and rows that point at
files are not touched at all.

The other fix is 33 lines, written 3 minutes after the grade came back. It reads
the files that hold earlier verdicts and hands both scripts every ticket id that
already has a ruling. Those ids stay out of the next proposal.

Not everything is repaired. A count at 23:31 that Tuesday still showed 97 index
rows canceled, waiting on a sample of their own to clear 90%. That count is 3
days old.

If you are about to let an agent clean a backlog, do not read its whole list.
Draw 20 rows at random, have a different model open every one, and set the bar
before you see the score.

Mine is 90%. In four tries, a second check agreed with 31%, 40%, 80% and 5% of
the proposed cancels. The first two came before the rule, and that batch
ran.

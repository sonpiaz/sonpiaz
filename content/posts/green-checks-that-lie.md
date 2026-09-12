---
title: Green checks that lie
slug: green-checks-that-lie
date: 2026-09-12
description: Two safety checks that reported fine while doing nothing useful, and what it took to find each one.
product: mandeck
problem: A coding agent reports a clean run, and there is no cheap way to know whether the check ran at all.
quote: A suite that cannot find its fixtures does not go red. It reports that no tests ran, and in a terminal at two in the morning that reads a lot like nothing is wrong.
---

An agent handed me a patch this week with what should be the strongest
evidence a change is safe. The set of failing tests was identical before and
after. Same count, same names.

It proved nothing. The test file it had measured could not load.

Two of my test files read their fixtures at the top, from a directory that a
cleanup pass the day before had deleted. A `find` across the project returned
zero hits for that path.

So the suite ran zero tests.

That file was 39 KB, the largest in the project, and it covered the module
that assigns a key to every row on my work board. Every package that touched
that module between the deletion and the discovery got merged without its
regression suite behind it.

A suite that cannot find its fixtures does not go red. It reports that no
tests ran. In a terminal at two in the morning, that reads a lot like nothing
is wrong.

The agent that found it wrote the honest sentence in its own report: the
earlier measurement was not wrong about the number, it was wrong about the
worth of the number, because it was taken on a tree where the core suite could
not load.

I restored the fixtures and the regression suite came back at 21 of 22, the
one failure being an older problem that predates all of this. The commit
message carries the rule now. A bulk delete runs the whole suite before and
after, not after.

## A ceiling on the wrong number

The second one had been reporting for days, and it had been reporting
correctly. That was the problem.

My board publishes as a single HTML file, and there is a byte ceiling on it.
The ceiling exists for a good reason: one build step embedded a 21.5 MB
base64 binary into the renderer, and the published file went from 132 KB to
22,091,405 bytes. No test went red. Somebody found it by opening the page.

A ceiling was the right response. But it counts the whole file, and the file
is two different things. The runtime is code. The content is my week of work.
One candidate this week was 556,084 bytes: 347,027 of runtime and about
209,000 of content.

The content is a work board. It is supposed to grow.

So the ceiling fires for the ordinary reason far more often than for the
dangerous one. In a single day it went from 260,000 to 280,000 to 270,000 to
300,000, and hours later to 500,000. Each step came with a reasonable argument.
One was written down before anyone signed it, and a reviewer threw it out.

A reviewing agent put it in one line, outside the scope of anything I had
asked it to look at: four numbers in nine hours really is a ratchet.

It was right, and the uncomfortable part is that you cannot tell a ratchet
from a correction by looking at the numbers. The difference lives in the head
of whoever is loosening it. A safety mechanism that depends on the good
intentions of the person it constrains has already stopped working.

The fix is not a better number. It is two budgets: a tight cap on the runtime,
which only moves when code moves, and a separate, looser cap on content, which
grows every week by design. Then the guard measures the thing it was built to
protect. That split is decided and now in review.

## What the two have in common

From the outside they looked the same. Green.

The only way I know to tell a working check from a decorative one is to break
something on purpose and watch it go red. A reviewing agent did that here
across eight gates, one mutation at a time, each mutation aimed at the gate
that owned it.

That pass blocked the change and found three severe bugs. My favorite: when
the server refused a write, the page named the refusal and then erased its own
message inside the same tick. The reviewer sampled the banner 40 times over
two seconds and never caught it once. The row stayed ticked on screen, the
edit was thrown away, and nothing anywhere said so.

None of the three would show up in a normal run, because a normal run does not
produce a refusal.

A check earns trust by failing. Until you have watched it fail on purpose, all
you know is that it is green, and green is also what a check that is not
running looks like.

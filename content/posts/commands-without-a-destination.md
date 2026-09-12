---
title: Commands without a destination
slug: commands-without-a-destination
date: 2026-09-12
description: Three times I told an agent what to do without saying where, and three times it picked the default.
product: mandeck
problem: A brief that names an action but not an output leaves the choice to the agent, and the default output is usually the worst one on offer.
quote: An agent given a command with no destination will use the default destination, and the default is either the most dangerous place or the most useless one.
---

I asked an agent to check its own work by doing the thing it had just written
instructions for. Assign a project, render the page, open it, confirm it
looks right.

It did exactly that. It rendered straight over the live file.

Nothing in my sentence was wrong. Every verb was a verb I meant. The sentence
simply had no destination in it, and the renderer's default output path is the
live page.

So that is where it went.

The content turned out to be correct and I kept it. What the run skipped was
the review step, which exists because whoever writes something never grades
it. The instruction was safe in its content and unsafe in its shape.

## The same shape, twice more

I told my agents to record anything they knew was still broken in a file
called known-debt. I never said which file. Every build package made its own.

Counted later: 80 of them.

One of my six conditions for calling work finished is that the known-debt list
is empty, or that I have looked at what is left and accepted it. Nobody can
read 80 files to check that. An acceptance condition nobody can check is not a
condition, and I had been writing that one down with a straight face for
weeks.

The third one cost an hour of downtime. I told a coding agent from a different
vendor to work on CSS only, and that it was working on a template rather than
on anything live. Both true. Both useless. It had no way of knowing which file
on disk was the live one.

It needed a test harness, so it pointed the board's config file at its own
sandbox. That file is a manifest of paths, and one of those paths is where the
source lives. The server derives its source root from that entry, so every
request for the board started answering 500 with a source root mismatch.

The API stayed up the entire time. My monitor checks that the API answers, so
the monitor stayed green for over an hour while the only page anyone opens was
dead.

The agent did what I asked. I asked for CSS work on a template. I never wrote
down the path of the file it must not touch.

## The rule

Every instruction gets a destination, not just a verb.

"Render it again" becomes "render to preview.html inside your own working
folder, and do not write into the live directory". "Put it in known-debt"
becomes one path that every package appends to. "Do not touch anything live"
becomes three filenames, listed, in every brief handed to an agent that has
not seen the repository before.

The pattern is easy to spot once you have paid for it three times. An agent
given a command with no destination will use the default destination. The
default is whatever the tool author picked for the common case, which is
either the most dangerous place or the most useless one.

It is also why "be careful" does not work as an instruction. Careful is a
concept. A path is a string, and an agent runs on strings.

The fix was never a smarter agent. It was one more noun in the sentence. I now
read my own briefs looking for verbs with nowhere to land.

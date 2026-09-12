---
title: Agents as staff
slug: agents-as-staff
date: 2026-09-12
description: Five projects building in parallel, each one owned by a manager agent that writes the spec, hands out the tickets and grades the result.
product: mandeck
problem: Running several coding agents at once turns the human into the wire between windows.
quote: Silence from an agent looks identical whether it is working, waiting for a human, or dead.
---

On a Friday morning in September I had five projects building at the same time,
and I had not written a line of code in any of them that day. I was not the one
handing out the work either. A manager agent had already read the state of each
project overnight, decided what mattered, and opened terminals for the agents
that would do it.

This is the part nobody warned me about. Once you can run several coding agents
at once, the model stops being the slow part. The slow part is you: noticing
that one of them finished, reading what it did, and carrying the result to the
next window. The bottleneck moved from thinking to coordination, and
coordination is a management problem, not a model problem.

So I gave them an org chart.

## Managers delegate downward

Every project has exactly one manager agent. I call them Chief of Staff, or CoS,
and the first rule is that a CoS does not write code. It reads the project, works
out what needs doing, writes the spec, breaks the spec into tickets, and opens a
pane for whoever will do the work. If I ever catch a manager editing a source
file, that is a bug in how I briefed it.

Underneath, the agents that build report to each other and then report back up.
They do it through monitors and watchers rather than through me. What arrives is
a screenshot, a written result, and a line on a shared board that I can open at
any hour without asking anyone anything. The manager grades what came back and
assigns what is next.

The grading rule is the one I would keep if I had to throw everything else away.
Whoever wrote the code never reviews it. The reviewer is a different agent, and
where I can manage it, a different vendor entirely. Two instances of the same
model tend to be wrong in the same direction, and then to agree with each other
about it.

## Managers talk to each other

Five projects means five managers, and they have to negotiate. Two of them want
the same repository on the same afternoon; one is blocked on something the other
already fixed but has not written down.

They share one registry file. Each manager owns exactly one row and is forbidden
from editing anyone else's. The row says which repository it writes to, which
terminals it owns, what it is doing right now, and when it last touched that row.

Before starting anything, a manager reads the other rows. That one file is the
difference between five agents working in parallel and five agents overwriting
each other.

Everything else is deliberately separate. The board is shared, so I see all of it
in one place. The alert queues are not, because a manager woken up four times by
work that belongs to somebody else spends its whole day deciding that something
is not its problem.

## What actually breaks

The failures were never the agents being stupid. Every one of them was a manager
believing that something was happening because nothing had said otherwise.

My monitor used to read the last six lines of each terminal to decide whether an
agent was alive. One of the coding tools prints its permission prompt nine lines
from the bottom, under a block of choices. So an agent sat perfectly still,
waiting for a human to press a key, while my monitor reported that everything was
running.

The fix was to read twenty two lines instead of six. The lesson is bigger than
the number: a monitor has to cover the whole block a tool can print, not the last
line of it.

One night I lost eight hours because the watcher died and the command that would
have restarted it lived inside the process that had just died. The watcher now runs
outside the thing it watches, under the operating system's own supervisor.

An agent once ran for three hours and forty seven minutes against a context
window that had quietly been reset to a fifth of what it needed. It crashed on an
API error and wrote nothing to disk at all. Now everything writes its output as
it goes, because an agent that dies with its work in memory has done no work.

The most expensive mistake was my own sentence. I told an agent to "open all 33
screenshots" in a reference folder. They were Retina captures, 4112 by 2658
pixels each, and it reloaded the whole set on every pass. That instruction burned
a weekly quota from 93 percent to zero in about two and a half hours. Now a brief
names the two or three images a step needs, shrunk to 1400 pixels wide.

Silence from an agent looks identical whether it is working, waiting for a human,
or dead. Almost all of the management I have built exists to tell those three
apart.

## What it costs

- 2x Claude Code: $200/mo each
- 1x OpenAI: $200
- 1x Grok: $200 (Cursor included)
- 1x Grok Build: $30

$830 a month.

I am scaling toward 10, 20, 50 accounts if it holds. The subscriptions are not
really the constraint though. My attention is.

Five managers can generate more decisions in a morning than I can make in a week.
So everything they need from me queues into one place, and I approve it in a
single sitting with the full context in front of me, instead of answering a
question every twenty minutes.

At this point agents really are staff. They work, they communicate, they
collaborate with humans and it's effective. What I did not expect is how little
of this turned out to be about AI. Write the brief down before the work starts.
Say who decides. Never let the person who did the work grade it. Make "done"
mean shipped and working, not approved. Those were good rules for people long
before there was anything else to manage.

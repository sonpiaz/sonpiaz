---
title: About
---

I build developer tools and AI infrastructure, and I run them myself before I ask
anyone else to.

I started in affiliate marketing, which is where I learned that the hard part of
software is rarely the software. What software alone could not do was start a
two sided market from zero, and knowing that is worth more than another quarter
of hoping. That work became [Affitor](/projects/affitor).

My current products are [Kyma API](/projects/kyma),
[Affitor](/projects/affitor), [Mandeck](/projects/mandeck), and
[Build to Own](/projects/build-to-own). Their project pages hold the current
facts and evidence. [Stack](/stack) shows how the tools and products fit
together.

Most of my work is open source. The repositories that get used are usually the
small ones: a command that lets an AI agent watch a video, a registry of
affiliate program terms published as plain YAML, a library of agent skills that
are just text files anyone can read and change.

I live in the Bay Area and study computer science, and the community I build for
is Vietnamese. I publish the numbers, including the ones that make the work look
worse, because a number you can check is the only part of a claim that survives
contact with someone who does not know you.

## How the work gets done

Almost everything above is now built by agents, and the interesting part is the
structure rather than the models. Four manager agents each own one project. A
manager does not write code: it reads the state of its project, writes the spec,
breaks it into tickets, and starts its own workers on them. Mandeck is the room
those workers run in.

Work is assigned by measured strength, not by preference. Claude writes the specs,
the reviews and the priorities. Codex and Cursor do the construction, because
Claude is the scarcest budget I have, and proposing costs less of it than typing.
A separate agent is measuring which model is actually good at which job. It uses
finished work rather than benchmarks, and writes the answer down so the next
manager does not have to rediscover it.

They report to each other through one shared pulse file instead of messaging.
A message costs tokens on both ends and creates an obligation to reply; a line in
a file costs the reader only when they choose to read it.

The hardest part was handing work over cleanly. Long instructions typed straight
into a terminal got cut off halfway, and an agent would sit there having never
started. Now every assignment is a file in the repo, and the instruction is one
line that points at it, so the agent reads the whole brief and says what it read
before it writes anything.

That setup merged and verified ten changes on production in a single night.

## The community

I run a Vietnamese community called [**Cơm AI lo**](https://comailo.vn), around
200,000 members. The
name is a pun that works twice: *cơm* is a meal, and *cơm để AI lo* means the AI
takes care of the meal. That is also the argument. Once making things gets cheap
enough and material needs are covered, money matters less than it used to. People
then get to spend their time on work they actually want to do. It is a common
belief in technology circles, and I have not seen it proved yet. Build to Own is
where I test it on real people with real deadlines.

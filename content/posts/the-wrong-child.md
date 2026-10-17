---
title: The wrong child
slug: the-wrong-child
date: 2026-10-16
description: Closing one terminal pane froze my app for about 15 hours. The guard I added a month earlier was watching a process that never belonged to the pane.
product: mandeck
problem: An app that hosts many terminals can hang on close when it guesses which process belongs to which pane.
quote: The guard was right about the process it watched. It was watching the wrong one.
---

On Tuesday at 11:08 pm, one command froze Mandeck on my Mac mini. An agent closed a busy pane, and the app stayed frozen until a restart at about 3 pm the next day.

Mandeck is the terminal I use to run many agents side by side. In our September tests, closing a pane took about 50 ms.

## A guard from September

This was not the first freeze. On September 11, closing one pane froze the app twice, for 21 minutes and then about two hours.

The fix merged the next day. The app sends the pane's process a hangup, then frees the pane only once the kernel says that process is gone.

I lifted the ban on closing panes on September 15. For four weeks, close worked.

## Gone on the first check

The October sample caught the main thread waiting on the terminal library in 1,830 of 1,830 stacks. That library loops until the pane's login process exits, with no deadline.

So the guard had freed the pane while its login was still alive. The disassembly showed the free right after the guard's very first check.

The guard said the process was gone. It was right, because the process it watched was never the pane's login.

## Adoption by timing

The app has no marker that ties a process to a pane. A root login hides its environment, so the pane adopts the oldest new child after a snapshot.

But the app also starts its own short helpers while panes open, like git and a usage check. Any of them can be the oldest new child.

The builder measured it with a stream of short helpers during six spawns. In 5 of 6 runs, a pane adopted a helper.

The helper exits in a moment, the guard sees "gone", and the pane is freed. The library then waits for the real login with no end.

This mistake had happened once before. The September fix first matched "started recently", claimed another pane's shell, and froze the app the same way.

## Ask what it is

The new rule asks what the process is, not when it appeared. A pane's login leads its own session on a terminal, and a helper does not.

Close now signals every process under the pane by pid, deepest first. Two seconds later, anything still in that session gets a kill.

That second part fixes a quieter bug found on the way. A job that ignored the hangup used to keep its shell running after close.

## Half the filter in a comment

The first review failed. The compiled check only tested for a terminal, and the session test sat in a comment on the same line.

The reviewer showed why that matters. A helper forked by a session leader shares its terminal, so it passes the half that compiled.

The second round fixed it and passed. The reviewer ran a job that kept forking background processes, and all five were gone about 2 seconds after close.

## What I would copy

If your app hosts child processes, never decide ownership by timing. Check something only the real child has, like leading its own session.

Test the guard against the wrong process, not only a slow one. The September tests stopped the pane's real login on purpose. The October freeze needed a short helper to start while a pane opened.

One link is still not reproduced. No test made a real agent's login refuse to exit, so that last step of the 15 hours is inferred.

The fix merged on Wednesday and reached the Mac mini today. Closing panes there is still banned, and the builder wants one throwaway shell pane closed first.

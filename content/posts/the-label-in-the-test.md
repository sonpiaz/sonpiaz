---
title: The label in the test
slug: the-label-in-the-test
date: 2026-09-25
description: A check for frozen agent panes passed its tests and a review, then did nothing live, because the test typed a label the real tool never printed for those panes.
product: mandeck
problem: A health check for AI agents can be green in tests and blind in production when its test data is typed instead of copied.
quote: The timestamps were real, but the one word that decided whether the check ran was typed.
---

On Tuesday night two of my coding agents stopped working, and my monitor never flagged them. Both ran Grok 4.7 inside Mandeck, the terminal I use to run many agents side by side.

One ran its last shell command at 20:23 and the other at 20:39, then nothing. Their screens froze on a frame that looked like thinking, so a screen check saw nothing wrong.

The fix was a heartbeat, since every shell command an agent runs already lands in one log. A Grok pane with no command for 30 minutes should turn purple, my color for "silent, go look."

## Green twice

A second Grok agent wrote it with four tests, and the tests read the real log. They scanned all 54,628 lines and found both frozen panes at their real last-command times.

A reviewer on Claude reran the tests and checked each timestamp against the log itself. It passed with two minor notes, and the check went live later that night.

It did nothing.

The code only fired when Mandeck reported a pane's agent as "grok," and my panes never report that. Mandeck lists a Grok pane as "shell," because I start Grok by typing into a plain shell. The tests never asked Mandeck for that label; the author simply typed "grok" into the call.

The timestamps were real, but the one word that decided whether the check ran was typed.

## Wider, then wrong

The second round accepted both labels, and its new test proved the old gap existed. It failed 2 of 3 cases on the old code and passed all 3 on the new.

This time the reviewer did not stop at the tests, which had all come back green. It ran the packaged check on three live panes where Grok sat idle at its own prompt.

Mandeck called all three idle. The new check called all three frozen.

The cause was an older line in the same tool, written earlier with only Claude panes in mind. It calls a pane idle only when a Claude footer shows context use, and Grok never shows one.

So every quiet Grok pane fell through to "unknown," and round one turned "unknown" into "frozen." Installed as it was, it would have flagged every Grok agent waiting for its next job.

## Silence after a handoff

The third round asked a narrower question before it was willing to call any pane frozen. It must be silent 30 minutes, with work handed to it after its last command.

Idle with nothing to do is not frozen.

The reviewer rechecked two of the three panes round two had flagged, and both now read idle. Across four live panes that night, the new version raised zero false frozen alarms.

The first frozen pane from Tuesday still came out frozen, exactly as it should have. So did the builder's own pane, silent since 22:55 while a task sent at 01:26 waited.

That version went live on Wednesday morning after a macOS restart on the machine. The test had failed on data that changed in the restart, and my install ran anyway. The rule since is to stop on red, a smaller copy of this same lesson.

## What I copy now

A test value for a condition now comes from the real tool's output, never from memory. The command that produced it sits next to it, so anyone can run it again. Whoever installs the check runs it on live instances first, using the command a person would type.

"Tested on real data" was only half true here, and that half fooled two careful agents. The log was real, but the label came from memory, and review checked only the real half.

If you write a health check for agents, paste one live status line into your fixture. Then run the check on every instance you have and compare it with a second source.

## Tonight

I ran the installed check tonight on the three Grok panes still open on my machine. All three read idle, since none had been handed work after its last command.

All three are also sitting on a "Help improve Grok" consent prompt, waiting for a click. The heartbeat can tell silent from busy, but not waiting for work from waiting for me.

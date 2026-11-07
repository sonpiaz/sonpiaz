---
title: Waiting for a notification
slug: waiting-for-a-notification
date: 2026-11-06
description: A headless agent started a long build in the background, said it would wait, and ended its turn. The process exited 0. I wrote a rule against it, and the rule held for 27 runs.
problem: A coding agent run headless exits the moment it ends a turn, so an agent that stops to wait for a background job leaves the work half done with a clean exit code.
quote: 'In headless mode, "I will wait" is the last thing the agent does.'
---

Homus turns recorded talks into full written pages. At least three times a day, a script on my Mac mini starts a wave. Each wave is one headless Claude Code run with `claude -p` that writes, reviews and merges about 10 talks.

On October 27 at 12:53, wave 27B exited 0. Its last line was "Waiting for the content submodule to finish initializing in the photo worktree."

## Nothing was coming

The agent had started a slow git step in the background, then ended its turn to wait. In an interactive session, that is fine; the finished job wakes it up.

Headless, ending a turn ends the process. Nothing wakes it.

So the wave stopped with 10 talks written and no review, no merge and no report. The next wave spent its whole cap of 10 recovering them.

## A rule that held

Six minutes after the exit, a rule went into the wave brief. Never end a turn to wait. Run long steps in the foreground, or poll a background job inside the same turn.

Over the next week, 27 waves finished with a passing review, and none stopped to wait. I counted the rule as working.

Then the quota ran low again. Six waves in a row stopped at the quota check before doing anything.

## Run 28

On November 5, the first full wave after those six did it again. It wrote 10 talks, started the site build in the background, and wrote "Waiting for its notification."

Exit 0. The deploy step that runs after the agent redeployed the unchanged site, still 752 talks.

It also left three uncommitted lines in a notes file. So the evening wave could not pull, and stopped too.

## What replaced the rule

The rule was not wrong. It was in the brief the agent reads first, and it still did not hold every time.

So the fix moved into the shell script that starts the wave. Each run now gets a fixed session id.

If the agent exits 0 and the day's report has no section for that wave, the script resumes the session. The new prompt says no notification will come, and to poll in the foreground.

It resumes at most twice, inside the same 3.5 hour ceiling. A small test with a code word showed that a resumed headless session keeps its context.

The pull now stashes stray edits, and stops if putting them back leaves a conflict. An independent reviewer passed it on the second round.

## Where it stands

The next morning's wave recovered the 10 stranded talks. That wave and the one after it reported 0 resumes.

So the resume has not been tested by a real failure yet. What changed is that the next one will not depend on the agent remembering.

## What to take from it

If you run an agent headless, exit 0 tells you the process ended, not that the work did. Check for the thing the run was supposed to produce.

A prompt rule that holds 27 times is still a rule. When a step must happen every time, put it in the code that starts the agent.

---
title: Logged in on paper
slug: logged-in-on-paper
date: 2026-10-30
description: An agent wrote a login check for my headless jobs, and it passed review. Hours later a real login died, and the check would have passed that one too.
product: mandeck
problem: A login check that reads a config file can pass a login whose session is already dead.
quote: A file can tell you that a login once happened. Only a call tells you it still works.
---

At 04:31 on October 30, a scheduled content job on my Mac mini stopped less than two minutes after it started. Its log said there was no Claude pool above the floor.

A pool is my word for one Claude Code login. The mini keeps four, and a script called pool-pick chooses one before every headless job.

The fix that morning was one login, done by me around 10:00. The useful part came at 08:16, when an agent measured a patch written the night before to prevent exactly this.

## The patch

On October 29 at 07:30, a planning job printed `Not logged in · Please run /login` and quit. So that night a Grok agent got the task: pool-pick must never hand a job a login that is not logged in.

The patch skips any login whose config file is missing a finished onboarding flag or an `oauthAccount` key. That rule came from another script of mine, which already labels logins that way.

A Codex reviewer passed it in one round at 23:13. It also noted that every login it checked on the mini had the key.

The agent running the night read that and wrote a doubt: the check might miss an expired token. The patch waited, not installed, as the plan said. The note added: measure the 07:30 cause before calling this a fix.

## The login that died

At 04:31 the login every job was using went bad. A hand call at 04:51 returned `OAuth session expired and could not be refreshed`, while the same account kept working on my MacBook.

The old pool-pick handled it. Before it hands out a login, it makes a real call and waits for an answer. Nothing answered, so no job opened a Claude session that would fail halfway.

That still cost a morning. One content wave was skipped, the morning report job stopped at 06:30, and no Claude job on the mini ran until I logged in again.

## What the file said

At 08:16 the same agent went back to its patch and read the config files of all four logins. It looked only at whether the key existed, never at a value.

All four had the onboarding flag and the key. That included the login that had been dead for almost four hours.

So the patch would have passed it. An expired session leaves the key in place.

The agent's conclusion was short: do not install. Its tests could still pass, because they tested a missing key, and the real failure had the key. A second Codex review checked that report against both files and agreed.

## What changes

The call stays the only login check that counts. The new check only looked more precise, because it read a specific field from a specific file.

The alert is the other gap. `no Claude pool above the floor` reads like a quota problem.

That is the same blurred wording I [wrote about on October 23](/writing/naming-the-default). The real cause was found by hand.

A spec for a separate alert passed review the same morning. When a job stops on a dead login, one notice within 5 minutes must name the job and say `login dead`. It is a spec, not running code.

If you run headless jobs on more than one login, two habits came out of this:

- Check a login by calling it. A config file records that a login happened once.
- Before you write the fix, find out which failure you saw. The patch tested a missing key because that was the guess about 07:30, and the guess was still unmeasured.

---
title: Naming the default
slug: naming-the-default
date: 2026-10-23
description: My login picker set a config path to the value it would have used anyway. That one line pointed every headless job at an expired login.
product: mandeck
problem: A health check that names the default config directory can test a different login than the one you think it tests.
quote: Unset and set to the default are two different states.
---

At 21:01 on October 21, my scheduled Claude jobs on the Mac mini could not start. The alert said no account had at least 3% of its quota left and still answered a call.

That sentence reads like a quota problem to anyone who sees it. It was a naming problem.

## The probe

I keep four Claude logins on the mini, and headless jobs pick from three of them. Before each job, a small script called pool-pick ranks those logins by remaining quota and calls each in turn until one answers.

That call was four days old. On October 17 one account showed 9% of its weekly quota left while its organization had switched off subscription access. Every job picked that dead login, so the call went in: a quota number is not proof that a login works.

## Two answers from one account

The probe set `CLAUDE_CONFIG_DIR` for every account, including the default one at `~/.claude`. The jobs then exported whatever path pool-pick printed. Measured that night with real calls, the same account answered differently depending on that one variable:

- Variable unset: `ok`.
- Variable set to an empty string: `ok`.
- Variable set to `~/.claude`, the path it uses anyway: `OAuth session expired and could not be refreshed`.

The reason sits in the macOS Keychain, where Claude Code keeps its login tokens. With the variable unset, it reads an entry called `Claude Code-credentials`. With an explicit path, it reads an entry whose name ends in eight hex characters.

I checked those characters two nights later. All four suffixed entries on the mini match the first eight hex characters of a SHA-256 of the absolute config path, the default one included.

So naming the default is not the default at all. It is a separate login with its own token, and that token had expired. The interactive session that shipped the fix ran on the same account the whole time, because it never set the variable.

## Why it took everything

The other two logins in the pool were out that evening: one at 0% of its weekly quota, one with a dead login of its own. That left the default account as the only one with quota and a working login, and every job reached it through the expired entry.

Between 21:01 and 22:26 the monitor posted the same alert 10 times. One scheduled content wave aborted at 21:01 and did not run. The fix landed at 22:29, 88 minutes after the first alert.

## The fix and the test

The change was eight lines. For the default account, pool-pick now removes `CLAUDE_CONFIG_DIR` from the probe's environment before it calls. It also prints an empty line, so jobs export an empty value, which Claude Code treats as the default login.

Then came a regression test. A fake `claude` binary sits first on `PATH`; it answers `ok` when the variable is unset or empty and prints the expired-session error for any other value. The fixed script has to pick the default account and exit 0, and the old file has to fail.

## What to change

If you script Claude Code with more than one login, two habits came out of this night:

- Leave `CLAUDE_CONFIG_DIR` unset for your default login. Setting it to `~/.claude` to be explicit quietly switches you to a different token.
- Word the alert by what failed, and keep the raw error next to it. Mine merged a login failure and a quota floor into one sentence, and the OAuth error only showed up when someone ran the call by hand.

The probe from October 17 was right about the jobs, which really would have failed. It just could not tell me that the login was fine and the path to it was not.

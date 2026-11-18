---
title: One shallow fetch
slug: one-shallow-fetch
date: 2026-11-17
description: A docs check built for CI fetched its base with depth one. Run on a full local clone, it quietly made the whole clone shallow, three times in eight days.
product: kyma
problem: A git command that is harmless on a shallow CI checkout can rewrite the state of a full local clone, and every worktree that shares its .git inherits the damage.
quote: 'A shallow clone does not say it is missing data. It says there is no common ancestor.'
---

On September 20, a merge in the Kyma repo failed with `refusing to merge unrelated histories`. We then ran `git merge-base` across all 55 open pull requests.

Forty-five of them had no common ancestor with `main`. The report that followed said the history had been rewritten, and those PRs could never merge.

All of it was wrong, because the clone we measured was shallow.

## What a shallow clone says

That clone held 64 commits. GitHub's `main` had 1,836. After `git fetch --unshallow`, 54 of the 55 PRs had a merge base.

GitHub had said `mergeable_state: clean` for that first PR the whole time. The local tool was the one that was blind.

The trap is the wording. A shallow clone does not say "I am missing data". It says "there is no common ancestor", which is a structural claim worth an alarm.

We wrote the rule down that day. Before you conclude anything about history, run `git rev-parse --is-shallow-repository`, and unshallow first if it prints `true`.

## The same night

At 23:05 that night, an unrelated PR merged. It added a docs link check that skips any PR whose only docs change is the changelog.

To see what changed, the check fetched the base commit: `git fetch -q --depth=1 origin $DOCS_LINKS_BASE`. On GitHub CI the checkout is shallow already, so that flag changes nothing.

On a full clone it does. A depth-one fetch writes the commit into `.git/shallow`, and the whole clone is shallow from then on.

## Seven weeks later

Our build machine keeps one full clone of the repo. Agents work in git worktrees under a separate folder, and every worktree shares that clone's `.git`.

Before pushing, an agent runs the CI checks locally. The local runner set `DOCS_LINKS_BASE` from the base SHA, the same way CI does.

So the clone went shallow on November 6, and twice on November 14. Each time, `merge-base` and `cherry-pick` failed, and the agent ran `--unshallow` to keep going.

## Searching everywhere but the repo

The third time, the agent asked for help. It had searched for `--depth` in our scripts, hooks and scheduled jobs, and in the log of agent shell commands.

Nothing matched. The flag was not in any command an agent typed; it sat inside a TypeScript file the runner called.

The cause came from timing, not text. `.git/shallow` was written at 21:55 and held exactly the tip of `origin/main`.

On November 14, both breaks came minutes after a local check run. The last of those runs started at 21:54, from a worktree, with that SHA as its base.

## The fix

The local runner no longer sets `DOCS_LINKS_BASE`. The check then tests every link, which is slower and safe. Measured on November 15 and again tonight, the clone is still full.

The repo fix asks git first. It passes `--depth=1` only when `--is-shallow-repository` already prints `true`, so CI behaves as before. That PR has passed review and is still open.

Its test runs real git in throwaway repos. On `main` the test fails to load. On the branch it passes 10 of 10, including one that reproduces the bug.

## What to take from it

The September rule was about reading history. It never asked who could change the clone, and a check written for CI could.

A command that is a no-op on CI can still change state on your laptop. Before you run CI checks locally, grep them for `--depth`, `fetch` and `config`.

If worktrees share one `.git`, one command in any of them changes all of them. After a local CI run, check that `git rev-parse --is-shallow-repository` still prints `false`.

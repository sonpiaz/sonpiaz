---
title: Thinking as the answer
slug: thinking-as-the-answer
date: 2026-10-27
description: My API had a safety net for thinking models that ran out of tokens. It handed callers the model's reasoning as if it were the reply.
product: kyma
problem: A gateway that fills an empty answer with the model's reasoning turns an honest cutoff into a wrong reply.
quote: An empty answer was the signal. Filling it hid the signal.
---

On October 12 an agent probed every chat model on my API with the same question. It asked 70 models to name three rivers in one short sentence, twice each, with a 256 token budget.

Eight of them returned their own thinking as the answer on at least one call. One was the model behind my `best` alias, which is also the default for my MCP server.

## What the caller saw

That model replied with "Here's a thinking process: 1. **Analyze…**" on both calls. The other seven did the same. Their replies opened with lines like "Okay, the user wants" or "Got it, let's see".

The cause was the budget. On those calls the model spent it thinking and came back with an empty answer, the reasoning in a separate field or an unclosed think tag.

My code took that reasoning and put it where the answer goes.

## The safety net

The line came from a change on July 31. Its comment explains the idea. When an always-thinking model burns its budget, the client renders a blank turn that "looks like the session stalled."

The comment ends with "Showing the reasoning beats showing nothing." It named one family of always-thinking models, but both backends ran it on every non-streaming response. Streaming never had the fallback, so it was already clean.

For a person watching a chat window, that trade sounds fair. An agent that reads the answer field gets the deliberation as its reply instead.

## The fix

The fix removes the fallback and changes nothing else. The answer stays empty and `finish_reason` stays `length`. Callers who ask for the reasoning still get it in its own field.

The reasoning tokens are still billed, as before. An empty answer at 256 tokens is the correct shape now, not a new bug.

The regression test stubs the model and covers three response shapes on both backends. Against the old code it failed 8 of 71 checks; with the fix it passes all 71.

The pull request opened the night of the probe and merged on October 27, after four review rounds and my approval. It went live the same afternoon.

## What to change

Two habits came out of this for anyone normalizing thinking models:

- Don't fill an empty answer with reasoning. Return it empty with `length`, and let the caller retry with a bigger budget.
- Probe every model with a small token budget. My first pass took 140 calls; a second pass at 2048 tokens showed which models were only short of budget.

The empty reply was never the failure. It told the caller what had happened, and my safety net was the only part that lied.

---
title: Counted as zero
slug: counted-as-zero
date: 2026-10-20
description: My API reserved less than a cent for a request that could bill $2.70. The first two fixes sized media by bytes, and bytes turned out to be the wrong unit.
product: kyma
problem: A prepaid API that estimates a request's cost before calling the model can admit requests it cannot charge for.
quote: A shape the estimator does not know should cost the most, not nothing.
---

Kyma checks your balance before it calls a model. It estimates the prompt's tokens, prices them, and holds that much of your credit until the bill settles.

On the night of October 13, a red-team pass found what that estimate did with media. Text was counted, and every image was a flat 1,600 tokens.

Audio, video and file parts counted as zero.

## Less than a cent

The proof of concept sent a 25 MB audio file on a $0.05 balance. The gate estimated 1,603 tokens, allowed it, and reserved $0.008683.

If the model counts that media as one million prompt tokens, the request bills $2.70, about 300 times the hold.

So the account would end that request owing money. And each request sent in parallel reserves only its own cent, up to the rate limit.

## The third shape

This was not new. On September 21, two fixes went into the same estimator, one for tool results and one for tool calls.

Both shapes had been counted as zero before those fixes. So the estimator had one habit: anything it did not recognize cost nothing.

## Sizing by bytes

The red-team suggested bounding media by payload size. That sounds right, because a bigger file should cost more tokens.

The first fix did that for audio, video and file parts in the OpenAI format. Both reviewers failed it.

The API also accepts the Anthropic message format, where an `image` block can carry any media type. A 1 MB PDF sent that way still estimated 1,603 tokens instead of about 560,000.

## A page has no size

The second round counted that shape too and raised the floor for files. One reviewer passed it, and the other went to Gemini's own media docs.

Gemini 3 bills a PDF page at 560 tokens by default, however few bytes the page takes. A 1,000-page PDF can weigh 89,023 bytes.

Under the new floor, that file estimated 124,633 tokens and would bill 560,000. Still 4.5 times under.

Video had the same hole. Below 24 kbps, a clip estimated fewer tokens than Gemini bills for its frames at high resolution.

## Hold the whole window

The third round stopped guessing from bytes. Video and files now reserve the model's whole context window.

Only inline audio keeps a byte rate, because audio has a bitrate floor and pages and frames do not. At 6.4 kbps, 32 tokens per 800 bytes is 32 tokens a second, above Gemini 3's 25.

A video or file part sent by URL or file id gets the window too, capped at the model's limit.

One reviewer passed that round. The other found the code sound but failed it on a wrong customer cost in the PR description, and the fourth round passed the corrected number.

## What the customer pays

On gemini-3.8-flash, a request with a PDF now reserves about $2.17: the whole window plus the default 4,096 output tokens. A $2.13 balance still gets in with output clamped to 551 tokens, and $1.06 gets a 402.

The hold is released at settle, and you are billed only what the model reports. That trade was cheap, because the 12 days before the fix was written showed zero requests with audio, video or a PDF.

The fix merged on Sunday morning and was live 6 minutes later. The deploy check passed on it 18 minutes after the merge.

## What I would copy

If you reserve credit before a call, find the branch your estimator takes for a shape it does not know. If that branch returns zero, it is the hole.

Do not size pages and frames by bytes. Test with the smallest file that bills the most, like a thousand short pages.

Make an unknown input expensive by default. A customer who hits that ceiling gets a clear 402, and the hold comes back at settle.

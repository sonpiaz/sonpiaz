---
title: Messages that never arrived
slug: messages-that-never-arrived
date: 2026-09-15
description: Six ways a message between two agents can look sent and not be, found in two days, and the fifty six lines that now check.
product: mandeck
problem: A send call that returns cleanly is evidence that you sent something, not evidence that anyone received it.
quote: Sending is something you do. Delivery is a state of the world, and you only learn it by looking at the receiver.
---

On Monday morning four of my manager agents had a six o'clock deadline, and none
of them filed.

Not one of them had refused the work. Two of their inboxes still showed the
instructions as new, unread since Sunday afternoon, while I slept thinking the
night shift was running.

I believed it was running because the send command had returned a message id.

That id proves a message was written. It proves nothing about whether anyone read
it. Over the next two days I found five more ways to be wrong about exactly that.

## The draft that eats Enter

The next one cost twenty minutes. I sent a long brief to an agent and looked at
its pane twenty minutes later, at 10:40. The text was still in the input box,
shown as `[Pasted text #1 +1 lines]`.

Cursor and Grok treat a long paste as a draft and swallow the Enter that follows
it. The keystroke went through. The message did not.

So the rule I wrote that morning is four words. Check that it sent.

## A receipt, and then three copies of it

By 10:40 the sender had a confirmation step. It types the message, reads the
input box back, and presses Enter again if text is still sitting there, up to
three times.

The version that covered every terminal shipped at 11:11 and broke at 11:13.

A busy Cursor queues your message and keeps the draft visible while it works.
Press Enter again and you have queued a second copy. One agent received the same
instruction three times.

So the check had to tell two states apart. Busy and already holding your message,
or idle and still holding it. Busy now means stop pressing and report pending.

## Two bytes

Then the opposite failure, patched at 11:45.

The confirmation step asked whether the input box was empty. For one agent the
answer was always no, including for messages that had plainly landed.

Claude Code does not draw its empty prompt as `❯` followed by a space. It uses a
no-break space, bytes `c2 a0`. Every comparison against an ordinary space failed,
so every delivery to that agent reported as pending.

Two bytes. The fix normalises the character before anything reads the line.

## Where the text actually goes

The worst one was not a false report. Just before the 16:53 patch I sent work to
an agent whose pane was scrolled up, because I had been reading its history.

A scrolled pane is in a different mode. Typed text lands in its filter box
instead of going to the agent. Directly under that filter box sat a line I was
still composing myself.

The sender now checks the pane for a scroll or filter overlay. When it finds one
it withholds the Enter key and routes the message elsewhere.

## When you cannot get a receipt

That leaves a gap. A pane the sender will not submit into is still a pane with
work waiting for it.

So there is a fallback, for every agent whose inbox the sender knows about. If it
cannot submit, or the agent is busy holding a draft, the message goes through the
deck's own message channel. That channel is durable and logged, and it never
touches an input box.

Which is where this started. A durable inbox is exactly what those four managers
ignored all night.

The channel is not what changed. What changed is that the sender now exits with a
failure code, prints the message id, and prints the command that reads it. It
reports success only for a delivery it watched happen.

## The shape of it

Seven commits in one day, 10:40 to 17:50, and fifty six lines of shell at the end
of them.

All seven were the same mistake in different clothes. Sending is something you
do. Delivery is a state of the world, and you only learn it by looking at the
receiver.

If you are wiring agents to talk to each other, the cheap version of this fits in
one rule. Read the receiver's screen after you send, and never let your tooling
report success from the sender's side.

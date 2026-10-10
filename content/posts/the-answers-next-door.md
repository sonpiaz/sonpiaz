---
title: The answers next door
slug: the-answers-next-door
date: 2026-10-09
description: A dictation feature in my meeting app failed three review rounds in one evening, and every blocking fix was already written down in the code of my other dictation app.
product: pheme
problem: When you build a feature your other app already ships, the old code already holds the bugs you are about to write.
quote: The reviewer did not find these bugs by thinking harder. It found them by reading Haynoi.
---

On Thursday evening I added hold-to-dictate to Pheme, my meeting notes app for macOS. You hold the right Option key, talk, let go, and the words land where your cursor is.

The spec was committed at 19:54. A Claude agent committed the first working code at 19:57, three minutes later, before anyone had reviewed that spec.

I also make Haynoi, a Mac app that does exactly this one job. Its code is full of comments about what went wrong the first time.

## Three rounds

A Grok agent reviewed the spec at 20:17 and failed it with two blocking problems. Then it reviewed the code three times and failed it twice before round three passed.

Here is what the failed rounds found:

1. The paste could land in the wrong app, or paste your old clipboard instead of your words.
2. A release inside a password field went unseen, so the mic stayed on and the clip was uploaded.
3. A short press could still arm a second shortcut, and some microphones sent pure silence.

The second one is a privacy bug, so it matters most. You start talking in a chat box, move into a password field, and let go of the key.

While a password field has focus, macOS stops delivering key events to the kind of listener Pheme used. So Pheme never saw the release, kept recording until its 60 second cap, and uploaded the clip.

## Where the fixes came from

Every blocking finding cited a line in Haynoi. The reviewer quoted its comments and line numbers instead of reasoning from scratch.

Haynoi's paste code says restoring the clipboard 400 ms after every paste, read or not, "is what used to make a failed paste unrecoverable." Pheme's spec restored it after a fixed 0.8 seconds.

Haynoi waits until every modifier key is up before it pastes, and falls back to the clipboard if they stay down. Pheme's first code could paste while Option was still held.

Haynoi watches for secure input and resyncs its key state, because "a release may be missed." Pheme's first code checked secure input only at paste time, after the audio was already sent.

So the knowledge existed, in a folder next to Pheme on the same disk. None of it made it into the first code.

## What changed

Pheme now remembers which app was in front when you let go. It pastes only after every modifier is up and only if that app is still in front, otherwise it copies and tells you.

Your old clipboard comes back only after the target app has actually read the pasted text. If nothing reads it, your dictated words stay on the clipboard for a manual paste.

While you hold the key, a watchdog checks for secure input every 0.1 seconds and cancels without uploading. If a hold starts inside a password field, nothing happens at all.

Each failed round now has a regression check, written the same night. The script fails on the commit that had each bug and passes all 12 checks on main.

Those checks read the source for the piece whose absence was the bug. They do not press keys or play audio, so the real behavior still needs a hand test on a Mac.

## Before the next one

If your other app already ships the feature, read its comments before you write the spec. A comment that says "used to" is a bug report you would otherwise collect from users.

Then review the spec before the first line of code. Here the spec review landed twenty minutes after the code had started, so both of its blocking findings had to be fixed in code instead of in a paragraph.

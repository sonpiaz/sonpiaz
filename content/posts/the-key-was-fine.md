---
title: The key was fine
slug: the-key-was-fine
date: 2026-11-03
description: An agent reported a dead API key and queued a replacement for me. The key worked. The script reading it kept the quotes.
product: watch-cli
problem: A script that reads a quoted .env value without stripping the quotes sends a key the API rejects, and the error blames the key.
quote: '"Key not valid" describes the bytes you sent, not the key you stored.'
---

At 15:42 on November 2, an agent running a content job on my Mac mini sent a message. It said the Gemini key behind `audio-q` was invalid, and whoever held the key should replace it.

`audio-q` is a small script that lets an agent ask an audio model about a file. Without it, the job's writer had to guess who was speaking in a podcast from video frames alone.

The request was queued for me, because replacing a key is a step only I do.

## What was actually wrong

Twenty-five minutes later another agent withdrew the request. The key had the same fingerprint on both Macs, and a real call with it returned 200.

The bug was one line, present in two scripts. My `.env` stores some values as `NAME='value'`, and `audio-q` and its sibling `video-q` read the key with `cut -d= -f2-`.

That keeps everything after the equals sign, quotes included. So the script sent the key wrapped in two quote characters, and the API answered "API key not valid".

The fix was `tr -d` on both quote characters, the same thing my `transcribe` script already did. It went into both scripts on both Macs, with a backup of each old file. A real `audio-q` call on a one second tone then answered on both.

## Why the file has quotes at all

Since September 21, my agents run secret-touching commands through a wrapper that masks secret values in everything they print. It reads `NAME='value'`, and bare values only when every character is safe.

So the file is now mixed. Tonight on the mini, 21 lines are quoted and 32 are bare.

Every script that reads it has to handle both shapes. Before that day, four of my readers did and three did not.

## Looking for the others

That night an agent searched two script folders for the same `cut -d=` pattern on a `.env` read. Six readers already stripped quotes; one live reader did not, plus the two backup copies.

That reader is a daily job that builds a traffic report. Tonight an agent opened its log to see whether the quotes had broken it too.

They had not, because it never got that far. The log has 42 runs since the night of September 22, and every one stopped at the same error.

A working folder the job needs is missing on this machine.

The script exits 0 right after printing that error. So the scheduler shows a clean last exit, and the job has not produced a single report since.

One of its two `.env` lines is quoted. Restore the folder, and the job will send a quoted token, write whatever error comes back into its report, and still exit 0.

## What to take from it

An "invalid key" error is about the bytes that left your machine. Before you rotate, compare fingerprints or make one call with the value read by hand.

A new key stored the same way would have failed the same way. The script, not the key, was the thing to change.

If you change how a shared file stores values, search for every reader the same day. The search that found the third reader was one fixed-string `grep`.

And a job that prints FATAL should not exit 0. That one is still loaded, and it runs again tonight at 23:36.

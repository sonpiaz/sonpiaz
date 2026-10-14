---
title: Saving over an agent
slug: saving-over-an-agent
date: 2026-10-13
description: A warning about my file viewer's autosave turned out to be designed behavior. Measuring it found three other ways one key could replace a file on disk.
product: mandeck
problem: An editor that autosaves next to AI agents can quietly put old text over the file an agent just rewrote.
quote: The warning was about the key I might press. The bugs were about the file I had not read.
---

On Tuesday one of my agents read the code of my file viewer and raised a warning. The editor saves 500 ms after a key, so one stray key could overwrite a file.

The viewer lives in Mandeck, the terminal I use to run many agents side by side. Agents write reports there, and I open them in a side panel to read.

The warning came from reading code, not from running it. So it went to the agent that builds Mandeck, to measure before anyone changed a line.

## True, by design

The first answer was boring. A key does save the file, but only after I click into the editor. That is how an IDE autosave works, and the editor keeps undo on. Whether text files should open read-only is a product call, and I have not made it.

The measuring found two other bugs, and both were worse.

## The 3 second window

The editor re-reads the file from disk every 3 seconds, and it saves with no disk check. That gap is where an agent's work disappears.

The test opened a file holding "agent v1", then rewrote it as an agent would, to "agent v2". It typed one key before the next re-read.

The file on disk became "agent v1" plus that key. The agent's new version was gone, and nothing on screen said so.

The second bug was a symlink. The save writes a fresh file and swaps it in, which replaced the link with a regular file and left the real target unedited.

## Held, not written

The fix compares the file's modified time with the one the editor read. If it moved, the edit is held and a bar says "Not saved: the file changed on disk after you started editing."

You pick Reload or Overwrite. The save now writes to the file the link points at, then records its own write time. On the old code, 4 checks in the new test went red. With the fix, all 10 passed.

## The file it never read

The reviewer passed that fix with one medium note. The time check only ran after a successful read.

So the builder measured that path on the old code. A file with no read permission, holding "private bytes", opened as an empty editor, and one key replaced it with "k".

The empty editor looked like an empty file. It was a file the editor never saw.

The fix holds any unread file that exists at save time behind the same bar. Its first review failed: when the editor itself created a file, the next key was held for good.

The reviewer typed "A", which created the file, then "B", which never reached disk. The second round fixed it, and that case now saves "AB" in the test suite.

## What I would copy

If your editor autosaves next to agents, compare the file's modified time before every write. Write through a symlink to its target, and treat a failed read as unknown, not empty.

The limits are written down. A save still drops extended attributes and breaks hard links, and a write landing in the same instant can still race.

Both fixes merged on Tuesday evening. They reach the Mandeck I use every day with the next install.

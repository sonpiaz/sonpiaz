---
title: The anchor claimed twice
slug: the-anchor-claimed-twice
date: 2026-09-12
description: A duplicate alias on two rows took the ticket numbers off every row on the board, and what that cost says about deriving identity from content.
product: mandeck
problem: Ticket identity derived from the text of a row breaks the moment two rows claim the same history.
quote: The damage was not proportional to the cause. Two ambiguous rows out of 251, and the result was that no row had a number.
---

Every ticket on my board takes its number from a hash of its own line of text.
Not from a database. From the line.

That has an obvious problem. Edit the words and the hash changes, so the row
loses its number, its checkbox and its comments in the same keystroke.

The answer is an alias. When a line is edited, the writer leaves a note saying
the old key belongs to this row now, and the next read follows the note. The
ticket keeps its number.

Then two rows left the same note.

There was no rule against it, so nothing stopped it. Two anchors each ended up
claimed by two lines: one on lines 50 and 114, another on lines 62 and 120.
Four rows involved, out of 251 on the board.

The page could not decide who owned those keys, so it stopped handing out
numbers. Not for the four rows. For all of them.

I opened the board and every ticket number was gone. Zero out of 251.

## Total, not partial

This is the part I keep going back to. The damage was not proportional to the
cause. Two ambiguous records, and a lookup that cannot decide has exactly one
correct behavior, which is to refuse. So it refused everything.

Refusing was right. A numbering scheme that guesses when it is ambiguous hands
you a ticket number belonging to some other ticket, and you find out three
weeks later from a comment that makes no sense on the row it is sitting on.

The repair was small, which is usually the sign that the bug lived in a rule
rather than in the code. An ownership check at the write gate, so a row cannot
claim an anchor another row already holds. A write that tries comes back 409
and the source file is not touched at all. Plus one cleanup command for the
rows already tangled.

That cleanup moved 38 bytes. The file went from 155,382 to 155,344 and the
numbers came back: 254 of 254, the board having grown by three rows while I
was fixing it.

Running the cleanup a second time reported zero contested anchors and changed
nothing, which is the only way to know a cleanup command has finished rather
than merely gone quiet.

## The general shape

Deriving identity from content is a tempting trade. You get no database, no
migration, no id column to keep in sync, and a file you can open and edit by
hand. The ticket numbers survive a `git clone`.

You pay for it at exactly one moment, and that moment is when the content
changes. Every scheme like this grows an alias layer, because it has to, and
from then on identity actually lives in the alias layer rather than in the
hash.

Which means the rules protecting it belong at the write gate, not in a check
that runs afterward. One anchor, one owner, verified before the bytes land.

I would make the same trade again. I would just write the ownership rule on
day one, because this cost does not arrive gradually. It arrives all at once,
on the day the board finally has enough rows on it to be worth something.

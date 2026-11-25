---
title: Two grey words
slug: two-grey-words
date: 2026-11-24
description: My agent deck read a grey prompt suggestion as text I had typed, and held every message to one agent for about 18 hours. The first fix merged green and changed nothing live.
product: mandeck
problem: A tool that reads a terminal as plain text cannot tell a grey suggestion from typed text, and a fix behind an optional argument does nothing until the live caller passes it.
quote: 'The test supplied the cursor column. The live caller never did.'
---

On November 22, one of my agents went quiet for most of the day. Every message sent to it sat in its inbox, and it never looked.

Its input box showed two words, `ok 20h`. My deck read them as a reply I had started typing and not sent.

## Why the deck waits

Mandeck is the app where I run my agents, one terminal pane each. When mail arrives for an idle agent, the deck types a short nudge into its pane so it checks the inbox.

It never types over a line a person is writing. If the input box holds text, the deck skips the nudge and tries again 30 seconds later, with no age limit.

That rule is right. It is also why a misread box can hold mail forever.

## What it cost

The hold ran from about 01:00 to 19:34. In that time the agent missed a 10:00 release window, because the mail that would have started it never arrived.

My chief of staff agent paged me by Telegram and email that morning, asking me to clear the box. A new stuck input alert paged me again at 17:34, with seven messages held.

In the evening I sent a screenshot and asked why there was any text to press Enter on. The box was empty. The two words were Claude Code's grey prompt suggestion, and the cursor sat at the start of the line.

## Why the deck saw text

The deck reads each pane as plain text from the terminal library, Ghostty. That read drops the faint style, so grey suggestion text and typed text come back as the same characters.

The draft check already had a rule for dim text. The live call never passed a style, because the plain text read does not have one.

A spec written at 01:55 that morning had treated `ok 20h` as an unsent draft, after a shorter hold of the same two words. It proposed a workaround, a notice to the sender after 10 minutes, and a reviewer passed it on round two.

## The fix that did nothing

The first fix used the cursor. If the cursor sits at column 0, right after the prompt glyph, the words are a suggestion and not a draft.

It merged at 01:23 on November 23 with the pane status harness green across 156 checks. Its test called the draft check and supplied a cursor column.

The live caller did not. The new argument was optional, and a caller that left it out kept the old plain text rule. That caller was the one that decides whether the nudge gets typed.

The next run opened with a stop check: if main already passes the cursor column, report done. `git grep cursorColumn` on the two caller files came back empty, so it kept going.

The second fix maps the cursor's screen position onto the input line and passes that column in. It merged at 12:23 the same day.

## Where it stands

Both fixes are merged and built into a staged copy of the app. They are not installed yet, because restarting the deck closes every agent session it hosts, so that waits for me.

The review named three limits. The text read and the cursor read are separate calls, the test does not drive a live terminal, and that build did not typecheck the caller's file.

The chief of staff also turned off its own stuck input alert. It had read the same grey words the same way.

## What to take from it

If your tool reads another program's screen, plain text is not the whole screen. Style and cursor position carry meaning, and a text read throws both away.

When a fix adds an optional argument, grep the live call sites before you call it done. A test that passes the new argument proves the function, not the path your users hit.

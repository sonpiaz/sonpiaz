---
title: A whole afternoon per talk
slug: a-whole-afternoon-per-talk
date: 2026-09-27
description: Deep conference talks are hard to take in on one listen, and reviewing each one by hand cost me an afternoon. Homus turns slide photos and a transcript into the complete talk, written out to read start to finish.
problem: A deep technical talk is hard to understand on first listen, and turning it into something you can read again takes hours of repetitive manual work.
quote: Not a summary. Every idea, example, number and story the speaker gave, in the order they gave it.
---

I go to a lot of tech conferences. Many of the talks are very good, and many of
them go deep enough that one listen is not enough for me to understand all of
it.

So after each event I used to review the talks by hand. I went through every
slide again. I asked an AI about each concept I had not fully caught. Then I
assembled everything into one document I could read from start to finish, and
stored it in Google Docs, Drive or Lark so I could come back to it later.

That worked. It also took a whole afternoon per talk, and almost all of that
afternoon was the same manual steps repeated: find the slide, match it to what
the speaker was saying, look up the term, paste, fix the name, move on.

Homus is what I built to remove that part.

## What Homus does

You give it photos of the slides and a transcript of the talk, taken from a
recording. Or you give it a set of videos on one topic. It rewrites the whole
talk into a document you can read.

- **Complete, not a summary.** Every idea, example, number and story the speaker gave, in the order they gave it.
- **Vietnamese, with the English technical terms kept.** Words like agent, sandbox and context window stay in English, so after reading you still use the right word at work.
- **Slides where the speaker talks about them.** Where there is no slide, there is a diagram drawn for that passage.
- **Names checked against the official agenda.** Speaker, company and talk title come from the event's session page, and tools, repos and articles the speaker mentions link to their own sources.
- **Readable by people and by agents.** Every talk has a Markdown version, and the site has an llms.txt.

The first event on the site is WeAreDevelopers World Congress North America
2026: 19 talks.

## How it works

The full pipeline is on the
[methodology page](https://homus.dev/methodology.html). In five steps:

1. **Collect and verify.** Take the transcript of each talk and the slide photos for the whole event, then match times and content against the official agenda to get the right title, speaker and company. Speech recognition often mishears names, and no name is guessed.
2. **Segment and place figures.** Cut the transcript into 420 word chunks, place each photo by the time it was taken, then open every photo to put it in the section whose content matches the slide.
3. **Write.** One agent writes each talk under the same rules: rewrite everything in order, fix names from the slides and agenda, turn prompts on slides into copyable blocks, draw a diagram where there is no slide.
4. **Review independently.** A different agent, one that did not write the talk, reads the full transcript against the document, lists what is missing or wrong, fixes it, and ends with a pass or fail verdict. Only talks that pass are published.
5. **Check and publish.** Scan for personal information, then build the static pages, the Markdown per talk and llms.txt, and check every link and image before it goes live.

## What the numbers say

For the 19 talks, the transcripts come to 84,505 words.

Every document is measured before review. The main check is coverage: words in
the document divided by words in the transcript. Vietnamese runs longer than
English for the same content, so anything under 1.0 is a sign the writer is
summarizing. Across the 19 talks the lowest is 1.02 and the median is 1.23.
Every transcript chunk is pointed to by at least one section in all 19 talks,
and every source link returned a valid response.

The 15 talks from September 24 and 25 all passed independent review on the
first round, after the reviewing agent fixed about 20 places. What it caught was
the useful part: misheard names that were not fully fixed, facts from an outside
source written as if the speaker had said them, figures with no source presented
as checked fact, and small technical details left out.

## What it does not do yet

Automatic transcripts get things wrong, especially names and new terms, and a
drawn diagram is the writer's reading of the talk, not the original slide. The
documents are written and reviewed by AI, so the error rate is low but not
zero, and for now they are only in Vietnamese.

## Use the method, or send your talks

The whole process is packaged as an open skill for coding agents,
[event-review](https://github.com/sonpiaz/event-review): the rules for the
writing agent, the rules for the reviewing agent, the script that measures each
document, and the script that places photos by the time they were taken. You
can run it on your own event.

If you run a company, conference or meetup and want complete Vietnamese
versions of your talks, send the full transcript or the recorded video, plus the
slides, to [hello@homus.dev](mailto:hello@homus.dev). Each talk goes through
the same process and the same independent review before it is published.

I am building Homus while I study Computer Science. It started as a study tool
for myself, and it is also a question I want to keep working on: how knowledge
from a talk becomes something you can read again and use again.

The talks are at [homus.dev](https://homus.dev).

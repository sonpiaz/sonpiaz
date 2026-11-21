---
title: A grep for robots
slug: a-grep-for-robots
date: 2026-11-20
description: Our crawler read a brand's terms before touching its program pages, as the rule said. Its search looked for robot words, missed a ban on gathering data, and fetched ten more program pages.
product: open-affiliate
problem: An agent can follow a terms-first rule to the letter and still miss the ban, because the clause does not use the words it searches for.
quote: 'The order was right. The vocabulary was the gap.'
---

At 00:30 on November 19, one of our agents fetched a brand's terms page. Five seconds later it moved on to the brand's program site.

Over the next 17 minutes it fetched 10 affiliate program pages. The terms it had just read said users would not use the website to gather or extract any data or content.

## What the agent does

OpenAffiliate is a public registry of affiliate programs. Every night, agents take a batch of leads and check each brand's program page against its own wording.

The worker brief has two rules before any program request. Read `robots.txt` first. Then read the site's terms, and if they ban robots, automated access, scraping or AI, mark the brand `HOLD-TOS` and stop.

That night's wave had 40 leads. It merged 3 programs and held 8 for terms.

## What it missed

The agent did follow the order. It fetched `robots.txt`, the homepage, then the terms, and only then the program pages.

To read the terms, it ran a search: `robot|scrap|crawl|spider|data min|harvest|automat|artificial`. The search did not surface the clause, so it wrote `tos_scope: none` with the note "no robots/scraping/AI clause".

The clause was there. It just used other words: "Gather or extract any data or content."

Four of the search's eight words match the rule's list: robot, scrape, automated, and artificial for AI. The clause used none of them.

## How we found it

Our audit script read zero incidents for that wave. It checks that `robots.txt` came before each request, and it does not check terms at all.

The agent caught it itself later that night, when it came back to draft the listing and mapped the terms headings. It logged an incident, rewrote the verdict to `HOLD-TOS`, deleted the draft and sent nothing more.

The reviewer then checked the request log against the terms fetch. It found 2 `robots.txt` hits and 10 program pages, from 5 seconds to 17 minutes 29 seconds after.

The clause names no automated means, so a narrower reading would have allowed the listing. We held it anyway.

## The fix

The next wave did not get a better sentence in the brief. It got a change in the tool that makes every request.

A new script, `tosgrep.py`, prints every sentence of a saved terms page that matches a wider list. Among others, that list adds `extract`, `gather`, `collect`, `mine` and `train`.

The fetch tool now refuses any program request to a brand until two things exist:

- a marker that `tosgrep.py` ran on that brand's terms
- a `tos_scope` line in the notes, written after that marker

If the line says `HOLD`, every later request to that host is refused. The tool also refuses if the notes were last written before the marker.

## What the next night showed

On November 20, 14 hosts got a request past the terms gate. All 14 came after a marker and a matching scope line, with 0 gate violations and 0 requests after a hold.

`tosgrep.py` also refused one terms page that was only a JavaScript shell with too little text to read. The agent marked that brand blocked and did not find a way around it.

## What to take from it

If your rule lists banned words, compare the agent's search to that list. Ours shared four words with the rule, added four more, and still had no gather or extract.

Put the check in the code that fetches, not in the brief. A rule in prose gets followed the way the agent reads it. A refusal in the fetch tool does not depend on the reading.

The wider list is still a search, and the scope line is still a judgment call. What changed is that the judgment now has to be written down, after the evidence, before the next request.

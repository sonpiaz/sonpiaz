---
title: The second foreign key
slug: the-second-foreign-key
date: 2026-11-13
description: A migration added one column with a foreign key. Every login on my learning platform failed for about ten hours, after five review rounds had read the line that added it.
product: build-to-own
problem: On an auto-generated database API, a second foreign key between two tables changes the meaning of every existing join between them, so a migration that looks additive can break reads it never mentions.
quote: 'On an auto-generated API, a foreign key is part of the query language, not only the schema.'
---

On November 9 at 21:07, a migration ran on the database behind Build to Own's learning platform. It added two columns to the enrollments table, so an admin could revoke a ticket without deleting the row.

One column, `revoked_by`, was declared as a foreign key to the people table. Twenty-six minutes later, the code that used the new columns merged.

From 21:07, every login answered 500. So did the endpoint that serves the lessons. Every learner was locked out for about ten hours.

## Two ways to join

The API in front of the database is PostgREST. A request like `enrollments?select=...,people(id,email,name)` asks it to join enrollments to people. It finds the join by following the foreign key.

With one foreign key there is one path. With two, the request is ambiguous, and PostgREST answers HTTP 300 with the code PGRST201. The app turned that 300 into a 500.

300 Multiple Choices was the honest answer. There were now two ways to join.

## What the review had read

The pull request was on its seventh round. Six reviewed heads had come back as not passing, and the fixes answered sixteen findings.

They ranged from refunds after a removal to OAuth tokens and paged reads. None of the sixteen mentions the join. Five of the six reviews had read the line that added the key.

The PR body even carried a deploy-order note. Apply the migration first, then merge. The login path selects the new column, so merging first would break every login.

The note named one way this deploy could break login. It broke another.

## The fix

I dropped the constraint on production and told PostgREST to reload its schema. Login answered 200 again. The column stayed, without the foreign key.

The repo caught up the same morning. The migration now declares `revoked_by` as a plain bigint, and drops the constraint if an environment already has it.

Every embed of people in the API and the scripts now names the foreign key it follows. That is `people!person_id(...)`, in 12 places.

A column hint, not the constraint name, because the hint must not depend on what production named the constraint. A wrong hint is a 400 on every login.

## The answer was next door

Two embeds already did this. The comments table has two foreign keys to people, and both of its embeds already carried `people!comments_person_id_fkey`.

The codebase knew the rule. Only the two embeds on a table that already had two keys followed it.

## A guard at the right layer

The first guard parsed the SQL migrations for a second foreign key. The reviewer showed it stayed green for uppercase names, quoted identifiers and block comments.

The second reads the code instead. It fails on any embed of people without a hint. Then it copies the code to a temp dir, appends one query shape at a time, and reruns itself.

Every unhinted shape must fail and every hinted one must pass. Over the next two review rounds the list grew from 9 unhinted shapes to 17, with 11 controls that pass.

A SQL check now asserts exactly one foreign key from enrollments to people. Re-running the fixed migration over the old shape has to bring the count back to one.

## What to take from it

On an auto-generated API, `references` is not only a constraint. It is a new entry in the query language for every pair of tables it touches. Every existing join between them now has to say which key it means.

So name the key in every embed, even while there is only one. And after any migration on production, run the login query and expect 200, not 300.

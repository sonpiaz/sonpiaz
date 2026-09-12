---
name: Kyma API
slug: kyma
one_liner: Gives agent builders one key for a hundred models, with uptime measured rather than claimed.
status: Live
tier: main
started: 2026-04
order: 1
featured: true
problem: >
  A developer building with AI ends up with a key, a bill and an account at dozens of vendors,
  and every agent that needs a model needs its own copy of that mess. Keeping it straight becomes a
  job of its own, and when one vendor has a bad hour the product goes down with it.
approach: >
  One key and one OpenAI compatible endpoint, with failover that retries the same model on
  another route before it gives up. The uptime number is computed from Kyma's own served
  requests, not from a vendor's status page, and it is published per model next to the price.
  The trade is honest: one vendor bought direct will usually list cheaper than Kyma.
stage: >
  Live since 2026-04-04 with 102 models on one endpoint, a hosted MCP server, and SDKs on npm
  and PyPI. The last month went into reliability rather than catalogue size: an audio contract
  that refuses a bad request before anyone is billed, and routing that demotes a route which
  cannot serve instead of letting it become primary.
vision: >
  One key should cover the tools an agent needs, not just the models: research, enrichment and
  voice behind the same endpoint and the same bill. And if buyers really choose on reliability,
  every gateway will publish per model uptime within three years, at which point an unmeasured
  99.9 percent reads the way a missing status page reads today.
evidence:
  - claim: An internal audit on 2026-09-08 found one model advertising 99.6 percent uptime against 74.0 percent measured, and 32 of 70 published prices wrong. Both were corrected from served request logs
  - claim: 102 models on one endpoint, each carrying a measured 30 day uptime rather than a claimed one
    source: https://kymaapi.com/models
  - claim: Every chat model probed every 6 hours under one uptime definition, published on the status page
    source: https://kymaapi.com/status
  - claim: Live token, request and developer counts, published on the rankings page and updated from request logs
    source: https://kymaapi.com/rankings
  - claim: 18,637 requests hit an upstream failure and still returned an answer; lifetime success 97.58 percent
links:
  site: https://kymaapi.com
  docs: https://docs.kymaapi.com
---

Kyma started on a Saturday in April, right after lunch. I use somewhere between forty and fifty
software vendors, and the keys for them were scattered everywhere, each with its own bill, its own
subscription and its own account. I was running a lot of AI agents on top of that. What I wanted was
simple: when an agent needs a model, it should ask for exactly one key.

I started building around one in the afternoon and stopped between two and three the next morning,
with a version where people could sign in and use the first set of open models. When I woke up,
about 700 people had already signed up.

That morning set the pattern for everything after it. I read what people did and what they asked for,
and changed the product from that rather than from a plan. The next day about 1,200 people came
through, and someone paid. I had wired up payments the day before, and I assumed the first purchases
were people testing. By day four and five they were still buying, which is when I stopped treating it
as an experiment.

Since then Kyma has become the layer under almost everything else I build: the realtime translation
app, the transcription extension, the blog agent, the content pipeline. When I start a new AI product,
the first thing I do is point it at Kyma. I still work on it a little every weekend and during the
week, and the rule has not changed since that first Saturday. Make it slightly better each time.

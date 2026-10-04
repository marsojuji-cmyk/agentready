# agentready

**Score any website on how well AI agents can read, cite and operate it.**

Zero dependencies. Node 18+. One file. No API keys, no accounts, no cloud.

```bash
node scan.mjs stripe.com
```

```
  AI AGENT READINESS — stripe.com
  ────────────────────────────────────────────────────
  SCORE 47/100   GRADE D   (44/93 weighted points)
  ────────────────────────────────────────────────────
  PASS   4pt  Served over HTTPS
  PASS  12pt  llms.txt present          → 200 (69878 bytes)
  FAIL   4pt  llms-full.txt present     → 404
  FAIL  10pt  robots.txt addresses AI crawlers
        robots.txt → 200; agents named: none
  FAIL   8pt  Markdown content negotiation
        Accept: text/markdown → content-type: text/html; charset=utf-8
  ...
  TOP FIXES:
   1. llms-full.txt present          (+4 pts available)
   2. robots.txt addresses AI crawlers (+10 pts available)
   3. Agent/MCP manifest present      (+8 pts available)
```

Writes a standalone HTML report and a JSON record per scan.

## Why this exists

Agents — ChatGPT, Claude, Perplexity, Gemini, Copilot — increasingly read sites through
machine-readable surfaces *before* they read the HTML. `llms.txt`, AI crawler rules in
`robots.txt`, `schema.org` JSON-LD, an OpenAPI spec, an MCP manifest, markdown content
negotiation. When a site lacks them, the agent gets an HTML soup of nav links and marketing
copy, or nothing at all.

Two things happen then: the site **doesn't get cited** when someone asks an assistant a
question it should have answered, and it **can't be operated** by an agent that wanted to
book, quote, or buy.

Nobody is measuring this yet. In the Calgary home-services cohort measured on 2026-10-04
(20 sites, real numbers, reproducible):

| | |
|---|---|
| Mean score | **22.7 / 100** |
| Sites graded C or better | **0 of 20** |
| Sites publishing `llms.txt` | 3 of 20 |
| Sites with JSON-LD | 8 of 20 |

Two of the three that publish `llms.txt` do so by accident — Yoast SEO v28.5 and Rank Math
now auto-generate it. The ones on older stacks have nothing.

## Try it without installing anything

Open an issue titled **"Scan my site"** with a URL in the body —
[**click here**](https://github.com/marsojuji-cmyk/agentready/issues/new?title=Scan%20my%20site&body=My%20website%20is%3A%20https%3A%2F%2F)
— and a GitHub Action scans the site and posts the full report as a comment.
No backend, no signup, no API key. See a live one:
[issue #1](https://github.com/marsojuji-cmyk/agentready/issues/1).

## Usage

```bash
# single site → HTML report + JSON
node scan.mjs example.com --out ./out

# machine-readable
node scan.mjs example.com --json

# a cohort → ranked leaderboard + CSV
node batch.mjs calgary-home-services.txt --out ./out --cat "Calgary home services"

# a cohort → per-prospect reports + ready-to-send email drafts + outreach queue
node outreach.mjs calgary-home-services.txt --out ./prospects --cat "home services" --city Calgary

# the fix, not the diagnosis → tailored llms.txt + robots AI block + schema + instructions
node fix.mjs dukesplumbing.ca --out ./fixes
```

## What it checks — 15 signals, 93 weighted points

| Weight | Check |
|---|---|
| 12 | `llms.txt` present (real content, not a soft-404) |
| 12 | JSON-LD structured data |
| 12 | robots.txt addresses AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …) |
| 10 | OpenAPI / Swagger spec discoverable |
| 10 | Agent manifest (`/.well-known/mcp.json`, `ai-plugin.json`, …) |
| 8 | Markdown content negotiation (`Accept: text/markdown`) |
| 5 | `sitemap.xml` reachable |
| 5 | High-value schema types (Organization, LocalBusiness, Product, FAQPage, …) |
| 5 | OpenGraph + meta description |
| 4 | HTTPS, `llms-full.txt` |
| 3 | `ai.txt`, `security.txt`, agent hint files, sitemap declared in robots.txt |

Weights are opinionated and in the open — edit `CHECKS` in `scan.mjs` and argue with them.

## Design constraints

- **Zero dependencies.** No `node_modules`, no lockfile, no supply chain. Global `fetch` only.
- **One file, readable in a sitting.** You can audit every claim it makes about your site.
- **Evidence, not vibes.** Every check prints the URL it hit and the status it got back.
- **Soft-404 aware.** A 200 that returns HTML is not a passing `llms.txt`.

## License

MIT.

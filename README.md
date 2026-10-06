# agentready

**Scores how well AI agents can read, cite and operate any website.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node 18+](https://img.shields.io/badge/node-18%2B-339933.svg)](scan.mjs)
[![scan-on-issue](https://github.com/marsojuji-cmyk/agentready/actions/workflows/scan-on-issue.yml/badge.svg)](https://github.com/marsojuji-cmyk/agentready/actions/workflows/scan-on-issue.yml)

Sites without machine-readable surfaces serve agents HTML soup, so they go uncited and agents can't operate them. agentready measures that gap with 15 checks. It ships as one file with zero dependencies and needs no API keys, accounts or cloud.

## What it guarantees

- **Evidence for every verdict.** Each check records the URL it requested and the status it got back, and the report prints both.
- **Soft-404s fail.** `llms.txt` passes only when the response is OK, the body is over 40 bytes, and its first 400 characters contain no HTML markers.
- **Reproducible score.** The score is `earned / 93` weighted points, rounded. Grades run A ≥ 90, B ≥ 78, C ≥ 62, D ≥ 45, E ≥ 25, F otherwise.
- **No supply chain.** No `node_modules` and no lockfile. It uses Node's global `fetch` only.
- **Read-only.** The scanner only issues GET requests and writes nothing to the target.

## Quickstart

```bash
git clone https://github.com/marsojuji-cmyk/agentready && cd agentready
node scan.mjs stripe.com
```

Sample output (recorded when this README was first written):

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

The scan writes a standalone HTML report and a JSON record to `./agentready-out/`. Pass `--out <dir>` to change the location or `--json` for machine-readable output.

## How it fails

| Condition | Behaviour |
|---|---|
| A request errors or exceeds 12 s | Each request is time-bounded (`AbortSignal.timeout(12000)`). It records status `0` and the check fails, but the scan does not crash |
| Home page unreachable | All checks still run and report their own status, so the score reflects what the site actually served |
| Malformed JSON-LD block | The scanner skips that block and counts only parseable types |
| Issue bot: no URL in the issue | Replies asking for a URL and scans nothing |
| Issue bot: `localhost`, `*.local`, `*.internal`, IP literals, non-http(s) | Rejects the target and explains why. The filter checks hostnames only and does not resolve DNS, so it is hygiene, not a full SSRF defence |
| Issue bot: scan fails or times out | Replies that the site refused the request or timed out |

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

# show only the 5 biggest fixes (default: every failing check); per-request timeout in ms
node scan.mjs example.com --top 5 --timeout 8000

# a cohort → ranked leaderboard + CSV
node batch.mjs calgary-home-services.txt --out ./out --cat "Calgary home services"

# a cohort → per-prospect reports + ready-to-send email drafts + outreach queue
node outreach.mjs calgary-home-services.txt --out ./prospects --cat "home services" --city Calgary

# the fix, not the diagnosis → tailored llms.txt + robots AI block + schema + instructions
node fix.mjs dukesplumbing.ca --out ./fixes
node fix.mjs jane-doe.dev --out ./fixes --type person   # auto-detected by default: person | organization | localbusiness

# regression tests (zero dependencies, local fake servers)
node --test test/
```

Exit codes: `0` scanned, `1` usage error, `2` site unreachable. An unreachable site is reported as
`UNREACHABLE` with the DNS/TLS/connect error and is **not** given a score.

Every file check is soft-404 aware: the scanner first requests a random path that cannot exist. If the
site answers it with `200` (a catch-all, e.g. an SPA host with no 404 page), any file whose body matches
that page, or any HTML body served for a `.txt`/`.json`/`.xml` path, is reported as `soft-404` and fails.

## What it checks: 15 signals, 93 weighted points

| Weight | Check |
|---|---|
| 12 | `llms.txt` present (real content, not a soft-404) |
| 12 | JSON-LD structured data |
| 10 | robots.txt has an explicit `User-agent` group for at least one AI crawler (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, …). Allow **or** Disallow counts; evidence lists which are allowed and which are blocked; comment-only mentions do not count |
| 8 | OpenAPI / Swagger spec discoverable |
| 8 | Agent manifest (`/.well-known/mcp.json`, `ai-plugin.json`, …) |
| 8 | Markdown content negotiation (`Accept: text/markdown`) |
| 5 | `sitemap.xml` reachable |
| 5 | High-value schema types (Organization, LocalBusiness, Product, FAQPage, Article, Person, ProfilePage, SoftwareSourceCode, …) |
| 5 | OpenGraph + meta description |
| 4 | HTTPS (a real TLS connection), `llms-full.txt` |
| 3 | `ai.txt`, `security.txt`, agent hint files, sitemap declared in robots.txt |

The table mirrors the `add(...)` calls in `scan.mjs`, which sum to 93. The weights are opinionated and public: edit them in `scan.mjs` and argue with them.

## Evidence

- **Committed cohort scan:** [`examples/calgary-home-services-2026-10-04.html`](examples/calgary-home-services-2026-10-04.html). It covers 20 sites, with a mean score of 22.7/100. 0 of 20 sites grade C or better, 4 of 20 publish `llms.txt`, and 9 of 20 have JSON-LD.
- **Live issue scan:** [issue #1](https://github.com/marsojuji-cmyk/agentready/issues/1).
- **Quickstart output:** the `stripe.com` sample above, re-run on 2026-10-07. It scored 47/100, grade D, 44/93 points. Live sites change, so your numbers may differ.
- Regression tests: `node --test test/` (zero dependencies, local fake servers). CodeQL code scanning and the scan-on-issue workflow run on GitHub Actions.

## Why it matters

Agents — ChatGPT, Claude, Perplexity, Gemini, Copilot — increasingly read sites through
machine-readable surfaces *before* they read the HTML. `llms.txt`, AI crawler rules in
`robots.txt`, `schema.org` JSON-LD, an OpenAPI spec, an MCP manifest, markdown content
negotiation. When a site lacks them, the agent gets an HTML soup of nav links and marketing
copy, or nothing at all.

Two things happen then: the site **doesn't get cited** when someone asks an assistant a
question it should have answered, and it **can't be operated** by an agent that wanted to
book, quote, or buy.

The committed Calgary home-services scan from 2026-10-04
([`examples/calgary-home-services-2026-10-04.html`](examples/calgary-home-services-2026-10-04.html), 20 sites) shows:

| | |
|---|---|
| Mean score | **22.7 / 100** |
| Sites graded C or better | **0 of 20** |
| Sites publishing `llms.txt` | 4 of 20 |
| Sites with JSON-LD | 9 of 20 |

SEO plugins now generate some of these files automatically: `mrmikesplumbing.ca/llms.txt`
opens with "Generated by Rank Math SEO" (checked 2026-10-07).

## Design constraints

- **Zero dependencies.** No `node_modules`, no lockfile, no supply chain. Global `fetch` only.
- **One file, readable in a sitting.** You can audit every claim it makes about your site.
- **Evidence, not vibes.** Every check prints the URL it hit and the status it got back.
- **Soft-404 aware.** A 200 that returns HTML is not a passing `llms.txt`.

## Status

Working tool, early. The single-site scanner and the issue bot run in production on this repo. The weights are opinionated and open to argument.

## License

MIT.

#!/usr/bin/env node
/**
 * action-scan — GitHub Action entry point.
 * Reads ISSUE_TITLE / ISSUE_BODY from env, extracts a URL, scans it, and writes
 * a markdown comment to FILE_OUT (default: comment.md).
 *
 * Serverless self-serve funnel: no backend, no credentials, no hosting cost.
 */
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const outFile = process.env.FILE_OUT || 'comment.md';
const title = process.env.ISSUE_TITLE || '';
const body = process.env.ISSUE_BODY || '';
const num = process.env.ISSUE_NUMBER || '';
const repo = process.env.REPO || '';

const write = (md) => { writeFileSync(outFile, md); console.log(md); };

function extractUrl(text) {
  const m = text.match(/https?:\/\/[^\s<>)"'\]]+/i) || text.match(/\b([a-z0-9-]+(\.[a-z0-9-]+)+)\b/i);
  return m ? m[0].replace(/[.,;:]+$/, '') : null;
}

// --- SSRF / abuse hygiene: public http(s) hosts only ---
function validate(raw) {
  let u;
  try { u = new URL(/^https?:\/\//i.test(raw) ? raw : 'https://' + raw); } catch { return { ok: false, why: 'not a valid URL' }; }
  if (!/^https?:$/.test(u.protocol)) return { ok: false, why: 'only http/https' };
  const h = u.hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) return { ok: false, why: 'internal hostnames are not scannable' };
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h) || h.includes(':')) return { ok: false, why: 'IP literals are not scannable' };
  const bad = ['127.0.0.1', '169.254.169.254', 'metadata.google.internal'];
  if (bad.includes(h)) return { ok: false, why: 'not scannable' };
  return { ok: true, url: u.origin };
}

const target = extractUrl(body) || extractUrl(title);

if (!target) {
  write(`### 🔍 Agent readiness scan\n\nI couldn't find a website in this issue.\n\nEdit the issue body to include a URL — e.g. \`https://example.com\` — and I'll scan it.`);
  process.exit(0);
}

const v = validate(target);
if (!v.ok) {
  write(`### 🔍 Agent readiness scan\n\n\`${target}\` was skipped: **${v.why}**.\n\nGive me a public \`https://\` address and I'll scan it.`);
  process.exit(0);
}

let result;
try {
  const raw = execFileSync(process.execPath, [join(import.meta.dirname, 'scan.mjs'), v.url, '--json', '--out', './out'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  result = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
} catch (e) {
  write(`### 🔍 Agent readiness scan\n\nCouldn't reach \`${v.url}\` — the site refused the request or timed out. (${String(e.message).slice(0, 120)})`);
  process.exit(0);
}

const bar = (n) => '█'.repeat(Math.round(n / 10)) + '░'.repeat(10 - Math.round(n / 10));
const rows = result.checks.map((c) => `| ${c.pass ? '✅' : '❌'} | ${c.name} | ${c.weight} | \`${c.evidence}\` |`).join('\n');

write(`### 🔍 Agent readiness scan — \`${result.host}\`

## ${result.score}/100 &nbsp; grade **${result.grade}**

\`${bar(result.score)}\` ${result.score}% of ${result.totalWeight} weighted points

Scanned ${result.checks.length} machine-readability signals — the files AI assistants read
*before* they read your HTML.

| | Check | Pts | Evidence |
|---|---|---|---|
${rows}

**Top ${Math.min(3, result.gaps.length)} fixes available:** ${result.gaps.slice(0, 3).map((g) => `\`${g.name}\` (+${g.weight})`).join(' · ')}

---

<sub>Score ${result.score}/100 · ${result.earned}/${result.totalWeight} weighted points · response ${result.homeMs} ms · every number reproducible by re-running \`node scan.mjs ${result.target}\` · scanner: https://github.com/${repo}</sub>`);

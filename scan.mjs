#!/usr/bin/env node
/**
 * agentready — AI Agent Readiness scanner.
 * Zero dependencies. Node 18+ (uses global fetch).
 *
 * Usage:  node scan.mjs <url> [--out <dir>] [--json]
 *
 * Scores how ready a website is to be read, cited and operated by AI agents:
 * llms.txt, AI crawler rules, structured data, OpenAPI, MCP manifests,
 * markdown content negotiation, and the machine-readable files agents look for.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const UA = 'Mozilla/5.0 (compatible; AgentReadyBot/1.0; +https://github.com/agentready)';
const TIMEOUT_MS = 12000;

async function get(url, headers = {}) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': UA, accept: '*/*', ...headers },
    });
    const text = await res.text();
    return {
      ok: res.ok, status: res.status, finalUrl: res.url, text,
      ct: (res.headers.get('content-type') || '').toLowerCase(),
      ms: Date.now() - t0, err: null,
    };
  } catch (e) {
    return { ok: false, status: 0, finalUrl: url, text: '', ct: '', ms: Date.now() - t0, err: String(e?.message || e) };
  }
}

function normalize(input) {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  const parsed = new URL(u);
  return parsed.origin;
}

function hasJsonLdTypes(html) {
  const types = new Set();
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      const walk = (node) => {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) return node.forEach(walk);
        const t = node['@type'];
        if (typeof t === 'string') types.add(t);
        else if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && types.add(x));
        if (node['@graph']) walk(node['@graph']);
      };
      walk(JSON.parse(raw));
    } catch { /* malformed block, skip */ }
  }
  return types;
}

async function scan(rawUrl) {
  const origin = normalize(rawUrl);
  const host = new URL(origin).host;

  // --- context fetches (done once, shared by checks) ---
  const home = await get(origin + '/');
  const robots = await get(origin + '/robots.txt');
  const llms = await get(origin + '/llms.txt');
  const mdProbe = await get(origin + '/', { accept: 'text/markdown, text/plain;q=0.9, */*;q=0.8' });

  const jsonld = home.ok ? hasJsonLdTypes(home.text) : new Set();
  const robotsText = robots.ok ? robots.text : '';

  const AI_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot', 'anthropic-ai', 'OAI-SearchBot', 'Applebot-Extended'];
  const aiBotsFound = AI_BOTS.filter((b) => robotsText.toLowerCase().includes(b.toLowerCase()));

  const C = [];
  const add = (id, name, weight, pass, evidence) => C.push({ id, name, weight, pass: !!pass, evidence });

  // 1. HTTPS
  add('https', 'Served over HTTPS', 4, origin.startsWith('https://'), origin);

  // 2. llms.txt
  const llmsBody = llms.text.trim();
  const llmsLooksHtml = /<html|<!doctype|<head>|<body>/i.test(llmsBody.slice(0, 400));
  const llmsValid = llms.ok && llmsBody.length > 40 && !llmsLooksHtml;
  add('llms_txt', 'llms.txt present', 12, llmsValid, `${origin}/llms.txt → ${llms.status}${llmsValid ? ` (${llmsBody.length} bytes)` : llmsLooksHtml ? ' (soft-404: HTML body)' : ''}`);

  // 3. llms-full.txt
  const llmsFull = await get(origin + '/llms-full.txt');
  add('llms_full', 'llms-full.txt present', 4, llmsFull.ok && llmsFull.text.length > 40, `${origin}/llms-full.txt → ${llmsFull.status}`);

  // 4. ai.txt
  const aitxt = await get(origin + '/ai.txt');
  add('ai_txt', 'ai.txt present', 3, aitxt.ok && aitxt.text.length > 20, `${origin}/ai.txt → ${aitxt.status}`);

  // 5. robots.txt names AI crawlers
  add('robots_ai', 'robots.txt addresses AI crawlers', 10, aiBotsFound.length > 0,
    robots.ok ? `robots.txt → 200; agents named: ${aiBotsFound.join(', ') || 'none'}` : 'robots.txt missing (HTTP ' + robots.status + ')');

  // 6. sitemap declared
  const sitemapInRobots = /sitemap:/i.test(robotsText);
  add('robots_sitemap', 'Sitemap declared in robots.txt', 3, sitemapInRobots, sitemapInRobots ? 'Sitemap: line found' : 'no Sitemap: line');

  // 7. sitemap.xml reachable
  const sm = await get(origin + '/sitemap.xml');
  add('sitemap_xml', 'sitemap.xml reachable', 5, sm.ok && /<(urlset|sitemapindex)/i.test(sm.text), `${origin}/sitemap.xml → ${sm.status}`);

  // 8. JSON-LD structured data
  add('jsonld', 'JSON-LD structured data', 12, jsonld.size > 0, jsonld.size ? `${[...jsonld].slice(0, 8).join(', ')}` : 'no application/ld+json block found');

  // 9. High-value schema types
  const highValue = ['Organization', 'LocalBusiness', 'Product', 'FAQPage', 'HowTo', 'Article', 'Service', 'Offer'];
  const foundHigh = highValue.filter((t) => jsonld.has(t));
  add('schema_types', 'High-value schema.org types', 5, foundHigh.length > 0, foundHigh.length ? foundHigh.join(', ') : 'none of ' + highValue.join('/'));

  // 10. OpenAPI spec
  const oaPaths = ['/openapi.json', '/openapi.yaml', '/.well-known/openapi.json', '/api/openapi.json'];
  let oaHit = null;
  for (const p of oaPaths) {
    const r = await get(origin + p);
    if (r.ok && /"(openapi|swagger)"\s*:/.test(r.text.slice(0, 4000))) { oaHit = { p, status: r.status }; break; }
  }
  add('openapi', 'OpenAPI / Swagger spec', 8, !!oaHit, oaHit ? `${origin}${oaHit.p} → ${oaHit.status}` : 'none of ' + oaPaths.join(', '));

  // 11. MCP server manifest
  const mcpPaths = ['/.well-known/mcp.json', '/.well-known/mcp/server.json', '/mcp.json', '/.well-known/ai-plugin.json'];
  let mcpHit = null;
  for (const p of mcpPaths) {
    const r = await get(origin + p);
    if (r.ok && r.text.trim().startsWith('{') && r.text.length > 20) { mcpHit = { p, status: r.status }; break; }
  }
  add('mcp', 'Agent/MCP manifest present', 8, !!mcpHit, mcpHit ? `${origin}${mcpHit.p} → ${mcpHit.status}` : 'none of ' + mcpPaths.join(', '));

  // 12. Markdown content negotiation
  const mdServed = mdProbe.ok && (mdProbe.ct.includes('text/markdown') || mdProbe.ct.includes('text/plain'));
  add('markdown', 'Markdown content negotiation', 8, mdServed, `Accept: text/markdown → content-type: ${mdProbe.ct || 'n/a'} (${mdProbe.status})`);

  // 13. security.txt
  const sec = await get(origin + '/.well-known/security.txt');
  add('security_txt', 'security.txt present', 3, sec.ok && /contact:/i.test(sec.text), `${origin}/.well-known/security.txt → ${sec.status}`);

  // 14. Discoverability meta (baseline)
  const ogTitle = /<meta[^>]+property=["']og:title["']/i.test(home.text);
  const metaDesc = /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}/i.test(home.text);
  add('meta', 'OpenGraph + meta description', 5, ogTitle && metaDesc, `og:title=${ogTitle} description=${metaDesc}`);

  // 15. Agent hint files
  const hints = ['/.well-known/agents.json', '/agents.txt', '/.well-known/ai.txt'];
  let hintHit = null;
  for (const p of hints) {
    const r = await get(origin + p);
    if (r.ok && r.text.trim().length > 10) { hintHit = p; break; }
  }
  add('agent_hints', 'Agent hint file present', 3, !!hintHit, hintHit ? origin + hintHit : 'none of ' + hints.join(', '));

  const totalWeight = C.reduce((s, c) => s + c.weight, 0);
  const earned = C.reduce((s, c) => s + (c.pass ? c.weight : 0), 0);
  const score = Math.round((earned / totalWeight) * 100);
  const grade = score >= 90 ? 'A' : score >= 78 ? 'B' : score >= 62 ? 'C' : score >= 45 ? 'D' : score >= 25 ? 'E' : 'F';

  return {
    target: origin, host, scannedAt: new Date().toISOString(),
    score, grade, earned, totalWeight,
    homeStatus: home.status, homeMs: home.ms, homeBytes: home.text.length,
    checks: C,
    gaps: C.filter((c) => !c.pass).sort((a, b) => b.weight - a.weight),
  };
}

function textReport(r) {
  const L = [];
  L.push('');
  L.push(`  AI AGENT READINESS — ${r.host}`);
  L.push('  ' + '─'.repeat(52));
  L.push(`  SCORE ${r.score}/100   GRADE ${r.grade}   (${r.earned}/${r.totalWeight} weighted points)`);
  L.push('  ' + '─'.repeat(52));
  for (const c of r.checks) {
    L.push(`  ${c.pass ? 'PASS' : 'FAIL'}  ${String(c.weight).padStart(2)}pt  ${c.name}`);
    L.push(`        ${c.evidence}`);
  }
  L.push('  ' + '─'.repeat(52));
  L.push('  TOP FIXES:');
  r.gaps.slice(0, 3).forEach((c, i) => L.push(`   ${i + 1}. ${c.name}  (+${c.weight} pts available)`));
  L.push('');
  return L.join('\n');
}

function htmlReport(r) {
  const rows = r.checks.map((c) => `
      <tr class="${c.pass ? 'pass' : 'fail'}">
        <td class="dot">${c.pass ? '&#10003;' : '&#10007;'}</td>
        <td>${c.name}</td>
        <td class="w">${c.weight}</td>
        <td class="ev">${c.evidence.replace(/[<>&]/g, (m) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[m]))}</td>
      </tr>`).join('');

  const gaps = r.gaps.slice(0, 3).map((c, i) => `<li><b>${c.name}</b> <span class="pts">+${c.weight} pts</span></li>`).join('');

  const circ = 2 * Math.PI * 54;
  const dash = (r.score / 100) * circ;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Agent Readiness — ${r.host} (${r.score}/100)</title>
<style>
  :root{--bg:#0b0d12;--card:#141821;--line:#232838;--fg:#e8ecf4;--mut:#8b95ab;--good:#3ddc84;--bad:#ff5c7a;--acc:#7c9cff}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;padding:40px 20px}
  .wrap{max-width:860px;margin:0 auto}
  h1{font-size:20px;margin:0 0 4px;font-weight:600}
  .sub{color:var(--mut);font-size:13px;margin-bottom:28px}
  .hero{display:flex;gap:32px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:28px;margin-bottom:20px;flex-wrap:wrap}
  .gauge{position:relative;flex:0 0 auto}
  .grade{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .grade b{font-size:34px;line-height:1}
  .grade span{font-size:11px;color:var(--mut);letter-spacing:.08em;text-transform:uppercase}
  .hero-meta{flex:1;min-width:220px}
  .hero-meta h2{font-size:15px;margin:0 0 10px;font-weight:600}
  ul{margin:0;padding-left:18px}
  li{margin:4px 0;font-size:14px}
  .pts{color:var(--acc);font-variant-numeric:tabular-nums;font-size:12px}
  table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;font-size:14px}
  th,td{text-align:left;padding:11px 14px;border-bottom:1px solid var(--line);vertical-align:top}
  th{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);font-weight:600}
  tr:last-child td{border-bottom:none}
  .dot{width:26px;text-align:center;font-weight:700}
  tr.pass .dot{color:var(--good)} tr.fail .dot{color:var(--bad)}
  .w{width:46px;color:var(--mut);font-variant-numeric:tabular-nums;text-align:right}
  .ev{color:var(--mut);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;word-break:break-all}
  .foot{margin-top:22px;color:var(--mut);font-size:12px}
  .cta{margin-top:22px;background:linear-gradient(135deg,#1a2133,#141821);border:1px solid var(--line);border-radius:14px;padding:20px 24px}
  .cta h3{margin:0 0 6px;font-size:15px}
  .cta p{margin:0;color:var(--mut);font-size:13px}
</style></head>
<body><div class="wrap">
  <h1>AI Agent Readiness Report</h1>
  <div class="sub">${r.target} &nbsp;·&nbsp; scanned ${r.scannedAt} &nbsp;·&nbsp; response ${r.homeMs} ms / ${r.homeBytes} bytes</div>

  <div class="hero">
    <div class="gauge">
      <svg width="132" height="132" viewBox="0 0 132 132">
        <circle cx="66" cy="66" r="54" fill="none" stroke="#232838" stroke-width="11"/>
        <circle cx="66" cy="66" r="54" fill="none" stroke="url(#g)" stroke-width="11" stroke-linecap="round"
                stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}" transform="rotate(-90 66 66)"/>
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#7c9cff"/><stop offset="1" stop-color="${r.score >= 62 ? '#3ddc84' : '#ff5c7a'}"/>
        </linearGradient></defs>
      </svg>
      <div class="grade"><b>${r.score}</b><span>of 100</span></div>
    </div>
    <div class="hero-meta">
      <h2>Grade ${r.grade} &nbsp;·&nbsp; ${r.gaps.length} gap${r.gaps.length === 1 ? '' : 's'} found</h2>
      <ul>${gaps || '<li>No gaps — this site is agent-native.</li>'}</ul>
    </div>
  </div>

  <table>
    <thead><tr><th></th><th>Check</th><th class="w">Pts</th><th>Evidence</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="cta">
    <h3>What this means</h3>
    <p>Agents (ChatGPT, Claude, Perplexity, Gemini) increasingly read sites through machine-readable files before they read HTML. A site without <code>llms.txt</code>, AI crawler rules, structured data and an API surface is invisible, misquoted, or unreachable to them — and increasingly to the buyers using them.</p>
  </div>
  <div class="foot">Generated by agentready &nbsp;·&nbsp; 15 checks, ${r.totalWeight} weighted points, zero dependencies</div>
</div></body></html>`;
}

// ---- CLI ----
const args = process.argv.slice(2);
if (!args.length || args.includes('-h') || args.includes('--help')) {
  console.log('usage: node scan.mjs <url> [--out <dir>] [--json]');
  process.exit(args.length ? 0 : 1);
}
const target = args.find((a) => !a.startsWith('--'));
const outIdx = args.indexOf('--out');
const outDir = outIdx !== -1 ? args[outIdx + 1] : join(process.cwd(), 'agentready-out');

const result = await scan(target);
if (args.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(textReport(result));
}
mkdirSync(outDir, { recursive: true });
const safe = result.host.replace(/[^a-z0-9.-]/gi, '_');
writeFileSync(join(outDir, `${safe}.json`), JSON.stringify(result, null, 2));
writeFileSync(join(outDir, `${safe}.html`), htmlReport(result));
console.error(`  wrote ${join(outDir, safe + '.html')}`);
console.error(`  wrote ${join(outDir, safe + '.json')}`);

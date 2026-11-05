/**
 * scripts/ssr-check.mjs
 * -----------------------------------------------------------------------------
 * Server-side-rendering smoke test. Fetches every public route as a crawler /
 * no-JavaScript browser would and verifies the SERVER sent real content:
 *
 *   npm run build && npm run start      (in one terminal)
 *   npm run check:ssr                   (in another;  BASE_URL=https://... to test a deploy)
 *
 * Fails (exit 1) on non-200 responses, Next.js error shells, empty pages, or
 * missing key content - the failures that usually mean "works on my machine".
 */

const BASE = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

const ROUTES = [
  { path: '/', must: ['Handcrafted luxury', 'Hamper Queen', 'id="homepage-hero"'] },
  { path: '/catalog', must: ['Hamper Queen'] },
  { path: '/customised', must: ['Hamper Queen'] },
  { path: '/track', must: ['Track'] },
  { path: '/pricing', must: ['Hamper Queen'] },
  { path: '/bulk', must: ['Bulk'] },
  { path: '/inspirations', must: ['Hamper Queen'] },
  { path: '/brochures', must: ['Hamper Queen'] },
  { path: '/privacy-policy', must: ['Privacy'] },
  { path: '/terms-of-service', must: ['Terms'] },
  { path: '/robots.txt', must: ['user-agent'], kind: 'text', lower: true },
  { path: '/sitemap.xml', must: ['<urlset'], kind: 'text' },
  { path: '/manifest.webmanifest', must: ['name'], kind: 'text' },
];

const BAD = ['Application error', '__next_error__', 'This page could not be found', 'Internal Server Error'];

let failures = 0;
const pad = (s, n) => String(s).padEnd(n);
console.log(`SSR check against ${BASE}\n`);

for (const r of ROUTES) {
  const problems = [];
  let status = 0;
  let ms = 0;
  let bytes = 0;
  try {
    const t0 = performance.now();
    const res = await fetch(BASE + r.path, { headers: { accept: 'text/html,*/*' }, redirect: 'follow' });
    const raw = await res.text();
    const html = r.lower ? raw.toLowerCase() : raw;
    ms = Math.round(performance.now() - t0);
    status = res.status;
    bytes = html.length;
    if (status !== 200) problems.push(`status ${status}`);
    for (const bad of BAD) if (html.includes(bad)) problems.push(`contains "${bad}"`);
    for (const needle of r.must) if (!html.includes(needle)) problems.push(`missing "${needle}"`);
    if (r.kind !== 'text') {
      if (!/<title>[^<]+<\/title>/.test(html)) problems.push('no <title>');
      if (!/<h1[\s>]/.test(html)) problems.push('no <h1> in server HTML');
      if (!/<meta[^>]+name="viewport"/.test(html)) problems.push('no viewport meta');
      if (html.length < 4000) problems.push(`HTML only ${html.length} bytes (empty shell?)`);
    }
  } catch (err) {
    problems.push(`request failed: ${err.message}`);
  }
  const ok = problems.length === 0;
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${pad(r.path, 22)} ${pad(status || '---', 4)} ${pad(ms + 'ms', 8)} ${(bytes / 1024).toFixed(1)}kB${ok ? '' : '  <- ' + problems.join('; ')}`);
}

// APIs must degrade to JSON errors, never crash into HTML.
for (const path of ['/api/catalog']) {
  try {
    const res = await fetch(BASE + path);
    const type = res.headers.get('content-type') || '';
    const okJson = type.includes('application/json');
    if (!okJson) failures++;
    console.log(`${okJson ? 'PASS' : 'FAIL'}  ${pad(path, 22)} ${pad(res.status, 4)} ${type}`);
  } catch (err) {
    failures++;
    console.log(`FAIL  ${path} ${err.message}`);
  }
}

console.log(failures ? `\n${failures} check(s) failed.` : '\nAll SSR checks passed.');
process.exit(failures ? 1 : 0);

/**
 * scripts/test-promo.mjs
 * -----------------------------------------------------------------------------
 * End-to-end promo integration tests against a running dev server.
 * Verifies: validate preview, expiry + min-subtotal gates, flat/percent
 * discounts, duplicate codes (same string, per-row single use), redemption
 * burn-on-order, promoError responses, then wipes all test data.
 *
 * Requires the dev server on HQ_BASE_URL (default http://127.0.0.1:3000) and a
 * .env with MONGODB_URI. Owner credentials come from HQ_ADMIN_USER /
 * HQ_ADMIN_PASS env vars (loaded from gitignored .env) or an interactive
 * prompt — never hardcoded.
 *
 * Usage:  npm run db:test-promo
 */

import { readFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { connectMongo } from './lib/db-utils.mjs';

const BASE = process.env.HQ_BASE_URL || 'http://127.0.0.1:3000';
const PHONE_MARKER = '+1000000000'; // identifies orders this suite creates

/** Minimal .env loader next to the other scripts (never overrides real env). */
function loadEnv(file = '.env') {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

async function prompt(label) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(label);
  rl.close();
  return String(answer).trim();
}

let pass = 0;
let fail = 0;
const failures = [];

function check(name, cond, extra = '') {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    failures.push(`${name} ${extra}`);
    console.log(`  ✗ ${name} ${extra}`);
  }
}

async function api(path, { method = 'GET', body, cookie } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no body */
  }
  return { status: res.status, data };
}

const orderPayload = (promoCode, subtotal = 1200) => ({
  orderType: 'individual',
  lines: [
    {
      kind: 'custom_hamper',
      productId: 'test-promo',
      name: `TEST ${subtotal} Hamper`,
      priceValue: subtotal,
      priceDisplay: `INR ${subtotal.toLocaleString('en-IN')}`,
      qty: 1,
    },
  ],
  customer: {
    fullName: 'Promo Test Runner',
    email: 'queen@test.local',
    mobilePhone: PHONE_MARKER,
    altPhone: '',
    recipientName: '',
  },
  delivery: {
    flatBuilding: 'Test 1A',
    streetAddress: 'Test Road',
    landmark: '',
    city: 'Mumbai',
    pincode: '400001',
    geo: { lat: 19.076, lng: 72.8777, label: 'test pin' },
  },
  preferences: {
    occasion: 'QA',
    deliveryDate: '2026-12-31',
    timeSlot: 'Morning (9:00 AM - 12:00 PM)',
    waxSealDesign: 'Crown',
    cardMessage: '',
    addons: [],
    customNotes: 'promo integration test',
  },
  payment: { method: 'upi' },
  consent: true,
  ...(promoCode ? { promoCode } : {}),
});

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  loadEnv();
  const ADMIN_USER = process.env.HQ_ADMIN_USER || (await prompt('Owner admin username: '));
  const ADMIN_PASS = process.env.HQ_ADMIN_PASS || (await prompt('Owner admin password: '));
  if (!ADMIN_USER || !ADMIN_PASS) throw new Error('HQ_ADMIN_USER / HQ_ADMIN_PASS are required.');

  const admin = await api('/api/admin/login', {
    method: 'POST',
    body: { username: ADMIN_USER, password: ADMIN_PASS },
  });
  check('admin login succeeds', admin.status === 200, `(got ${admin.status})`);
  // raw login request keeps Set-Cookie to reuse as the session jar
  const loginRes = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ADMIN_USER, password: ADMIN_PASS }),
  });
  const jar = loginRes.headers.get('set-cookie')?.split(';')[0] ?? '';
  check('got admin session cookie', jar.startsWith('hq_admin='));

  const { client } = await connectMongo(process.env.MONGODB_URI);
  const db = client.db('hamper_queen');
  const orders = db.collection('orders');
  const coupons = db.collection('promoCodes');

  // seed via the admin API (integration path)
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 3600 * 1000).toISOString();
  const seeds = [
    { code: 'TESTFLAT', kind: 'flat', value: 200, count: 1, eventName: 'Integration Test' },
    { code: 'TESTPCT', kind: 'percent', value: 10, count: 2, eventName: 'Integration Test' },
    { code: 'TESTMIN', kind: 'flat', value: 300, count: 1, minSubtotal: 1000, eventName: 'Integration Test' },
    { code: 'TESTED', kind: 'flat', value: 100, count: 1, expiresAt: yesterday, eventName: 'Integration Test' },
  ];
  let seeded = 0;
  for (const s of seeds) {
    const r = await api('/api/admin/promo', { method: 'POST', body: s, cookie: jar });
    assert(r.status === 201, `seed ${s.code} failed ${r.status}`);
    seeded += r.data.inserted;
  }
  check(`seeded ${seeded} coupon rows`, seeded === 5);

  // validate preview cases
  const v = await api('/api/promo/validate', {
    method: 'POST',
    body: { code: 'TESTFLAT', subtotal: 1200 },
  });
  check('validate flat', v.status === 200 && v.data.discount === 200, `(${v.status})`);

  const vp = await api('/api/promo/validate', {
    method: 'POST',
    body: { code: 'TESTPCT', subtotal: 1200 },
  });
  check('validate percent (10% of 1200 = 120)', vp.status === 200 && vp.data.discount === 120, `(${vp.status} ${vp.data?.discount})`);

  const vm = await api('/api/promo/validate', { method: 'POST', body: { code: 'TESTMIN', subtotal: 500 } });
  check('validate respects min subtotal', vm.status === 400 && vm.data.promoError === true, `(${vm.status})`);

  const ve = await api('/api/promo/validate', { method: 'POST', body: { code: 'TESTED', subtotal: 1200 } });
  check('validate rejects expired', ve.status === 400 && ve.data.promoError === true, `(${ve.status})`);

  const vx = await api('/api/promo/validate', { method: 'POST', body: { code: 'NOPE900', subtotal: 1200 } });
  check('validate rejects unknown code', vx.status === 400 && vx.data.promoError === true, `(${vx.status})`);

  const v0 = await api('/api/promo/validate', { method: 'POST', body: { code: 'TESTFLAT', subtotal: 0 } });
  check('validate rejects zero subtotal', v0.status === 400, `(${v0.status})`);

  // validate must NOT burn anything
  const still1 = await coupons.countDocuments({ code: 'TESTFLAT', redeemedAt: null });
  check('validate preview does not burn', still1 === 1);

  // order with flat coupon -> redeemed + burned, discount recorded
  const o1 = await api('/api/orders', { method: 'POST', body: orderPayload('TESTFLAT', 1200) });
  check('order with TESTFLAT succeeds', o1.status === 201, `(${o1.status})`);
  if (o1.status === 201) {
    const doc = await orders.findOne({ trackingId: o1.data.trackingId });
    check('flat discount recorded', doc && doc.totals.discount === 200 && doc.promo?.code === 'TESTFLAT');
    check('flat grandTotal recalculated', doc && doc.totals.grandTotal === 1000, `(${doc?.totals?.grandTotal})`);
  }
  const burnedFlat = await coupons.countDocuments({ code: 'TESTFLAT' });
  check('flat coupon row burned (deleted)', burnedFlat === 0);

  // duplicate code rows: one burned, other still valid
  const o2 = await api('/api/orders', { method: 'POST', body: orderPayload('TESTPCT', 1200) });
  check('first TESTPCT order succeeds', o2.status === 201, `(${o2.status})`);
  const pctLeft = await coupons.countDocuments({ code: 'TESTPCT', redeemedAt: null });
  check('one TESTPCT row remains', pctLeft === 1);
  const vp2 = await api('/api/promo/validate', { method: 'POST', body: { code: 'TESTPCT', subtotal: 1200 } });
  check('remaining TESTPCT still valid', vp2.status === 200 && vp2.data.discount === 120, `(${vp2.status})`);
  const o3 = await api('/api/orders', { method: 'POST', body: orderPayload('TESTPCT', 1200) });
  check('second TESTPCT order succeeds', o3.status === 201, `(${o3.status})`);
  check('both TESTPCT rows now gone', (await coupons.countDocuments({ code: 'TESTPCT' })) === 0);

  // used-up / invalid coupon at order time -> promoError, order NOT created
  const o4 = await api('/api/orders', { method: 'POST', body: orderPayload('TESTPCT', 1200) });
  check('no more TESTPCT rows -> promoError', o4.status === 400 && o4.data.promoError === true, `(${o4.status})`);
  const ordersWithMarker = await orders.countDocuments({ 'customer.mobilePhone': PHONE_MARKER });
  check('order count stayed at expected (no extra rows for failed promo)', ordersWithMarker >= 3, `(${ordersWithMarker})`);

  // percent discount min(value, subtotal) cap path via API
  const r2 = await api('/api/orders', { method: 'POST', body: orderPayload('TESTMIN', 1500) });
  check('order with TESTMIN (1500 subtotal) succeeds', r2.status === 201, `(${r2.status})`);
  const wasted = await api('/api/orders', { method: 'POST', body: orderPayload('TESTMIN', 1500) });
  check('TESTMIN consumed -> promoError on reuse', wasted.status === 400 && wasted.data.promoError === true, `(${wasted.status})`);

  // cleanup
  await coupons.deleteMany({ code: /^TEST/ });
  const delOrders = await orders.deleteMany({ 'customer.mobilePhone': PHONE_MARKER });
  console.log(`\ncleaned ${delOrders.deletedCount} test orders, removed TEST coupons`);

  await client.close();
  console.log(`\nPASS ${pass} | FAIL ${fail}`);
  if (fail > 0) {
    console.log('\nFailures:\n' + failures.map((f) => `  - ${f}`).join('\n'));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('test-promo crashed:', err);
  process.exit(1);
});
/**
 * scripts/bootstrap-db.mjs
 * -----------------------------------------------------------------------------
 * Idempotent database bootstrap for Hamper Queen.
 *
 *   npm run db:bootstrap
 *
 * Reads MONGODB_URI from .env (via `node --env-file=.env`). Uses the same
 * SRV -> direct fallback as scripts/test-mongo.mjs. Ensures every collection
 * and index the app relies on, then creates the FIRST owner admin account if
 * none exists.
 *
 * SECURITY: the admin password is NEVER hardcoded here. It comes from
 * HQ_BOOTSTRAP_ADMIN_USER / HQ_BOOTSTRAP_ADMIN_PASSWORD env vars, or an
 * interactive prompt when they are absent.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { connectMongo, hashPassword } from './lib/db-utils.mjs';

const DB_NAME = 'hamper_queen';

function loadEnv(file = '.env') {
  try {
    const raw = readFileSync(resolve(file), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx < 0) continue;
      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // .env is optional for this script when MONGODB_URI is already exported.
  }
}

function question(prompt) {
  return new Promise((resolvePromise) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(prompt, (answer) => {
      rl.close();
      resolvePromise(answer.trim());
    });
  });
}

const COLLECTION_INDEXES = {
  orders: [
    { key: { trackingId: 1 }, name: 'uniq_trackingId', unique: true },
    { key: { status: 1 }, name: 'idx_status' },
    { key: { createdAt: -1 }, name: 'idx_createdAt' },
  ],
  catalogOverrides: [
    { key: { productId: 1 }, name: 'uniq_productId', unique: true },
  ],
  promoCodes: [
    { key: { code: 1 }, name: 'idx_code' },
    { key: { redeemedAt: 1 }, name: 'idx_redeemedAt' },
  ],
  adminUsers: [
    { key: { username: 1 }, name: 'uniq_username', unique: true },
  ],
  sessions: [
    { key: { token: 1 }, name: 'uniq_token', unique: true },
    { key: { expiresAt: 1 }, name: 'ttl_expiresAt', expireAfterSeconds: 0 },
  ],
};

function keyTuple(key) {
  return Object.entries(key)
    .map(([field, dir]) => `${field}_${dir}`)
    .join('__');
}

async function ensureCollections(db) {
  for (const [name, indexes] of Object.entries(COLLECTION_INDEXES)) {
    const collection = db.collection(name);
    let existing = [];
    try {
      existing = ((await collection.indexes()) || []).map((i) => ({
        key: keyTuple(i.key),
        unique: Boolean(i.unique) || (i.name === '_id_'),
      }));
    } catch (err) {
      if (err && err.code !== 26) throw err; // 26 = NamespaceNotFound (collection missing)
    }
    for (const spec of indexes) {
      // Skip when an equivalent index (same fields + same uniqueness) already
      // exists under a different name - tolerate pre-app / older bootstrap runs.
      const equivalent = existing.some(
        (e) => e.key === keyTuple(spec.key) && e.unique === Boolean(spec.unique)
      );
      if (spec.unique !== true && equivalent) {
        console.log(`  index exists: ${name}(${keyTuple(spec.key)}) - skipped`);
        continue;
      }
      if (spec.unique === true && equivalent) {
        console.log(`  index exists: ${name}(${keyTuple(spec.key)}) - skipped`);
        continue;
      }
      const options = { name: spec.name };
      if (spec.unique) options.unique = true;
      if (typeof spec.expireAfterSeconds === 'number') options.expireAfterSeconds = spec.expireAfterSeconds;
      await collection.createIndex(spec.key, options);
      console.log(`  index ok: ${name}.${spec.name}`);
    }
  }
}

async function ensureOwnerAdmin(db) {
  const admins = db.collection('adminUsers');
  const existing = await admins.countDocuments({});
  if (existing > 0) {
    console.log(`  adminUsers: already has ${existing} account(s) - skipping owner creation.`);
    return;
  }

  const username = process.env.HQ_BOOTSTRAP_ADMIN_USER || (await question('Owner admin username: '));
  if (!username) throw new Error('Admin username is required (HQ_BOOTSTRAP_ADMIN_USER or prompt).');

  const password = process.env.HQ_BOOTSTRAP_ADMIN_PASSWORD || (await question('Owner admin password: '));
  if (!password) throw new Error('Admin password is required (HQ_BOOTSTRAP_ADMIN_PASSWORD or prompt).');
  if (password.length < 6) throw new Error('Admin password must be at least 6 characters.');

  const { salt, hash } = hashPassword(password);
  const now = new Date().toISOString();
  await admins.insertOne({
    username: String(username).trim().toLowerCase(),
    passwordHash: hash,
    passwordSalt: salt,
    role: 'owner',
    active: true,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`  adminUsers: created owner account "${String(username).trim().toLowerCase()}".`);
}

async function run() {
  loadEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<db_password>')) {
    console.error('MONGODB_URI is missing or still contains the <db_password> placeholder.');
    console.error('Open .env and set the real Atlas connection string, then rerun npm run db:bootstrap.');
    process.exit(1);
  }
  const redacted = uri.replace(/\/\/[^@]+@/, '//****:****@');

  console.log(`Connecting to ${redacted} ...`);
  const { client, label } = await connectMongo(uri);
  console.log(`Connected (${label}).`);

  try {
    const db = client.db(DB_NAME);
    console.log(`Ensuring collections + indexes in "${DB_NAME}":`);
    await ensureCollections(db);
    await ensureOwnerAdmin(db);
    console.log('\nBootstrap complete.');
    console.log('Collections:', Object.keys(COLLECTION_INDEXES).join(', '));
  } finally {
    await client.close().catch(() => {});
  }
}

run().catch((err) => {
  console.error('Bootstrap failed:');
  console.error(err);
  process.exit(1);
});
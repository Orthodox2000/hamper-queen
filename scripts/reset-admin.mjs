/**
 * scripts/reset-admin.mjs
 * -----------------------------------------------------------------------------
 * Create or reset an admin login directly in MongoDB. Use it when you forgot
 * the owner password, bootstrapped with a throwaway password, or the owner was
 * never created.
 *
 *   npm run db:reset-admin
 *   HQ_RESET_ADMIN_USER=supriya HQ_RESET_ADMIN_PASSWORD='a-long-passphrase' npm run db:reset-admin
 *   HQ_ENV_FILE=.env.production node --env-file=.env.production scripts/reset-admin.mjs
 *
 * - Existing user  -> password replaced, account re-activated, all of that user's sessions revoked.
 * - New user       -> created as "owner" when the collection has no owner yet, otherwise "admin".
 * - Password is read from HQ_RESET_ADMIN_PASSWORD or typed at a hidden prompt (min 8 chars).
 * - Uses the same scrypt format as src/lib/auth.ts, so the login form accepts it immediately.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { connectMongo, getDbName, hashPassword } from './lib/db-utils.mjs';

const ENV_FILE = process.env.HQ_ENV_FILE || '.env';

function loadEnv(file = ENV_FILE) {
  try {
    for (const line of readFileSync(resolve(file), 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i < 0) continue;
      const key = t.slice(0, i).trim();
      let value = t.slice(i + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    /* .env optional when variables are exported */
  }
}

function ask(prompt, { hidden = false } = {}) {
  return new Promise((done) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(prompt)) process.stdout.write(s);
      };
    }
    rl.question(prompt, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      done(answer);
    });
  });
}

async function run() {
  loadEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<db_password>')) {
    console.error('MONGODB_URI is missing or still has the <db_password> placeholder.');
    process.exit(1);
  }

  const username = String(process.env.HQ_RESET_ADMIN_USER || (await ask('Admin username to create/reset: '))).trim().toLowerCase();
  if (!/^[a-z0-9_.-]{3,40}$/.test(username)) {
    console.error('Username must be 3-40 chars using a-z, 0-9, dot, underscore or dash.');
    process.exit(1);
  }
  const password = process.env.HQ_RESET_ADMIN_PASSWORD || (await ask('New password (min 8 chars, hidden): ', { hidden: true }));
  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  const { client, label } = await connectMongo(uri);
  console.log(`Connected (${label}) to database "${getDbName()}".`);
  try {
    const db = client.db(getDbName());
    const admins = db.collection('adminUsers');
    const { salt, hash } = hashPassword(password);
    const now = new Date().toISOString();
    const existing = await admins.findOne({ username });

    if (existing) {
      await admins.updateOne({ _id: existing._id }, { $set: { passwordHash: hash, passwordSalt: salt, active: true, updatedAt: now } });
      const revoked = await db.collection('sessions').deleteMany({ username });
      console.log(`Password reset for "${username}" (role: ${existing.role ?? 'admin'}); ${revoked.deletedCount} old session(s) revoked.`);
    } else {
      const hasOwner = (await admins.countDocuments({ role: 'owner' })) > 0;
      await admins.insertOne({ username, passwordHash: hash, passwordSalt: salt, role: hasOwner ? 'admin' : 'owner', active: true, createdAt: now, updatedAt: now });
      console.log(`Created "${username}" as ${hasOwner ? 'admin' : 'owner'}.`);
    }
    console.log('Done. Sign in at /admin with that username (case-insensitive) and the new password.');
  } finally {
    await client.close().catch(() => {});
  }
}

run().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});

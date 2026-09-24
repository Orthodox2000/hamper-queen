/**
 * scripts/lib/db-utils.mjs
 * -----------------------------------------------------------------------------
 * Shared helpers for the standalone Node scripts: Mongo connection (with the
 * same SRV -> direct fallback used by scripts/test-mongo.mjs) and scrypt
 * password hashing compatible with src/lib/auth.ts.
 */

import { MongoClient, ServerApiVersion } from 'mongodb';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SHARD_HOSTS = [
  'ac-apeuakp-shard-00-00.jma7vfa.mongodb.net:27017',
  'ac-apeuakp-shard-00-01.jma7vfa.mongodb.net:27017',
  'ac-apeuakp-shard-00-02.jma7vfa.mongodb.net:27017',
];

/** Rewrite a mongodb+srv URI into a direct mongodb URI (no DNS SRV/TXT lookup). */
export function toDirectUri(srv) {
  const withoutScheme = srv.replace(/^mongodb\+srv:\/\//, '');
  const [authority, query] = withoutScheme.split('?');
  const parts = authority.split('@');
  const credentials = parts.slice(0, parts.length - 1).join('@');
  const querySuffix = query ? `&${query}` : '';
  return `mongodb://${credentials}@${SHARD_HOSTS.join(',')}/?ssl=true&retryWrites=true&w=majority${querySuffix}`;
}

function isSrvDnsError(err) {
  const code = err && err.code ? err.code : '';
  const msg = err && err.message ? err.message : '';
  return code === 'ECONNREFUSED' && (msg.includes('querySrv') || msg.includes('queryTxt'));
}

/** Connect to the cluster, returning the MongoClient (already connected). */
export async function connectMongo(uri) {
  const first = uri.startsWith('mongodb+srv://');
  const attempts = first ? [uri, toDirectUri(uri)] : [uri];
  const labels = first ? ['mongodb+srv', 'direct fallback'] : ['mongodb'];
  let lastErr = null;

  for (let i = 0; i < attempts.length; i++) {
    const client = new MongoClient(attempts[i], {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 8000,
    });
    try {
      await client.connect();
      await client.db('admin').command({ ping: 1 });
      return { client, label: labels[i] };
    } catch (err) {
      lastErr = err;
      await client.close().catch(() => {});
      const last = i >= attempts.length - 1;
      if (last) throw err;
      if (!isSrvDnsError(err)) throw err;
      console.error(`  ${labels[i]} failed (${err.code}) - retrying with ${labels[i + 1]}.`);
    }
  }
  throw lastErr;
}

/** scrypt hash + salt, hex encoded. Format shared with src/lib/auth.ts. */
export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return { salt, hash: scryptSync(String(password), salt, 64).toString('hex') };
}

/** Constant-time password check against a stored salt+hash. */
export function verifyPassword(password, salt, expectedHash) {
  const candidate = scryptSync(String(password), String(salt), 64);
  const expected = Buffer.from(String(expectedHash), 'hex');
  return expected.length === candidate.length && timingSafeEqual(candidate, expected);
}
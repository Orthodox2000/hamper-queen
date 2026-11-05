/**
 * mongo.ts
 * -----------------------------------------------------------------------------
 * Singleton Mongo client for the Hamper Queen database. Mirrors the connection
 * strategy in scripts/test-mongo.mjs: tries `mongodb+srv://` first, and when a
 * local DNS refuses SRV/TXT lookups it falls back to a direct `mongodb://` URI
 * resolved from the known shard hosts.
 *
 * Every consumer guards with try/catch because MongoDB may be unreachable at
 * runtime (the storefront must degrade gracefully to static data / clear errors).
 */

import { MongoClient, ServerApiVersion, Db, Collection } from 'mongodb';

/** Database name. Override with MONGODB_DB (defaults to the production name). */
const DB_NAME = process.env.MONGODB_DB?.trim() || 'hamper_queen';

/**
 * Direct shard hosts used ONLY as a fallback when a network blocks the SRV/TXT DNS
 * lookups behind `mongodb+srv://`. Override with MONGODB_DIRECT_HOSTS=host1:27017,host2:27017
 * if you move to a different Atlas cluster.
 */
const SHARD_HOSTS = (process.env.MONGODB_DIRECT_HOSTS?.split(',').map((h) => h.trim()).filter(Boolean)) || [
  'ac-apeuakp-shard-00-00.jma7vfa.mongodb.net:27017',
  'ac-apeuakp-shard-00-01.jma7vfa.mongodb.net:27017',
  'ac-apeuakp-shard-00-02.jma7vfa.mongodb.net:27017',
];

/** Rewrite a mongodb+srv URI into a direct mongodb URI (no DNS SRV/TXT lookup). */
function toDirectUri(srv: string): string {
  const withoutScheme = srv.replace(/^mongodb\+srv:\/\//, '');
  const [authority, query] = withoutScheme.split('?');
  const parts = authority.split('@');
  const credentials = parts.slice(0, parts.length - 1).join('@');
  const querySuffix = query ? `&${query}` : '';
  return `mongodb://${credentials}@${SHARD_HOSTS.join(',')}/?ssl=true&retryWrites=true&w=majority${querySuffix}`;
}

function isSrvDnsError(err: unknown): boolean {
  const code = (err as { code?: string })?.code ?? '';
  const msg = (err as { message?: string })?.message ?? '';
  return code === 'ECONNREFUSED' && (msg.includes('querySrv') || msg.includes('queryTxt'));
}

let clientPromise: Promise<MongoClient> | null = null;

function makeClient(uri: string): MongoClient {
  return new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 8000,
  });
}

async function getClient(): Promise<MongoClient> {
  if (clientPromise) return clientPromise;

  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<db_password>')) {
    throw new Error('MONGODB_URI is missing or still contains the <db_password> placeholder.');
  }

  clientPromise = (async () => {
    const candidates: Array<MongoClient> = uri.startsWith('mongodb+srv://')
      ? [makeClient(uri), makeClient(toDirectUri(uri))]
      : [makeClient(uri)];

    let lastErr: unknown = null;
    for (const client of candidates) {
      try {
        await client.connect();
        await client.db('admin').command({ ping: 1 });
        return client;
      } catch (err) {
        lastErr = err;
        await client.close().catch(() => {});
        if (!isSrvDnsError(err)) throw err;
      }
    }
    throw lastErr;
  })();

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(DB_NAME);
}

export async function getOrdersCollection() {
  const db = await getDb();
  const col = db.collection('orders');
  await ensureIndex(col, { trackingId: 1 }, { name: 'uniq_trackingId', unique: true });
  await ensureIndex(col, { status: 1 }, { name: 'idx_status' });
  await ensureIndex(col, { createdAt: -1 }, { name: 'idx_createdAt' });
  return col;
}

export async function getCatalogOverridesCollection() {
  const db = await getDb();
  const col = db.collection('catalogOverrides');
  await ensureIndex(col, { productId: 1 }, { name: 'uniq_productId', unique: true });
  return col;
}

export async function getPromoCodesCollection() {
  const db = await getDb();
  const col = db.collection('promoCodes');
  await ensureIndex(col, { code: 1 }, { name: 'idx_code' });
  await ensureIndex(col, { redeemedAt: 1 }, { name: 'idx_redeemedAt' });
  return col;
}

export async function getAdminUsersCollection() {
  const db = await getDb();
  const col = db.collection('adminUsers');
  await ensureIndex(col, { username: 1 }, { name: 'uniq_username', unique: true });
  return col;
}

/** Server codes meaning "this server does not implement TTL indexes". */
const TTL_UNSUPPORTED = new Set([238, 115, 59]);
/** 85 = same keys, different name; 86 = same name, different options. Either way an equivalent index exists. */
const INDEX_CONFLICT = new Set([85, 86]);
const ensuredIndexes = new Set<string>();
let warnedNoTtl = false;

/**
 * Create an index once per process.
 *  - Index names match scripts/bootstrap-db.mjs, so a freshly bootstrapped database and an
 *    app-created one converge on the same names.
 *  - If an equivalent index already exists under another name (databases created before names
 *    were standardised) the conflict is accepted instead of failing the request.
 *  - TTL indexes are housekeeping only (auth.ts also rejects expired sessions on read), so servers
 *    without TTL support must not break login.
 */
async function ensureIndex(col: Collection, key: Record<string, 1 | -1>, options: { name: string; unique?: boolean; expireAfterSeconds?: number }) {
  const id = `${col.collectionName}:${options.name}`;
  if (ensuredIndexes.has(id)) return;
  try {
    await col.createIndex(key, options);
  } catch (err) {
    const code = (err as { code?: number }).code;
    if (typeof code === 'number' && INDEX_CONFLICT.has(code)) {
      // equivalent index already present
    } else if (typeof code === 'number' && TTL_UNSUPPORTED.has(code) && options.expireAfterSeconds !== undefined) {
      if (!warnedNoTtl) {
        warnedNoTtl = true;
        console.warn('[mongo] TTL indexes are not supported by this server; expired sessions are only rejected, not purged.');
      }
    } else {
      throw err;
    }
  }
  ensuredIndexes.add(id);
}

export async function getSessionsCollection() {
  const db = await getDb();
  const col = db.collection('sessions');
  await ensureIndex(col, { token: 1 }, { name: 'uniq_token', unique: true });
  await ensureIndex(col, { expiresAt: 1 }, { name: 'ttl_expiresAt', expireAfterSeconds: 0 });
  return col;
}

export { DB_NAME };
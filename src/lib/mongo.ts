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

import { MongoClient, ServerApiVersion, Db } from 'mongodb';

const DB_NAME = 'hamper_queen';

const SHARD_HOSTS = [
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
  await col.createIndex({ trackingId: 1 }, { unique: true });
  await col.createIndex({ status: 1 });
  await col.createIndex({ createdAt: -1 });
  return col;
}

export async function getCatalogOverridesCollection() {
  const db = await getDb();
  const col = db.collection('catalogOverrides');
  await col.createIndex({ productId: 1 }, { unique: true });
  return col;
}

export { DB_NAME };
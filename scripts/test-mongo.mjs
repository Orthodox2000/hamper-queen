/**
 * MongoDB Atlas connection test for Hamper Queen.
 *
 * Usage:
 *   npm run db:test
 *
 * Reads MONGODB_URI from .env (Next.js-compatible). Replace the
 * <db_password> placeholder in .env with your real Atlas password first.
 *
 * Known quirk: some home/office DNS servers (e.g. a router at 192.168.1.1)
 * REFUSE SRV/TXT queries, which breaks the `mongodb+srv://` scheme with
 * "querySrv ECONNREFUSED". This script detects that and automatically retries
 * with a direct `mongodb://` URI (same credentials, ssl=true) whose shard
 * hostnames were resolved from the SRV record. If Atlas re-creates your
 * cluster, refresh the SHARD_HOSTS list below to match the new SRV answers.
 */
import { MongoClient, ServerApiVersion } from 'mongodb';

const SHARD_HOSTS = [
  'ac-apeuakp-shard-00-00.jma7vfa.mongodb.net:27017',
  'ac-apeuakp-shard-00-01.jma7vfa.mongodb.net:27017',
  'ac-apeuakp-shard-00-02.jma7vfa.mongodb.net:27017',
];

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://ankit:<db_password>@cluster0.jma7vfa.mongodb.net/?appName=Cluster0';

if (uri.includes('<db_password>')) {
  console.error('MONGODB_URI still contains the <db_password> placeholder.');
  console.error('Open .env and replace <db_password> with your Atlas database user password, then rerun this command.');
  process.exit(1);
}

const redacted = uri.replace(/\/\/[^@]+@/, '//****:****@');

/** Rewrite a mongodb+srv URI into a direct mongodb URI (no DNS SRV/TXT lookup). */
function toDirectUri(srv) {
  const withoutScheme = srv.replace(/^mongodb\+srv:\/\//, '');
  const [authority, query] = withoutScheme.split('?');
  const parts = authority.split('@');
  const credentials = parts.slice(0, parts.length - 1).join('@'); // userid:password (may contain escaped @)
  const querySuffix = query ? `&${query}` : '';
  return `mongodb://${credentials}@${SHARD_HOSTS.join(',')}/?ssl=true&retryWrites=true&w=majority${querySuffix}`;
}

function isSrvDnsError(err) {
  const code = err && err.code ? err.code : '';
  const msg = err && err.message ? err.message : '';
  return code === 'ECONNREFUSED' && (msg.includes('querySrv') || msg.includes('queryTxt'));
}

async function ping(client, label) {
  await client.connect();
  await client.db('admin').command({ ping: 1 });
  console.log(`Connected (${label}): ${redacted}`);
  console.log('Pinged your deployment. You successfully connected to MongoDB!');
}

async function run() {
  const first = uri.startsWith('mongodb+srv://');
  const labels = first ? ['mongodb+srv', 'direct fallback'] : ['mongodb'];
  const attempts = first ? [uri, toDirectUri(uri)] : [uri];

  for (let i = 0; i < attempts.length; i++) {
    const client = new MongoClient(attempts[i], {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    });
    try {
      await ping(client, labels[i]);
      return;
    } catch (err) {
      const last = i >= attempts.length - 1;
      if (last) {
        throw err;
      }
      if (isSrvDnsError(err)) {
        console.error('mongodb+srv DNS lookup failed — retrying with a direct connection URI.');
      } else {
        throw err; // wrong password / network error: surface the real cause
      }
    } finally {
      await client.close().catch(() => {});
    }
  }
}

run().catch((err) => {
  console.error('MongoDB connection ping failed:');
  console.error(err);
  process.exit(1);
});
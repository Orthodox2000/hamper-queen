/**
 * MongoDB Atlas connection test for Hamper Queen.
 *
 * Usage:
 *   npm run db:test
 *
 * Reads MONGODB_URI from .env (Next.js-compatible). Replace the
 * <db_password> placeholder in .env with your real Atlas password first.
 */
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://ankit:<db_password>@cluster0.jma7vfa.mongodb.net/?appName=Cluster0';

if (uri.includes('<db_password>')) {
  console.error('MONGODB_URI still contains the <db_password> placeholder.');
  console.error('Open .env and replace <db_password> with your Atlas database user password, then rerun this command.');
  process.exit(1);
}

const redacted = uri.replace(/\/\/[^@]+@/, '//****:****@');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(`Connected: ${redacted}`);
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection ping failed:');
    console.error(err);
    process.exit(1);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
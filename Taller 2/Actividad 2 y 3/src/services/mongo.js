const { MongoClient, ServerApiVersion } = require('mongodb');

let cached = { client: null, db: null, connecting: null };

async function connect() {
  if (cached.db) return cached.db;
  if (cached.connecting) return cached.connecting;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'pii_vault';
  if (!uri) throw new Error('MONGODB_URI no está definido en .env');

  const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });

  cached.connecting = client.connect().then(async () => {
    const db = client.db(dbName);
    cached.client = client;
    cached.db = db;
    return db;
  });

  return cached.connecting;
}

async function getDb() {
  return await connect();
}

module.exports = { getDb };






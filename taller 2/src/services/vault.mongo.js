const crypto = require('crypto');
const { getDb } = require('./mongo');
const { encrypt, decrypt } = require('./crypto');

function hashValue(value, type) {
  return crypto.createHash('sha256').update(`${type}::${value}`).digest('hex');
}

async function ensureIndexes(col) {
  await col.createIndex({ type: 1, value_hash: 1 }, { unique: true, name: 'uniq_type_valuehash' });
  await col.createIndex({ type: 1, token: 1 }, { unique: true, name: 'uniq_type_token' });
}

async function getCollection() {
  const db = await getDb();
  const col = db.collection('pii_vault');
  await ensureIndexes(col);
  return col;
}

async function upsertOriginal({ type, value, token }) {
  const col = await getCollection();
  const value_hash = hashValue(value, type);
  const now = new Date().toISOString();
  const { iv, authTag, ciphertext } = encrypt(value);
  await col.updateOne(
    { type, value_hash },
    { $setOnInsert: { type, value_hash, token, iv, auth_tag: authTag, ciphertext, created_at: now } },
    { upsert: true }
  );
}

async function getOriginalByToken({ type, token }) {
  const col = await getCollection();
  const doc = await col.findOne({ type, token }, { projection: { iv: 1, auth_tag: 1, ciphertext: 1 } });
  if (!doc) return null;
  return decrypt({ iv: doc.iv, authTag: doc.auth_tag, ciphertext: doc.ciphertext });
}

module.exports = { upsertOriginal, getOriginalByToken };

async function listAll({ limit = 50, decryptOriginal = false } = {}) {
  const col = await getCollection();
  const cursor = col.find({}, { projection: { type: 1, token: 1, created_at: 1, iv: 1, auth_tag: 1, ciphertext: 1 } }).limit(limit).sort({ created_at: -1 });
  const results = [];
  for await (const doc of cursor) {
    results.push({
      type: doc.type,
      token: doc.token,
      created_at: doc.created_at,
      original: decryptOriginal ? decrypt({ iv: doc.iv, authTag: doc.auth_tag, ciphertext: doc.ciphertext }) : undefined,
    });
  }
  return results;
}

module.exports.listAll = listAll;



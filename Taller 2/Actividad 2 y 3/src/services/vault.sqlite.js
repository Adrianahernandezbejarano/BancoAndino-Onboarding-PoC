const Database = require('better-sqlite3');
const crypto = require('crypto');
const { encrypt, decrypt } = require('./crypto');

// Inicializa DB (archivo local)
const DB_PATH = process.env.VAULT_DB_PATH || 'vault.db';
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS pii_vault (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,                 -- 'email' | 'phone' | 'name'
  value_hash TEXT NOT NULL,           -- sha256(type::value)
  token TEXT NOT NULL,                -- token de 8 chars
  iv TEXT NOT NULL,                   -- iv hex AES-GCM
  auth_tag TEXT NOT NULL,             -- authTag hex AES-GCM
  ciphertext TEXT NOT NULL,           -- valor original cifrado
  created_at TEXT NOT NULL            -- ISO timestamp
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_value ON pii_vault(type, value_hash);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_token ON pii_vault(type, token);
`);

function hashValue(value, type) {
  return crypto.createHash('sha256').update(`${type}::${value}`).digest('hex');
}

function upsertOriginal({ type, value, token }) {
  const valueHash = hashValue(value, type);
  const now = new Date().toISOString();
  const { iv, authTag, ciphertext } = encrypt(value);

  const insert = db.prepare(`
    INSERT INTO pii_vault(type, value_hash, token, iv, auth_tag, ciphertext, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(type, value_hash) DO NOTHING
  `);
  insert.run(type, valueHash, token, iv, authTag, ciphertext, now);

  const upsertToken = db.prepare(`
    INSERT OR IGNORE INTO pii_vault(type, value_hash, token, iv, auth_tag, ciphertext, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  upsertToken.run(type, valueHash, token, iv, authTag, ciphertext, now);
}

function getOriginalByToken({ type, token }) {
  const row = db.prepare(`SELECT iv, auth_tag, ciphertext FROM pii_vault WHERE type = ? AND token = ?`).get(type, token);
  if (!row) return null;
  return decrypt({ iv: row.iv, authTag: row.auth_tag, ciphertext: row.ciphertext });
}

module.exports = { upsertOriginal, getOriginalByToken };

function listAll({ limit = 50, decryptOriginal = false } = {}) {
  const rows = db.prepare(`SELECT type, token, iv, auth_tag, ciphertext, created_at FROM pii_vault ORDER BY created_at DESC LIMIT ?`).all(limit);
  return rows.map((r) => ({
    type: r.type,
    token: r.token,
    created_at: r.created_at,
    original: decryptOriginal ? decrypt({ iv: r.iv, authTag: r.auth_tag, ciphertext: r.ciphertext }) : undefined,
  }));
}

module.exports.listAll = listAll;



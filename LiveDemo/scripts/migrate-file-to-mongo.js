'use strict';

require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { connectToMongoDB, disconnectFromMongoDB } = require('../src/lib/mongodb');
const Token = require('../src/models/Token');

async function migrate() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const storageFilePath = process.env.STORAGE_FILE_PATH || path.join(process.cwd(), 'vault-storage.json');

  if (!mongoUri) {
    console.error('MONGODB_URI not set. Please set it in your .env');
    process.exit(1);
  }

  if (!fs.existsSync(storageFilePath)) {
    console.log(`No file storage found at ${storageFilePath}. Nothing to migrate.`);
    return;
  }

  // Read file
  const raw = fs.readFileSync(storageFilePath, 'utf8');
  const json = raw ? JSON.parse(raw) : { tokens: {} };
  const entries = Object.entries(json.tokens || {});

  if (entries.length === 0) {
    console.log('No tokens found in file. Nothing to migrate.');
    return;
  }

  let migrated = 0;
  let failed = 0;

  try {
    await connectToMongoDB(mongoUri);

    for (const [token, value] of entries) {
      try {
        await Token.upsertToken(token, value.v, value.m || {});
        migrated += 1;
      } catch (err) {
        failed += 1;
        console.error(`Failed to migrate token ${token}:`, err.message);
      }
    }

    console.log(`✅ Migration completed. Migrated: ${migrated}, Failed: ${failed}`);
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exitCode = 1;
  } finally {
    try {
      await disconnectFromMongoDB();
    } catch (_) {}
  }
}

migrate();

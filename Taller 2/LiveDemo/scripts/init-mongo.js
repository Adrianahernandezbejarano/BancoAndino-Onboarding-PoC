'use strict';

require('dotenv').config();

const { connectToMongoDB, disconnectFromMongoDB } = require('../src/lib/mongodb');
const Token = require('../src/models/Token');

async function init() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set. Please set it in your .env');
    process.exit(1);
  }

  try {
    await connectToMongoDB(mongoUri);

    // Ensure collection exists and indexes are created
    await Token.init(); // builds indexes defined in the schema

    console.log('✅ MongoDB initialized: collection and indexes ensured');
  } catch (err) {
    console.error('❌ Failed to initialize MongoDB:', err.message);
    process.exitCode = 1;
  } finally {
    try {
      await disconnectFromMongoDB();
    } catch (_) {}
  }
}

init();

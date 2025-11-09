'use strict';

const path = require('path');
const dotenv = require('dotenv');

function loadConfig() {
  dotenv.config();
  const masterKey = process.env.VAULT_MASTER_KEY;
  const apiKey = process.env.API_KEY || '';
  const port = Number(process.env.PORT || 3000);
  const storageFilePath = process.env.STORAGE_FILE_PATH || path.join(process.cwd(), 'vault-storage.json');

  // Configuración de MongoDB
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || '';
  const storageType = process.env.STORAGE_TYPE || 'file'; // 'file' o 'mongodb'

  if (!masterKey || masterKey.length < 32) {
    throw new Error('VAULT_MASTER_KEY must be set and at least 32 characters');
  }

  // Validar que si se usa MongoDB, se proporcione la URI
  if (storageType === 'mongodb' && !mongoUri) {
    throw new Error('MONGODB_URI must be set when STORAGE_TYPE=mongodb');
  }

  return {
    masterKey,
    apiKey,
    port,
    storageFilePath,
    storageType, // 'file' o 'mongodb'
    mongoUri // URI de conexión a MongoDB
  };
}

function requireApiKey(expectedKey) {
  return (req, res, next) => {
    if (!expectedKey) return next();
    const provided = req.header('x-api-key');
    if (!provided || provided !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
}

module.exports = { loadConfig, requireApiKey };



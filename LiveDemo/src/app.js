'use strict';

const express = require('express');
const helmet = require('helmet');
const crypto = require('crypto');
const { loadConfig, requireApiKey } = require('./lib/config');
const { createVaultService } = require('./lib/vault');
const { anonymizeText, deanonymizeText } = require('./lib/text');
const { connectToMongoDB } = require('./lib/mongodb');

/**
 * Inicializa la aplicación y configura el almacenamiento
 * Si se usa MongoDB, establece la conexión antes de crear el vault service
 */
async function buildApp() {
  const app = express();
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));

  const config = loadConfig();

  // Si se usa MongoDB, conectar antes de crear el vault service
  if (config.storageType === 'mongodb') {
    try {
      await connectToMongoDB(config.mongoUri);
      console.log('✅ MongoDB connection established');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      throw new Error(`MongoDB connection failed: ${error.message}`);
    }
  }

  const vault = createVaultService({
    storageFilePath: config.storageFilePath,
    masterKey: config.masterKey,
    storageType: config.storageType
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Demo endpoint: free-text anonymization with short, non-reversible 8-hex tokens
  // Contract:
  //   POST /anonymize-demo
  //   { "message": "..." }
  //   -> { "anonymizedMessage": "..." }
  app.post('/anonymize-demo', async (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
      const { message } = payload;
      if (typeof message !== 'string') {
        return res.status(400).json({ error: 'Missing message string' });
      }

      const shortHashTokenize = async (value /*, metadata */) => {
        const h = crypto.createHash('sha256').update(String(value)).digest('hex');
        return h.slice(0, 8); // 8-hex demo token
      };

      const { text } = await anonymizeText(message, { tokenize: shortHashTokenize });
      res.json({ anonymizedMessage: text });
    } catch (err) {
      res.status(500).json({ error: 'Internal error' });
    }
  });

  app.post('/anonymize', requireApiKey(config.apiKey), async (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
      const { data, piiFields } = payload;
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Missing data object' });
      }
      const result = await vault.anonymizeObject(data, { piiFields });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Internal error' });
    }
  });

  app.post('/deanonymize', requireApiKey(config.apiKey), async (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
      const { data } = payload;
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Missing data object' });
      }
      const result = await vault.deanonymizeObject(data);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Internal error' });
    }
  });

  app.post('/anonymize-text', requireApiKey(config.apiKey), async (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
      const { text } = payload;
      if (typeof text !== 'string') {
        return res.status(400).json({ error: 'Missing text string' });
      }
      const result = await anonymizeText(text, {
        tokenize: (value, metadata) => vault.tokenizeValue(value, metadata)
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Internal error' });
    }
  });

  app.post('/deanonymize-text', requireApiKey(config.apiKey), async (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
      const { text } = payload;
      if (typeof text !== 'string') {
        return res.status(400).json({ error: 'Missing text string' });
      }
      const result = await deanonymizeText(text, {
        detokenize: (token) => vault.detokenizeValue(token)
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Internal error' });
    }
  });

  return { app, vault, config };
}

module.exports = { buildApp };



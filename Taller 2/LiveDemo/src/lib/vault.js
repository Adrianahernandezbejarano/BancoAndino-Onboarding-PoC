'use strict';

const { FileStorage, MongoStorage } = require('./storage');
const { encryptString, decryptString, generateToken } = require('./crypto');
const { isLikelyPiiField, isLikelyPiiValue } = require('./piiRules');

function createVaultService({ storageFilePath, masterKey, storageType = 'file' }) {
  // Seleccionar el tipo de almacenamiento según la configuración
  const storage = storageType === 'mongodb' 
    ? new MongoStorage() 
    : new FileStorage(storageFilePath);

  async function tokenizeValue(value, metadata) {
    const token = generateToken();
    const encrypted = encryptString(String(value), masterKey);
    await storage.saveToken(token, encrypted, metadata);
    return token;
  }

  async function detokenizeValue(token) {
    const entry = await storage.getByToken(token);
    if (!entry) return null;
    return decryptString(entry.v, masterKey);
  }

  function shouldTokenize(fieldName, value, piiFields) {
    return isLikelyPiiField(fieldName, piiFields) || isLikelyPiiValue(value);
  }

  async function anonymizeObject(obj, options) {
    const piiFields = (options && options.piiFields) || undefined;
    const cloned = Array.isArray(obj) ? [] : {};
    const tasks = [];

    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object') {
        tasks.push(
          anonymizeObject(value, { piiFields }).then((nested) => {
            cloned[key] = nested;
          })
        );
      } else if (shouldTokenize(key, value, piiFields)) {
        tasks.push(
          tokenizeValue(value, { field: key }).then((token) => {
            cloned[key] = token;
          })
        );
      } else {
        cloned[key] = value;
      }
    }
    await Promise.all(tasks);
    return { data: cloned };
  }

  async function deanonymizeObject(obj) {
    const cloned = Array.isArray(obj) ? [] : {};
    const tasks = [];

    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object') {
        tasks.push(
          deanonymizeObject(value).then((nested) => {
            cloned[key] = nested;
          })
        );
      } else if (typeof value === 'string' && value.startsWith('tok_')) {
        tasks.push(
          detokenizeValue(value).then((plain) => {
            cloned[key] = plain === null ? value : plain;
          })
        );
      } else {
        cloned[key] = value;
      }
    }
    await Promise.all(tasks);
    return { data: cloned };
  }

  return {
    anonymizeObject,
    deanonymizeObject,
    tokenizeValue,
    detokenizeValue
  };
}

module.exports = { createVaultService };



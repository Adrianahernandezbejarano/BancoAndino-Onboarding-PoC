'use strict';

const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const KEY_ITERATIONS = 210000;

function deriveKey(masterKey, salt) {
  return crypto.pbkdf2Sync(masterKey, salt, KEY_ITERATIONS, 32, 'sha512');
}

function encryptString(plaintext, masterKey) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = deriveKey(masterKey, salt);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([salt, iv, authTag, ciphertext]).toString('base64');
}

function decryptString(payload, masterKey) {
  const buf = Buffer.from(payload, 'base64');
  const salt = buf.subarray(0, SALT_LENGTH);
  const iv = buf.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = buf.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + 16);
  const ciphertext = buf.subarray(SALT_LENGTH + IV_LENGTH + 16);
  const key = deriveKey(masterKey, salt);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  return plaintext;
}

function generateToken() {
  return `tok_${crypto.randomUUID()}`;
}

module.exports = { encryptString, decryptString, generateToken };



const crypto = require('crypto');

const ENC_ALGO = 'aes-256-gcm';
const ENC_KEY_HEX = process.env.DATA_KEY_HEX || '';

function getKey() {
  if (!ENC_KEY_HEX || ENC_KEY_HEX.length !== 64) {
    throw new Error('DATA_KEY_HEX debe estar definido en .env (64 hex chars para AES-256)');
  }
  return Buffer.from(ENC_KEY_HEX, 'hex');
}

function encrypt(value) {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENC_ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { iv: iv.toString('hex'), authTag: authTag.toString('hex'), ciphertext: ciphertext.toString('hex') };
}

function decrypt({ iv, authTag, ciphertext }) {
  const key = getKey();
  const decipher = crypto.createDecipheriv(ENC_ALGO, key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'hex')),
    decipher.final(),
  ]);
  return plaintext.toString('utf8');
}

module.exports = { encrypt, decrypt };



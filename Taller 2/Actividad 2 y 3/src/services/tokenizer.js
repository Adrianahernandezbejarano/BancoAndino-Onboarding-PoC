const crypto = require('crypto');

const SALT = process.env.TOKEN_SALT || 'change-me-in-.env';

/**
 * Genera un token alfanumérico determinista para un valor sensible.
 * - typeTag separa espacios de colisión por tipo (email/name/phone)
 * - No reversible: ideal para anonimización general sin vault
 */
function toToken(value, typeTag) {
  const h = crypto
    .createHmac('sha256', SALT)
    .update(`${typeTag}::${value}`)
    .digest('hex');
  return h.slice(0, 8); // 8 chars como en el ejemplo
}

module.exports = { toToken };



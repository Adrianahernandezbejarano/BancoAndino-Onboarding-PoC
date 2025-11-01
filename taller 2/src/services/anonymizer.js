const { toToken } = require('./tokenizer');
const { upsertOriginal } = require('./vault');
const { EMAIL_RE, PHONE_CHAR_RE } = require('../utils/regex');

/**
 * Heurística simple de nombre propio en español:
 * - Secuencias de 2 a 4 palabras con mayúscula inicial y resto minúsculas/acentos
 */
function findNameCandidates(text) {
  const NAME_WORD = '[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+';
  const re = new RegExp(`\\b(${NAME_WORD}(?:\\s+${NAME_WORD}){1,3})\\b`, 'g');

  const candidates = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const span = m[0];
    if (/[0-9@]/.test(span)) continue; // evitar falsos positivos obvios
    candidates.push({ match: span, index: m.index });
  }
  return candidates;
}

/**
 * Detecta teléfonos con al menos 10 dígitos (tolerando separadores y prefijo +57/57)
 */
function findPhones(text) {
  const matches = [];
  const re = /(?:\+?57[\s\-\.]?)?(?:\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4}|\d[\d\s\-\.\(\)]{8,}\d)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const original = m[0];
    const digits = original.replace(PHONE_CHAR_RE, '').replace(/^\+?57/, '');
    if (digits.replace(/\D/g, '').length >= 10) {
      matches.push({ match: original, index: m.index });
    }
  }
  return matches;
}

/**
 * Anonimiza el mensaje reemplazando emails, teléfonos y nombres por tokens.
 */
function anonymizeMessage(message) {
  if (typeof message !== 'string') {
    throw new Error('message debe ser string');
  }

  let result = message;

  // 1) Emails
  result = result.replace(EMAIL_RE, (email) => {
    const normalized = email.toLowerCase();
    const token = toToken(normalized, 'email');
    upsertOriginal({ type: 'email', value: normalized, token });
    return token;
  });

  // 2) Teléfonos (reemplazar de derecha a izquierda)
  const phoneMatches = findPhones(result);
  phoneMatches
    .sort((a, b) => b.index - a.index)
    .forEach(({ match, index }) => {
      // Colombia: quitar separadores y prefijos +57/57, exigir 10 dígitos
      const normalized = match
        .replace(PHONE_CHAR_RE, '')
        .replace(/^\+?57/, '')
        .replace(/\D/g, '')
        .slice(-10);
      if (normalized.length !== 10) return; // si no cumple, no reemplazar
      const token = toToken(normalized, 'phone');
      upsertOriginal({ type: 'phone', value: normalized, token });
      result = result.slice(0, index) + token + result.slice(index + match.length);
    });

  // 3) Nombres (reemplazar de derecha a izquierda)
  const nameMatches = findNameCandidates(result);
  nameMatches
    .sort((a, b) => b.index - a.index)
    .forEach(({ match, index }) => {
      const normalized = match.trim();
      const token = toToken(normalized, 'name');
      upsertOriginal({ type: 'name', value: normalized, token });
      result = result.slice(0, index) + token + result.slice(index + match.length);
    });

  return { anonymizedMessage: result };
}

module.exports = { anonymizeMessage };



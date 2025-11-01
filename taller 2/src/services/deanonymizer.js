const { getOriginalByToken } = require('./vault');

// Regex para tokens con prefijo explícito
const NAME_TOKEN_RE = /\bNAME_([a-f0-9]{8,64})\b/g;
const EMAIL_TOKEN_RE = /\bEMAIL_([a-f0-9]{8,64})\b/g;
const PHONE_TOKEN_RE = /\bPHONE_([a-f0-9]{8,64})\b/g;

// Regex para tokens "simples" de 8 hex (compatibilidad con la salida actual)
const BARE_TOKEN_RE = /\b([a-f0-9]{8})\b/g;

function replaceAllPrefixed(message) {
  let result = message;

  result = result.replace(NAME_TOKEN_RE, (_m, tok) => {
    const original = getOriginalByToken({ type: 'name', token: tok });
    return original || _m; // si no hay match, dejar el token como está
  });

  result = result.replace(EMAIL_TOKEN_RE, (_m, tok) => {
    const original = getOriginalByToken({ type: 'email', token: tok });
    return original || _m;
  });

  result = result.replace(PHONE_TOKEN_RE, (_m, tok) => {
    const original = getOriginalByToken({ type: 'phone', token: tok });
    return original || _m;
  });

  return result;
}

function tryLookupAnyType(token) {
  // Intentar por tipo en orden probable
  return (
    getOriginalByToken({ type: 'email', token }) ||
    getOriginalByToken({ type: 'phone', token }) ||
    getOriginalByToken({ type: 'name', token }) ||
    null
  );
}

function replaceAllBare(message) {
  return message.replace(BARE_TOKEN_RE, (m, tok) => {
    const original = tryLookupAnyType(tok);
    return original || m;
  });
}

/**
 * Restaura un mensaje completo reemplazando tokens por sus valores originales usando el vault.
 * Soporta tokens con prefijo (NAME_/EMAIL_/PHONE_) y tokens simples de 8 hex.
 */
function deanonymizeMessage(anonymizedMessage) {
  if (typeof anonymizedMessage !== 'string') {
    throw new Error('anonymizedMessage debe ser string');
  }
  // Primero prefijados (tienen tipo explícito), luego los simples
  const afterPrefixed = replaceAllPrefixed(anonymizedMessage);
  const restored = replaceAllBare(afterPrefixed);
  return { message: restored };
}

module.exports = { deanonymizeMessage };






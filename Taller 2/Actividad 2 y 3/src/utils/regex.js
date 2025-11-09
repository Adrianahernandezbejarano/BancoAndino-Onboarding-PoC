// Email relativamente estricto (RFC-like práctico)
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

// Caracteres típicos de formato en teléfonos
const PHONE_CHAR_RE = /[\s\-\.\(\)]/g;

module.exports = { EMAIL_RE, PHONE_CHAR_RE };



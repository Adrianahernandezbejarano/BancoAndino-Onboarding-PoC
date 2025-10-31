'use strict';

const path = require('path');

// ============================================================================
// HTTP Status Codes
// ============================================================================
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// ============================================================================
// Server Configuration
// ============================================================================
const SERVER = {
  DEMO_PORT: 3001,
  DEFAULT_PORT: 3000,
  JSON_BODY_LIMIT: '1mb'
};

// ============================================================================
// Crypto/Encryption Constants
// ============================================================================
const CRYPTO = {
  ALGORITHM: 'aes-256-gcm',
  IV_LENGTH: 12,
  SALT_LENGTH: 16,
  KEY_ITERATIONS: 210000,
  KEY_LENGTH: 32,
  HASH_ALGORITHM: 'sha512'
};

// ============================================================================
// Token Constants
// ============================================================================
const TOKEN = {
  // Token prefixes for different PII types
  PREFIX: {
    EMAIL: 'EMAIL',
    PHONE: 'PHONE',
    NAME: 'NAME',
    DEFAULT: 'TOK',
    UUID: 'tok'
  },
  // Default hash length for demo tokens
  DEFAULT_HASH_LENGTH: 12,
  // Demo token hash length (shorter for demo)
  DEMO_HASH_LENGTH: 8,
  // UUID token format: tok_<uuid>
  UUID_FORMAT: /\btok_[0-9a-fA-F\-]{36}\b/g
};

// ============================================================================
// PII Type Constants
// ============================================================================
const PII_TYPE = {
  EMAIL: 'email',
  PHONE: 'phone',
  NAME: 'name',
  DEFAULT: 'GEN'
};

// ============================================================================
// PII Detection Priority
// ============================================================================
const PII_PRIORITY = {
  email: 3,
  phone: 2,
  name: 1
};

// ============================================================================
// Regex Patterns for PII Detection
// ============================================================================
const REGEX = {
  // Email patterns (global and case-insensitive)
  EMAIL_GLOBAL: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  EMAIL_CASE_INSENSITIVE: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  
  // Phone patterns (global and case-insensitive)
  PHONE_GLOBAL: /\b\+?\d[\d\-()\s]{6,}\d\b/g,
  PHONE_CASE_INSENSITIVE: /\b\+?[0-9][0-9\-()\s]{6,}[0-9]\b/,
  
  // Name patterns (global)
  NAME_GLOBAL: /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/g,
  
  // SSN pattern (US example)
  SSN: /\b\d{3}-?\d{2}-?\d{4}\b/,
  
  // Demo token pattern: (NAME|EMAIL|PHONE)_[hex]{6,}
  DEMO_TOKEN: /(NAME|EMAIL|PHONE)_[0-9a-fA-F]{6,}/g,
  
  // Pattern to detect digits or @ in names (should be excluded)
  NAME_INVALID_CHARS: /[@\d]/
};

// ============================================================================
// Default PII Field Names
// ============================================================================
const DEFAULT_PII_FIELD_NAMES = new Set([
  'email', 'e-mail', 'mail',
  'phone', 'mobile', 'cell', 'telephone',
  'firstName', 'lastName', 'fullName', 'name',
  'ssn', 'nationalId', 'dni', 'cedula', 'passport',
  'address', 'street', 'city', 'zipcode', 'postalCode'
]);

// ============================================================================
// i18n Constants
// ============================================================================
const I18N = {
  DEFAULT_LOCALE: 'es',
  LOCALES_DIR: path.join(__dirname, '..', 'locales')
};

// ============================================================================
// Demo Service Seed Tokens
// ============================================================================
const DEMO_SEED_TOKENS = new Map([
  ['NAME_e1be92e2b3a5', 'Pepito Perez'],
  ['EMAIL_8004719c6ea5', 'ana.correa@gmail.com'],
  ['PHONE_40e83067b9cb', '3152319157']
]);

// ============================================================================
// Export all constants
// ============================================================================
module.exports = {
  HTTP_STATUS,
  SERVER,
  CRYPTO,
  TOKEN,
  PII_TYPE,
  PII_PRIORITY,
  REGEX,
  DEFAULT_PII_FIELD_NAMES,
  I18N,
  DEMO_SEED_TOKENS
};


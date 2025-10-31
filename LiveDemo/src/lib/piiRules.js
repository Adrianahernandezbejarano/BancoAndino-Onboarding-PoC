'use strict';

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const PHONE_REGEX = /\b\+?[0-9][0-9\-()\s]{6,}[0-9]\b/;
const SSN_REGEX = /\b\d{3}-?\d{2}-?\d{4}\b/; // US example

const defaultFieldNames = new Set([
  'email', 'e-mail', 'mail',
  'phone', 'mobile', 'cell', 'telephone',
  'firstName', 'lastName', 'fullName', 'name',
  'ssn', 'nationalId', 'dni', 'cedula', 'passport',
  'address', 'street', 'city', 'zipcode', 'postalCode'
]);

function isLikelyPiiField(fieldName, explicitList) {
  if (explicitList && Array.isArray(explicitList)) {
    return explicitList.includes(fieldName);
  }
  return defaultFieldNames.has(fieldName);
}

function isLikelyPiiValue(value) {
  if (typeof value !== 'string') return false;
  const s = value.trim();
  return EMAIL_REGEX.test(s) || PHONE_REGEX.test(s) || SSN_REGEX.test(s);
}

module.exports = { isLikelyPiiField, isLikelyPiiValue };



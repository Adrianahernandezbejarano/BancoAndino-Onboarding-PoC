'use strict';

// Basic regexes for PII in free text
const EMAIL_REGEX_G = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_REGEX_G = /\b\+?\d[\d\-()\s]{6,}\d\b/g;
// Heuristic for person names: 2-3 capitalized words (e.g., "Jane Doe", "Juan Carlos Perez")
// Avoid matching if the token contains digits or @
// English-only: capitalized words with standard ASCII letters
const NAME_REGEX_G = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/g;

function collectMatches(text) {
  const matches = [];

  const pushMatches = (regex, type) => {
    regex.lastIndex = 0;
    let m;
    while ((m = regex.exec(text)) !== null) {
      const value = m[0];
      if (type === 'name' && (/[@\d]/.test(value))) continue;
      matches.push({ start: m.index, end: m.index + value.length, value, type });
    }
  };

  pushMatches(EMAIL_REGEX_G, 'email');
  pushMatches(PHONE_REGEX_G, 'phone');
  pushMatches(NAME_REGEX_G, 'name');

  // Deduplicate and remove overlaps: prefer email/phone over name
  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const result = [];
  for (const m of matches) {
    const overlap = result.find(r => !(m.end <= r.start || m.start >= r.end));
    if (!overlap) {
      result.push(m);
    } else {
      const priority = { email: 3, phone: 2, name: 1 };
      if (priority[m.type] > priority[overlap.type]) {
        const idx = result.indexOf(overlap);
        result.splice(idx, 1, m);
      }
    }
  }
  return result.sort((a, b) => b.start - a.start); // replace right-to-left
}

async function anonymizeText(text, { tokenize }) {
  if (typeof text !== 'string' || !text) {
    return { text: text || '', replacements: [] };
  }
  const matches = collectMatches(text);
  const replacements = [];

  for (const m of matches) {
    // one token per unique value in this run
    const token = await tokenize(m.value, { type: m.type });
    replacements.push({ type: m.type, token });
    text = text.slice(0, m.start) + token + text.slice(m.end);
  }

  // Return replacements in left-to-right order for readability
  replacements.reverse();
  return { text, replacements };
}

// Replace tokens (tok_<uuid>) in text with their original values using detokenize()
// We scan with a conservative token regex to avoid false positives.
const TOKEN_REGEX_G = /\btok_[0-9a-fA-F\-]{36}\b/g;

async function deanonymizeText(text, { detokenize }) {
  if (typeof text !== 'string' || !text) {
    return { text: text || '' };
  }

  TOKEN_REGEX_G.lastIndex = 0;
  const matches = [];
  let m;
  while ((m = TOKEN_REGEX_G.exec(text)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length, token: m[0] });
  }
  // Replace right-to-left
  for (let i = matches.length - 1; i >= 0; i--) {
    const { start, end, token } = matches[i];
    const value = await detokenize(token);
    if (value !== null && value !== undefined) {
      text = text.slice(0, start) + value + text.slice(end);
    }
  }
  return { text };
}

module.exports = { anonymizeText, deanonymizeText };




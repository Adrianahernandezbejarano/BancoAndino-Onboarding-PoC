'use strict';

const { anonymizeText, deanonymizeText } = require('../src/lib/text');

describe('text anonymization', () => {
  test('anonymizes email, phone, and English names', async () => {
    const input = 'Contact Jane Doe at jane@example.com or +1 (555) 222-3333.';
    const issued = new Map();
    const tokenize = async (value, metadata) => {
      const token = `tok_${metadata.type}_${issued.size}`;
      issued.set(token, value);
      return token;
    };

    const { text, replacements } = await anonymizeText(input, { tokenize });

    expect(text).toContain('tok_name_');
    expect(text).toContain('tok_email_');
    expect(text).toContain('tok_phone_');
    expect(replacements.length).toBe(3);
  });

  test('deanonymizes tokens back to original values in text', async () => {
    const original = 'Contact Jane Doe at jane@example.com or +1 (555) 222-3333.';
    const mapping = new Map([
      ['tok_0', 'Jane Doe'],
      ['tok_1', 'jane@example.com'],
      ['tok_2', '+1 (555) 222-3333']
    ]);
    const textWithTokens = 'Contact tok_0 at tok_1 or tok_2.';
    const detokenize = async (t) => mapping.get(t) ?? null;

    const { text } = await deanonymizeText(textWithTokens, { detokenize });
    expect(text).toBe(original);
  });
});



'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const request = require('supertest');

describe('endpoint integration', () => {
  let app;
  const API_KEY = 'test-key';
  const MASTER_KEY = 'x'.repeat(40);
  let storagePath;

  beforeAll(() => {
    storagePath = path.join(os.tmpdir(), `vault-test-${Date.now()}.json`);
    process.env.API_KEY = API_KEY;
    process.env.VAULT_MASTER_KEY = MASTER_KEY;
    process.env.STORAGE_FILE_PATH = storagePath;
    const { buildApp } = require('../src/app');
    const built = buildApp();
    app = built.app;
  });

  afterAll(() => {
    try { fs.unlinkSync(storagePath); } catch (_) {}
  });

  test('anonymize-text returns tokens', async () => {
    const res = await request(app)
      .post('/anonymize-text')
      .set('x-api-key', API_KEY)
      .send({ text: 'Email me at jane@example.com' })
      .expect(200);

    expect(res.body.text).toMatch(/tok_/);
  });

  test('deanonymize-text roundtrip', async () => {
    const anon = await request(app)
      .post('/anonymize-text')
      .set('x-api-key', API_KEY)
      .send({ text: 'Call me at +1 555 000 1111' })
      .expect(200);

    const dean = await request(app)
      .post('/deanonymize-text')
      .set('x-api-key', API_KEY)
      .send({ text: anon.body.text })
      .expect(200);

    expect(dean.body.text).toBe('Call me at +1 555 000 1111');
  });
});



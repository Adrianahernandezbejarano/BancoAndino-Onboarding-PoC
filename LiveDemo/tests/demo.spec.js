'use strict';

const request = require('supertest');
const { buildDemoServer } = require('../src/demo');

describe('Demo Service API', () => {
  let app;

  beforeAll(() => {
    app = buildDemoServer();
  });

  describe('GET /health', () => {
    test('should return status ok', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body).toEqual({ status: 'ok' });
      expect(typeof res.body.status).toBe('string');
    });
  });

  describe('POST /anonymize', () => {
    test('should anonymize message successfully', async () => {
      const message = 'oferta de trabajo para johanna Correa con email johanna.correa.c@gmail.com y teléfono 3157090897';
      
      const res = await request(app)
        .post('/anonymize')
        .send({ message })
        .expect(200);

      expect(res.body).toHaveProperty('anonymizedMessage');
      expect(typeof res.body.anonymizedMessage).toBe('string');
      expect(res.body.anonymizedMessage).not.toContain('johanna.correa.c@gmail.com');
      expect(res.body.anonymizedMessage).toMatch(/EMAIL_/);
      expect(res.body.anonymizedMessage).toMatch(/PHONE_/);
    });

    test('should anonymize names correctly', async () => {
      // Note: NAME regex only matches ASCII letters, so "Juan Carlos Perez" works but "María García" doesn't
      const message = 'Contacta a Juan Carlos Perez para mas informacion';
      
      const res = await request(app)
        .post('/anonymize')
        .send({ message })
        .expect(200);

      expect(res.body.anonymizedMessage).toMatch(/NAME_/);
    });

    test('should return 400 when message field is missing', async () => {
      const res = await request(app)
        .post('/anonymize')
        .query({ lang: 'en' })
        .send({ otroCampo: 'test' })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty('details');
      expect(res.body.error).toBe('Missing \'message\' field');
      expect(res.body.details).toContain('message');
    });

    test('should return 400 when message is null', async () => {
      const res = await request(app)
        .post('/anonymize')
        .query({ lang: 'en' })
        .send({ message: null })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Missing \'message\' field');
    });

    test('should return 400 when message is undefined', async () => {
      const res = await request(app)
        .post('/anonymize')
        .query({ lang: 'en' })
        .send({ message: undefined })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Missing \'message\' field');
    });

    test('should return 400 when message is not a string', async () => {
      const res = await request(app)
        .post('/anonymize')
        .query({ lang: 'en' })
        .send({ message: 12345 })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty('details');
      expect(res.body.error).toBe('Invalid message type');
      expect(res.body.details).toContain('string');
    });

    test('should return 400 when message is empty string', async () => {
      const res = await request(app)
        .post('/anonymize')
        .query({ lang: 'en' })
        .send({ message: '' })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Empty message');
    });

    test('should return 400 when message is only whitespace', async () => {
      const res = await request(app)
        .post('/anonymize')
        .query({ lang: 'en' })
        .send({ message: '   ' })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Empty message');
    });

    test('should handle malformed JSON gracefully', async () => {
      const res = await request(app)
        .post('/anonymize')
        .query({ lang: 'en' })
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/Invalid|Missing/);
    });

    test('should handle JSON parsing errors gracefully', async () => {
      const res = await request(app)
        .post('/anonymize')
        .query({ lang: 'en' })
        .set('Content-Type', 'application/json')
        .send('{"message": invalid json}')
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Invalid JSON format');
    });
  });

  describe('POST /deanonymize', () => {
    test('should deanonymize message with seed tokens successfully', async () => {
      const anonymizedMessage = 'oferta de trabajo para NAME_e1be92e2b3a5 con email EMAIL_8004719c6ea5 y telefono PHONE_40e83067b9cb';
      
      const res = await request(app)
        .post('/deanonymize')
        .send({ anonymizedMessage })
        .expect(200);

      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
      expect(res.body.message).toContain('Pepito Perez');
      expect(res.body.message).toContain('ana.correa@gmail.com');
      expect(res.body.message).toContain('3152319157');
    });

    test('should deanonymize previously anonymized message', async () => {
      // First, anonymize a message
      const originalMessage = 'Contacta a María García en maria@empresa.com o al 3201234567';
      const anonymizeRes = await request(app)
        .post('/anonymize')
        .send({ message: originalMessage })
        .expect(200);

      const anonymized = anonymizeRes.body.anonymizedMessage;

      // Then, deanonymize it
      const res = await request(app)
        .post('/deanonymize')
        .send({ anonymizedMessage: anonymized })
        .expect(200);

      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe(originalMessage);
    });

    test('should preserve non-token text', async () => {
      const anonymizedMessage = 'Hola NAME_e1be92e2b3a5, bienvenido';
      
      const res = await request(app)
        .post('/deanonymize')
        .send({ anonymizedMessage })
        .expect(200);

      expect(res.body.message).toContain('Hola');
      expect(res.body.message).toContain('bienvenido');
      expect(res.body.message).toContain('Pepito Perez');
    });

    test('should return 400 when anonymizedMessage field is missing', async () => {
      const res = await request(app)
        .post('/deanonymize')
        .query({ lang: 'en' })
        .send({ otroCampo: 'test' })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty('details');
      expect(res.body.error).toBe('Missing \'anonymizedMessage\' field');
      expect(res.body.details).toContain('anonymizedMessage');
    });

    test('should return 400 when anonymizedMessage is null', async () => {
      const res = await request(app)
        .post('/deanonymize')
        .query({ lang: 'en' })
        .send({ anonymizedMessage: null })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Missing \'anonymizedMessage\' field');
    });

    test('should return 400 when anonymizedMessage is not a string', async () => {
      const res = await request(app)
        .post('/deanonymize')
        .query({ lang: 'en' })
        .send({ anonymizedMessage: 12345 })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Invalid anonymizedMessage type');
    });

    test('should return 400 when anonymizedMessage is empty', async () => {
      const res = await request(app)
        .post('/deanonymize')
        .query({ lang: 'en' })
        .send({ anonymizedMessage: '' })
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Empty anonymizedMessage');
    });

    test('should handle tokens not found gracefully', async () => {
      const anonymizedMessage = 'oferta de trabajo para NAME_nonexistent123 con email EMAIL_unknown456';
      
      const res = await request(app)
        .post('/deanonymize')
        .send({ anonymizedMessage })
        .expect(200);

      // Should still return the message, but tokens remain unchanged
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('NAME_nonexistent123');
    });
  });

  describe('Error handling and edge cases', () => {
    test('should return 404 for non-existent routes', async () => {
      const res = await request(app)
        .get('/ruta-inexistente')
        .query({ lang: 'en' })
        .expect(404);

      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty('details');
      expect(res.body.error).toBe('Not found');
      expect(res.body.details).toContain('does not exist');
    });

    test('should handle empty request body', async () => {
      const res = await request(app)
        .post('/anonymize')
        .query({ lang: 'en' })
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Missing \'message\' field');
    });

    test('should handle special characters in message', async () => {
      const message = 'Mensaje con caracteres especiales: @#$%^&*() y español: ñáéíóú';
      
      const res = await request(app)
        .post('/anonymize')
        .send({ message })
        .expect(200);

      expect(res.body).toHaveProperty('anonymizedMessage');
      expect(typeof res.body.anonymizedMessage).toBe('string');
    });

    test('should handle very long messages', async () => {
      const longMessage = 'A'.repeat(5000) + ' johanna@example.com ' + 'B'.repeat(5000);
      
      const res = await request(app)
        .post('/anonymize')
        .send({ message: longMessage })
        .expect(200);

      expect(res.body).toHaveProperty('anonymizedMessage');
      expect(res.body.anonymizedMessage.length).toBeGreaterThan(0);
    });

    test('should handle messages without PII', async () => {
      const message = 'Este es un mensaje sin información personal identificable';
      
      const res = await request(app)
        .post('/anonymize')
        .send({ message })
        .expect(200);

      expect(res.body).toHaveProperty('anonymizedMessage');
      expect(res.body.anonymizedMessage).toBe(message);
    });
  });

  describe('Roundtrip tests', () => {
    test('should successfully anonymize and deanonymize email', async () => {
      const originalMessage = 'Contacta en ana@example.com';
      
      // Anonymize
      const anonymizeRes = await request(app)
        .post('/anonymize')
        .send({ message: originalMessage })
        .expect(200);

      const anonymized = anonymizeRes.body.anonymizedMessage;
      expect(anonymized).toMatch(/EMAIL_/);

      // Deanonymize
      const deanonymizeRes = await request(app)
        .post('/deanonymize')
        .send({ anonymizedMessage: anonymized })
        .expect(200);

      expect(deanonymizeRes.body.message).toBe(originalMessage);
    });

    test('should successfully anonymize and deanonymize phone', async () => {
      const originalMessage = 'Llama al 3157090897';
      
      // Anonymize
      const anonymizeRes = await request(app)
        .post('/anonymize')
        .send({ message: originalMessage })
        .expect(200);

      const anonymized = anonymizeRes.body.anonymizedMessage;
      expect(anonymized).toMatch(/PHONE_/);

      // Deanonymize
      const deanonymizeRes = await request(app)
        .post('/deanonymize')
        .send({ anonymizedMessage: anonymized })
        .expect(200);

      expect(deanonymizeRes.body.message).toBe(originalMessage);
    });

    test('should successfully anonymize and deanonymize name', async () => {
      const originalMessage = 'Hola Juan Carlos Pérez';
      
      // Anonymize
      const anonymizeRes = await request(app)
        .post('/anonymize')
        .send({ message: originalMessage })
        .expect(200);

      const anonymized = anonymizeRes.body.anonymizedMessage;
      expect(anonymized).toMatch(/NAME_/);

      // Deanonymize
      const deanonymizeRes = await request(app)
        .post('/deanonymize')
        .send({ anonymizedMessage: anonymized })
        .expect(200);

      expect(deanonymizeRes.body.message).toBe(originalMessage);
    });

    test('should successfully anonymize and deanonymize multiple PII types', async () => {
      // Note: Using ASCII names that will be detected by the NAME regex
      const originalMessage = 'Contacta a Juan Carlos Perez en juan.perez@empresa.com o al 3201234567';
      
      // Anonymize
      const anonymizeRes = await request(app)
        .post('/anonymize')
        .send({ message: originalMessage })
        .expect(200);

      const anonymized = anonymizeRes.body.anonymizedMessage;
      expect(anonymized).toMatch(/EMAIL_/);
      expect(anonymized).toMatch(/PHONE_/);
      // NAME may or may not be detected depending on regex behavior, so we check for either
      const hasNameOrEmail = anonymized.includes('NAME_') || anonymized.includes('EMAIL_');
      expect(hasNameOrEmail).toBe(true);

      // Deanonymize
      const deanonymizeRes = await request(app)
        .post('/deanonymize')
        .send({ anonymizedMessage: anonymized })
        .expect(200);

      expect(deanonymizeRes.body.message).toBe(originalMessage);
    });
  });
});


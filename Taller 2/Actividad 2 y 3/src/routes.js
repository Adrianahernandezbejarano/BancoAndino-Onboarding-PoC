const express = require('express');
const { anonymizeMessage } = require('./services/anonymizer');
const { getOriginalByToken } = require('./services/vault');
const { deanonymizeMessage } = require('./services/deanonymizer');
const { OpenAIClient } = require('./services/openaiClient');

const router = express.Router();

/**
 * POST /anonymize
 * body: { "message": "texto con PII" }
 * resp: { anonymizedMessage: "..." }
 */
router.post('/anonymize', (req, res) => {
  try {
    const { message } = req.body || {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'message es requerido y debe ser string no vacío' });
    }
    const result = anonymizeMessage(message);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error procesando el mensaje' });
  }
});

/**
 * POST /deanonymize
 * Dos modos:
 * 1) { anonymizedMessage: string } -> { message: string }
 * 2) { type: 'email'|'phone'|'name', token: 'xxxxxxxx' } -> { original }
 */
router.post('/deanonymize', (req, res) => {
  try {
    const { anonymizedMessage, type, token } = req.body || {};

    if (typeof anonymizedMessage === 'string') {
      const restored = deanonymizeMessage(anonymizedMessage);
      return res.json(restored);
    }

    if (['email', 'phone', 'name'].includes(type) && typeof token === 'string') {
      const original = getOriginalByToken({ type, token });
      if (!original) return res.status(404).json({ error: 'No encontrado' });
      return res.json({ original });
    }

    return res.status(400).json({ error: 'Cuerpo inválido: proporcione anonymizedMessage o (type, token)' });
  } catch (err) {
    return res.status(500).json({ error: 'Error consultando el vault' });
  }
});

/**
 * POST /secureChatGPT
 * body: { prompt: string, model?: string, temperature?: number }
 * flujo: anonimiza -> llama OpenAI -> desanonimiza -> responde
 */
router.post('/secureChatGPT', async (req, res) => {
  try {
    const { prompt, model, temperature } = req.body || {};
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'prompt es requerido y debe ser string no vacío' });
    }

    // 1) Anonimizar
    const { anonymizedMessage } = anonymizeMessage(prompt);

    // 2) Enviar a OpenAI con instrucción de conservar tokens
    const ai = new OpenAIClient({ model });
    const systemMsg = 'Eres un asistente útil. NO modifiques, dividas ni inventes tokens hexadecimales de 8 caracteres; mantenlos exactamente como aparecen.';
    const aiResponse = await ai.completeText(anonymizedMessage, { system: systemMsg, temperature });

    // 3) Desanonimizar respuesta
    const { message } = deanonymizeMessage(aiResponse);

    return res.json({ response: message });
  } catch (err) {
    return res.status(500).json({ error: 'Error en secureChatGPT' });
  }
});

module.exports = router;



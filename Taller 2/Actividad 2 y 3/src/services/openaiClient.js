require('dotenv').config();
const OpenAI = require('openai');

class OpenAIClient {
  constructor(options = {}) {
    const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY no está definido. Configúralo en tu entorno.');
    }
    this.client = new OpenAI({ apiKey });
    this.defaultModel = options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    this.defaultTemperature = options.temperature ?? 0.7;
    this.defaultMaxTokens = options.maxTokens ? Number(options.maxTokens) : undefined; // opcional
  }

  /**
   * Realiza una completion de texto usando Chat Completions.
   * prompt: string (contenido del usuario)
   * options: { model?, temperature?, maxTokens?, system? }
   * Devuelve: string (texto de la primera respuesta)
   */
  async completeText(prompt, options = {}) {
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error('prompt debe ser un string no vacío');
    }

    const model = options.model || this.defaultModel;
    const temperature = options.temperature ?? this.defaultTemperature;
    const maxTokens = options.maxTokens ?? this.defaultMaxTokens;
    const system = options.system || 'Eres un asistente útil.';

    try {
      const response = await this.client.chat.completions.create({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
      });

      const text = response?.choices?.[0]?.message?.content ?? '';
      return text;
    } catch (err) {
      // En producción, log estructurado
      throw new Error(`OpenAI error: ${err?.message || 'desconocido'}`);
    }
  }
}

module.exports = { OpenAIClient };






require('dotenv').config();
const { OpenAIClient } = require('../src/services/openaiClient');

async function main() {
  const prompt = process.argv.slice(2).join(' ') || 'Describe brevemente por qué es importante proteger la PII.';
  try {
    const ai = new OpenAIClient();
    console.log('Prompt enviado a OpenAI (anonimizado por el servicio si aplica):');
    console.log(prompt);
    console.log('---');

    const response = await ai.completeText(prompt);
    console.log('Respuesta del modelo:');
    console.log(response);
  } catch (err) {
    console.error('Fallo usando OpenAI:', err.message);
    process.exit(1);
  }
}

main();




require('dotenv').config();
const readline = require('readline');
const { upsertOriginal } = require('../src/services/vault.mongo');

function ask(question, rl) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log('Vault CLI (MongoDB) - Inserta pares [type, valor_privado, token]');
  console.log("Tipos permitidos: 'email' | 'phone' | 'name'. Escribe 'exit' para salir.\n");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    // bucle interactivo
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const type = (await ask('type: ', rl)).trim();
      if (!type || type.toLowerCase() === 'exit') break;
      if (!['email', 'phone', 'name'].includes(type)) {
        console.log('Tipo inválido. Usa email | phone | name.');
        continue;
      }

      const value = (await ask('valor_privado: ', rl)).trim();
      if (!value) {
        console.log('valor_privado vacío.');
        continue;
      }

      const token = (await ask('token (8+ hex recomendado): ', rl)).trim();
      if (!token) {
        console.log('token vacío.');
        continue;
      }

      try {
        await upsertOriginal({ type, value, token });
        console.log('OK guardado en vault.\n');
      } catch (e) {
        console.error('Error guardando:', e.message);
      }
    }
  } finally {
    rl.close();
    process.exit(0);
  }
}

main().catch((e) => {
  console.error('Fallo CLI:', e);
  process.exit(1);
});






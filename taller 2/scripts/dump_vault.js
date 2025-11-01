require('dotenv').config();
const vault = require('../src/services/vault');

async function main() {
  const args = process.argv.slice(2);
  const decryptOriginal = args.includes('--decrypt');
  const limitArg = args.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 50;

  try {
    const entries = await vault.listAll({ limit, decryptOriginal });
    console.log(JSON.stringify(entries, null, 2));
  } catch (e) {
    console.error('Error listando vault:', e.message);
    process.exit(1);
  }
}

main();






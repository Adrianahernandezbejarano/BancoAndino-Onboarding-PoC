const backend = process.env.VAULT_BACKEND || 'sqlite';

let impl;
if (backend === 'mongo') {
  impl = require('./vault.mongo');
} else {
  impl = require('./vault.sqlite');
}

module.exports = impl;



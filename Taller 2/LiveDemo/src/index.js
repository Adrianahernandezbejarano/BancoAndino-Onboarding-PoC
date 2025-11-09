'use strict';

const { buildApp } = require('./app');
const { disconnectFromMongoDB } = require('./lib/mongodb');

/**
 * Inicializa y ejecuta el servidor
 */
async function startServer() {
  try {
    const { app, config } = await buildApp();

    const port = config.port;
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Privacy Vault listening on port ${port}`);
      console.log(`Storage type: ${config.storageType}`);
    });

    // Manejo de cierre graceful
    process.on('SIGINT', async () => {
      console.log('\n⚠️  Shutting down gracefully...');
      if (config.storageType === 'mongodb') {
        await disconnectFromMongoDB();
      }
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n⚠️  Shutting down gracefully...');
      if (config.storageType === 'mongodb') {
        await disconnectFromMongoDB();
      }
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();



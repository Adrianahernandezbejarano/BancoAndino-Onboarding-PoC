'use strict';

const mongoose = require('mongoose');

let isConnected = false;

/**
 * Conecta a MongoDB usando la URI proporcionada
 * @param {string} uri - MongoDB connection string
 * @returns {Promise<void>}
 */
async function connectToMongoDB(uri) {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(uri, {
      // Opciones recomendadas para producción
      serverSelectionTimeoutMS: 5000, // Timeout después de 5s si no puede seleccionar un servidor
      socketTimeoutMS: 45000, // Cierra sockets después de 45s de inactividad
    });

    isConnected = true;
    console.log('✅ Connected to MongoDB');

    // Manejo de eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    isConnected = false;
    throw error;
  }
}

/**
 * Desconecta de MongoDB
 * @returns {Promise<void>}
 */
async function disconnectFromMongoDB() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
    throw error;
  }
}

/**
 * Verifica si la conexión está activa
 * @returns {boolean}
 */
function isMongoDBConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB,
  isMongoDBConnected
};


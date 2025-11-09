'use strict';

const mongoose = require('mongoose');

/**
 * Esquema de MongoDB para almacenar tokens y sus valores cifrados
 * 
 * Estructura del documento:
 * - token: String único que identifica el token (ej: "tok_abc123...")
 * - encryptedValue: String con el valor cifrado de la información privada
 * - metadata: Object con información adicional (campo, tipo, etc.)
 * - createdAt: Timestamp de creación
 * - updatedAt: Timestamp de actualización (automático con timestamps: true)
 */
const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true, // Índice para búsquedas rápidas por token
      trim: true
    },
    encryptedValue: {
      type: String,
      required: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Permite cualquier estructura de objeto
      default: {}
    }
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
    collection: 'tokens' // Nombre de la colección en MongoDB
  }
);

// Índice compuesto para búsquedas optimizadas (opcional)
tokenSchema.index({ token: 1, createdAt: -1 });

// Método estático para buscar por token
tokenSchema.statics.findByToken = function(token) {
  return this.findOne({ token });
};

// Método estático para crear o actualizar un token
tokenSchema.statics.upsertToken = function(token, encryptedValue, metadata = {}) {
  return this.findOneAndUpdate(
    { token },
    {
      token,
      encryptedValue,
      metadata,
      updatedAt: new Date()
    },
    {
      upsert: true, // Crea si no existe, actualiza si existe
      new: true, // Retorna el documento actualizado
      setDefaultsOnInsert: true
    }
  );
};

// Método para convertir el documento a JSON eliminando campos internos de MongoDB
tokenSchema.methods.toJSON = function() {
  const obj = this.toObject();
  // Elimina campos internos de MongoDB que no queremos exponer
  delete obj.__v;
  return obj;
};

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;


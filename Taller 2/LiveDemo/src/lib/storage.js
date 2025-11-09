'use strict';

const fs = require('fs');
const Token = require('../models/Token');

/**
 * FileStorage: Almacenamiento basado en archivos JSON
 * Mantiene compatibilidad con la implementación original
 */
class FileStorage {
  constructor(filePath) {
    this.filePath = filePath;
    this._ensureFile();
  }

  _ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({ tokens: {} }, null, 2), { encoding: 'utf8' });
    }
  }

  _readAll() {
    const raw = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(raw || '{"tokens":{}}');
  }

  _writeAll(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), { encoding: 'utf8' });
  }

  async saveToken(token, encryptedValue, metadata) {
    const db = this._readAll();
    db.tokens[token] = { v: encryptedValue, m: metadata || {}, createdAt: new Date().toISOString() };
    this._writeAll(db);
  }

  async getByToken(token) {
    const db = this._readAll();
    return db.tokens[token] || null;
  }
}

/**
 * MongoStorage: Almacenamiento basado en MongoDB
 * Implementa la misma interfaz que FileStorage para mantener compatibilidad
 */
class MongoStorage {
  constructor() {
    // No requiere parámetros adicionales, usa la conexión global de mongoose
  }

  /**
   * Guarda o actualiza un token en MongoDB
   * @param {string} token - El token único (ej: "tok_abc123...")
   * @param {string} encryptedValue - El valor cifrado de la información privada
   * @param {object} metadata - Metadatos adicionales (campo, tipo, etc.)
   * @returns {Promise<void>}
   */
  async saveToken(token, encryptedValue, metadata) {
    try {
      await Token.upsertToken(token, encryptedValue, metadata || {});
    } catch (error) {
      // Si hay error de duplicado (aunque no debería con upsert), intentar actualización
      if (error.code === 11000) {
        await Token.findOneAndUpdate(
          { token },
          { encryptedValue, metadata: metadata || {}, updatedAt: new Date() }
        );
      } else {
        throw error;
      }
    }
  }

  /**
   * Obtiene un token de MongoDB por su identificador
   * @param {string} token - El token a buscar
   * @returns {Promise<object|null>} Retorna null si no existe, o un objeto con formato compatible
   */
  async getByToken(token) {
    try {
      const doc = await Token.findByToken(token);
      
      if (!doc) {
        return null;
      }

      // Retorna en el mismo formato que FileStorage para mantener compatibilidad
      // Estructura: { v: encryptedValue, m: metadata, createdAt: ISOString }
      return {
        v: doc.encryptedValue,
        m: doc.metadata || {},
        createdAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting token from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Método adicional: Obtiene todos los tokens (útil para migración o auditoría)
   * @returns {Promise<Array>}
   */
  async getAllTokens() {
    try {
      return await Token.find({}).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting all tokens from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Método adicional: Elimina un token (útil para limpieza)
   * @param {string} token - El token a eliminar
   * @returns {Promise<boolean>}
   */
  async deleteToken(token) {
    try {
      const result = await Token.deleteOne({ token });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting token from MongoDB:', error);
      throw error;
    }
  }
}

module.exports = { FileStorage, MongoStorage };



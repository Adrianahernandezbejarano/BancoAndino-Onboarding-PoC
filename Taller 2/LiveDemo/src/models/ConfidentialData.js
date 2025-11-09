'use strict';

const mongoose = require('mongoose');

/**
 * Esquema de MongoDB para la colección confidentialData
 * 
 * Estructura observada:
 * - _id puede contener diferentes campos (email, name, phone)
 * - Cada documento representa un tipo de dato confidencial diferente
 */
const confidentialDataSchema = new mongoose.Schema(
  {
    // MongoDB usa _id como clave primaria, pero en esta colección
    // _id es un objeto que contiene los campos identificadores
    // Usamos un schema flexible para manejar esto
    _id: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    // Campos opcionales que pueden estar en el nivel raíz
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true // Permite que el campo no esté presente en todos los documentos
    },
    name: {
      type: String,
      trim: true,
      sparse: true
    },
    phone: {
      type: String,
      trim: true,
      sparse: true
    }
  },
  {
    // No usar timestamps automáticos ya que la estructura es especial
    timestamps: false,
    collection: 'confidentialData', // Nombre de la colección en MongoDB
    // Estrict mode deshabilitado para permitir campos adicionales
    strict: false
  }
);

// Nota: Los índices en campos sparse se crean automáticamente si se necesitan
// Los campos principales están en _id, así que los índices en el nivel raíz
// son opcionales y pueden crearse después si se necesitan

// Método estático para buscar por email
confidentialDataSchema.statics.findByEmail = function(email) {
  return this.findOne({ 
    $or: [
      { 'email': email },
      { '_id.email': email }
    ]
  });
};

// Método estático para buscar por name
confidentialDataSchema.statics.findByName = function(name) {
  return this.findOne({ 
    $or: [
      { 'name': name },
      { '_id.name': name }
    ]
  });
};

// Método estático para buscar por phone
confidentialDataSchema.statics.findByPhone = function(phone) {
  return this.findOne({ 
    $or: [
      { 'phone': phone },
      { '_id.phone': phone }
    ]
  });
};

// Método estático para buscar por cualquier campo en _id
confidentialDataSchema.statics.findByIdField = function(field, value) {
  const query = {};
  query[`_id.${field}`] = value;
  return this.findOne(query);
};

// Método estático para obtener todos los documentos
confidentialDataSchema.statics.findAll = function() {
  return this.find({});
};

// Método estático para buscar por múltiples campos
confidentialDataSchema.statics.findByFields = function(fields) {
  const query = {};
  
  Object.keys(fields).forEach(key => {
    query.$or = query.$or || [];
    query.$or.push({ [key]: fields[key] });
    query.$or.push({ [`_id.${key}`]: fields[key] });
  });
  
  return this.find(query);
};

// Método estático para crear o actualizar un documento
confidentialDataSchema.statics.upsertByIdField = function(field, value, additionalData = {}) {
  // Construir el _id basado en el campo y valor
  const id = {};
  id[field] = value;
  
  // Construir el documento completo
  const doc = {
    _id: id,
    ...additionalData
  };
  
  // También agregar el campo en el nivel raíz para facilitar búsquedas
  if (field === 'email' || field === 'name' || field === 'phone') {
    doc[field] = value;
  }
  
  return this.findOneAndUpdate(
    { _id: id },
    doc,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );
};

// Método para convertir el documento a JSON con formato consistente
confidentialDataSchema.methods.toJSON = function() {
  const obj = this.toObject();
  
  // Si el _id tiene campos, exponerlos también en el nivel raíz para facilitar acceso
  if (obj._id && typeof obj._id === 'object') {
    Object.keys(obj._id).forEach(key => {
      if (key !== '_id') {
        obj[key] = obj[key] || obj._id[key];
      }
    });
  }
  
  // Eliminar campos internos de MongoDB
  delete obj.__v;
  
  return obj;
};

// Crear el modelo
const ConfidentialData = mongoose.model('ConfidentialData', confidentialDataSchema);

module.exports = ConfidentialData;


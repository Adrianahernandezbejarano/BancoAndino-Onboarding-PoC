'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const { connectToMongoDB, disconnectFromMongoDB } = require('../src/lib/mongodb');

async function analyzeCollection() {
  try {
    await connectToMongoDB(process.env.MONGODB_URI);
    
    console.log('🔍 Analizando estructura completa de "confidentialData"...');
    console.log('');
    
    const db = mongoose.connection.db;
    const collection = db.collection('confidentialData');
    
    // Obtener todos los documentos
    const allDocs = await collection.find({}).toArray();
    console.log(`📊 Total de documentos: ${allDocs.length}`);
    console.log('');
    
    // Analizar estructura completa
    const structure = {};
    const allFields = new Set();
    
    allDocs.forEach((doc, index) => {
      console.log(`📄 Documento ${index + 1}:`);
      console.log(JSON.stringify(doc, null, 2));
      console.log('');
      
      // Analizar _id
      if (doc._id && typeof doc._id === 'object') {
        Object.keys(doc._id).forEach(key => {
          allFields.add(key);
          if (!structure[key]) {
            structure[key] = {
              type: typeof doc._id[key],
              isInId: true,
              values: []
            };
          }
          structure[key].values.push(doc._id[key]);
        });
      }
      
      // Analizar otros campos en el nivel raíz
      Object.keys(doc).forEach(key => {
        if (key !== '_id') {
          allFields.add(key);
          if (!structure[key]) {
            structure[key] = {
              type: typeof doc[key],
              isInId: false,
              values: []
            };
          }
          if (typeof doc[key] === 'object' && !Array.isArray(doc[key]) && doc[key] !== null) {
            structure[key].nested = Object.keys(doc[key]);
          }
          structure[key].values.push(doc[key]);
        }
      });
    });
    
    // Resumen de estructura
    console.log('📋 Resumen de campos encontrados:');
    console.log('');
    
    Array.from(allFields).sort().forEach(field => {
      const info = structure[field];
      console.log(`  ${field}:`);
      console.log(`    - Tipo: ${info.type}`);
      console.log(`    - Ubicación: ${info.isInId ? 'En _id (clave compuesta)' : 'En nivel raíz'}`);
      console.log(`    - Aparece en: ${info.values.length} documentos`);
      
      // Mostrar valores únicos de ejemplo
      const uniqueValues = [...new Set(info.values.map(v => 
        typeof v === 'string' && v.length > 30 ? v.substring(0, 30) + '...' : 
        typeof v === 'object' ? '[Object]' : String(v)
      ))];
      if (uniqueValues.length <= 5) {
        console.log(`    - Valores ejemplo: ${uniqueValues.join(', ')}`);
      } else {
        console.log(`    - Valores ejemplo: ${uniqueValues.slice(0, 5).join(', ')}... (+${uniqueValues.length - 5} más)`);
      }
      
      if (info.nested) {
        console.log(`    - Campos anidados: ${info.nested.join(', ')}`);
      }
      console.log('');
    });
    
    // Determinar estructura sugerida
    console.log('💡 Estructura sugerida para el modelo:');
    console.log('');
    
    const fieldsInId = Object.keys(structure).filter(f => structure[f].isInId);
    if (fieldsInId.length > 0) {
      console.log('⚠️  Nota: Algunos campos están en _id (clave compuesta)');
      console.log('   Campos en _id:', fieldsInId.join(', '));
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await disconnectFromMongoDB();
  }
}

analyzeCollection().catch(console.error);


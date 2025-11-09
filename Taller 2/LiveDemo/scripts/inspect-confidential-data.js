'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const { connectToMongoDB, disconnectFromMongoDB } = require('../src/lib/mongodb');

async function inspectCollection() {
  try {
    await connectToMongoDB(process.env.MONGODB_URI);
    
    console.log('🔍 Inspeccionando colección "confidentialData"...');
    console.log('');
    
    const db = mongoose.connection.db;
    const collection = db.collection('confidentialData');
    
    // Contar documentos
    const count = await collection.countDocuments();
    console.log(`📊 Total de documentos: ${count}`);
    console.log('');
    
    if (count === 0) {
      console.log('⚠️  La colección está vacía');
      console.log('   No se puede determinar la estructura automáticamente');
      await disconnectFromMongoDB();
      return;
    }
    
    // Obtener algunos documentos de ejemplo
    console.log('📄 Documentos de ejemplo:');
    console.log('');
    
    const samples = await collection.find({}).limit(3).toArray();
    samples.forEach((doc, index) => {
      console.log(`Ejemplo ${index + 1}:`);
      console.log(JSON.stringify(doc, null, 2));
      console.log('');
    });
    
    // Analizar campos comunes
    console.log('📋 Análisis de campos:');
    console.log('');
    
    const allDocs = await collection.find({}).toArray();
    const fieldAnalysis = {};
    
    allDocs.forEach(doc => {
      Object.keys(doc).forEach(key => {
        if (!fieldAnalysis[key]) {
          fieldAnalysis[key] = {
            count: 0,
            types: new Set(),
            sampleValues: []
          };
        }
        fieldAnalysis[key].count++;
        fieldAnalysis[key].types.add(typeof doc[key]);
        if (fieldAnalysis[key].sampleValues.length < 3) {
          fieldAnalysis[key].sampleValues.push(doc[key]);
        }
      });
    });
    
    Object.keys(fieldAnalysis).forEach(field => {
      const analysis = fieldAnalysis[field];
      console.log(`  ${field}:`);
      console.log(`    - Aparece en: ${analysis.count}/${allDocs.length} documentos`);
      console.log(`    - Tipos: ${Array.from(analysis.types).join(', ')}`);
      if (analysis.sampleValues.length > 0) {
        console.log(`    - Valores de ejemplo: ${analysis.sampleValues.map(v => 
          typeof v === 'string' && v.length > 30 ? v.substring(0, 30) + '...' : v
        ).join(', ')}`);
      }
      console.log('');
    });
    
    // Ver índices
    console.log('🔑 Índices:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`  ${index.name}: ${JSON.stringify(index.key)}`);
    });
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await disconnectFromMongoDB();
  }
}

inspectCollection().catch(console.error);



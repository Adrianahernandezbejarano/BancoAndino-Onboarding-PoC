'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const { connectToMongoDB, disconnectFromMongoDB } = require('../src/lib/mongodb');
const ConfidentialData = require('../src/models/ConfidentialData');

async function testModel() {
  try {
    await connectToMongoDB(process.env.MONGODB_URI);
    
    console.log('🧪 Probando modelo ConfidentialData...');
    console.log('');
    
    // 1. Obtener todos los documentos
    console.log('📋 1. Obteniendo todos los documentos:');
    const allDocs = await ConfidentialData.findAll();
    console.log(`   Encontrados: ${allDocs.length} documentos`);
    allDocs.forEach((doc, index) => {
      console.log(`   ${index + 1}. ${JSON.stringify(doc.toJSON())}`);
    });
    console.log('');
    
    // 2. Buscar por email
    console.log('📧 2. Buscando por email "pepito@p.com":');
    const byEmail = await ConfidentialData.findByEmail('pepito@p.com');
    if (byEmail) {
      console.log('   ✅ Encontrado:', JSON.stringify(byEmail.toJSON()));
    } else {
      console.log('   ❌ No encontrado');
    }
    console.log('');
    
    // 3. Buscar por name
    console.log('👤 3. Buscando por name "pedro":');
    const byName = await ConfidentialData.findByName('pedro');
    if (byName) {
      console.log('   ✅ Encontrado:', JSON.stringify(byName.toJSON()));
    } else {
      console.log('   ❌ No encontrado');
    }
    console.log('');
    
    // 4. Buscar por phone
    console.log('📱 4. Buscando por phone "3129382495":');
    const byPhone = await ConfidentialData.findByPhone('3129382495');
    if (byPhone) {
      console.log('   ✅ Encontrado:', JSON.stringify(byPhone.toJSON()));
    } else {
      console.log('   ❌ No encontrado');
    }
    console.log('');
    
    // 5. Buscar usando findByIdField
    console.log('🔍 5. Buscando por campo en _id (email: "pepito@p.com"):');
    const byIdField = await ConfidentialData.findByIdField('email', 'pepito@p.com');
    if (byIdField) {
      console.log('   ✅ Encontrado:', JSON.stringify(byIdField.toJSON()));
    } else {
      console.log('   ❌ No encontrado');
    }
    console.log('');
    
    // 6. Probar crear un nuevo documento
    console.log('➕ 6. Creando un nuevo documento (email: "test@example.com"):');
    try {
      const newDoc = await ConfidentialData.upsertByIdField('email', 'test@example.com', {
        name: 'Test User'
      });
      console.log('   ✅ Creado:', JSON.stringify(newDoc.toJSON()));
      
      // Eliminar el documento de prueba
      await ConfidentialData.deleteOne({ _id: newDoc._id });
      console.log('   🗑️  Documento de prueba eliminado');
    } catch (error) {
      console.log('   ❌ Error:', error.message);
    }
    console.log('');
    
    console.log('✅ Todas las pruebas completadas');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await disconnectFromMongoDB();
  }
}

testModel().catch(console.error);



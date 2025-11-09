'use strict';

const mongoose = require('mongoose');

/**
 * Script para crear el usuario de MongoDB
 * Ejecutar: node scripts/create-mongodb-user.js
 */
async function createUser() {
  console.log('🔧 Creando usuario de MongoDB...');
  console.log('   Usuario: liveDemoApp');
  console.log('   Base de datos: liveDemoDB');
  console.log('');
  
  try {
    // Conectar sin autenticación a la base de datos admin
    await mongoose.connect('mongodb://localhost:27017/admin', {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Conectado a MongoDB');
    console.log('');
    
    const adminDb = mongoose.connection.db.admin();
    
    // Verificar si el usuario ya existe
    console.log('🔍 Verificando si el usuario ya existe...');
    try {
      const usersInfo = await mongoose.connection.db.admin().command({
        usersInfo: { user: 'liveDemoApp', db: 'admin' }
      });
      
      if (usersInfo.users && usersInfo.users.length > 0) {
        console.log('⚠️  El usuario "liveDemoApp" ya existe');
        console.log('');
        console.log('💡 Opciones:');
        console.log('   1. Eliminar el usuario existente y recrearlo');
        console.log('   2. Actualizar la contraseña del usuario existente');
        console.log('   3. Usar el usuario existente');
        console.log('');
        console.log('   Para eliminar el usuario:');
        console.log('   mongosh mongodb://localhost:27017/admin');
        console.log('   db.dropUser("liveDemoApp")');
        console.log('');
        
        // Intentar eliminar y recrear
        console.log('🗑️  Intentando eliminar el usuario existente...');
        try {
          await mongoose.connection.db.command({
            dropUser: 'liveDemoApp'
          });
          console.log('✅ Usuario eliminado');
        } catch (err) {
          console.log('❌ No se pudo eliminar:', err.message);
          console.log('   Debes eliminarlo manualmente');
          await mongoose.disconnect();
          return;
        }
      }
    } catch (err) {
      // El usuario no existe, continuar con la creación
      console.log('ℹ️  El usuario no existe, procediendo a crearlo...');
    }
    
    // Crear el usuario
    console.log('');
    console.log('👤 Creando usuario...');
    try {
      await mongoose.connection.db.command({
        createUser: 'liveDemoApp',
        pwd: 'liveDemo123',
        roles: [
          { role: 'readWrite', db: 'liveDemoDB' }
        ]
      });
      
      console.log('✅ Usuario creado exitosamente!');
      console.log('');
      console.log('📋 Resumen:');
      console.log('   Usuario: liveDemoApp');
      console.log('   Contraseña: liveDemo123');
      console.log('   Base de datos: liveDemoDB');
      console.log('   Permisos: readWrite');
      console.log('');
      console.log('✅ Ahora puedes usar la conexión con autenticación');
      
    } catch (err) {
      console.error('❌ Error al crear el usuario:', err.message);
      
      if (err.message.includes('already exists')) {
        console.log('');
        console.log('💡 El usuario ya existe. Intenta:');
        console.log('   1. Cambiar la contraseña:');
        console.log('      db.changeUserPassword("liveDemoApp", "liveDemo123")');
        console.log('   2. O usar la conexión sin autenticación');
      }
    }
    
  } catch (error) {
    console.error('');
    console.error('❌ Error de conexión:', error.message);
    console.error('');
    console.error('💡 Asegúrate de que:');
    console.error('   1. MongoDB esté corriendo');
    console.error('   2. Tienes permisos para crear usuarios');
    console.error('');
    console.error('   Puedes crear el usuario manualmente ejecutando:');
    console.error('   mongosh mongodb://localhost:27017/admin');
    console.error('   use admin');
    console.error('   db.createUser({');
    console.error('     user: "liveDemoApp",');
    console.error('     pwd: "liveDemo123",');
    console.error('     roles: [{ role: "readWrite", db: "liveDemoDB" }]');
    console.error('   })');
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('');
    console.log('🔌 Desconectado de MongoDB');
  }
}

createUser().catch(console.error);


# Guía Paso a Paso: Integración de MongoDB para Persistencia

## 📋 Resumen

Esta guía te muestra cómo integrar MongoDB para almacenar las parejas **[información privada, token]** en lugar de usar archivos JSON. La implementación mantiene compatibilidad total con el código existente mediante una interfaz común.

---

## 🎯 ¿Qué se ha implementado?

### ✅ Arquitectura

1. **Dos sistemas de almacenamiento compatibles:**
   - `FileStorage`: Almacenamiento original basado en archivos JSON
   - `MongoStorage`: Nuevo almacenamiento basado en MongoDB

2. **Interfaz común:** Ambos implementan los mismos métodos (`saveToken`, `getByToken`)

3. **Configuración flexible:** Se selecciona el tipo de almacenamiento mediante variables de entorno

### ✅ Archivos creados/modificados

**Nuevos archivos:**
- `src/lib/mongodb.js` - Módulo de conexión a MongoDB
- `src/models/Token.js` - Modelo/esquema de Mongoose para tokens

**Archivos modificados:**
- `src/lib/storage.js` - Agregada clase `MongoStorage`
- `src/lib/config.js` - Agregadas configuraciones de MongoDB
- `src/lib/vault.js` - Soporte para seleccionar tipo de almacenamiento
- `src/app.js` - Inicialización de MongoDB
- `src/index.js` - Manejo async y cierre graceful de MongoDB
- `package.json` - Agregada dependencia `mongoose`

---

## 📝 Paso a Paso: Cómo Usar MongoDB

### **Paso 1: Instalar Dependencias**

Ya está instalado, pero para referencia:

```bash
npm install mongoose
```

---

### **Paso 2: Configurar Variables de Entorno**

Edita tu archivo `.env` y agrega las siguientes variables:

#### **Opción A: Usar MongoDB (recomendado para producción)**

```env
# Configuración básica
PORT=3000
API_KEY=change-me-please
VAULT_MASTER_KEY=please-set-a-strong-32+chars-secret-key-for-demo-purposes-only
STORAGE_FILE_PATH=./vault-storage.json

# Configuración de MongoDB
STORAGE_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/privacy-vault
```

#### **Opción B: Usar Archivo (por defecto, para desarrollo)**

```env
# Configuración básica
PORT=3000
API_KEY=change-me-please
VAULT_MASTER_KEY=please-set-a-strong-32+chars-secret-key-for-demo-purposes-only
STORAGE_FILE_PATH=./vault-storage.json

# No especificar STORAGE_TYPE o usar 'file'
STORAGE_TYPE=file
# MONGODB_URI no es necesario
```

#### **Ejemplos de MONGODB_URI:**

1. **MongoDB Local:**
   ```
   MONGODB_URI=mongodb://localhost:27017/privacy-vault
   ```

2. **MongoDB con Autenticación:**
   ```
   MONGODB_URI=mongodb://usuario:password@localhost:27017/privacy-vault?authSource=admin
   ```

3. **MongoDB Atlas (Cloud):**
   ```
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/privacy-vault?retryWrites=true&w=majority
   ```

4. **MongoDB con Opciones Adicionales:**
   ```
   MONGODB_URI=mongodb://localhost:27017/privacy-vault?retryWrites=true&w=majority&ssl=true
   ```

---

### **Paso 3: Iniciar MongoDB**

#### **Opción A: MongoDB Local (si lo tienes instalado)**

```bash
# Windows (si tienes MongoDB como servicio, se inicia automáticamente)
# O manualmente:
mongod --dbpath "C:\data\db"

# Linux/Mac
sudo systemctl start mongod
# O manualmente:
mongod --dbpath /data/db
```

#### **Opción B: MongoDB usando Docker**

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### **Opción C: MongoDB Atlas (Cloud)**

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Obtén la URI de conexión
4. Agrega tu IP a la whitelist

---

### **Paso 4: Ejecutar la Aplicación**

```bash
npm start
```

Si todo está configurado correctamente, verás:

```
✅ Connected to MongoDB
✅ MongoDB connection established
Privacy Vault listening on port 3000
Storage type: mongodb
```

---

### **Paso 5: Probar la Integración**

#### **Test 1: Crear un Token (Anonimizar)**

```bash
curl -X POST http://localhost:3000/anonymize \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me-please" \
  -d '{
    "data": {
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+1234567890"
    }
  }'
```

**Respuesta:**
```json
{
  "data": {
    "name": "tok_abc123...",
    "email": "tok_def456...",
    "phone": "tok_ghi789..."
  }
}
```

#### **Test 2: Recuperar Información (Desanonimizar)**

```bash
curl -X POST http://localhost:3000/deanonymize \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me-please" \
  -d '{
    "data": {
      "name": "tok_abc123...",
      "email": "tok_def456..."
    }
  }'
```

**Respuesta:**
```json
{
  "data": {
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

---

## 🔍 Verificar los Datos en MongoDB

### **Opción 1: MongoDB Compass (GUI)**

1. Descarga [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Conecta a `mongodb://localhost:27017`
3. Navega a la base de datos `privacy-vault`
4. Abre la colección `tokens`
5. Verás documentos como:

```json
{
  "_id": ObjectId("..."),
  "token": "tok_abc123...",
  "encryptedValue": "encrypted_data_here...",
  "metadata": {
    "field": "email"
  },
  "createdAt": ISODate("2024-01-01T00:00:00.000Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00.000Z")
}
```

### **Opción 2: MongoDB Shell (mongosh)**

```bash
# Conectar a MongoDB
mongosh mongodb://localhost:27017/privacy-vault

# Ver todas las colecciones
show collections

# Consultar tokens
db.tokens.find().pretty()

# Contar tokens
db.tokens.countDocuments()

# Buscar un token específico
db.tokens.findOne({ token: "tok_abc123..." })
```

---

## 📊 Estructura de Datos en MongoDB

### **Colección: `tokens`**

Cada documento tiene la siguiente estructura:

```javascript
{
  _id: ObjectId("..."),              // ID único de MongoDB
  token: "tok_abc123...",             // Token único (índice único)
  encryptedValue: "encrypted...",     // Valor cifrado de la información privada
  metadata: {                          // Metadatos adicionales
    field: "email",                   // Campo original
    type: "email"                      // Tipo de PII (opcional)
  },
  createdAt: ISODate("..."),          // Fecha de creación
  updatedAt: ISODate("...")           // Fecha de última actualización
}
```

### **Índices**

- `token`: Índice único para búsquedas rápidas
- `{ token: 1, createdAt: -1 }`: Índice compuesto (opcional)

---

## 🔄 Migración desde FileStorage a MongoDB

Si ya tienes datos en `vault-storage.json` y quieres migrarlos a MongoDB:

### **Script de Migración (Manual)**

1. Lee `vault-storage.json`
2. Por cada token, usa la API para crear el token en MongoDB
3. O crea un script personalizado:

```javascript
// migrar-tokens.js
const fs = require('fs');
const mongoose = require('mongoose');
const Token = require('./src/models/Token');
const { connectToMongoDB } = require('./src/lib/mongodb');

async function migrate() {
  // Conectar a MongoDB
  await connectToMongoDB(process.env.MONGODB_URI);
  
  // Leer archivo JSON
  const data = JSON.parse(fs.readFileSync('./vault-storage.json', 'utf8'));
  
  // Migrar cada token
  for (const [token, value] of Object.entries(data.tokens)) {
    await Token.upsertToken(token, value.v, value.m);
    console.log(`Migrado: ${token}`);
  }
  
  console.log('Migración completada');
  await mongoose.disconnect();
}

migrate().catch(console.error);
```

---

## ⚙️ Configuración Avanzada

### **Variables de Entorno Completas**

```env
# Servidor
PORT=3000

# Seguridad
API_KEY=change-me-please
VAULT_MASTER_KEY=please-set-a-strong-32+chars-secret-key-for-demo-purposes-only

# Almacenamiento (FileStorage)
STORAGE_FILE_PATH=./vault-storage.json

# Almacenamiento (MongoDB)
STORAGE_TYPE=mongodb                    # 'file' o 'mongodb'
MONGODB_URI=mongodb://localhost:27017/privacy-vault
```

### **Manejo de Errores**

El código maneja automáticamente:
- ✅ Reconexión automática si MongoDB se desconecta
- ✅ Validación de configuración antes de iniciar
- ✅ Cierre graceful al detener el servidor
- ✅ Logging de errores de conexión

---

## 🛡️ Consideraciones de Seguridad

1. **Cifrado:**
   - Los valores en MongoDB están cifrados (usando `VAULT_MASTER_KEY`)
   - El campo `encryptedValue` contiene datos cifrados, no texto plano

2. **Acceso a MongoDB:**
   - Usa autenticación en producción
   - Restringe acceso por red/firewall
   - Considera usar MongoDB Atlas con cifrado en tránsito

3. **Backup:**
   - Configura backups regulares de la base de datos
   - Considera replicación para alta disponibilidad

---

## 📚 Referencias

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## ✅ Checklist de Implementación

- [x] Instalar mongoose
- [x] Crear módulo de conexión MongoDB
- [x] Crear modelo Token
- [x] Implementar MongoStorage
- [x] Actualizar configuración
- [x] Actualizar vault.js
- [x] Actualizar app.js
- [x] Actualizar index.js
- [x] Probar conexión
- [x] Probar guardar tokens
- [x] Probar recuperar tokens

---

## 🎉 ¡Listo!

Tu aplicación ahora puede usar MongoDB para almacenar las parejas **[información privada, token]** de forma persistente y escalable.

Para cambiar entre FileStorage y MongoDB, solo necesitas modificar `STORAGE_TYPE` en el archivo `.env`.


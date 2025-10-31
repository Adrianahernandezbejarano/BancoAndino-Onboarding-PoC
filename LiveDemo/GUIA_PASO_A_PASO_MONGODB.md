# 📚 Guía Paso a Paso: Implementar Persistencia en MongoDB

## 🎯 Objetivo

Esta guía te ayudará a implementar persistencia en MongoDB para almacenar las parejas **[información privada, token]** de forma segura y escalable.

---

## 📋 Prerequisitos

- Node.js instalado (v14 o superior)
- MongoDB instalado o acceso a MongoDB Atlas (cloud)
- Conocimientos básicos de terminal/consola

---

## 🚀 PASO 1: Instalar Mongoose

**Mongoose** es la librería que usaremos para conectarnos a MongoDB desde Node.js.

### Ejecuta en la terminal:

```bash
npm install mongoose
```

✅ **Verificación**: Verifica que `mongoose` aparezca en `package.json` bajo `dependencies`.

---

## 🔧 PASO 2: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (si no existe) con la siguiente configuración:

### Para usar MongoDB:

```env
# Configuración del servidor
PORT=3000

# Seguridad
API_KEY=tu-clave-api-secreta-aqui
VAULT_MASTER_KEY=una-clave-maestra-muy-segura-de-al-menos-32-caracteres

# Tipo de almacenamiento: 'file' o 'mongodb'
STORAGE_TYPE=mongodb

# URI de conexión a MongoDB
MONGODB_URI=mongodb://localhost:27017/privacy-vault
```

### Ejemplos de MONGODB_URI según tu caso:

**1. MongoDB Local (sin autenticación):**
```env
MONGODB_URI=mongodb://localhost:27017/privacy-vault
```

**2. MongoDB Local con autenticación:**
```env
MONGODB_URI=mongodb://usuario:password@localhost:27017/privacy-vault?authSource=admin
```

**3. MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/privacy-vault?retryWrites=true&w=majority
```

**4. MongoDB con opciones adicionales:**
```env
MONGODB_URI=mongodb://localhost:27017/privacy-vault?retryWrites=true&w=majority&ssl=true
```

---

## 💾 PASO 3: Instalar y Configurar MongoDB

### Opción A: MongoDB Local (Windows)

**Si MongoDB no está instalado:**

1. Descarga MongoDB desde: https://www.mongodb.com/try/download/community
2. Instala siguiendo el asistente
3. MongoDB normalmente se inicia automáticamente como servicio en Windows

**Verificar que MongoDB esté corriendo:**
```powershell
# Verificar el servicio
Get-Service MongoDB

# O verificar el puerto
netstat -an | findstr :27017
```

### Opción B: MongoDB con Docker

Si tienes Docker instalado:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Opción C: MongoDB Atlas (Cloud - Recomendado para pruebas rápidas)

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea una cuenta gratuita
3. Crea un cluster gratuito
4. Obtén la cadena de conexión (connection string)
5. Configura la whitelist de IPs (permite todas temporalmente para pruebas: `0.0.0.0/0`)

---

## ✅ PASO 4: Verificar que el Código Esté Correcto

El código ya está implementado, pero verifica estos archivos:

### Estructura esperada:

```
src/
├── lib/
│   ├── mongodb.js      ✅ Módulo de conexión a MongoDB
│   ├── storage.js      ✅ Implementa MongoStorage
│   └── vault.js        ✅ Usa MongoStorage cuando STORAGE_TYPE=mongodb
└── models/
    └── Token.js        ✅ Modelo Mongoose para tokens
```

### Archivos clave:

1. **`src/lib/mongodb.js`**: Maneja la conexión a MongoDB
2. **`src/models/Token.js`**: Define el esquema de la colección `tokens`
3. **`src/lib/storage.js`**: Contiene la clase `MongoStorage` que implementa `saveToken()` y `getByToken()`
4. **`src/app.js`**: Conecta a MongoDB antes de iniciar el servidor
5. **`src/index.js`**: Cierra la conexión gracefulmente al detener el servidor

---

## 🧪 PASO 5: Probar la Conexión

### 5.1 Iniciar el servidor:

```bash
npm start
```

### 5.2 Verificación esperada:

Si todo está bien, deberías ver en la consola:

```
✅ Connected to MongoDB
✅ MongoDB connection established
Privacy Vault listening on port 3000
Storage type: mongodb
```

### 5.3 Si hay errores:

**Error: "MONGODB_URI must be set when STORAGE_TYPE=mongodb"**
- ✅ Solución: Agrega `MONGODB_URI=...` a tu archivo `.env`

**Error: "Failed to connect to MongoDB"**
- ✅ Verifica que MongoDB esté corriendo: `Get-Service MongoDB`
- ✅ Verifica la URI en `.env` (revisa usuario, password, host, puerto)
- ✅ Si usas MongoDB Atlas, verifica que tu IP esté en la whitelist

**Error: "Authentication failed"**
- ✅ Verifica usuario y contraseña en la URI
- ✅ Verifica el `authSource` en la URI

---

## 🔐 PASO 6: Crear y Almacenar Tokens

### Test 1: Anonimizar datos (crear tokens)

```bash
# En PowerShell
curl.exe -X POST http://localhost:3000/anonymize `
  -H "Content-Type: application/json" `
  -H "x-api-key: tu-clave-api-secreta-aqui" `
  -d '{\"data\":{\"name\":\"Juan Pérez\",\"email\":\"juan@example.com\",\"phone\":\"+1234567890\"}}'
```

**O usando PowerShell con Invoke-RestMethod:**

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "x-api-key" = "tu-clave-api-secreta-aqui"
}

$body = @{
    data = @{
        name = "Juan Pérez"
        email = "juan@example.com"
        phone = "+1234567890"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/anonymize" -Method POST -Headers $headers -Body $body
```

**Respuesta esperada:**
```json
{
  "data": {
    "name": "tok_abc123...",
    "email": "tok_def456...",
    "phone": "tok_ghi789..."
  }
}
```

✅ **Lo que pasó:** 
- Se crearon 3 tokens en MongoDB
- Cada token está vinculado a un valor cifrado de la información privada
- Los tokens se guardaron en la colección `tokens`

---

## 🔍 PASO 7: Recuperar Información (Desanonimizar)

### Test 2: Recuperar datos usando tokens

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "x-api-key" = "tu-clave-api-secreta-aqui"
}

$body = @{
    data = @{
        name = "tok_abc123..."  # Usa el token que recibiste antes
        email = "tok_def456..."
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/deanonymize" -Method POST -Headers $headers -Body $body
```

**Respuesta esperada:**
```json
{
  "data": {
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

✅ **Lo que pasó:**
- El sistema buscó los tokens en MongoDB
- Desencriptó los valores usando `VAULT_MASTER_KEY`
- Retornó la información original

---

## 📊 PASO 8: Verificar los Datos en MongoDB

### Opción A: MongoDB Compass (GUI - Recomendado)

1. **Descarga MongoDB Compass**: https://www.mongodb.com/products/compass
2. **Conecta** usando tu `MONGODB_URI`
3. **Navega** a la base de datos `privacy-vault`
4. **Abre** la colección `tokens`
5. **Verás documentos** como:

```json
{
  "_id": ObjectId("65a1b2c3d4e5f6789012345"),
  "token": "tok_abc123...",
  "encryptedValue": "U2FsdGVkX1+vupppZksvRf5pq5g5XkFy...",
  "metadata": {
    "field": "email"
  },
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

### Opción B: MongoDB Shell (mongosh)

```bash
# Conectar a MongoDB
mongosh mongodb://localhost:27017/privacy-vault

# Ver todas las colecciones
show collections

# Consultar todos los tokens
db.tokens.find().pretty()

# Contar cuántos tokens hay
db.tokens.countDocuments()

# Buscar un token específico
db.tokens.findOne({ token: "tok_abc123..." })

# Ver los últimos 10 tokens creados
db.tokens.find().sort({ createdAt: -1 }).limit(10).pretty()
```

---

## 📦 PASO 9: Migrar Datos Existentes (Opcional)

Si ya tienes tokens guardados en `vault-storage.json` y quieres migrarlos a MongoDB:

### 9.1 Configurar MongoDB en `.env`:

```env
STORAGE_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/privacy-vault
```

### 9.2 Ejecutar el script de migración:

```bash
npm run mongo:migrate
```

✅ **Resultado esperado:**
```
✅ Migration completed. Migrated: 15, Failed: 0
✅ Disconnected from MongoDB
```

---

## 🔄 PASO 10: Cambiar entre File Storage y MongoDB

Puedes alternar entre almacenamiento en archivo y MongoDB simplemente cambiando `STORAGE_TYPE`:

### Usar MongoDB:
```env
STORAGE_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/privacy-vault
```

### Usar archivo:
```env
STORAGE_TYPE=file
STORAGE_FILE_PATH=./vault-storage.json
```

No necesitas cambiar código, solo las variables de entorno. ✅

---

## 📋 Estructura de Datos en MongoDB

### Colección: `tokens`

Cada documento representa una pareja **[token, información privada cifrada]**:

```javascript
{
  _id: ObjectId("..."),              // ID único de MongoDB (automático)
  token: "tok_abc123...",             // Token único (índice único para búsqueda rápida)
  encryptedValue: "U2FsdGVkX1+...",  // Valor cifrado de la información privada
  metadata: {                         // Metadatos opcionales
    field: "email",                   // Nombre del campo original
    type: "email"                     // Tipo de PII (opcional)
  },
  createdAt: ISODate("..."),          // Fecha de creación (automático)
  updatedAt: ISODate("...")           // Fecha de última actualización (automático)
}
```

### Índices:

- `token`: Índice único para búsquedas rápidas por token
- `{ token: 1, createdAt: -1 }`: Índice compuesto para consultas optimizadas

---

## 🛡️ Consideraciones de Seguridad

### ✅ Buenas Prácticas:

1. **Cifrado:**
   - ✅ Los valores en MongoDB están cifrados (usando `VAULT_MASTER_KEY`)
   - ✅ Solo los tokens son visibles en texto plano
   - ✅ Los valores cifrados no pueden ser descifrados sin la clave maestra

2. **Acceso a MongoDB:**
   - ✅ Usa autenticación en producción
   - ✅ Restringe acceso por red/firewall
   - ✅ Considera MongoDB Atlas con cifrado en tránsito (SSL/TLS)

3. **Claves:**
   - ✅ `VAULT_MASTER_KEY`: Debe ser fuerte (≥32 caracteres) y mantenerla secreta
   - ✅ `API_KEY`: Protege tus endpoints API
   - ✅ Nunca commits estas claves en Git

4. **Backup:**
   - ✅ Configura backups regulares de MongoDB
   - ✅ Considera replicación para alta disponibilidad

---

## ❓ Troubleshooting Común

### Problema: "Mongoose is not defined"

**Solución:**
```bash
npm install mongoose
```

---

### Problema: "Connection timeout"

**Solución:**
1. Verifica que MongoDB esté corriendo
2. Verifica que el puerto 27017 esté accesible
3. Si usas MongoDB Atlas, verifica la whitelist de IPs

---

### Problema: "E11000 duplicate key error"

**Solución:**
- Este error indica que intentaste crear un token que ya existe
- El código maneja esto automáticamente con `upsert`, pero si persiste, verifica la conexión

---

### Problema: "Cannot read property 'findByToken' of undefined"

**Solución:**
- Verifica que `mongoose` esté instalado: `npm list mongoose`
- Verifica que la conexión a MongoDB se haya establecido antes de usar el modelo

---

## 📚 Referencias

- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Connection Strings](https://docs.mongodb.com/manual/reference/connection-string/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## ✅ Checklist de Implementación

Usa esta lista para verificar que todo esté correcto:

- [ ] Mongoose instalado (`npm install mongoose`)
- [ ] Archivo `.env` creado con `STORAGE_TYPE=mongodb` y `MONGODB_URI`
- [ ] MongoDB corriendo (local o Atlas)
- [ ] Servidor inicia sin errores (`npm start`)
- [ ] Mensaje "✅ Connected to MongoDB" aparece en consola
- [ ] Puedo crear tokens (POST `/anonymize`)
- [ ] Puedo recuperar datos (POST `/deanonymize`)
- [ ] Puedo ver los tokens en MongoDB Compass o mongosh
- [ ] Script de migración funciona (si aplica)

---

## 🎉 ¡Listo!

Ahora tienes persistencia en MongoDB funcionando. Las parejas **[información privada, token]** se almacenan de forma segura y escalable en MongoDB.

**Próximos pasos sugeridos:**
- Configurar backups automáticos
- Implementar índices adicionales si manejas grandes volúmenes
- Configurar replicación para alta disponibilidad
- Implementar rotación de claves para producción


# ✅ Verificación de Conexión a MongoDB

## 📋 Resultado de la Verificación

**Estado:** ✅ **CONEXIÓN EXITOSA**

### Información de Conexión

- **Host:** localhost
- **Puerto:** 27017
- **Base de datos:** liveDemoDB
- **Usuario:** liveDemoApp
- **Contraseña:** liveDemo123 (configurada)
- **Estado:** Conectado ✅

### Verificaciones Completadas

✅ **Conexión a MongoDB:** Exitosa
- MongoDB está corriendo en el puerto 27017
- La conexión se estableció correctamente

✅ **Autenticación:** Exitosa
- Usuario `liveDemoApp` existe
- Credenciales funcionan correctamente
- Usuario creado con permisos `readWrite` en `liveDemoDB`

✅ **Permisos de Lectura:** Verificados
- Puede listar colecciones
- Encontradas 1 colección existente: `confidentialData`

✅ **Permisos de Escritura:** Verificados
- Puede crear documentos
- Puede actualizar documentos
- Puede eliminar documentos

✅ **Colección "tokens":** Lista
- La colección se creará automáticamente al guardar el primer token
- No es necesario crearla manualmente

## 🚀 Próximos Pasos

### 1. Iniciar la Aplicación

```powershell
npm start
```

**Salida esperada:**
```
✅ Connected to MongoDB
✅ MongoDB connection established
Privacy Vault listening on port 3000
Storage type: mongodb
```

### 2. Probar la Aplicación

#### Anonimizar datos (crear tokens):
```powershell
$headers = @{
    "Content-Type" = "application/json"
    "x-api-key" = "change-me-please"
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

#### Desanonimizar datos (recuperar información):
```powershell
$body = @{
    data = @{
        name = "tok_abc123..."  # Usa el token recibido antes
        email = "tok_def456..."
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/deanonymize" -Method POST -Headers $headers -Body $body
```

## 📊 Estructura en MongoDB

### Base de Datos: `liveDemoDB`

### Colección: `tokens` (se creará automáticamente)

Estructura de cada documento:
```json
{
  "_id": ObjectId("..."),
  "token": "tok_abc123...",
  "encryptedValue": "cifrado...",
  "metadata": {
    "field": "email"
  },
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

## 🔍 Verificar en MongoDB Compass

1. **Conectar a:**
   ```
   mongodb://liveDemoApp:liveDemo123@localhost:27017/liveDemoDB?authSource=admin
   ```

2. **Navegar a:**
   - Base de datos: `liveDemoDB`
   - Colección: `tokens`

3. **Ver tokens guardados:**
   - Los tokens aparecerán después de usar el endpoint `/anonymize`

## 📝 Scripts Disponibles

### Crear/Verificar Usuario de MongoDB
```powershell
node scripts/create-mongodb-user.js
```

### Migrar datos desde archivo a MongoDB
```powershell
npm run mongo:migrate
```

## ⚠️ Notas Importantes

1. **Usuario creado:** El usuario `liveDemoApp` fue creado exitosamente con permisos `readWrite` en `liveDemoDB`

2. **Clave maestra:** La clave `VAULT_MASTER_KEY` en el archivo `.env` es la que se usa para cifrar/descifrar. Guárdala de forma segura.

3. **API Key:** Cambia el `API_KEY` en producción por una clave segura.

4. **Conexión persistente:** La aplicación maneja automáticamente:
   - Reconexión si MongoDB se desconecta
   - Cierre graceful al detener el servidor

## ✅ Todo Listo

Tu aplicación está configurada y lista para usar MongoDB. Los tokens se guardarán automáticamente en la colección `tokens` de la base de datos `liveDemoDB`.


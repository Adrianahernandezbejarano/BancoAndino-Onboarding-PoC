# ✅ Configuración de MongoDB Completada

## 📋 Información de Conexión

- **Base de datos:** `liveDemoDB`
- **Usuario:** `liveDemoApp`
- **Contraseña:** `liveDemo123`
- **Host:** `localhost:27017`
- **URI completa:** `mongodb://liveDemoApp:liveDemo123@localhost:27017/liveDemoDB?authSource=admin`

## 🔐 Variables Configuradas

| Variable | Valor | Estado |
|----------|-------|--------|
| `STORAGE_TYPE` | `mongodb` | ✅ Configurado |
| `MONGODB_URI` | `mongodb://liveDemoApp:liveDemo123@localhost:27017/liveDemoDB?authSource=admin` | ✅ Configurado |
| `VAULT_MASTER_KEY` | `9d74c4cab0ecf048d829128760e0dd2d555783453ed925b32b26a437094eca48` | ✅ Generado (64 chars) |
| `API_KEY` | `change-me-please` | ⚠️ Cambiar en producción |
| `PORT` | `3000` | ✅ Configurado |

## 🚀 Próximos Pasos

### 1. Verificar que MongoDB esté corriendo

```powershell
# Verificar el servicio de MongoDB
Get-Service MongoDB

# O verificar el puerto
netstat -an | findstr :27017
```

### 2. Verificar que el usuario exista en MongoDB

Si el usuario `liveDemoApp` no existe, créalo en MongoDB:

```javascript
// Conectar a MongoDB
mongosh mongodb://localhost:27017/admin

// Crear usuario (si no existe)
use admin
db.createUser({
  user: "liveDemoApp",
  pwd: "liveDemo123",
  roles: [
    { role: "readWrite", db: "liveDemoDB" }
  ]
})
```

### 3. Probar la conexión

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

### 4. Probar con una petición de prueba

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "x-api-key" = "change-me-please"
}

$body = @{
    data = @{
        name = "Juan Pérez"
        email = "juan@example.com"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/anonymize" -Method POST -Headers $headers -Body $body
```

## 🔍 Verificar Datos en MongoDB

### Usando MongoDB Compass:
1. Conecta a: `mongodb://liveDemoApp:liveDemo123@localhost:27017/liveDemoDB?authSource=admin`
2. Navega a la colección `tokens`

### Usando mongosh:
```bash
mongosh "mongodb://liveDemoApp:liveDemo123@localhost:27017/liveDemoDB?authSource=admin"

# Ver tokens
db.tokens.find().pretty()
```

## ⚠️ Importante

1. **Cambia el API_KEY** antes de usar en producción
2. **Guarda de forma segura** el `VAULT_MASTER_KEY` - sin esta clave no podrás descifrar los datos
3. **No commits** el archivo `.env` en Git (debería estar en `.gitignore`)

## 📁 Estructura de Datos

Los tokens se almacenarán en:
- **Base de datos:** `liveDemoDB`
- **Colección:** `tokens`
- **Índice único:** campo `token`

Cada documento tiene esta estructura:
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


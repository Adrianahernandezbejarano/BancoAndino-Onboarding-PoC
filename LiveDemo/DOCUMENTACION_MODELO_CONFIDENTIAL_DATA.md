# 📚 Documentación del Modelo ConfidentialData

## 📋 Descripción

El modelo `ConfidentialData` representa la estructura de la colección `confidentialData` en MongoDB. Esta colección almacena información confidencial donde cada documento tiene una estructura única con un campo identificador en el `_id`.

## 🗂️ Estructura de Datos

### Estructura Observada en la Base de Datos

Cada documento en la colección `confidentialData` tiene la siguiente estructura:

```javascript
{
  "_id": {
    "email": "pepito@p.com"  // o "name": "pedro" o "phone": "3129382495"
  }
}
```

### Campos del Modelo

- **`_id`** (Mixed, requerido): Objeto que contiene el campo identificador principal (email, name, o phone)
- **`email`** (String, opcional, sparse): Email en formato lowercase
- **`name`** (String, opcional, sparse): Nombre de la persona
- **`phone`** (String, opcional, sparse): Número de teléfono

**Nota:** Los campos `email`, `name`, y `phone` son opcionales (sparse), lo que significa que no todos los documentos tienen todos los campos. El campo que está en `_id` determina el tipo de dato principal del documento.

## 🚀 Uso del Modelo

### Importar el Modelo

```javascript
const ConfidentialData = require('./src/models/ConfidentialData');
```

### Métodos Estáticos Disponibles

#### 1. `findAll()`

Obtiene todos los documentos de la colección.

```javascript
const allDocs = await ConfidentialData.findAll();
console.log(`Encontrados: ${allDocs.length} documentos`);
```

#### 2. `findByEmail(email)`

Busca un documento por email (busca tanto en el nivel raíz como en `_id.email`).

```javascript
const doc = await ConfidentialData.findByEmail('pepito@p.com');
if (doc) {
  console.log('Encontrado:', doc.toJSON());
}
```

#### 3. `findByName(name)`

Busca un documento por name (busca tanto en el nivel raíz como en `_id.name`).

```javascript
const doc = await ConfidentialData.findByName('pedro');
```

#### 4. `findByPhone(phone)`

Busca un documento por phone (busca tanto en el nivel raíz como en `_id.phone`).

```javascript
const doc = await ConfidentialData.findByPhone('3129382495');
```

#### 5. `findByIdField(field, value)`

Busca un documento por un campo específico dentro de `_id`.

```javascript
const doc = await ConfidentialData.findByIdField('email', 'pepito@p.com');
```

#### 6. `findByFields(fields)`

Busca documentos por múltiples campos.

```javascript
const docs = await ConfidentialData.findByFields({
  email: 'pepito@p.com',
  name: 'pedro'
});
```

#### 7. `upsertByIdField(field, value, additionalData)`

Crea o actualiza un documento basado en un campo identificador.

```javascript
const doc = await ConfidentialData.upsertByIdField(
  'email', 
  'test@example.com',
  {
    name: 'Test User'
  }
);
```

### Métodos de Instancia

#### `toJSON()`

Convierte el documento a JSON con formato consistente, exponiendo los campos de `_id` también en el nivel raíz.

```javascript
const doc = await ConfidentialData.findByEmail('pepito@p.com');
console.log(doc.toJSON());
// { _id: { email: 'pepito@p.com' }, email: 'pepito@p.com' }
```

## 📝 Ejemplos de Uso

### Ejemplo 1: Obtener todos los documentos

```javascript
const ConfidentialData = require('./src/models/ConfidentialData');
const { connectToMongoDB } = require('./src/lib/mongodb');

await connectToMongoDB(process.env.MONGODB_URI);

const allDocs = await ConfidentialData.findAll();
allDocs.forEach(doc => {
  console.log(doc.toJSON());
});
```

### Ejemplo 2: Buscar por email

```javascript
const doc = await ConfidentialData.findByEmail('pepito@p.com');
if (doc) {
  console.log('Email encontrado:', doc.toJSON());
} else {
  console.log('Email no encontrado');
}
```

### Ejemplo 3: Crear un nuevo documento

```javascript
const newDoc = await ConfidentialData.upsertByIdField(
  'email',
  'nuevo@example.com',
  {
    name: 'Nuevo Usuario',
    phone: '+1234567890'
  }
);
console.log('Documento creado:', newDoc.toJSON());
```

### Ejemplo 4: Buscar por múltiples campos

```javascript
const docs = await ConfidentialData.findByFields({
  email: 'pepito@p.com'
});
console.log(`Encontrados ${docs.length} documentos`);
```

## 🔍 Estructura de la Colección en MongoDB

### Base de Datos
- **Nombre:** `liveDemoDB`

### Colección
- **Nombre:** `confidentialData`

### Índices
- `_id`: Índice único (creado automáticamente por MongoDB)

## ⚠️ Notas Importantes

1. **Estructura no estándar:** Esta colección usa una estructura no estándar donde `_id` es un objeto con campos dinámicos. El modelo maneja esto correctamente.

2. **Campos sparse:** Los campos `email`, `name`, y `phone` son opcionales (sparse), lo que significa que no todos los documentos tienen todos los campos.

3. **Modo estricto deshabilitado:** El modelo tiene `strict: false` para permitir campos adicionales que puedan existir en los documentos.

4. **Sin timestamps:** El modelo no usa timestamps automáticos (`timestamps: false`) debido a la estructura especial.

## 🧪 Pruebas

Para probar el modelo, ejecuta:

```bash
node scripts/test-confidential-data-model.js
```

Este script prueba todas las funcionalidades del modelo con los datos existentes.

## 📁 Archivos Relacionados

- `src/models/ConfidentialData.js` - Definición del modelo
- `scripts/test-confidential-data-model.js` - Script de prueba
- `scripts/analyze-confidential-data.js` - Script de análisis de estructura
- `scripts/inspect-confidential-data.js` - Script de inspección

## 🔗 Integración con el Sistema de Tokens

Este modelo puede usarse junto con el sistema de tokens (`Token` model) para:

1. **Tokenizar datos confidenciales:** Los datos de `confidentialData` pueden ser tokenizados usando el sistema de vault
2. **Mantener referencia:** Los tokens pueden referenciar documentos en `confidentialData`
3. **Desanonimización:** Recuperar información confidencial desde tokens

## ✅ Estado del Modelo

- ✅ Modelo creado y probado
- ✅ Métodos de búsqueda funcionando
- ✅ Métodos de creación/actualización funcionando
- ✅ Compatible con estructura existente
- ✅ Sin warnings de índices duplicados


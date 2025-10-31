# Guía de Uso del Servicio de Anonimización

El servicio está corriendo en **http://localhost:3001**

## Endpoints Disponibles

### 1. Anonimizar (POST /anonymize)

Convierte información personal (nombres, emails, teléfonos) en tokens.

**Ejemplo en PowerShell:**

```powershell
$body = @{
    message = "oferta de trabajo para johanna Correa con email johanna.correa.c@gmail.com y teléfono 3157090897"
} | ConvertTo-Json -Compress

Invoke-RestMethod -Method Post -Uri "http://localhost:3001/anonymize" -ContentType "application/json" -Body $body
```

**Respuesta:**
```json
{
  "anonymizedMessage": "oferta de trabajo para NAME_xxx con email EMAIL_yyy y teléfono PHONE_zzz"
}
```

---

### 2. Desanonimizar (POST /deanonymize)

Convierte los tokens de vuelta al mensaje original.

**Ejemplo en PowerShell:**

```powershell
$body = @{
    anonymizedMessage = "oferta de trabajo para NAME_e1be92e2b3a5 con email EMAIL_8004719c6ea5 y telefono PHONE_40e83067b9cb"
} | ConvertTo-Json -Compress

Invoke-RestMethod -Method Post -Uri "http://localhost:3001/deanonymize" -ContentType "application/json" -Body $body
```

**Respuesta:**
```json
{
  "message": "oferta de trabajo para Pepito Perez con email ana.correa@gmail.com y telefono 3152319157"
}
```

---

### 3. Health Check (GET /health)

Verifica que el servicio esté funcionando.

**Ejemplo:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/health"
```

**Respuesta:**
```json
{
  "status": "ok"
}
```

---

## Ejemplo Completo: Flujo de Anonimización y Desanonimización

```powershell
# Paso 1: Anonimizar un mensaje
$mensajeOriginal = @{
    message = "Contacta a María García en maria.garcia@empresa.com o llámalo al 3201234567"
} | ConvertTo-Json -Compress

$resultadoAnonimizado = Invoke-RestMethod -Method Post -Uri "http://localhost:3001/anonymize" -ContentType "application/json" -Body $mensajeOriginal

Write-Host "Mensaje anonimizado:"
$resultadoAnonimizado.anonymizedMessage
Write-Host ""

# Paso 2: Guardar el mensaje anonimizado (simular almacenamiento)
$mensajeAnonimizadoGuardado = $resultadoAnonimizado.anonymizedMessage

# Paso 3: Desanonimizar cuando sea necesario
$bodyDesanonimizar = @{
    anonymizedMessage = $mensajeAnonimizadoGuardado
} | ConvertTo-Json -Compress

$resultadoDesanonimizado = Invoke-RestMethod -Method Post -Uri "http://localhost:3001/deanonymize" -ContentType "application/json" -Body $bodyDesanonimizar

Write-Host "Mensaje desanonimizado:"
$resultadoDesanonimizado.message
```

---

## Usando cURL (si tienes Git Bash o WSL)

```bash
# Anonimizar
curl -X POST http://localhost:3001/anonymize \
  -H "Content-Type: application/json" \
  -d '{"message":"oferta de trabajo para johanna Correa con email johanna.correa.c@gmail.com y teléfono 3157090897"}'

# Desanonimizar
curl -X POST http://localhost:3001/deanonymize \
  -H "Content-Type: application/json" \
  -d '{"anonymizedMessage":"oferta de trabajo para NAME_e1be92e2b3a5 con email EMAIL_8004719c6ea5 y telefono PHONE_40e83067b9cb"}'
```

---

## Notas Importantes

1. **Tokens en memoria**: Los tokens se almacenan en memoria mientras el servidor esté corriendo. Si reinicias el servidor, los tokens nuevos se perderán (excepto los tokens semilla).

2. **Tokens semilla**: Los siguientes tokens están pre-configurados para pruebas:
   - `NAME_e1be92e2b3a5` → `Pepito Perez`
   - `EMAIL_8004719c6ea5` → `ana.correa@gmail.com`
   - `PHONE_40e83067b9cb` → `3152319157`

3. **Formato de tokens**: Los tokens tienen el formato `TIPO_hash`, donde:
   - `TIPO` puede ser: `NAME`, `EMAIL`, `PHONE`
   - `hash` es un identificador hexadecimal único

4. **Detecta automáticamente**: El sistema detecta automáticamente:
   - Nombres (2-3 palabras con mayúscula inicial)
   - Emails (formato estándar)
   - Teléfonos (números con 7+ dígitos)


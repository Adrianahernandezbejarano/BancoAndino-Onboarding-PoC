## Data Privacy Vault (Node.js)

Servicio en Node.js para anonimizar información personal (PII) en texto libre, con vault reversible y soporte de OpenAI para prompts seguros.

### Características
- **Anonimización determinista**: nombres, emails y teléfonos reemplazados por tokens hex de 8 chars.
- **Vault reversible**: persistencia de pares [tipo, token, valor cifrado] en SQLite (local) o MongoDB Atlas.
- **Cifrado**: AES-256-GCM con clave en `DATA_KEY_HEX`.
- **Colombia (teléfonos)**: normaliza a 10 dígitos, tolera prefijos +57/57.
- **Deanonimización**: restaura mensajes completos o por token.
- **Secure ChatGPT**: flujo prompt -> anonimizar -> OpenAI -> desanonimizar.
- **CLIs**: insertar pares al vault vía prompts y listar contenido.

---

### Requisitos
- Node.js 18+
- PowerShell o bash

---

### Instalación
1) Clonar e instalar dependencias
```bash
npm install
```

2) Variables de entorno (ejemplos)
```bash
# Puerto
PORT=3001

# Sal para tokens deterministas (no reversible)
TOKEN_SALT=pon-un-salt-seguro

# Clave AES-256-GCM en hex (64 chars)
DATA_KEY_HEX=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# Selección de backend del vault: sqlite | mongo
VAULT_BACKEND=sqlite

# Si usas MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:clave@cluster0.ybvexgw.mongodb.net/?appName=Cluster0
MONGODB_DB=pii_vault

# Si usas OpenAI (para /secureChatGPT)
OPENAI_API_KEY=sk-...tu_key...
# OPENAI_MODEL opcional (por defecto gpt-4o-mini)
```

3) Arranque
```bash
npm run dev
# o
node src/server.js
```

---

### Endpoints

- POST `/anonymize`
  - Body: `{ "message": "texto con PII" }`
  - Resp: `{ anonymizedMessage: "..." }`

- POST `/deanonymize`
  - Modos:
    - `{ anonymizedMessage: "..." }` → `{ message: "restaurado" }`
    - `{ type: "email"|"phone"|"name", token: "xxxxxxxx" }` → `{ original: "..." }`

- POST `/secureChatGPT`
  - Body: `{ prompt: string, model?: string, temperature?: number }`
  - Flujo: anonimiza prompt → llama OpenAI → desanonimiza respuesta → `{ response: string }`

---

### Ejemplos rápidos (PowerShell)

- Anonimizar
```powershell
curl.exe -X POST "http://localhost:3001/anonymize" -H "Content-Type: application/json" -d "{\"message\":\"oferta para Dago Borda email dborda@gmail.com tel 3152319157\"}"
```

- Deanonimizar con mensaje
```powershell
curl.exe -X POST "http://localhost:3001/deanonymize" -H "Content-Type: application/json" -d "{\"anonymizedMessage\":\"TEXTO_CON_TOKENS\"}"
```

- Secure ChatGPT
```powershell
$env:OPENAI_API_KEY="sk-..."
$h = @{ "Content-Type" = "application/json" }
$b = @{ prompt = "Escribe un correo para Dago Borda (dborda@gmail.com) y teléfono 3152319157" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3001/secureChatGPT" -Headers $h -Body $b
```

---

### CLI (opcional)

- Insertar pares al vault (Mongo)
```bash
npm run vault:prompt
```
Responde a: `type (email|phone|name)`, `valor_privado`, `token`.

- Listar vault (tokens y fechas)
```bash
npm run vault:list
```

- Listar con originales descifrados (auditoría)
```bash
npm run vault:list -- --decrypt
```

---

### Notas de seguridad
- Nunca commitees `.env` ni claves. Usa variables de entorno seguras.
- Cambia periódicamente `TOKEN_SALT` y rota `DATA_KEY_HEX` si tu modelo de amenaza lo requiere.
- Limita la red y usuarios en MongoDB Atlas (Network Access y roles mínimos).
- El endpoint `/secureChatGPT` incluye una instrucción para preservar tokens.

---

### Estructura
```
src/
  server.js
  routes.js
  services/
    anonymizer.js
    deanonymizer.js
    tokenizer.js
    crypto.js
    vault.js             # selector (sqlite|mongo)
    vault.sqlite.js
    vault.mongo.js
    mongo.js
    openaiClient.js
utils/
  regex.js
scripts/
  prompt_vault.js       # insertar pares
  dump_vault.js         # listar vault
```

---

### Troubleshooting (Windows/PowerShell)
- `Cannot POST /...`: reinicia el servidor tras cambios de rutas.
- `MODULE_NOT_FOUND 'openai'`: `npm install openai`.
- `EADDRINUSE 3001`: libera el puerto (`taskkill /PID <PID> /F`).
- `npm.ps1 bloqueado`: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` o usa `npm.cmd`.
- `Invoke-WebRequest Headers`: usa `Invoke-RestMethod` o `curl.exe` en lugar de `curl` alias.



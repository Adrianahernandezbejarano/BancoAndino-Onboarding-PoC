## Data Privacy Vault (Node.js)

Anonymize and detokenize PII using tokenization backed by AES-256-GCM encryption and file storage. Designed for quick demos and small projects.

### Features
- Tokenize PII into opaque tokens like `tok_<uuid>`
- AES-256-GCM encryption with PBKDF2 key derivation
- Simple PII detection via field names and regex (email, phone, SSN)
- Express API with API key protection
- **Multiple storage backends:**
  - File-backed storage (`vault-storage.json`) - default
  - MongoDB storage - for production and scalability

### Quick start

#### Option 1: File Storage (Default)

1. Create `.env` in the project root:

```
PORT=3000
API_KEY=change-me-please
VAULT_MASTER_KEY=please-set-a-strong-32+chars-secret
STORAGE_FILE_PATH=./vault-storage.json
STORAGE_TYPE=file
```

#### Option 2: MongoDB Storage (Recommended for Production)

1. Create `.env` in the project root:

```
PORT=3000
API_KEY=change-me-please
VAULT_MASTER_KEY=please-set-a-strong-32+chars-secret
STORAGE_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/privacy-vault
```

> 📖 **See [GUIA_MONGODB.md](./GUIA_MONGODB.md) for detailed MongoDB setup instructions**

2. Install and run:

```
npm install
npm run start
```

3. Call the API:

Anonymize

```
POST /anonymize
Headers: x-api-key: change-me-please
Body:
{
  "data": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1 555-555-1212"
  }
}
```

Response:

```
{
  "data": {
    "name": "tok_...",
    "email": "tok_...",
    "phone": "tok_..."
  }
}
```

Deanonymize
Anonymize free text

```
POST /anonymize-text
Headers: x-api-key: change-me-please
Body:
{
  "text": "Contact Jane Doe at jane@example.com or +1 (555) 222-3333."
}
```

Response:

```
{
  "text": "Contact tok_... at tok_... or tok_....",
  "replacements": [
    { "type": "name", "token": "tok_..." },
    { "type": "email", "token": "tok_..." },
    { "type": "phone", "token": "tok_..." }
  ]
}
```

Deanonymize free text

```
POST /deanonymize-text
Headers: x-api-key: change-me-please
Body:
{
  "text": "Contact tok_... at tok_... or tok_...."
}
```

Response:

```
{
  "text": "Contact Jane Doe at jane@example.com or +1 (555) 222-3333."
}
```


```
POST /deanonymize
Headers: x-api-key: change-me-please
Body:
{
  "data": {
    "name": "tok_...",
    "email": "tok_..."
  }
}
```

### Configuration

**Required:**
- `VAULT_MASTER_KEY` (required): Strong secret (≥32 chars). Used to derive encryption keys.

**Optional:**
- `API_KEY`: If set, required in `x-api-key` header. Recommended for production.
- `PORT` (default: 3000): Server port
- `STORAGE_TYPE` (default: `file`): Storage backend - `file` or `mongodb`
- `STORAGE_FILE_PATH` (default: `./vault-storage.json`): Path for file storage (only used when `STORAGE_TYPE=file`)
- `MONGODB_URI`: MongoDB connection string (required when `STORAGE_TYPE=mongodb`)

### Security notes
- This demo uses file storage and in-process crypto; for production use an HSM/KMS (AWS KMS, Azure Key Vault, GCP KMS), rotate keys, and store mappings in a database with access controls and audit logging.
- Restrict access to the detokenization endpoint. Consider separating services and networks for anon vs. deanonymize operations.
- Validate and minimize PII processed; prefer explicit `piiFields` when calling `/anonymize` to reduce false positives.

### Advanced usage
You can pass `piiFields` in the `/anonymize` body to explicitly control which fields are tokenized:

```
{
  "data": { "customerId": 123, "email": "jane@example.com" },
  "piiFields": ["email"]
}
```

### License
MIT



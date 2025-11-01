require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const app = express();

// Middleware para parsear JSON de requests
app.use(express.json());

// Rutas
app.use(routes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`PII Anonymizer escuchando en http://localhost:${PORT}`);
});



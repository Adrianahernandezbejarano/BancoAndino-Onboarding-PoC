const express = require('express');
const cors = require('cors');
const validationRoutes = require('./routes/validation.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/validation', validationRoutes);

app.use(errorHandler);

module.exports = app;


'use strict';

const express = require('express');
const crypto = require('crypto');
const { anonymizeText } = require('./lib/text');
const { i18nMiddleware } = require('./lib/i18n');
const {
  HTTP_STATUS,
  SERVER,
  TOKEN,
  PII_TYPE,
  CRYPTO,
  REGEX,
  DEMO_SEED_TOKENS
} = require('./lib/constants');

// In-memory maps for demo reverse lookups
const tokenToValue = new Map(DEMO_SEED_TOKENS);
const valueToToken = new Map();
for (const [t, v] of tokenToValue.entries()) valueToToken.set(v, t);

function hashHex(value, len = TOKEN.DEFAULT_HASH_LENGTH) {
  return crypto.createHash(CRYPTO.HASH_ALGORITHM).update(String(value)).digest('hex').slice(0, len);
}

function buildDemoServer() {
  const app = express();
  
  // Middleware de internacionalización (debe ir antes de otros middlewares)
  app.use(i18nMiddleware);
  
  // Middleware para parsear JSON con manejo de errores
  app.use(express.json({ 
    limit: SERVER.JSON_BODY_LIMIT,
    strict: true 
  }));
  
  // Middleware para capturar errores de parsing JSON
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === HTTP_STATUS.BAD_REQUEST && 'body' in err) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
        error: req.t('errors.invalidJson'), 
        details: req.t('errors.invalidJsonDetails') 
      });
    }
    next(err);
  });

  app.get('/health', (req, res) => {
    try {
      res.json({ status: req.t('status.ok') });
    } catch (err) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: req.t('errors.healthCheckFailed') });
    }
  });

  // POST /anonymize { message } -> { anonymizedMessage }
  app.post('/anonymize', async (req, res) => {
    try {
      // Validar que el body existe y tiene el formato correcto
      if (!req.body || typeof req.body !== 'object') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: req.t('errors.invalidRequestBody'), 
          details: req.t('errors.invalidRequestBodyDetails') 
        });
      }

      const { message } = req.body;
      
      // Validar que message existe y es string
      if (message === undefined || message === null) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: req.t('errors.missingMessage'), 
          details: req.t('errors.missingMessageDetails') 
        });
      }
      
      if (typeof message !== 'string') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: req.t('errors.invalidMessageType'), 
          details: req.t('errors.invalidMessageTypeDetails') 
        });
      }
      
      if (message.trim().length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: req.t('errors.emptyMessage'), 
          details: req.t('errors.emptyMessageDetails') 
        });
      }

      // Función tokenize con manejo de errores
      const translateError = req.t.bind(req);
      const tokenize = async (value, metadata) => {
        try {
          if (!value || typeof value !== 'string') {
            throw new Error(translateError('errors.invalidValueTokenization'));
          }
          const kind = metadata && metadata.type ? metadata.type : PII_TYPE.DEFAULT;
          const existing = valueToToken.get(value);
          if (existing) return existing;
          
          // Obtener el prefijo según el tipo de PII
          let prefix = TOKEN.PREFIX.DEFAULT;
          if (kind === PII_TYPE.EMAIL) prefix = TOKEN.PREFIX.EMAIL;
          else if (kind === PII_TYPE.PHONE) prefix = TOKEN.PREFIX.PHONE;
          else if (kind === PII_TYPE.NAME) prefix = TOKEN.PREFIX.NAME;
          
          const token = `${prefix}_${hashHex(value)}`;
          valueToToken.set(value, token);
          tokenToValue.set(token, value);
          return token;
        } catch (tokenizeErr) {
          // eslint-disable-next-line no-console
          console.error('Error in tokenize function:', tokenizeErr);
          throw tokenizeErr;
        }
      };

      // Anonimizar el texto
      const { text } = await anonymizeText(message, { tokenize });
      
      return res.json({ anonymizedMessage: text });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error in /anonymize endpoint:', err);
      
      // Error de validación de anonymizeText
      if (err.message && err.message.includes('anonymize')) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: req.t('errors.anonymizationFailed'), 
          details: err.message 
        });
      }
      
      // Error genérico del servidor
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: req.t('errors.internalServerError'), 
        details: req.t('errors.internalServerErrorDetails') 
      });
    }
  });

  // POST /deanonymize { anonymizedMessage } -> { message }
  app.post('/deanonymize', async (req, res) => {
    try {
      // Validar que el body existe y tiene el formato correcto
      if (!req.body || typeof req.body !== 'object') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: req.t('errors.invalidRequestBody'), 
          details: req.t('errors.invalidRequestBodyDetails') 
        });
      }

      const { anonymizedMessage } = req.body;
      
      // Validar que anonymizedMessage existe y es string
      if (anonymizedMessage === undefined || anonymizedMessage === null) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: req.t('errors.missingAnonymizedMessage'), 
          details: req.t('errors.missingAnonymizedMessageDetails') 
        });
      }
      
      if (typeof anonymizedMessage !== 'string') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: req.t('errors.invalidAnonymizedMessageType'), 
          details: req.t('errors.invalidAnonymizedMessageTypeDetails') 
        });
      }
      
      if (anonymizedMessage.trim().length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: req.t('errors.emptyAnonymizedMessage'), 
          details: req.t('errors.emptyAnonymizedMessageDetails') 
        });
      }

      let text = anonymizedMessage;
      
      try {
        // Buscar tokens en el texto
        const tokenRegex = REGEX.DEMO_TOKEN;
        const matches = [];
        let m;
        tokenRegex.lastIndex = 0;
        
        while ((m = tokenRegex.exec(text)) !== null) {
          matches.push({ start: m.index, end: m.index + m[0].length, token: m[0] });
        }
        
        // Replace right-to-left to preserve indices
        let tokensNotFound = [];
        for (let i = matches.length - 1; i >= 0; i--) {
          const { start, end, token } = matches[i];
          const original = tokenToValue.get(token);
          if (original) {
            text = text.slice(0, start) + original + text.slice(end);
          } else {
            tokensNotFound.push(token);
          }
        }
        
        // Advertencia si hay tokens no encontrados (pero no es un error fatal)
        if (tokensNotFound.length > 0) {
          // eslint-disable-next-line no-console
          console.warn(req.t('warnings.tokensNotFound', { tokens: tokensNotFound.join(', ') }));
        }
        
        return res.json({ message: text });
      } catch (processErr) {
        // eslint-disable-next-line no-console
        console.error('Error processing deanonymization:', processErr);
        throw processErr;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error in /deanonymize endpoint:', err);
      
      // Error de validación
      if (err.message && (err.message.includes('Invalid') || err.message.includes('Missing'))) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
          error: req.t('errors.validationError'), 
          details: err.message 
        });
      }
      
      // Error genérico del servidor
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
        error: req.t('errors.internalServerError'), 
        details: req.t('errors.internalServerErrorDetails') 
      });
    }
  });

  // Middleware final para manejar rutas no encontradas
  app.use((req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({ 
      error: req.t('errors.notFound'), 
      details: req.t('errors.notFoundDetails', { method: req.method, path: req.path }) 
    });
  });

  // Middleware de manejo de errores global (debe ser el último)
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled error:', err);
    
    if (res.headersSent) {
      return next(err);
    }
    
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
      error: req.t('errors.internalServerError'), 
      details: req.t('errors.internalServerErrorDetails') 
    });
  });

  return app;
}

// Solo iniciar el servidor si se ejecuta directamente (no cuando se importa)
if (require.main === module) {
  const port = SERVER.DEMO_PORT;
  const app = buildDemoServer();

  // Manejar errores al iniciar el servidor
  try {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Demo service listening on port ${port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
  }

  // Manejar errores no capturados
  process.on('uncaughtException', (err) => {
    // eslint-disable-next-line no-console
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

module.exports = { buildDemoServer };



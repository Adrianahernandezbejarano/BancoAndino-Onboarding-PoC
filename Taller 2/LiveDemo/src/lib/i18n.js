'use strict';

const fs = require('fs');
const { I18N } = require('./constants');

// Cache de traducciones cargadas
const translationsCache = {};

/**
 * Carga las traducciones de un idioma
 * @param {string} locale - Código del idioma (ej: 'es', 'en')
 * @returns {Object} Objeto con las traducciones
 */
function loadTranslations(locale) {
  if (translationsCache[locale]) {
    return translationsCache[locale];
  }

  const filePath = require('path').join(I18N.LOCALES_DIR, `${locale}.json`);
  
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      translationsCache[locale] = JSON.parse(content);
      return translationsCache[locale];
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error loading translations for locale ${locale}:`, err);
  }

  // Si no se encuentra el archivo, intentar con el idioma por defecto
  if (locale !== I18N.DEFAULT_LOCALE) {
    return loadTranslations(I18N.DEFAULT_LOCALE);
  }

  // Si también falla el idioma por defecto, retornar objeto vacío
  return {};
}

/**
 * Obtiene un mensaje traducido
 * @param {string} locale - Código del idioma
 * @param {string} key - Clave del mensaje (ej: 'errors.invalidJson')
 * @param {Object} params - Parámetros para reemplazar en el mensaje
 * @returns {string} Mensaje traducido
 */
function translate(locale, key, params = {}) {
  const translations = loadTranslations(locale);
  
  // Obtener el mensaje usando la notación de puntos (ej: 'errors.invalidJson')
  const keys = key.split('.');
  let message = translations;
  
  for (const k of keys) {
    if (message && typeof message === 'object' && k in message) {
      message = message[k];
    } else {
      // Si no se encuentra, intentar con el idioma por defecto
      if (locale !== I18N.DEFAULT_LOCALE) {
        return translate(I18N.DEFAULT_LOCALE, key, params);
      }
      // Si tampoco existe, retornar la clave
      return key;
    }
  }

  // Si el mensaje no es un string, retornar la clave
  if (typeof message !== 'string') {
    return key;
  }

  // Reemplazar parámetros en el mensaje (ej: {field} -> valor)
  return message.replace(/\{(\w+)\}/g, (match, paramKey) => {
    return params[paramKey] !== undefined ? params[paramKey] : match;
  });
}

/**
 * Middleware para detectar el idioma desde headers o query params
 * @param {Object} req - Request object
 * @returns {string} Código del idioma
 */
function detectLocale(req) {
  // Prioridad: query param > header Accept-Language > default
  if (req.query && req.query.lang) {
    return req.query.lang.toLowerCase().split('-')[0];
  }

  if (req.headers && req.headers['accept-language']) {
    const acceptLanguage = req.headers['accept-language'].split(',')[0];
    return acceptLanguage.split('-')[0].toLowerCase();
  }

  return I18N.DEFAULT_LOCALE;
}

/**
 * Middleware de Express para agregar función de traducción a req
 */
function i18nMiddleware(req, res, next) {
  const locale = detectLocale(req);
  req.locale = locale;
  req.t = (key, params) => translate(locale, key, params);
  next();
}

module.exports = {
  translate,
  detectLocale,
  i18nMiddleware
};


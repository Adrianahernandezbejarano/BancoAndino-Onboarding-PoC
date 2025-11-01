const Joi = require('joi');

const DOCUMENT_PATTERNS = {
  ID: /^[0-9]{6,10}$/,
  Passport: /^[A-Z0-9]{6,9}$/i,
  DriverLicense: /^[A-Z0-9-]{5,15}$/i,
};

const normalizeCurrency = (value, helpers) => {
  if (typeof value !== 'string') {
    return helpers.error('string.base');
  }

  const sanitized = value.replace(/\s/g, '');

  if (!/^\d+([,.]\d{1,2})?$/.test(sanitized)) {
    return helpers.error('string.pattern.base');
  }

  const normalized = sanitized.replace(',', '.');
  const amount = Number.parseFloat(normalized);

  if (Number.isNaN(amount)) {
    return helpers.error('number.base');
  }

  return Number(amount.toFixed(2));
};

const formSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  middleName: Joi.string().trim().max(50).allow('', null),
  birthDate: Joi.date()
    .iso()
    .less('now')
    .required()
    .custom((value, helpers) => {
      const today = new Date();
      const birth = new Date(value);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age -= 1;
      }
      if (age < 18) {
        return helpers.error('date.minAge');
      }
      return value;
    })
    .messages({
      'date.minAge': 'Debe ser mayor de 18 años.',
    }),
  documentType: Joi.string()
    .trim()
    .valid('ID', 'Passport', 'DriverLicense')
    .required(),
  documentNumber: Joi.string()
    .trim()
    .required()
    .when('documentType', {
      is: 'ID',
      then: Joi.string()
        .pattern(DOCUMENT_PATTERNS.ID)
        .messages({
          'string.pattern.base': 'La cédula debe contener entre 6 y 10 dígitos.',
        }),
    })
    .when('documentType', {
      is: 'Passport',
      then: Joi.string()
        .pattern(DOCUMENT_PATTERNS.Passport)
        .messages({
          'string.pattern.base': 'El pasaporte debe ser alfanumérico de 6 a 9 caracteres.',
        }),
    })
    .when('documentType', {
      is: 'DriverLicense',
      then: Joi.string()
        .pattern(DOCUMENT_PATTERNS.DriverLicense)
        .messages({
          'string.pattern.base': 'La licencia admite letras, números y guiones (5-15).',
        }),
    }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false }, allowFullyQualified: true })
    .required(),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{7,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'El teléfono debe seguir el formato internacional E.164.',
    }),
  country: Joi.string().trim().max(80).required(),
  city: Joi.string().trim().max(80).required(),
  addressLine1: Joi.string().trim().max(120).required(),
  addressLine2: Joi.string().trim().max(120).allow('', null),
  postalCode: Joi.string().trim().max(15).allow('', null),
  employmentStatus: Joi.string()
    .valid('employed', 'selfEmployed', 'student', 'unemployed', 'retired')
    .required(),
  employerName: Joi.string()
    .trim()
    .max(100)
    .allow('', null)
    .when('employmentStatus', {
      is: Joi.valid('employed', 'selfEmployed'),
      then: Joi.required(),
    }),
  position: Joi.string()
    .trim()
    .max(80)
    .allow('', null)
    .when('employmentStatus', {
      is: 'employed',
      then: Joi.required(),
    }),
  employmentStartDate: Joi.date()
    .iso()
    .less('now')
    .allow(null)
    .when('employmentStatus', {
      is: 'employed',
      then: Joi.required(),
    }),
  monthlyIncome: Joi.string()
    .required()
    .custom(normalizeCurrency, 'currency normalization')
    .messages({
      'string.pattern.base': 'El ingreso debe ser numérico y puede incluir decimales con coma o punto.',
    }),
  monthlyExpenses: Joi.string()
    .required()
    .custom(normalizeCurrency, 'currency normalization')
    .messages({
      'string.pattern.base': 'Los gastos deben ser numéricos y pueden incluir decimales con coma o punto.',
    }),
  bankName: Joi.string().trim().max(80).required(),
  accountType: Joi.string().trim().valid('savings', 'checking').required(),
  accountNumberLast4: Joi.string()
    .trim()
    .pattern(/^[0-9]{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Solo se permiten los últimos 4 dígitos de la cuenta.',
    }),
  consent: Joi.boolean().truthy(1, '1', 'true', 'on', true).required(),
});

module.exports = {
  formSchema,
};


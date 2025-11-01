const Joi = require('joi');

const validateRequest = (schema) => {
  if (!schema || !Joi.isSchema(schema)) {
    throw new Error('A valid Joi schema must be provided to validateRequest.');
  }

  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next({
        status: 422,
        message: 'Validation failed',
        details: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validateRequest;


const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.status || 500;

  const payload = {
    status: 'error',
    message: err.message || 'Unexpected server error.',
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = errorHandler;


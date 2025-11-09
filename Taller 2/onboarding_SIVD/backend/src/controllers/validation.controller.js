const documentService = require('../services/document.service');

const validateForm = (req, res) => {
  return res.status(200).json({
    status: 'success',
    data: req.body,
    message: 'Form data is valid.',
  });
};

const validateDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No document uploaded. Use form-data with key "document".',
      });
    }

    const validationResult = await documentService.validateDocument(
      req.file,
      req.body
    );

    res.status(200).json({
      status: 'success',
      message: 'Document validation completed.',
      validation: validationResult,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateForm,
  validateDocument,
};


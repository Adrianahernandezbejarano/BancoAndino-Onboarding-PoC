const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

const validateDocument = async (file, metadata = {}) => {
  const errors = [];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    errors.push('Unsupported file type. Only PDF, JPEG, and PNG are allowed.');
  }

  if (file.size === 0) {
    errors.push('Uploaded file is empty.');
  }

  // Example metadata-driven validation
  if (metadata.documentType && metadata.documentType.length < 3) {
    errors.push('documentType must be at least 3 characters long.');
  }

  await new Promise((resolve) => setTimeout(resolve, 150));

  return {
    fileName: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    metadata,
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateDocument,
};


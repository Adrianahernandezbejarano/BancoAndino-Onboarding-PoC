const express = require('express');
const multer = require('multer');
const validationController = require('../controllers/validation.controller');
const validateRequest = require('../middleware/validationMiddleware');
const { formSchema } = require('../utils/validationSchemas');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post('/form', validateRequest(formSchema), validationController.validateForm);

router.post(
  '/document',
  upload.single('document'),
  validationController.validateDocument
);

module.exports = router;


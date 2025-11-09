import { Router } from 'express';
import { AuthController } from './controllers/AuthController';
import { validationMiddleware } from '@shared/middleware/validationMiddleware';
import { CreateClienteDto, LoginDto, ResendVerificationDto } from './dtos';

const router = Router();
const authController = new AuthController();

// Register new user
router.post(
  '/register',
  validationMiddleware(CreateClienteDto),
  authController.register.bind(authController)
);

// Verify email
router.get('/verify-email/:token', authController.verifyEmail.bind(authController));

// Resend verification email
router.post(
  '/resend-verification',
  validationMiddleware(ResendVerificationDto),
  authController.resendVerification.bind(authController)
);

// Login
router.post('/login', validationMiddleware(LoginDto), authController.login.bind(authController));

export { router as authRoutes };

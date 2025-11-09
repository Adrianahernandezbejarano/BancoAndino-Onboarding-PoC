import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { CreateClienteDto, LoginDto, ResendVerificationDto } from '../dtos';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as CreateClienteDto;
      const originHeader = (req.headers['origin'] as string) ?? (req.headers['referer'] as string);

      const result = await this.authService.registerCliente(dto, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        origin: originHeader,
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.params;
      const result = await this.authService.verifyEmailToken(token, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        origin: (req.headers['origin'] as string) ?? undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Email verificado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async resendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as ResendVerificationDto;
      await this.authService.resendVerificationEmail(dto, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        origin: (req.headers['origin'] as string) ?? undefined,
      });
      res.status(200).json({
        success: true,
        message: 'Email de verificación reenviado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = req.body as LoginDto;
      const result = await this.authService.login(dto, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        origin: (req.headers['origin'] as string) ?? undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

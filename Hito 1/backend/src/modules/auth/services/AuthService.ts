import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../config/database';
import { config } from '../../../config/env';
import { logger } from '../../../shared/utils/logger';
import {
  BadRequestError,
  ConflictError,
  GoneError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
} from '../../../shared/errors/HttpError';
import { AuthRepository } from '../repositories';
import { CreateClienteDto, LoginDto, ResendVerificationDto } from '../dtos';
import { isTokenExpired } from '../validators';

interface RequestContext {
  ip?: string;
  userAgent?: string;
  origin?: string;
}

const REGISTRATION_RATE_LIMIT = 5;
const RESEND_RATE_LIMIT = 3;

export class AuthService {
  private readonly repository = new AuthRepository();

  async registerCliente(dto: CreateClienteDto, context: RequestContext = {}) {
    if (!dto.termsAccepted) {
      throw new BadRequestError('Debes aceptar los términos y condiciones.');
    }

    const email = dto.email.toLowerCase().trim();
    const telefono = dto.telefono.trim();

    const existingCliente = await this.repository.findClienteByEmail(email);
    if (existingCliente) {
      throw new ConflictError('El email ya se encuentra registrado.');
    }

    if (context.ip) {
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const attempts = await this.repository.countRecentRegistrationsByIp(context.ip, hourAgo);
      if (attempts >= REGISTRATION_RATE_LIMIT) {
        throw new TooManyRequestsError(
          'Se alcanzó el límite de registros desde esta dirección IP. Intente más tarde.'
        );
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const tokenVerificacion = crypto.randomBytes(32).toString('hex');
    const tokenExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const createdCliente = await prisma.$transaction(async (tx) => {
      const cliente = await this.repository.createCliente(
        {
          email,
          telefono,
          passwordHash,
          tokenVerificacion,
          tokenExpiracion,
        },
        tx
      );

      await this.repository.createAuditLog(
        {
          action: 'REGISTER',
          success: true,
          clienteId: cliente.id,
          ipAddress: context.ip,
          userAgent: context.userAgent,
          metadata: {
            email,
            telefono,
            origin: context.origin ?? null,
          } as Prisma.InputJsonValue,
        },
        tx
      );

      return cliente;
    });

    logger.info('Cliente registrado correctamente, pendiente verificación de email', {
      clienteId: createdCliente.id,
    });

    // TODO: enviar email de verificación mediante cola/evento

    return {
      id: createdCliente.id,
      email: createdCliente.email,
      telefono: createdCliente.telefono,
      fechaRegistro: createdCliente.fechaRegistro,
      emailVerificado: createdCliente.emailVerificado,
    };
  }

  async verifyEmailToken(token: string, context: RequestContext = {}) {
    const cliente = await this.repository.findClienteByVerificationToken(token);

    if (!cliente) {
      throw new NotFoundError('Token inválido.');
    }

    if (cliente.emailVerificado) {
      throw new ConflictError('El email ya se encuentra verificado.');
    }

    if (isTokenExpired(cliente.tokenExpiracion)) {
      throw new GoneError('El token de verificación ha expirado.');
    }

    await prisma.$transaction(async (tx) => {
      await this.repository.updateCliente(
        cliente.id,
        {
          emailVerificado: true,
          tokenVerificacion: null,
          tokenExpiracion: null,
          updatedAt: new Date(),
        },
        tx
      );

      await this.repository.createAuditLog(
        {
          action: 'EMAIL_VERIFIED',
          success: true,
          clienteId: cliente.id,
          ipAddress: context.ip,
          userAgent: context.userAgent,
          metadata: {
            token,
          },
        },
        tx
      );
    });

    logger.info('Email verificado correctamente', { clienteId: cliente.id });

    return {
      clienteId: cliente.id,
      email: cliente.email,
      nextStep: 'LOGIN',
    };
  }

  async resendVerificationEmail(dto: ResendVerificationDto, context: RequestContext = {}) {
    const email = dto.email.toLowerCase().trim();
    const cliente = await this.repository.findClienteByEmail(email);

    if (!cliente) {
      throw new NotFoundError('No encontramos una cuenta asociada a este email.');
    }

    if (cliente.emailVerificado) {
      throw new ConflictError('Este email ya está verificado.');
    }

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const resendCount = await this.repository.countRecentResendRequests(email, hourAgo);
    if (resendCount >= RESEND_RATE_LIMIT) {
      throw new TooManyRequestsError(
        'Has superado el número de reenvíos permitido. Intenta nuevamente más tarde.'
      );
    }

    const tokenVerificacion = crypto.randomBytes(32).toString('hex');
    const tokenExpiracion = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await this.repository.updateCliente(
        cliente.id,
        {
          tokenVerificacion,
          tokenExpiracion,
        },
        tx
      );

      await this.repository.createAuditLog(
        {
          action: 'RESEND_VERIFICATION',
          success: true,
          clienteId: cliente.id,
          ipAddress: context.ip,
          userAgent: context.userAgent,
          metadata: {
            email,
          },
        },
        tx
      );
    });

    logger.info('Token de verificación reenviado', { clienteId: cliente.id });

    // TODO: enviar email de verificación

    return { success: true };
  }

  async login(dto: LoginDto, context: RequestContext = {}) {
    const email = dto.email.toLowerCase().trim();
    const cliente = await this.repository.findClienteByEmail(email);

    if (!cliente) {
      await this.logLoginAttempt(null, false, context, email);
      throw new UnauthorizedError('Credenciales incorrectas.');
    }

    if (!cliente.emailVerificado) {
      await this.logLoginAttempt(cliente.id, false, context, email, 'EMAIL_NOT_VERIFIED');
      throw new UnauthorizedError('Debes verificar tu email antes de iniciar sesión.');
    }

    if (cliente.bloqueadoHasta && new Date() < cliente.bloqueadoHasta) {
      const minutes = Math.ceil((cliente.bloqueadoHasta.getTime() - Date.now()) / (60 * 1000));
      throw new TooManyRequestsError(
        `Tu cuenta está bloqueada temporalmente. Intenta nuevamente en ${minutes} minuto(s).`
      );
    }

    const isValidPassword = await bcrypt.compare(dto.password, cliente.passwordHash);
    if (!isValidPassword) {
      const { bloqueadoHasta } = await this.incrementFailedAttempts(cliente.id);
      await this.logLoginAttempt(cliente.id, false, context, email, 'INVALID_CREDENTIALS');

      if (bloqueadoHasta) {
        throw new TooManyRequestsError(
          'Has superado el número permitido de intentos. Tu cuenta ha sido bloqueada por 15 minutos.'
        );
      }

      throw new UnauthorizedError('Credenciales incorrectas.');
    }

    await this.resetFailedAttempts(cliente.id);
    await this.logLoginAttempt(cliente.id, true, context, email);

    const tokens = this.generateTokens(
      {
        id: cliente.id,
        email: cliente.email,
        estadoOnboarding: cliente.estadoOnboarding,
      },
      dto.rememberMe ?? false
    );

    await this.repository.createAuditLog({
      action: 'LOGIN_SUCCESS',
      success: true,
      clienteId: cliente.id,
      ipAddress: context.ip,
      userAgent: context.userAgent,
      metadata: {
        rememberMe: dto.rememberMe ?? false,
      },
    });

    return {
      tokens,
      cliente: {
        id: cliente.id,
        email: cliente.email,
        estadoOnboarding: cliente.estadoOnboarding,
      },
    };
  }

  private async incrementFailedAttempts(clienteId: string) {
    const updated = await this.repository.updateCliente(clienteId, {
      intentosFallidos: {
        increment: 1,
      },
    });

    const newAttemptCount = updated.intentosFallidos;
    let bloqueadoHasta: Date | null = null;

    if (newAttemptCount >= 5) {
      bloqueadoHasta = new Date(Date.now() + 15 * 60 * 1000);
      await this.repository.updateCliente(clienteId, {
        bloqueadoHasta,
      });
    }

    return {
      intentosFallidos: newAttemptCount,
      bloqueadoHasta,
    };
  }

  private resetFailedAttempts(clienteId: string) {
    return this.repository.updateCliente(clienteId, {
      intentosFallidos: 0,
      bloqueadoHasta: null,
      ultimoAcceso: new Date(),
    });
  }

  private generateTokens(
    payload: { id: string; email: string; estadoOnboarding: string },
    rememberMe: boolean
  ) {
    const accessToken = jwt.sign(
      {
        sub: payload.id,
        email: payload.email,
        estadoOnboarding: payload.estadoOnboarding,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiration }
    );

    const refreshToken = jwt.sign(
      {
        sub: payload.id,
      },
      config.jwt.refreshSecret,
      {
        expiresIn: rememberMe ? config.jwt.refreshExpiration : '1d',
      }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: config.jwt.expiration,
      refreshExpiresIn: rememberMe ? config.jwt.refreshExpiration : '1d',
      tokenType: 'Bearer' as const,
    };
  }

  private async logLoginAttempt(
    clienteId: string | null,
    success: boolean,
    context: RequestContext,
    email: string,
    reason?: string
  ) {
    await this.repository.createAuditLog({
      action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
      success,
      clienteId: clienteId ?? undefined,
      ipAddress: context.ip,
      userAgent: context.userAgent,
      metadata: {
        email,
        reason: reason ?? null,
      },
    });
  }
}

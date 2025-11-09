import { Prisma, PrismaClient, Cliente } from '@prisma/client';
import { prisma } from '../../../config/database';

type ClienteCreateData = Prisma.ClienteCreateInput;
type ClienteUpdateData = Prisma.ClienteUpdateInput;

export class AuthRepository {
  private getClient(tx?: PrismaClient) {
    return tx ?? prisma;
  }

  findClienteByEmail(email: string, tx?: PrismaClient) {
    return this.getClient(tx).cliente.findUnique({
      where: { email },
    });
  }

  findClienteByVerificationToken(token: string, tx?: PrismaClient) {
    return this.getClient(tx).cliente.findFirst({
      where: { tokenVerificacion: token },
    });
  }

  createCliente(data: ClienteCreateData, tx?: PrismaClient) {
    return this.getClient(tx).cliente.create({
      data,
    });
  }

  updateCliente(id: Cliente['id'], data: ClienteUpdateData, tx?: PrismaClient) {
    return this.getClient(tx).cliente.update({
      where: { id },
      data,
    });
  }

  createAuditLog(data: Prisma.AuditoriaAuthCreateInput, tx?: PrismaClient) {
    return this.getClient(tx).auditoriaAuth.create({
      data,
    });
  }

  countRecentRegistrationsByIp(ip: string, from: Date, tx?: PrismaClient) {
    return this.getClient(tx).auditoriaAuth.count({
      where: {
        action: 'REGISTER',
        ipAddress: ip,
        timestamp: {
          gte: from,
        },
      },
    });
  }

  countRecentResendRequests(email: string, from: Date, tx?: PrismaClient) {
    return this.getClient(tx).auditoriaAuth.count({
      where: {
        action: 'RESEND_VERIFICATION',
        metadata: {
          path: ['email'],
          equals: email,
        },
        timestamp: {
          gte: from,
        },
      },
    });
  }
}

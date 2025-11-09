import { PrismaClient } from '@prisma/client';
import { logger } from '../shared/utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
  prismaClient.$on('error', (event) => {
    logger.error('Prisma error', event);
  });
  prismaClient.$on('warn', (event) => {
    logger.warn('Prisma warning', event);
  });
}

export const prisma = prismaClient;

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

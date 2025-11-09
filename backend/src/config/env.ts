import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiration: process.env.JWT_EXPIRATION || '2h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  email: {
    serviceUrl: process.env.EMAIL_SERVICE_URL || '',
    from: process.env.EMAIL_FROM || 'noreply@bancoandino.com',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '30d',
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  cookie: {
    secret: process.env.COOKIE_SECRET || 'fallback-cookie-secret',
  },
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';

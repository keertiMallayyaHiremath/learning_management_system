import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || '4000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'change-me',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'change-me',
};
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from './env';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAccessToken = (userId: bigint): string => {
  const options: SignOptions = { expiresIn: '15m' };
  return jwt.sign({ userId }, config.jwt.secret, options);
};

export const generateRefreshToken = (userId: bigint): string => {
  const options: SignOptions = { expiresIn: '30d' };
  return jwt.sign({ userId }, config.jwt.refreshSecret, options);
};

export const verifyAccessToken = (token: string): { userId: bigint } => {
  return jwt.verify(token, config.jwt.secret) as { userId: bigint };
};

export const verifyRefreshToken = (token: string): { userId: bigint } => {
  return jwt.verify(token, config.jwt.refreshSecret) as { userId: bigint };
};

export const hashToken = async (token: string): Promise<string> => {
  return bcrypt.hash(token, 10);
};

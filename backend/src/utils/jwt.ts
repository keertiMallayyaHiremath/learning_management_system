import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateTokens = (userId: bigint) => {
  const accessToken = jwt.sign({ userId }, config.jwt.secret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: '30d' });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwt.secret) as { userId: bigint };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwt.refreshSecret) as { userId: bigint };
};

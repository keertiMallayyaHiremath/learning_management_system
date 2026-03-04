import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signAccessToken(payload: object) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
import { prisma } from '../../config/db';
import { hashPassword, verifyPassword, hashToken } from '../../utils/password';
import { generateTokens, verifyRefreshToken } from '../../utils/jwt';
import { createError } from '../../middleware/errorHandler';

export class AuthService {
  async register(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createError('User with this email already exists', 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const { accessToken, refreshToken } = generateTokens(user.id);
    const refreshTokenHash = await hashToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw createError('Invalid credentials', 401);
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw createError('Invalid credentials', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    const refreshTokenHash = await hashToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      const tokenRecord = await prisma.refreshToken.findFirst({
        where: {
          userId: decoded.userId,
          revokedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!tokenRecord) {
        throw createError('Invalid refresh token', 401);
      }

      const isValidToken = await verifyPassword(refreshToken, tokenRecord.tokenHash);
      if (!isValidToken) {
        throw createError('Invalid refresh token', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        throw createError('User not found', 401);
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
      const newRefreshTokenHash = hashToken(newRefreshToken);

      await prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: {
          tokenHash: newRefreshTokenHash,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      return {
        user,
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw createError('Invalid refresh token', 401);
    }
  }

  async logout(userId: bigint) {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}

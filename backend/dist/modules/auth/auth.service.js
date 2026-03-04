"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../../config/db");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const errorHandler_1 = require("../../middleware/errorHandler");
class AuthService {
    async register(email, password, name) {
        const existingUser = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw (0, errorHandler_1.createError)('User with this email already exists', 409);
        }
        const passwordHash = await (0, password_1.hashPassword)(password);
        const user = await db_1.prisma.user.create({
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
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user.id);
        const refreshTokenHash = await (0, password_1.hashToken)(refreshToken);
        await db_1.prisma.refreshToken.create({
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
    async login(email, password) {
        const user = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw (0, errorHandler_1.createError)('Invalid credentials', 401);
        }
        const isValidPassword = await (0, password_1.verifyPassword)(password, user.passwordHash);
        if (!isValidPassword) {
            throw (0, errorHandler_1.createError)('Invalid credentials', 401);
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user.id);
        const refreshTokenHash = await (0, password_1.hashToken)(refreshToken);
        await db_1.prisma.refreshToken.create({
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
    async refresh(refreshToken) {
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
            const tokenRecord = await db_1.prisma.refreshToken.findFirst({
                where: {
                    userId: decoded.userId,
                    revokedAt: null,
                    expiresAt: {
                        gt: new Date(),
                    },
                },
            });
            if (!tokenRecord) {
                throw (0, errorHandler_1.createError)('Invalid refresh token', 401);
            }
            const isValidToken = await (0, password_1.verifyPassword)(refreshToken, tokenRecord.tokenHash);
            if (!isValidToken) {
                throw (0, errorHandler_1.createError)('Invalid refresh token', 401);
            }
            const user = await db_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });
            if (!user) {
                throw (0, errorHandler_1.createError)('User not found', 401);
            }
            const { accessToken, refreshToken: newRefreshToken } = (0, jwt_1.generateTokens)(user.id);
            const newRefreshTokenHash = (0, password_1.hashToken)(newRefreshToken);
            await db_1.prisma.refreshToken.update({
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
        }
        catch (error) {
            throw (0, errorHandler_1.createError)('Invalid refresh token', 401);
        }
    }
    async logout(userId) {
        await db_1.prisma.refreshToken.updateMany({
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
exports.AuthService = AuthService;

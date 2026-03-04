"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = exports.isDevelopment = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
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
exports.isDevelopment = exports.config.nodeEnv === 'development';
exports.isProduction = exports.config.nodeEnv === 'production';

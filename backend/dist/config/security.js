"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./env");
const hashPassword = async (password) => {
    const saltRounds = 12;
    return bcrypt_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hash) => {
    return bcrypt_1.default.compare(password, hash);
};
exports.verifyPassword = verifyPassword;
const generateAccessToken = (userId) => {
    const options = { expiresIn: '15m' };
    return jsonwebtoken_1.default.sign({ userId }, env_1.config.jwt.secret, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    const options = { expiresIn: '30d' };
    return jsonwebtoken_1.default.sign({ userId }, env_1.config.jwt.refreshSecret, options);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.config.jwt.secret);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.config.jwt.refreshSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
const hashToken = async (token) => {
    return bcrypt_1.default.hash(token, 10);
};
exports.hashToken = hashToken;

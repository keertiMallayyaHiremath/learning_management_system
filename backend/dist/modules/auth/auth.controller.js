"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_validator_1 = require("./auth.validator");
const env_1 = require("../../config/env");
class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(req, res) {
        try {
            const { error, value } = auth_validator_1.registerSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            const result = await this.authService.register(value.email, value.password, value.name);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: env_1.config.nodeEnv === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
            res.status(201).json({
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
    async login(req, res) {
        try {
            const { error, value } = auth_validator_1.loginSchema.validate(req.body);
            if (error) {
                res.status(400).json({ error: error.details[0].message });
                return;
            }
            const result = await this.authService.login(value.email, value.password);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: env_1.config.nodeEnv === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
            res.json({
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
    async refresh(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ error: 'Refresh token required' });
                return;
            }
            const result = await this.authService.refresh(refreshToken);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: env_1.config.nodeEnv === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
            res.json({
                user: result.user,
                accessToken: result.accessToken,
            });
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
    async logout(req, res) {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            await this.authService.logout(req.user.id);
            res.clearCookie('refreshToken');
            res.json({ message: 'Logged out successfully' });
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
}
exports.AuthController = AuthController;

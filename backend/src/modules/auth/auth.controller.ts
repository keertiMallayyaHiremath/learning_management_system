import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from './auth.validator';
import { createError } from '../../middleware/errorHandler';
import { config } from '../../config/env';
import { verifyPassword, hashToken } from '../../utils/password';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const result = await this.authService.register(value.email, value.password, value.name);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const result = await this.authService.login(value.email, value.password);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ error: 'Refresh token required' });
        return;
      }

      const result = await this.authService.refresh(refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      await this.authService.logout(req.user.id);

      res.clearCookie('refreshToken');
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
}

import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));
router.post('/logout', authenticateToken, authController.logout.bind(authController));

export default router;

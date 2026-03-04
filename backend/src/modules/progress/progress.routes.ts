import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { ProgressRepository } from './progress.repository';
import { ProgressService } from './progress.service';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = Router();
const progressRepository = new ProgressRepository();
const progressService = new ProgressService(progressRepository);
const progressController = new ProgressController(progressService);

router.get('/subjects/:subjectId', authenticateToken, progressController.getSubjectProgress.bind(progressController));

export default router;

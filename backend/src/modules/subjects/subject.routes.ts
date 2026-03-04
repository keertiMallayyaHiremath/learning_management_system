import { Router } from 'express';
import { SubjectController } from './subject.controller';
import { SubjectRepository } from './subject.repository';
import { SubjectService } from './subject.service';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = Router();
const subjectRepository = new SubjectRepository();
const subjectService = new SubjectService(subjectRepository);
const subjectController = new SubjectController(subjectService);

router.get('/', subjectController.getSubjects.bind(subjectController));
router.get('/:subjectId', subjectController.getSubjectById.bind(subjectController));
router.get('/:subjectId/tree', authenticateToken, subjectController.getSubjectTree.bind(subjectController));
router.get('/:subjectId/first-video', authenticateToken, subjectController.getFirstUnlockedVideo.bind(subjectController));

export default router;

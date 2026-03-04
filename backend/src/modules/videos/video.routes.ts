import { Router } from 'express';
import { VideoController } from './video.controller';
import { VideoRepository } from './video.repository';
import { VideoService } from './video.service';
import { authenticateToken } from '../../middleware/authMiddleware';

const router = Router();
const videoRepository = new VideoRepository();
const videoService = new VideoService(videoRepository);
const videoController = new VideoController(videoService);

router.get('/:videoId', authenticateToken, videoController.getVideoById.bind(videoController));
router.post('/:videoId/progress', authenticateToken, videoController.updateVideoProgress.bind(videoController));
router.get('/:videoId/progress', authenticateToken, videoController.getVideoProgress.bind(videoController));

export default router;

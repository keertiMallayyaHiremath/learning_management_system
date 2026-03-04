import { Request, Response } from 'express';
import { VideoService } from './video.service';

export class VideoController {
  constructor(private videoService: VideoService) {}

  async getVideoById(req: Request, res: Response): Promise<void> {
    try {
      const videoId = BigInt(req.params.videoId);
      const userId = req.user!.id;

      const video = await this.videoService.getVideoById(videoId, userId);
      res.json(video);
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async updateVideoProgress(req: Request, res: Response): Promise<void> {
    try {
      const videoId = BigInt(req.params.videoId);
      const userId = req.user!.id;
      const { lastPositionSeconds, isCompleted } = req.body;

      if (typeof lastPositionSeconds !== 'number' || typeof isCompleted !== 'boolean') {
        res.status(400).json({ error: 'Invalid progress data' });
        return;
      }

      await this.videoService.updateVideoProgress(
        userId,
        videoId,
        lastPositionSeconds,
        isCompleted
      );

      res.json({ message: 'Progress updated successfully' });
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async getVideoProgress(req: Request, res: Response): Promise<void> {
    try {
      const videoId = BigInt(req.params.videoId);
      const userId = req.user!.id;

      const progress = await this.videoService.getVideoProgress(userId, videoId);
      res.json(progress);
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
}

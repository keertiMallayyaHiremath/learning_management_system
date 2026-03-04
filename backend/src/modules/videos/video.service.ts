import { VideoRepository } from './video.repository';
import { createError } from '../../middleware/errorHandler';

export class VideoService {
  constructor(private videoRepository: VideoRepository) {}

  async getVideoById(videoId: bigint, userId: bigint) {
    const video = await this.videoRepository.findById(videoId, userId);
    if (!video) {
      throw createError('Video not found', 404);
    }
    return video;
  }

  async updateVideoProgress(
    userId: bigint,
    videoId: bigint,
    lastPositionSeconds: number,
    isCompleted: boolean
  ) {
    try {
      return await this.videoRepository.updateProgress(
        userId,
        videoId,
        lastPositionSeconds,
        isCompleted
      );
    } catch (error) {
      throw createError('Failed to update progress', 400);
    }
  }

  async getVideoProgress(userId: bigint, videoId: bigint) {
    return this.videoRepository.getProgress(userId, videoId);
  }
}

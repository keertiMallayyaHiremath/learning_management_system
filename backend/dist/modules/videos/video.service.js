"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const errorHandler_1 = require("../../middleware/errorHandler");
class VideoService {
    constructor(videoRepository) {
        this.videoRepository = videoRepository;
    }
    async getVideoById(videoId, userId) {
        const video = await this.videoRepository.findById(videoId, userId);
        if (!video) {
            throw (0, errorHandler_1.createError)('Video not found', 404);
        }
        return video;
    }
    async updateVideoProgress(userId, videoId, lastPositionSeconds, isCompleted) {
        try {
            return await this.videoRepository.updateProgress(userId, videoId, lastPositionSeconds, isCompleted);
        }
        catch (error) {
            throw (0, errorHandler_1.createError)('Failed to update progress', 400);
        }
    }
    async getVideoProgress(userId, videoId) {
        return this.videoRepository.getProgress(userId, videoId);
    }
}
exports.VideoService = VideoService;

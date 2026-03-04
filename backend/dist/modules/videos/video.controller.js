"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoController = void 0;
class VideoController {
    constructor(videoService) {
        this.videoService = videoService;
    }
    async getVideoById(req, res) {
        try {
            const videoId = BigInt(req.params.videoId);
            const userId = req.user.id;
            const video = await this.videoService.getVideoById(videoId, userId);
            res.json(video);
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
    async updateVideoProgress(req, res) {
        try {
            const videoId = BigInt(req.params.videoId);
            const userId = req.user.id;
            const { lastPositionSeconds, isCompleted } = req.body;
            if (typeof lastPositionSeconds !== 'number' || typeof isCompleted !== 'boolean') {
                res.status(400).json({ error: 'Invalid progress data' });
                return;
            }
            await this.videoService.updateVideoProgress(userId, videoId, lastPositionSeconds, isCompleted);
            res.json({ message: 'Progress updated successfully' });
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
    async getVideoProgress(req, res) {
        try {
            const videoId = BigInt(req.params.videoId);
            const userId = req.user.id;
            const progress = await this.videoService.getVideoProgress(userId, videoId);
            res.json(progress);
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
}
exports.VideoController = VideoController;

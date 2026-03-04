"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    async getSubjectProgress(req, res) {
        try {
            const subjectId = BigInt(req.params.subjectId);
            const userId = req.user.id;
            const progress = await this.progressService.getSubjectProgress(subjectId, userId);
            res.json(progress);
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
}
exports.ProgressController = ProgressController;

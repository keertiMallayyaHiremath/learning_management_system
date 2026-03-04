"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const errorHandler_1 = require("../../middleware/errorHandler");
class ProgressService {
    constructor(progressRepository) {
        this.progressRepository = progressRepository;
    }
    async getSubjectProgress(subjectId, userId) {
        const progress = await this.progressRepository.getSubjectProgressSummary(subjectId, userId);
        if (!progress) {
            throw (0, errorHandler_1.createError)('Subject not found', 404);
        }
        return progress;
    }
}
exports.ProgressService = ProgressService;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectService = void 0;
const errorHandler_1 = require("../../middleware/errorHandler");
class SubjectService {
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    async getSubjects(page = 1, pageSize = 10, query) {
        return this.subjectRepository.findAll(page, pageSize, query);
    }
    async getSubjectById(subjectId) {
        const subject = await this.subjectRepository.findById(subjectId);
        if (!subject) {
            throw (0, errorHandler_1.createError)('Subject not found', 404);
        }
        return subject;
    }
    async getSubjectTree(subjectId, userId) {
        const subjectTree = await this.subjectRepository.findSubjectTree(subjectId, userId);
        if (!subjectTree) {
            throw (0, errorHandler_1.createError)('Subject not found', 404);
        }
        return subjectTree;
    }
    async getFirstUnlockedVideo(subjectId, userId) {
        const videoId = await this.subjectRepository.getFirstUnlockedVideo(subjectId, userId);
        if (!videoId) {
            throw (0, errorHandler_1.createError)('No unlocked videos found', 404);
        }
        return { videoId };
    }
}
exports.SubjectService = SubjectService;

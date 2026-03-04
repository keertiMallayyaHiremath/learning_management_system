"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectController = void 0;
class SubjectController {
    constructor(subjectService) {
        this.subjectService = subjectService;
    }
    async getSubjects(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const query = req.query.q;
            const result = await this.subjectService.getSubjects(page, pageSize, query);
            res.json(result);
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
    async getSubjectById(req, res) {
        try {
            const subjectId = BigInt(req.params.subjectId);
            const subject = await this.subjectService.getSubjectById(subjectId);
            res.json(subject);
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
    async getSubjectTree(req, res) {
        try {
            const subjectId = BigInt(req.params.subjectId);
            const userId = req.user.id;
            const subjectTree = await this.subjectService.getSubjectTree(subjectId, userId);
            res.json(subjectTree);
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
    async getFirstUnlockedVideo(req, res) {
        try {
            const subjectId = BigInt(req.params.subjectId);
            const userId = req.user.id;
            const result = await this.subjectService.getFirstUnlockedVideo(subjectId, userId);
            res.json(result);
        }
        catch (error) {
            const err = error;
            res.status(err.statusCode || 500).json({ error: err.message });
        }
    }
}
exports.SubjectController = SubjectController;

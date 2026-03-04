import { Request, Response } from 'express';
import { SubjectService } from './subject.service';

export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  async getSubjects(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const query = req.query.q as string;

      const result = await this.subjectService.getSubjects(page, pageSize, query);
      res.json(result);
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async getSubjectById(req: Request, res: Response): Promise<void> {
    try {
      const subjectId = BigInt(req.params.subjectId);
      const subject = await this.subjectService.getSubjectById(subjectId);
      res.json(subject);
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async getSubjectTree(req: Request, res: Response): Promise<void> {
    try {
      const subjectId = BigInt(req.params.subjectId);
      const userId = req.user!.id;

      const subjectTree = await this.subjectService.getSubjectTree(subjectId, userId);
      res.json(subjectTree);
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }

  async getFirstUnlockedVideo(req: Request, res: Response): Promise<void> {
    try {
      const subjectId = BigInt(req.params.subjectId);
      const userId = req.user!.id;

      const result = await this.subjectService.getFirstUnlockedVideo(subjectId, userId);
      res.json(result);
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
}

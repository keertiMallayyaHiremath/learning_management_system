import { Request, Response } from 'express';
import { ProgressService } from './progress.service';

export class ProgressController {
  constructor(private progressService: ProgressService) {}

  async getSubjectProgress(req: Request, res: Response): Promise<void> {
    try {
      const subjectId = BigInt(req.params.subjectId);
      const userId = req.user!.id;

      const progress = await this.progressService.getSubjectProgress(subjectId, userId);
      res.json(progress);
    } catch (error) {
      const err = error as any;
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  }
}

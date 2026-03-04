import { ProgressRepository } from './progress.repository';
import { createError } from '../../middleware/errorHandler';

export class ProgressService {
  constructor(private progressRepository: ProgressRepository) {}

  async getSubjectProgress(subjectId: bigint, userId: bigint) {
    const progress = await this.progressRepository.getSubjectProgressSummary(subjectId, userId);
    if (!progress) {
      throw createError('Subject not found', 404);
    }
    return progress;
  }
}

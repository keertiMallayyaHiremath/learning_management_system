import { SubjectRepository } from './subject.repository';
import { createError } from '../../middleware/errorHandler';

export class SubjectService {
  constructor(private subjectRepository: SubjectRepository) {}

  async getSubjects(page: number = 1, pageSize: number = 10, query?: string) {
    return this.subjectRepository.findAll(page, pageSize, query);
  }

  async getSubjectById(subjectId: bigint) {
    const subject = await this.subjectRepository.findById(subjectId);
    if (!subject) {
      throw createError('Subject not found', 404);
    }
    return subject;
  }

  async getSubjectTree(subjectId: bigint, userId: bigint) {
    const subjectTree = await this.subjectRepository.findSubjectTree(subjectId, userId);
    if (!subjectTree) {
      throw createError('Subject not found', 404);
    }
    return subjectTree;
  }

  async getFirstUnlockedVideo(subjectId: bigint, userId: bigint) {
    const videoId = await this.subjectRepository.getFirstUnlockedVideo(subjectId, userId);
    if (!videoId) {
      throw createError('No unlocked videos found', 404);
    }
    return { videoId };
  }
}
